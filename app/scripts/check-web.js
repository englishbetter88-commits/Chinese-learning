// Quick safety check before every build: the app's JavaScript must parse,
// and the pages the app links to must exist. A broken update stops here instead of reaching users.
const fs = require('fs'), path = require('path');
const www = path.resolve(__dirname, '..', 'www');
const html = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) throw new Error('No inline script found in index.html');
scripts.forEach((code, i) => { try { new Function(code); } catch (e) { throw new Error('Script ' + i + ' does not parse: ' + e.message); } });
for (const f of ['privacy.html', 'terms.html', 'help.html', 'credits.html', 'hanzi-writer.min.js', 'supabase.min.js'])
  if (!fs.existsSync(path.join(www, f))) throw new Error('Missing ' + f);
const lv = fs.readdirSync(path.join(www, 'levels'));
for (const f of lv.filter(f => f.endsWith('.json'))) JSON.parse(fs.readFileSync(path.join(www, 'levels', f), 'utf8'));
for (const bad of ['[ИМЭЙЛ ХАЯГ]', '[EMAIL ADDRESS]'])
  for (const f of ['privacy.html', 'terms.html', 'help.html'])
    if (fs.readFileSync(path.join(www, f), 'utf8').includes(bad)) console.warn('WARNING: ' + f + ' still has the placeholder ' + bad);
console.log('web check ok:', scripts.length, 'scripts,', lv.length, 'level files');
