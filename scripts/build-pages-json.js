import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const xmlPath = path.join(rootDir, 'tabeebpedia.WordPress.2026-09-27 Pages.xml');
if (!fs.existsSync(xmlPath)) {
  console.error('❌ Pages XML file not found:', xmlPath);
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// The 5 core legal and contact pages
const CORE_PAGES = [
  {
    id: 1,
    title: 'ہمارے بارے میں (About Tabeeb Pedia)',
    slug: 'about-us',
    author: 'حکیم سید عبدالوہاب شاہ',
    date: '2026/09/25',
    status: 'published',
    parentId: null,
    level: 0,
    order: 1,
    content: `
      <div class="space-y-6 text-right leading-relaxed font-nastaliq">
        <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">بسم اللہ الرحمن الرحیم</p>
        <p>
          <strong>طبیب پیڈیا (Tabeeb Pedia)</strong> پاکستان کا سب سے بڑا اور مستند ڈیجیٹل طبی انسائیکلوپیڈیا اور مستند اطباء و معالجین کی قومی ڈائریکٹری ہے۔ ہمارا بنیادی مقصد طب یونانی، طب نبویﷺ اور قانون مفرد اعضاء کو جدید سائنسی خطوط اور ڈیجیٹل سہولت کے ساتھ عوام الناس تک پہنچانا ہے۔
        </p>
        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">ہمارا مشن و وژن</h3>
        <ul class="list-disc list-inside space-y-2 pr-2 text-slate-700 dark:text-slate-300">
          <li><strong>مستند طبی معلومات:</strong> بیماریوں، ان کے اسباب، علامات اور دیسی و جڑی بوٹیوں سے علاج کی قابل اعتماد معلومات فراہم کرنا۔</li>
          <li><strong>اطباء کی رسائی:</strong> پاکستان بھر کے مستند اور کوالیفائیڈ (FTJ / BEMS) اطباء کو ایک ہی پلیٹ فارم پر اکٹھا کرنا تاکہ مریض باآسانی صحیح معالج تک پہنچ سکیں۔</li>
          <li><strong>طب کی ڈیجیٹلائزیشن:</strong> قدیم طبی کتب، مجرب نسخہ جات اور تحقیقات کو آن لائن محفوظ اور قابل تلاش بنانا۔</li>
        </ul>
        <div class="p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl my-6">
          <p class="text-emerald-800 dark:text-emerald-200 font-bold">
            طبیب پیڈیا پر تمام مضامین ماہر اطباء اور محققین کی زیرِ نگرانی شائع کیے جاتے ہیں تاکہ قارئین تک صرف درست اور محفوظ معلومات پہنچیں۔
          </p>
        </div>
      </div>
    `
  },
  {
    id: 2,
    title: 'رابطہ کریں (Contact Us)',
    slug: 'contact',
    author: 'ایڈمن طبیب پیڈیا',
    date: '2026/09/25',
    status: 'published',
    parentId: null,
    level: 0,
    order: 2,
    content: `
      <div class="space-y-6 text-right leading-relaxed font-nastaliq">
        <p>
          اگر آپ کو کسی بیماری کے متعلق مشورہ درکار ہے، کسی طبیب کے بارے میں معلومات حاصل کرنی ہیں، یا اپنی رائے اور تجاویز ہم تک پہنچانی ہیں، تو آپ ہم سے درج ذیل ذرائع سے باآسانی رابطہ کر سکتے ہیں۔
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div class="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-slate-900 dark:text-white text-base">مرکزی دفتر</h4>
            <p class="text-sm text-slate-600 dark:text-slate-300">طبیب پیڈیا ہیڈ کوارٹر، اسلام آباد، پاکستان</p>
          </div>
          <div class="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-slate-900 dark:text-white text-base">ہیلپ لائن و واٹس ایپ</h4>
            <p class="text-sm text-slate-600 dark:text-slate-300">0300-1234567 | صبح 9 بجے تا شام 6 بجے</p>
          </div>
        </div>
        <p class="text-slate-600 dark:text-slate-400">آپ نیچے دیے گئے فارم کو پُر کر کے بھی اپنا پیغام براہِ راست ہمیں بھیج سکتے ہیں:</p>
      </div>
    `
  },
  {
    id: 3,
    title: 'پرائیویسی پالیسی (Privacy Policy)',
    slug: 'privacy-policy',
    author: 'قانونی ٹیم طبیب پیڈیا',
    date: '2026/09/25',
    status: 'published',
    parentId: null,
    level: 0,
    order: 3,
    content: `
      <div class="space-y-6 text-right leading-relaxed font-nastaliq">
        <p>
          طبیب پیڈیا پر ہم اپنے صارفین اور مریضوں کے ذاتی ڈیٹا اور رازداری کے تحفظ کو انتہائی اہمیت دیتے ہیں۔ یہ پرائیویسی پالیسی واضح کرتی ہے کہ ہم آپ کی معلومات کو کس طرح جمع اور محفوظ کرتے ہیں۔
        </p>
        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">1. معلومات کا جمع کرنا</h3>
        <p>
          جب آپ طبیب پیڈیا پر اکاؤنٹ بناتے ہیں، کسی طبیب سے مشاورت کی درخواست کرتے ہیں، یا رابطہ فارم پُر کرتے ہیں، تو ہم آپ کا نام، فون نمبر، ای میل اور شہر کی معلومات حاصل کرتے ہیں۔
        </p>
        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">2. طبی ڈیٹا کی رازداری</h3>
        <p>
          آپ کے امراض، نسخہ جات اور معالج کے ساتھ ہونے والی گفتگو مکمل طور پر خفیہ رکھی جاتی ہے اور کسی تیسرے فریق (Third Party) کے ساتھ کبھی شیئر نہیں کی جاتی۔
        </p>
        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">3. کوکیز اور سیکیورٹی</h3>
        <p>
          ویب سائٹ کو تیز رفتار اور محفوظ بنانے کے لیے جدید انکرپشن اور محفوظ سرورز کا استعمال کیا جاتا ہے۔
        </p>
      </div>
    `
  },
  {
    id: 4,
    title: 'طبی انتباہ و ڈس کلیمر (Medical Disclaimer)',
    slug: 'disclaimer',
    author: 'طبی و قانونی بورڈ طبیب پیڈیا',
    date: '2026/09/27',
    status: 'published',
    parentId: null,
    level: 0,
    order: 4,
    content: `
      <div class="space-y-6 text-right leading-relaxed font-nastaliq">
        <div class="p-5 bg-amber-50 dark:bg-amber-950/30 border-r-4 border-amber-500 rounded-2xl mb-6">
          <p class="text-amber-900 dark:text-amber-200 font-bold text-base">
            ⚠️ اہم انتباہ: طبیب پیڈیا پر موجود تمام معلومات، مقالات اور جڑی بوٹیوں کے نسخہ جات صرف تعلیمی، علمی اور تحقیقی مقاصد کے لیے شائع کیے جاتے ہیں۔ یہ کسی مستند معالج یا ڈاکٹر کے ذاتی معائنے، کلینیکل تشخیص اور باقاعدہ تجویز کردہ علاج کا ہرگز متبادل نہیں ہیں۔
          </p>
        </div>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">1. خود علاجی کی سخت ممانعت (No Self-Medication)</h3>
        <p>
          طب یونانی، طب نبوی اور قانون مفرد اعضاء کے مطابق ہر انسان کا مزاج (اعصابی، عضلاتی، غدی) اور جسمانی ساخت منفرد ہوتی ہے۔ ایک فرد کے لیے مفید دوا یا جڑی بوٹی دوسرے فرد کے مزاج کے خلاف ہونے پر نقصان دہ ثابت ہو سکتی ہے۔ لہٰذا ویب سائٹ پر مذکور کسی نسخے یا جڑی بوٹی کو اپنے طور پر خود استعمال کرنے سے گریز کریں اور لازماً کسی مستند طبیب (FTJ / BEMS) یا ڈاکٹر سے اپنی نبض و علامات چیک کروا کر رہنمائی حاصل کریں۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">2. ہنگامی طبی صورتِ حال (Medical Emergencies)</h3>
        <p>
          اگر آپ یا آپ کا کوئی عزیز کسی شدید، اچانک یا جان لیوا علامت (مثلاً سینے میں شدید درد، سانس لینے میں شدید دشواری، فالج کے اثرات، سر پر شدید چوٹ، یا بے ہوشی) کا شکار ہے، تو فوری طور پر قریبی ایمرجنسی اسپتال یا 1122 ریسکیو سے رابطہ کریں۔ طبیب پیڈیا ایمرجنسی خدمات کے لیے نہیں ہے۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">3. اطباء و معالجین کی آزادانہ حیثیت</h3>
        <p>
          طبیب پیڈیا اطباء و مریضوں کے مابین ایک معلوماتی و تعارفی پلیٹ فارم کے طور پر کام کرتا ہے۔ پلیٹ فارم پر درج اطباء آزاد معالج ہیں اور نیشنل کونسل فار طب کے قواعد و ضوابط کے تحت پریکٹس کرتے ہیں۔ مریض اپنے معالج سے ہونے والے ہر مشورے اور لین دین کا خود ذمہ دار ہے، اور ادارہ کسی معالج کی تجویز کردہ مخصوص ادویات کے قانونی یا طبی نتائج کا ضامن نہیں ہے۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">4. کتبِ طب اور قدیم حوالہ جات</h3>
        <p>
          مضامین میں بیان کردہ مفردرات اور مرکبات کے خواص قدیم اطباء کی معتبر کتب (مثلاً قانون فی الطب، قرابادینِ اعظم، مخزن المفردات وغیرہ) اور جدید تحقیقات سے اخذ کیے گئے ہیں۔ علمی تحقیق وقت کے ساتھ ترقی پذیر رہتی ہے، اس لیے قدیم اصطلاحات کو سمجھنے کے لیے جدید سائنسی اور طبی اصولوں کو پیشِ نظر رکھنا ضروری ہے۔
        </p>
      </div>
    `
  },
  {
    id: 5,
    title: 'شرائط و ضوابط (Terms of Service)',
    slug: 'terms',
    author: 'قانونی مشیر طبیب پیڈیا',
    date: '2026/09/27',
    status: 'published',
    parentId: null,
    level: 0,
    order: 5,
    content: `
      <div class="space-y-6 text-right leading-relaxed font-nastaliq">
        <p>
          طبیب پیڈیا (TabeebPedia.com) پورٹل پر خوش آمدید۔ ہماری ویب سائٹ کا وزٹ کرنے یا اس پر دستیاب خدمات استعمال کرنے کا مطلب ہے کہ آپ درج ذیل شرائط و ضوابط کے پابند ہیں۔ براہ کرم ان شرائط کا بغور مطالعہ فرمائیں۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">1. خدمات کا استعمال اور اہلیت</h3>
        <p>
          یہ ویب سائٹ عوام الناس کو طب یونانی، ہربل علاج اور مستند اطباء سے متعلق معلوماتی مواد فراہم کرتی ہے۔ اس ویب سائٹ کا غلط استعمال، ہیکنگ کی کوشش، غیر اخلاقی تبصرے، یا بلا اجازت اسپامنگ سخت منع ہے۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">2. دانشورانہ ملکیت و کاپی رائٹ (Intellectual Property)</h3>
        <p>
          طبیب پیڈیا پر موجود تمام مضامین، ڈیٹا بیس، ڈیزائن، گرافکس اور لوگوز ادارے کی دانشورانہ ملکیت ہیں۔ کسی بھی مواد کو تجارتی مقاصد کے لیے ادارے کی پیشگی تحریری اجازت کے بغیر نقل (Copy/Paste) کرنا یا دوسری سائٹس پر ری پبلش کرنا ممنوع ہے، البتہ ذاتی و تعلیمی مقصد کے لیے اصل ویب سائٹ کا لنک دے کر شیئر کیا جا سکتا ہے۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">3. اطباء رجسٹریشن کے اصول</h3>
        <p>
          جو معالجین ہمارے پورٹل پر بطور طبیب/ڈاکٹر اکاؤنٹ بناتے ہیں، وہ اپنے شناختی کوائف، کوالیفکیشن (فاضل الطب والجراحت FTJ، BEMS وغیرہ) اور نیشنل کونسل فار طب کے رجسٹریشن نمبر کو درست فراہم کرنے کے پابند ہیں۔ کسی بھی جعلی معلومات یا غیر اخلاقی سرگرمی کی صورت میں ان کا پروفائل فوری معطل کر دیا جائے گا۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">4. ذمہ داری کی حد بندی (Limitation of Liability)</h3>
        <p>
          طبیب پیڈیا کسی بھی ایسی صورت کا قانونی ذمہ دار نہیں ہوگا جس میں کسی صارف نے مواد کے غلط فہم، خود علاجی، یا غیر مستند ذرائع سے حاصل کردہ معلومات کی بنا پر ادویات کا غیر مجاز استعمال کیا ہو۔ صارف تمام طبی فیصلے اپنی صوابدید اور معالج کے براہِ راست مشورے کے بعد کرنے کا مجاز ہے۔
        </p>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white border-r-4 border-emerald-500 pr-3 my-4">5. شرائط میں ترامیم اور متعلقہ قوانین</h3>
        <p>
          ادارہ وقتاً فوقتاً ان شرائط و ضوابط کو اپ ڈیٹ کرنے کا حق محفوظ رکھتا ہے۔ یہ تمام شرائط اسلامی جمہوریہ پاکستان کے قوانین کے مطابق نافذ العمل ہیں۔
        </p>
      </div>
    `
  }
];

// Target pages in the exact order requested by user screenshot
const TARGET_ORDER = [
  { id: 6609, parentId: null, level: 0, order: 6 },
  { id: 7355, parentId: 6609, level: 1, order: 7 },
  { id: 6662, parentId: 6609, level: 1, order: 8 },
  { id: 6818, parentId: 6609, level: 1, order: 9 },
  { id: 6743, parentId: 6818, level: 2, order: 10 },
  { id: 6735, parentId: 6818, level: 2, order: 11 },
  { id: 6742, parentId: 6818, level: 2, order: 12 },
  { id: 6744, parentId: 6818, level: 2, order: 13 },
  { id: 6669, parentId: 6609, level: 1, order: 14 },
  { id: 6654, parentId: 6609, level: 1, order: 15 },
  { id: 6590, parentId: 6609, level: 1, order: 16 },
  { id: 6633, parentId: 6609, level: 1, order: 17 }
];

const targetIdSet = new Set(TARGET_ORDER.map(t => String(t.id)));

const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
const parsedPagesMap = new Map();

while ((match = itemRegex.exec(xml)) !== null) {
  const itemStr = match[1];
  const postId = (itemStr.match(/<wp:post_id>(\d+)<\/wp:post_id>/) || [])[1];
  if (postId && targetIdSet.has(postId)) {
    const title = (itemStr.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemStr.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    const postName = (itemStr.match(/<wp:post_name><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_name>/) || itemStr.match(/<wp:post_name>(.*?)<\/wp:post_name>/) || [])[1] || '';
    const creator = (itemStr.match(/<dc:creator><!\[CDATA\[([\s\S]*?)\]\]><\/dc:creator>/) || [])[1] || 'طبیب پیڈیا ریسرچ بورڈ';
    const postDate = (itemStr.match(/<wp:post_date><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_date>/) || [])[1] || '2026-09-27';
    let content = (itemStr.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) || [])[1] || '';

    // 1. Remove external broken responsive srcset/sizes attributes
    content = content.replace(/\ssrcset=["'][^"']+["']/gi, '');
    content = content.replace(/\ssizes=["'][^"']+["']/gi, '');

    // 2. Map all remote WordPress images to local downloaded images in /images/pages/
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-Hakeem-in-Sind[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-sindh.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-Hakeem-of-Gilgit[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-gilgit.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-Hakeem-Kashmir[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-kashmir.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-of-Certified-Hakims-in-Balochistan[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-balochistan.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-of-Certified-Hakeem-in-KHYBER[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-kpk.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/punjab-Hakeem-List[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-punjab.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-Hakim-Punjab-West[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-punjab-west.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-of-Eastern-Punjab-scholars[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-punjab-east.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-Hakim-Punjab-South[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-punjab-south.png');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/wp-content\/uploads\/[^\/]+\/[^\/]+\/List-Hakim-Punjab-North[^\."'\s]+\.png/gi, '/images/pages/list-hakeem-punjab-north.png');

    // 3. Cleanly parse WordPress caption shortcodes
    content = content.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, (match, body) => {
      const imgMatch = body.match(/(<a[\s\S]*?<\/a>|<img[\s\S]*?>)/i);
      let media = '';
      let captionText = body;
      if (imgMatch) {
        media = imgMatch[0];
        captionText = body.replace(media, '').trim();
      }
      return `<figure class="my-6 flex flex-col items-center justify-center text-center">${media || body}${captionText ? `<figcaption class="text-sm font-bold text-slate-600 mt-2">${captionText}</figcaption>` : ''}</figure>`;
    });
    content = content.replace(/\[\/?caption[^\]]*\]/gi, '');

    // 4. Replace WordPress internal navigation links (href only, never touching src or uploads)
    content = content.replace(/href=["']https?:\/\/(?:www\.)?tabeebpedia\.com\/registered-hakims-pakistan\/[^\/]+\/([^\/"'\s]+)\/?["']/gi, 'href="/$1"');
    content = content.replace(/href=["']https?:\/\/(?:www\.)?tabeebpedia\.com\/registered-hakims-pakistan\/([^\/"'\s]+)\/?["']/gi, 'href="/$1"');
    content = content.replace(/href=["']https?:\/\/(?:www\.)?tabeebpedia\.com\/([^\/"'\s]+)\/?["']/gi, (m, slug) => {
      if (slug.startsWith('wp-') || slug.includes('.')) return m;
      return `href="/${slug}"`;
    });

    // 5. Clean up empty paragraphs
    content = content.replace(/<p>\s*&nbsp;\s*<\/p>/gi, '');

    parsedPagesMap.set(postId, {
      id: parseInt(postId, 10),
      title: title.trim(),
      slug: postName.trim(),
      author: creator.trim() || 'طبیب پیڈیا ریسرچ بورڈ',
      date: postDate.split(' ')[0],
      status: 'published',
      content
    });
  }
}

// Assemble all pages in order
const allPages = [...CORE_PAGES];

TARGET_ORDER.forEach(target => {
  const parsed = parsedPagesMap.get(String(target.id));
  if (parsed) {
    allPages.push({
      ...parsed,
      parentId: target.parentId,
      level: target.level,
      order: target.order
    });
  } else {
    console.error(`⚠️ Missing page with ID ${target.id}`);
  }
});

console.log(`✅ Total assembled pages: ${allPages.length}`);

// Write to public/data/pages.json
const pagesJsonPath = path.join(rootDir, 'public', 'data', 'pages.json');
fs.writeFileSync(pagesJsonPath, JSON.stringify(allPages, null, 2), 'utf8');
console.log(`💾 Saved to: ${pagesJsonPath}`);

// Also sync to dist/data/pages.json if dist/data exists
const distDataDir = path.join(rootDir, 'dist', 'data');
if (!fs.existsSync(distDataDir)) {
  fs.mkdirSync(distDataDir, { recursive: true });
}
const distPagesJsonPath = path.join(distDataDir, 'pages.json');
fs.writeFileSync(distPagesJsonPath, JSON.stringify(allPages, null, 2), 'utf8');
console.log(`💾 Synced to: ${distPagesJsonPath}`);
