# Нэвтрэх хэсгийн тохиргоо (Google · Facebook · Имэйл)

Апп талын код бүрэн бэлэн. Доорх бүртгэлүүдийг **та өөрөө** нээнэ, учир нь эдгээр нь таны нэр дээр байх ёстой. Нийтдээ 30–45 минут.

Төгсгөлд нь надад **2 зүйл** өгнө: Supabase-ийн **Project URL** ба **anon (publishable) key**. Би аппад холбоод туршина. Эдгээр нь нууц биш, аппын кодонд байдаг зүйл.

> ⚠️ **Хэзээ ч надад бүү өгөх зүйлс:** Supabase-ийн `service_role` / secret key, database password, Google Client Secret, Facebook App Secret. Тэдгээрийг зөвхөн Supabase-ийн самбарт өөрөө буулгана.

---

## 1. Supabase (үнэгүй) · 10 мин

1. https://supabase.com → **Start your project** → GitHub-аараа нэвтэрнэ.
2. **New project**:
   - Name: `hanz-ehlel`
   - Database password: **Generate** → хадгалаад ав
   - Region: **Southeast Asia (Singapore)**. Монголд хамгийн ойр нь.
3. Төсөл бэлэн болоход (1–2 мин) зүүн цэс → **SQL Editor** → **New query** → `supabase/setup.sql` файлын бүх текстийг буулгаад **Run** дарна. «Success» гарвал болсон.
4. **Project Settings → API Keys**: **Project URL** (`https://xxxx.supabase.co`) ба **anon / publishable key**-ийг хуулж надад явуулна.
5. **Authentication → URL Configuration**:
   - Site URL: `https://englishbetter88-commits.github.io/Chinese-learning/`
   - Redirect URLs → **Add URL** дээр хоёуланг нь нэмнэ:
     - `https://englishbetter88-commits.github.io/Chinese-learning/`
     - `mn.hanzehlel.app://auth`

## 2. Имэйл код · 10 мин

1. **Authentication → Sign In / Providers → Email**: Enable. **Confirm email** асаалттай хэвээр.
2. **Authentication → Emails → Templates**. **Magic Link** ба **Confirm signup** хоёулангийнх нь агуулгыг үүгээр солино:
   - Subject: `Ханз эхлэл · нэвтрэх код`
   - Body:
     ```html
     <h2>Ханз эхлэл</h2>
     <p>Таны нэвтрэх код:</p>
     <p style="font-size:32px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
     <p>Энэ кодыг апп дээрээ оруулна уу. Та хүсээгүй бол энэ имэйлийг үл тоомсорлоно уу.</p>
     ```
3. **Имэйл илгээгч (SMTP). Заавал хийнэ.** Supabase-ийн өөрийнх нь илгээгч цагт хэдхэн имэйл л явуулдаг, зөвхөн туршилтад зориулагдсан.
   - Хамгийн хялбар нь Gmail. Google бүртгэл → Security → 2-Step Verification асаах → **App passwords** → «Hanz Ehlel» нэрээр 16 оронтой нууц үг үүсгэнэ.
   - Supabase → **Authentication → Emails → SMTP Settings** → Enable:
     - Host `smtp.gmail.com`, Port `465`
     - Username: Gmail хаяг
     - Password: дээрх app password
     - Sender name: `Ханз эхлэл`
   - Gmail өдөрт ~500 имэйл илгээнэ. Хэрэглэгч олширвол өөрийн домэйн аваад Resend руу шилжинэ.
4. **Authentication → Rate Limits** → «emails sent per hour»-ийг 100 болгоно.

## 3. Google · 10 мин

1. https://console.cloud.google.com → дээд талын төслийн цэс → **New project** → `Hanz Ehlel`.
2. **Google Auth Platform → Branding**:
   - App name: `Ханз эхлэл`
   - Support email: өөрийн имэйл
   - Home page: `https://englishbetter88-commits.github.io/Chinese-learning/`
   - Privacy policy: `https://englishbetter88-commits.github.io/Chinese-learning/privacy.html`
   - Authorized domains: `supabase.co`, `github.io`
3. **Audience** → External → **Publish app**. Зөвхөн имэйл ба нэр авдаг тул Google-ийн удаан шалгалт шаардлагагүй.
4. **Clients → Create client** → Web application:
   - Authorized JavaScript origins: `https://englishbetter88-commits.github.io`
   - Authorized redirect URIs: `https://ТАНЫ-ТӨСӨЛ.supabase.co/auth/v1/callback`
5. Гарч ирсэн **Client ID** ба **Client secret**-ийг Supabase → **Authentication → Sign In / Providers → Google** → Enable хийж буулгаад Save дарна.

## 4. Facebook · 10 мин

1. https://developers.facebook.com → **My Apps → Create app**.
   - Use case: **Authenticate and request data from users with Facebook Login**
   - Нэр: `Hanz Ehlel`
2. **Use cases → Facebook Login → Customize**:
   - Permissions: **email** нэмнэ (public_profile угаасаа байгаа).
   - Settings → Valid OAuth Redirect URIs: `https://ТАНЫ-ТӨСӨЛ.supabase.co/auth/v1/callback`
3. **App settings → Basic**:
   - Privacy Policy URL: `…/privacy.html`
   - User data deletion → Data deletion instructions URL: `…/privacy.html#delete`
   - Category: Education
   - App icon: 1024×1024
4. Тэндээс **App ID** ба **App Secret**-ийг Supabase → Providers → **Facebook** → Enable хийж буулгана.
5. Facebook самбарын дээд талд **Publish** дарж Live болгоно. Үгүй бол зөвхөн та өөрөө нэвтэрч чадна.

## 5. Apple (App Store гаргахад)
iPhone дээр Google/Facebook нэвтрэлт байвал Apple «Sign in with Apple»-ийг заавал шаарддаг. Код нь бэлэн, зөвхөн тохиргоо дутуу. Apple Developer бүртгэл ($99) нээгдмэгц хамт тохируулна.

---

## Мэдэх зүйлс
- **Бүртгэл заавал биш.** Апп анх нээгдэхэд нэвтрэх цонх гарна, гэхдээ «Бүртгэлгүйгээр эхлэх» товч бий. Хүнийг заавал бүртгүүлбэл Apple аппыг буцаадаг.
- **Ахиц нийлүүлэх.** Бүртгэлгүй хичээллэж байгаад нэвтэрвэл төхөөрөмж дээрх ахиц бүртгэлтэй нь нийлнэ. Хоёулангийнх нь сурсан ханз бүгд үлдэнэ.
- **Гарах / устгах.** Профайл → Тохиргоо хэсэгт бий. Гарахад төхөөрөмж цэвэрлэгдэнэ, буцаад нэвтрэхэд ахиц сэргэнэ.
- **Тэргүүлэгчдийн самбар.** GitHub дээрх сайт болон утасны аппад одоо жинхэнэ самбар ажиллана. Нэвтрээгүй хүн самбарыг харж болно, гэхдээ өөрийн оноо гаргахын тулд нэвтэрнэ.
- **Supabase үнэгүй багц.** 50,000 идэвхтэй хэрэглэгч хүртэл үнэгүй. Харин **7 хоног огт хэрэглэгдээгүй төсөл түр унтардаг**. Самбарын Restore товчоор сэргээнэ. Хэрэглэгчид тогтмол орж эхэлбэл энэ асуудал гарахгүй.
