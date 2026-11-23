# Ханз эхлэл — утасны апп

Энэ хавтас нь вэб аппыг (репогийн үндсэн `index.html`) Android / iOS апп болгон багцалдаг. Capacitor 8, Android API 36.

Код өөрчлөгдөхөд та юу ч хийх шаардлагагүй. GitHub руу `main` дээр push хийх бүрт Android build автоматаар явна.

## 1. Нэг удаагийн тохиргоо

### Google Play ($25, нэг удаа)
1. https://play.google.com/console дээр хөгжүүлэгчийн бүртгэл нээнэ (иргэний үнэмлэх баталгаажуулалттай).
2. Шинэ апп үүсгэнэ → нэр «Ханз эхлэл», хэл Монгол, Апп, Үнэгүй.
3. Хувь хүний шинэ бүртгэлд: **12 тестер 14 хоног** хаалттай тестэд оролцсоны дараа л нийтэд гаргаж болно. 12 хүний Gmail-ийг одооноос цуглуулж эхлээрэй.

### GitHub Secrets (гарын үсгийн түлхүүр)
Репо → Settings → Secrets and variables → Actions → **New repository secret**. Гурвыг нэмнэ:

| Нэр | Утга |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `ANDROID_KEYSTORE_BASE64.txt` файлын бүх текст |
| `ANDROID_KEYSTORE_PASSWORD` | `ANDROID_KEYSTORE_PASSWORD.txt` дахь нууц үг |
| `ANDROID_KEY_ALIAS` | `upload` |

⚠️ `hanz-ehlel-upload.p12` болон нууц үгийг **репо руу хэзээ ч бүү оруул**. Компьютер болон Google Drive дээрээ хоёр газар нөөцөл. Play App Signing ашигладаг тул алдсан ч Play Console-оос upload key солиулж болно, гэхдээ хэдэн хоног зарцуулна.

### Нууцлалын бодлого
Холбоо барих имэйл: `hanzehlel.help@gmail.com` (privacy, terms, help хуудсанд орсон).
https://englishbetter88-commits.github.io/Chinese-learning/privacy.html

### Нэвтрэх (Google · Facebook · Имэйл)
`NEVTREH-TOHIRGOO.md` дахь алхмуудыг хийгээд Supabase-ийн Project URL ба anon key-г Claude-д өгнө. Тэр болтол апп нэвтрэх хэсэггүйгээр, урьдын адил ажиллана.

### Орлого (Pro, зар)
`ORLOGO.md`-ээс эхэлнэ үү.

### Pro худалдаа
`PRO-TOHIRGOO.md`: Google Play, App Store-д Pro захиалга үүсгэж, RevenueCat-ийн public түлхүүрүүдийг Claude-д өгнө.

## 2. Build татах

GitHub → **Actions** → «Android build» → хамгийн сүүлийн ногоон run → доод талын **Artifacts**:
- `hanz-ehlel-test-apk`: утсандаа шууд суулгаж туршина (zip задлаад .apk).
- `hanz-ehlel-play-store-aab`: Play Console → Testing → Closed testing → Create release руу оруулна. Secrets нэмсний дараа гарч ирнэ.

Хувилбарын дугаар (versionCode) run бүрээр автоматаар нэмэгдэнэ.

## 3. iOS (дараагийн шат)
- Apple Developer Program ($99/жил) хэрэгтэй.
- «iOS build check» workflow-г Actions дээрээс гараар ажиллуулж хөрвөж байгаа эсэхийг шалгана.
- Бүртгэл нээгдсэний дараа App Store руу гарын үсэгтэй оруулах алхмыг нэмнэ.

## Бүтэц
```
index.html, privacy.html, terms.html, L*.json, L*-audio.mp3   ← вэб апп (GitHub Pages)
supabase.min.js           нэвтрэлтийн сан
supabase/setup.sql        өгөгдлийн сангийн хүснэгт, эрх (Supabase SQL Editor-т ажиллуулна)
app/
  capacitor.config.json   appId: mn.hanzehlel.app
  scripts/prep-www.js     вэб файлыг www/ руу хуулж, утасны safe-area нэмнэ
  scripts/make-icons.js   resources/*.svg → PNG
  scripts/patch-native.js нэвтрэлтийн дараа апп руу буцах холбоос (mn.hanzehlel.app://auth)
  NEVTREH-TOHIRGOO.md     Google, Facebook, имэйл нэвтрэлтийн тохиргоо
  PRO-TOHIRGOO.md         Pro захиалгын тохиргоо (Google Play, App Store, RevenueCat)
  ORLOGO.md               Орлогын 3 зам, AdMob зар, GitHub Variables
  resources/              icon, splash (SVG)
  STORE-LISTING.md        дэлгүүрийн тайлбар, data safety хариулт
.github/workflows/
  android.yml             push бүрт APK + AAB
  ios.yml                 гараар: iOS хөрвүүлэлт шалгах
```

## Локалаар (хүсвэл)
```
cd app && npm ci && npm run sync && npx cap open android
```
