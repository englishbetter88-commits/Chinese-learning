// Registers the mn.hanzehlel.app:// link so Google / Facebook / Apple sign-in can return to the app.
// Run after `npx cap add android|ios`. Safe to run more than once.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SCHEME = 'mn.hanzehlel.app';

const man = path.join(ROOT, 'android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(man)) {
  let s = fs.readFileSync(man, 'utf8');
  if (!s.includes(`android:scheme="${SCHEME}"`)) {
    const filter = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="${SCHEME}" android:host="auth" />
            </intent-filter>`;
    const i = s.indexOf('</intent-filter>');
    if (i < 0) throw new Error('AndroidManifest: launcher intent-filter not found');
    const j = i + '</intent-filter>'.length;
    s = s.slice(0, j) + filter + s.slice(j);
    console.log('android: deep link added');
  } else console.log('android: deep link already present');
  // AdMob needs its app id in the manifest or the app closes at start. Google's test id when not set.
  const adApp = process.env.ADMOB_APP_ID_ANDROID || 'ca-app-pub-3940256099942544~3347511713';
  if (!s.includes('com.google.android.gms.ads.APPLICATION_ID')) {
    s = s.replace(/<application([^>]*)>/, m => m + `\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${adApp}" />`);
    console.log('android: AdMob app id', adApp.startsWith('ca-app-pub-3940256099942544') ? '(test)' : '');
  }
  fs.writeFileSync(man, s);
}

const plist = path.join(ROOT, 'ios/App/App/Info.plist');
if (fs.existsSync(plist)) {
  let s = fs.readFileSync(plist, 'utf8');
  if (!s.includes(`<string>${SCHEME}</string>`)) {
    const add = `\t<key>CFBundleURLTypes</key>
\t<array>
\t\t<dict>
\t\t\t<key>CFBundleURLName</key>
\t\t\t<string>${SCHEME}</string>
\t\t\t<key>CFBundleURLSchemes</key>
\t\t\t<array>
\t\t\t\t<string>${SCHEME}</string>
\t\t\t</array>
\t\t</dict>
\t</array>
`;
    const i = s.lastIndexOf('</dict>');
    if (i < 0) throw new Error('Info.plist: </dict> not found');
    s = s.slice(0, i) + add + s.slice(i);
    console.log('ios: URL scheme added');
  } else console.log('ios: URL scheme already present');
  if (!s.includes('GADApplicationIdentifier')) {
    const adApp = process.env.ADMOB_APP_ID_IOS || 'ca-app-pub-3940256099942544~1458002511';
    const ad = `\t<key>GADApplicationIdentifier</key>\n\t<string>${adApp}</string>\n\t<key>SKAdNetworkItems</key>\n\t<array>\n\t\t<dict>\n\t\t\t<key>SKAdNetworkIdentifier</key>\n\t\t\t<string>cstr6suwn9.skadnetwork</string>\n\t\t</dict>\n\t</array>\n`;
    const j = s.lastIndexOf('</dict>');
    s = s.slice(0, j) + ad + s.slice(j);
    console.log('ios: AdMob app id added');
  }
  fs.writeFileSync(plist, s);
}
