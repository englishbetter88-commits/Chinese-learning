-- Ханз эхлэл — Supabase тохиргоо
-- Supabase → SQL Editor → New query → энэ файлыг бүтнээр нь буулгаад Run дарна.

-- 1) Хэрэглэгч бүрийн ахиц (зөвхөн өөрөө харна)
create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.progress enable row level security;
drop policy if exists "own progress read" on public.progress;
drop policy if exists "own progress insert" on public.progress;
drop policy if exists "own progress update" on public.progress;
create policy "own progress read"   on public.progress for select to authenticated using (user_id = auth.uid());
create policy "own progress insert" on public.progress for insert to authenticated with check (user_id = auth.uid());
create policy "own progress update" on public.progress for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 2) Тэргүүлэгчдийн самбар (бүгд харна, зөвхөн өөрийнхөө мөрийг бичнэ)
create table if not exists public.board (
  id uuid primary key references auth.users(id) on delete cascade,
  entry jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists board_xp_idx on public.board (xp desc);
alter table public.board enable row level security;
drop policy if exists "board read all" on public.board;
drop policy if exists "board insert own" on public.board;
drop policy if exists "board update own" on public.board;
create policy "board read all"   on public.board for select to anon, authenticated using (true);
create policy "board insert own" on public.board for insert to authenticated with check (id = auth.uid());
create policy "board update own" on public.board for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- 3) Алдааны мэдэгдэл (хэрэглэгч бичнэ, зөвхөн та Supabase дээрээс уншина)
create table if not exists public.reports (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "reports insert own" on public.reports;
create policy "reports insert own" on public.reports for insert to authenticated with check (user_id = auth.uid());

-- 4) Хэрэглэгч бүртгэлээ өөрөө устгах (App Store, Google Play заавал шаарддаг)
create or replace function public.delete_me()
returns void language plpgsql security definer set search_path = '' as $$
begin
  delete from auth.users where id = auth.uid();
end; $$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;

-- Хэт том өгөгдлөөс хамгаалах
alter table public.progress drop constraint if exists progress_size;
alter table public.progress add constraint progress_size check (pg_column_size(data) < 500000);
alter table public.board drop constraint if exists board_size;
alter table public.board add constraint board_size check (pg_column_size(entry) < 2000);
alter table public.reports drop constraint if exists reports_size;
alter table public.reports add constraint reports_size check (pg_column_size(data) < 4000);

-- 5) Хуурамч онооноос хамгаалах: долоо хоногийн оноог сервер өөрөө тоолно
alter table public.board add column if not exists sw text;
alter table public.board add column if not exists swxp integer not null default 0;
alter table public.board add column if not exists spw text;
alter table public.board add column if not exists spwxp integer not null default 0;

create or replace function public.board_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  cur text := to_char(date_trunc('week', now() at time zone 'Asia/Ulaanbaatar'), 'YYYY-MM-DD');
  hrs numeric; cap integer; delta integer; nm text;
begin
  -- нэр: 24 тэмдэгт, холбоос, хаяг хориглоно
  nm := coalesce(new.entry->>'nk', '');
  if length(nm) > 24 or nm ~* '(https?://|www\.|\.(com|mn|net|org)|t\.me|@)' then
    new.entry := new.entry - 'nk';
  end if;
  if tg_op = 'INSERT' then
    new.xp := least(greatest(new.xp, 0), 3000);
    new.sw := cur; new.swxp := 0; new.spw := null; new.spwxp := 0;
  else
    -- цагт 250-аас их XP нэмэгдэх боломжгүй (хэт хурдан өсөлтийг таслана)
    hrs := greatest(extract(epoch from (now() - old.updated_at)) / 3600.0, 0);
    cap := 400 + floor(least(hrs, 168) * 250)::int;
    delta := least(greatest(new.xp - old.xp, 0), cap);
    new.xp := least(new.xp, old.xp + cap);
    if old.sw is distinct from cur then
      new.spw := old.sw; new.spwxp := old.swxp; new.sw := cur; new.swxp := delta;
    else
      new.sw := old.sw; new.swxp := old.swxp + delta; new.spw := old.spw; new.spwxp := old.spwxp;
    end if;
  end if;
  new.updated_at := now();
  new.entry := new.entry || jsonb_build_object('xp', new.xp, 'w', new.sw, 'wxp', new.swxp,
                                               'pw', coalesce(new.spw, ''), 'pwxp', new.spwxp);
  return new;
end; $$;
drop trigger if exists board_guard on public.board;
create trigger board_guard before insert or update on public.board
  for each row execute function public.board_guard();

-- 6) Долоо хоногийн шагналыг сервер олгоно (апп өөрөө шийдэхгүй)
create table if not exists public.prizes (
  user_id uuid references auth.users(id) on delete cascade,
  week text not null,
  rank integer not null,
  days integer not null,
  created_at timestamptz not null default now(),
  primary key (user_id, week)
);
alter table public.prizes enable row level security;
drop policy if exists "own prizes" on public.prizes;
create policy "own prizes" on public.prizes for select to authenticated using (user_id = auth.uid());

create or replace function public.award_week()
returns void language plpgsql security definer set search_path = '' as $$
declare
  lastw text := to_char(date_trunc('week', now() at time zone 'Asia/Ulaanbaatar') - interval '7 days', 'YYYY-MM-DD');
  n integer;
begin
  select count(*) into n from public.board
   where (sw = lastw and swxp > 0) or (spw = lastw and spwxp > 0);
  if n < 5 then return; end if;          -- 5-аас цөөн оролцогчтой бол шагнал олгохгүй
  insert into public.prizes (user_id, week, rank, days)
  select id, lastw, rk, (array[7, 5, 3])[rk]
    from (select id, row_number() over (order by v desc, updated_at) as rk
            from (select id, updated_at,
                         case when sw = lastw then swxp when spw = lastw then spwxp else 0 end as v
                    from public.board) t
           where v >= 50) s
   where rk <= 3
  on conflict do nothing;
end; $$;
revoke all on function public.award_week() from public, anon, authenticated;

-- Даваа гарагт 00:10 (Улаанбаатар) автоматаар ажиллана
create extension if not exists pg_cron;
select cron.schedule('award-week', '10 16 * * 0', 'select public.award_week()');
