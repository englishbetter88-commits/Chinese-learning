// Copies the web app from the repository root into www/ for the native builds,
// and adds safe-area handling so content does not sit under the status bar.
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..');
const www = path.resolve(__dirname, '..', 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'levels'), { recursive: true });
for (const f of ['index.html', 'privacy.html', 'terms.html', 'help.html', 'credits.html', 'hanzi-writer.min.js', 'supabase.min.js', 'CREDITS.txt']) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(www, f));
  else if (f === 'index.html' || f === 'hanzi-writer.min.js') throw new Error('Missing ' + f);
}
const lv = fs.existsSync(path.join(root, 'levels')) ? path.join(root, 'levels') : root;
let n = 0;
for (const f of fs.readdirSync(lv)) if (/^L\d+(-audio\.mp3|\.json)$/.test(f)) { fs.copyFileSync(path.join(lv, f), path.join(www, 'levels', f)); n++; }
if (n < 14) throw new Error('Expected 14 level files, found ' + n);
const ip = path.join(www, 'index.html');
let html = fs.readFileSync(ip, 'utf8');
html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">');
const safe = '<style>html.cap body{padding-top:max(env(safe-area-inset-top),var(--safe-area-inset-top,0px))}' +
  'html.cap .top{top:max(env(safe-area-inset-top),var(--safe-area-inset-top,0px))!important}' +
  'html.cap .bnav{padding-bottom:calc(6px + max(env(safe-area-inset-bottom),var(--safe-area-inset-bottom,0px)))}</style>' +
  '<script>if(window.Capacitor)document.documentElement.classList.add("cap")</script>';
if (!html.includes('</head>')) throw new Error('No </head> in index.html');
// Public keys come from GitHub repository Variables (Settings → Secrets and variables → Actions → Variables).
const E = process.env, cfg = {};
if (E.SB_URL && E.SB_KEY) cfg.HANZ_CFG = { url: E.SB_URL, key: E.SB_KEY, apple: E.SB_APPLE === '1' };
if (E.RC_ANDROID || E.RC_IOS) cfg.HANZ_RC = { android: E.RC_ANDROID || '', ios: E.RC_IOS || '' };
if (E.ADMOB_REWARDED_ANDROID || E.ADMOB_REWARDED_IOS) cfg.HANZ_ADS = { android: E.ADMOB_REWARDED_ANDROID || '', ios: E.ADMOB_REWARDED_IOS || '' };
const cfgJs = Object.keys(cfg).length ? '<script>' + Object.entries(cfg).map(([k, v]) => 'window.' + k + '=' + JSON.stringify(v) + ';').join('') + '</script>' : '';
html = html.replace('</head>', safe + cfgJs + '</head>');
console.log('config:', Object.keys(cfg).join(', ') || 'none (test mode)');
fs.writeFileSync(ip, html);
console.log('www ready:', n, 'level files');
