# TabeebPedia (طبیب پیڈیا) - پروجیکٹ آرکیٹیکچر، مائیگریشن اور ورک فلو پلان

## 1. پروجیکٹ کا جائزہ (Overview)
* **موجودہ پلیٹ فارم:** ورڈپریس (Doctreat تھیم + بلاگ) - ہوسٹنگر
* **نیا ہدف:** کسٹم ہائی اسپیڈ سنگل پیج / پی ڈبلیو اے ایپلیکیشن (React + Vite + Tailwind CSS + PHP REST API + Hostinger MySQL)
* **بنیادی مقاصد:**
  1. 300 تا 400 آرٹیکلز اور میڈیا کا 100% تحفظ بغیر کسی ڈیٹا لاس کے۔
  2. گوگل SEO اور پرانے یو آر ایل اسلگز (URL Slugs) کا مکمل تحفظ (Zero 404s)۔
  3. جدید ترین نستعلیق اردو ٹائپوگرافی اور موبائل فرسٹ فاسٹ لوڈنگ انٹرفیس۔
  4. ڈاکٹرز اور اطباء کی سرچ ایبل ڈائریکٹری (شہر، بیماری، تخصص) مع واٹس ایپ کنیکٹ۔
  5. آسان اردو ایڈمن پینل (Admin CMS)۔

---

## 2. مائیگریشن اور آرکیٹیکچر کا تفصیلی روڈ میپ (Workflow Roadmap)

```
[مرحلہ 1: بیک اپ اور ڈیٹا سیکیورٹی]
   ├── ورڈپریس ڈیٹا بیس ایکسپورٹ (wp_posts, wp_postmeta, wp_terms, doctreat meta)
   └── ورڈپریس میڈیا فولڈر (wp-content/uploads) کا مکمل ڈاؤن لوڈ

[مرحلہ 2: کسٹم ڈیٹابیس ڈیزائن اور ای ٹی ایل مائیگریشن اسکرپٹ]
   ├── نیا نارملائزڈ MySQL اسکیمہ (articles, categories, doctors, cities, specialities, media)
   ├── خودکار PHP / Python مائیگریشن اسکرپٹ (WP HTML Clean up, Slug Preservation, Doctreat Meta Parsing)
   └── میڈیا پاتھس کی درست میپنگ (uploads/year/month -> /uploads/articles/)

[مرحلہ 3: کسٹم بیک اینڈ API کی تیاری]
   ├── لائٹ ویٹ، تیز اور محفوظ PHP REST API
   ├── پبلک اینڈ پوائنٹس (Articles, Categories, Doctors, Search, Related Posts)
   └── ایڈمن اینڈ پوائنٹس مع JWT / Session سیکیورٹی (CRUD Articles, Media Upload, Manage Doctors)

[مرحلہ 4: جدید کسٹم فرنٹ اینڈ (React + Tailwind CSS)]
   ├── الٹرا فاسٹ بلاگ انجن (Noto Nastaliq / Urdu Typography، کیٹیگری فلٹرز، لائیو سرچ، سوشل شیئر، پرنٹ موڈ)
   ├── جدید ڈاکٹرز ڈائریکٹری (لوکیشن، سپیشلٹی، ریٹنگ، ڈگری، واٹس ایپ ڈائریکٹ میسج)
   ├── ایڈمن ڈیش بورڈ (اردو بلاگ ایڈیٹر، فیچرڈ امیج مینیجر، ڈاکٹرز پروفائل مینیجر)
   └── آن پیج SEO میٹا ٹیگز، اوپن گراف (OG Tags) اور اسکیما مارک اپ (Schema.org / JSON-LD)

[مرحلہ 5: لوکل ٹیسٹنگ اور ویریفیکیشن]
   ├── تمام 300-400 آرٹیکلز کے مواد اور تصاویر کی 100% ویریفیکیشن
   ├── ڈاکٹرز کے تمام پروفائلز کا ڈیٹا چیک
   ├── پرانے ورڈپریس لنکس کی درست میپنگ کی تصدیق
   └── لوڈ اسپیڈ اور گوگل لائٹ ہاؤس اسکور (95+ اسکور ٹارگٹ)

[مرحلہ 6: ہوسٹنگر پر زیرو ڈاؤن ٹائم لائیو ڈیپلائمنٹ]
   ├── ہوسٹنگر پر MySQL ڈیٹابیس امپورٹ
   ├── میڈیا اپلوڈز اور بیک اینڈ API کنفیگریشن
   ├── فرنٹ اینڈ بلڈ ڈائریکٹری پبلش اور htaccess ری رائیٹ رولز سیٹ اپ
   └── لائیو سائٹ ویریفیکیشن اور مانیٹرنگ
```

---

## 3. ڈیٹا بیس اسکیمہ کا خاکہ (Database Schema Plan)

### A. آرٹیکلز ٹیبل (`articles`)
* `id` (INT, Primary Key, Auto Increment)
* `title` (VARCHAR 255 - اردو عنوان)
* `slug` (VARCHAR 255, Unique, Indexed - پرانا ورڈپریس سلگ)
* `content` (LONGTEXT - مکمل صاف ستھرا ایچ ٹی ایم ایل مواد)
* `excerpt` (TEXT - خلاصہ)
* `featured_image` (VARCHAR 500 - فیچرڈ امیج پاتھ)
* `category_id` (INT - بنیادی کیٹیگری)
* `views` (INT Default 0)
* `status` (ENUM: 'published', 'draft')
* `meta_title` / `meta_description` (SEO میٹا ٹیگز)
* `published_at` / `created_at` / `updated_at` (تاریخ)

### B. کیٹیگریز ٹیبل (`categories`)
* `id`, `name`, `slug`, `description`, `icon`

### C. اطباء و ڈاکٹرز ٹیبل (`doctors`)
* `id` (INT, Primary Key)
* `name` (VARCHAR 255 - نام مع القاب)
* `slug` (VARCHAR 255, Unique)
* `photo` (VARCHAR 500)
* `qualifications` (VARCHAR 255 - BEMS, MBBS, FTJ وغیرہ)
* `specialities` (TEXT / JSON - امراض قلب، نظام ہضم، جوڑوں کا درد وغیرہ)
* `experience_years` (INT)
* `clinic_name` (VARCHAR 255)
* `clinic_address` (TEXT)
* `city_id` (INT)
* `phone` (VARCHAR 50)
* `whatsapp_number` (VARCHAR 50)
* `fee_range` (VARCHAR 100)
* `timing` (VARCHAR 255)
* `about` (TEXT)
* `is_featured` (TINYINT)

---

## 4. اگلا فوری قدم (Next Actionable Steps)
1. ورڈپریس ڈیٹا بیس کا بیک اپ (SQL فائل یا WP XML ایکسپورٹ) پروجیکٹ فولڈر میں لانا۔
2. `wp-content/uploads` زپ فائل / فولڈر حاصل کرنا۔
3. مائیگریشن اسکرپٹ چلا کر تمام ڈیٹا کو کسٹم فارمیٹ میں لانا۔
