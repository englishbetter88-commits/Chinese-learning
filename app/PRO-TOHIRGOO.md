# Pro худалдаа: тохиргоо (Google Play · App Store)

Аппын код бэлэн. Апп Pro-гийн үнийг дэлгүүрээс татаж харуулж, «Pro авах» дарахад Google Play / App Store-ын төлбөрийн цонх нээгдэнэ. Төлбөр амжилттай болоход Pro шууд нээгдэнэ.

Дундаас нь **RevenueCat** үйлчилгээ ашиглана. Энэ нь хоёр дэлгүүрийн төлбөрийг шалгаж, хэн Pro болохыг хадгалдаг. Сард $2,500 хүртэлх орлоготой бол үнэгүй.

Төгсгөлд нь надад **2 түлхүүр** өгнө: `goog_…` ба `appl_…`. Эдгээр нь нууц биш, аппын кодонд байдаг түлхүүр.

> ⚠️ Google-ийн service account JSON файл, Apple-ийн .p8 түлхүүр, RevenueCat-ийн secret key (`sk_…`)-ийг **надад хэзээ ч бүү явуулаарай.** Тэдгээрийг зөвхөн RevenueCat-ийн самбарт өөрөө оруулна.

---

## Үнэ (санал)
| Захиалга | Үнэ | Бүтээгдэхүүний ID |
|---|---|---|
| Сар бүр | 14,900₮ | `hanz_pro_monthly` |
| 3 сар | 34,900₮ | `hanz_pro_3m` |
| Жил | 99,000₮ | `hanz_pro_yearly` |

Эдгээр нь ойролцоогоор $4.4 / $10.3 / $29.1 болно. Дэлгүүр орлогын 15%-ийг авдаг. Хувь хүн жилд $1 сая хүртэлх орлоготой бол эхний жилээс 15% байна.

## 1. Google Play · 20 мин
1. Play Console → **Setup → Payments profile**:
   - Хаяг, банкны данс оруулна. Банкны данс USD хүлээн авдаг бол илүү сайн.
   - Google мөнгийг USD-ээр шилжүүлнэ. Доод хэмжээ нь $100.
2. Апп-аа эхлээд **хаалттай тест** рүү нэг удаа оруулна. Google нэг ч build ороогүй аппад төлбөрийн бүтээгдэхүүн үүсгэх боломж олгодоггүй.
3. **Monetize → Products → Subscriptions → Create subscription**:
   - Product ID: `hanz_pro`, нэр: `Ханз эхлэл Pro`
   - **Base plans** гурвыг нэмнэ. Тус бүрийн үнийг дээрх хүснэгтээр тавиад **Activate** дарна.
     - `monthly`: сар бүр сунгагдана
     - `3m`: 3 сар тутам сунгагдана
     - `yearly`: жил бүр сунгагдана
4. RevenueCat-ийн заавраар **service account** үүсгэж, Play Console-д эрх өгнө: https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials
   - Эрх өгснөөс хойш 24–36 цагийн дараа ажиллаж эхэлдэг.

## 2. App Store · 20 мин (Apple бүртгэл нээгдсэний дараа)
1. App Store Connect → **Business**:
   - **Paid Apps Agreement** гэрээг хүлээн зөвшөөрнө.
   - Банк, татварын мэдээллээ бөглөнө.
2. Апп → **Subscriptions** → Subscription Group: `Pro` → гурван захиалга нэмнэ (`hanz_pro_monthly`, `hanz_pro_3m`, `hanz_pro_yearly`).
   - Тус бүрт үнэ, монгол нэр, тайлбар, дэлгэцийн зураг шаардлагатай.
3. **Users and Access → Integrations → In-App Purchase** → түлхүүр үүсгэж, RevenueCat-д оруулна.

## 3. RevenueCat · 15 мин
1. https://app.revenuecat.com → бүртгүүлнэ → **New project**: `Hanz Ehlel`.
2. **Apps** хэсэгт:
   - Google Play app нэмнэ: package `mn.hanzehlel.app` + service account JSON
   - App Store app нэмнэ: bundle `mn.hanzehlel.app` + In-App Purchase key
3. **Product catalog → Entitlements** → **New**: identifier заавал `pro` байна. Гурван бүтээгдэхүүнээ бүгдийг нь `pro`-д холбоно.
4. **Offerings** → `default` offering дотор 3 package:
   - `$rc_monthly` → monthly
   - `$rc_three_month` → 3 сар
   - `$rc_annual` → yearly
5. **API keys** → **Public** SDK key-үүдийг (`goog_…`, `appl_…`) хуулж надад явуулна.

## 4. Туршилт
- **Google Play:** Play Console → Setup → **License testing** → Gmail-ээ нэмнэ. Тэр бүртгэлээр худалдаж авахад мөнгө гарахгүй, захиалга хэдэн минутын дотор дуусна.
- **iPhone:** TestFlight-аар суулгавал sandbox төлбөр (үнэгүй) ажиллана.

---

## Апп дотор юу харагдах вэ
- **Pro цэс:** 3 захиалгын карт харагдана. Үнэ нь дэлгүүрээс автоматаар ирэх ба жилийнх нь «45% хэмнэнэ» гэсэн тэмдэгтэй, анхнаасаа сонгогдсон байна. Доор нь «Pro авах» товч, «Өмнө авсан Pro-гоо сэргээх» холбоос, автомат сунгалтын тайлбар, Үйлчилгээний нөхцөл, Нууцлалын бодлогын холбоосууд гарна. Apple, Google хоёулаа эдгээрийг заавал шаарддаг.
- **Профайл → Тохиргоо:** «Pro захиалга · Дараагийн сунгалт: …» мөр болон «Удирдах» товч нь дэлгүүрийн захиалга цуцлах хуудсыг нээнэ.
- **Нэвтэрсэн хэрэглэгч:** Pro нь бүртгэлтэй нь холбогдоно. Утас солиод нэвтэрхэд Pro хэвээр байна.
- **Вэб хувилбар (GitHub Pages, claude.ai):** «Pro-г утасны аппаас авна» гэсэн бичиг гарна. Вэб дээр төлбөр авахгүй.
