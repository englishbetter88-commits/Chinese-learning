// Renders the SVG sources in resources/ to the PNG files @capacitor/assets expects.
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const dir = path.resolve(__dirname, '..', 'resources');
(async () => {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const out = path.join(dir, f.replace(/\.svg$/, '.png'));
    let img = sharp(path.join(dir, f), { density: 72 });
    if (f !== 'icon-foreground.svg') img = img.flatten({ background: '#1fa577' });
    await img.png().toFile(out);
    console.log('made', path.basename(out));
  }
})().catch(e => { console.error(e); process.exit(1); });
