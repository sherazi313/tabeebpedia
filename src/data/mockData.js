export const CITIES = [
  { id: 'all', name: 'تمام شہر' },
  { id: 'lahore', name: 'لاہور' },
  { id: 'karachi', name: 'کراچی' },
  { id: 'islamabad', name: 'اسلام آباد / راولپنڈی' },
  { id: 'faisalabad', name: 'فیصل آباد' },
  { id: 'multan', name: 'ملتان' },
  { id: 'peshawar', name: 'پشاور' },
  { id: 'quetta', name: 'کوئٹہ' },
  { id: 'gujranwala', name: 'گوجرانوالہ' },
  { id: 'sialkot', name: 'سیالکوٹ' },
  { id: 'bahawalpur', name: 'بہاولپور' },
  { id: 'hyderabad', name: 'حیدرآباد' },
];

export const SPECIALTIES = [
  { id: 'all', name: 'تمام امراض و شعبہ جات', icon: 'Sparkles' },
  { id: 'digestive', name: 'امراض معدہ، گیس و تبخیر', icon: 'Flame', desc: 'معدے کا السر، تیزابیت، دائمی قبض اور آئی بی ایس' },
  { id: 'joints', name: 'جوڑوں و پٹھوں کا درد (عرق النساء)', icon: 'Activity', desc: 'گٹھیا، مہروں کا درد، یورک ایسڈ اور پٹھوں کا کھنچاؤ' },
  { id: 'liver', name: 'امراض جگر و یرقان', icon: 'ShieldAlert', desc: 'فیٹی لیور، یرقان، گرمی جگر اور ہیپاٹائٹس' },
  { id: 'mens-health', name: 'مردانہ صحت و بانجھ پن', icon: 'UserCheck', desc: 'مردانہ کمزوری، مادہ منویہ کی خرابی اور قوت باہ' },
  { id: 'womens-health', name: 'امراض نسواں و زنانہ بانجھ پن', icon: 'Heart', desc: 'پیسی او ایس (PCOS)، ہارمونز کی بے قاعدگی اور لیکوریا' },
  { id: 'respiratory', name: 'امراض تنفس، دمہ و نزلہ', icon: 'Wind', desc: 'دائمی نزلہ زکام، الرجی، دمہ اور کھانسی' },
  { id: 'skin', name: 'جلدی امراض و الرجی', icon: 'Smile', desc: 'چنبل، داد، خارش، ایکنی اور چہرے کے داغ دھبے' },
  { id: 'diabetes', name: 'شوگر و بلڈ پریشر', icon: 'Droplets', desc: 'ذیابیطس کنٹرول، ہائی بلڈ پریشر اور کولیسٹرول' },
  { id: 'qanoon-mufrad', name: 'قانون مفرد اعضاء و تشخیص نبض', icon: 'Compass', desc: 'اعصابی، عضلاتی اور غدی نبض سے مکمل علاج' },
  { id: 'hijama', name: 'حجامہ و کپنگ تھیراپی', icon: 'Crosshair', desc: 'سنت طریقہ علاج، فاسد خون کا اخراج اور درد سے نجات' },
];

export const TREATMENT_TYPES = [
  'طب پاکستانی (قانون مفرد اعضاء)',
  'طب یونانی',
  'طب نبوی',
  'حجامہ',
  'کائرو پریکٹس'
];

export const CATEGORIES = [
  { id: 'all', name: 'تمام مضامین', slug: 'all' },
  { id: 'tibb-unani', name: 'طب یونانی و نبوی', slug: 'tibb-unani', icon: 'BookOpen' },
  { id: 'qanoon-mufrad-aza', name: 'قانون مفرد اعضاء', slug: 'qanoon-mufrad-aza', icon: 'Cpu' },
  { id: 'herbs', name: 'جڑی بوٹیوں کی انسائیکلوپیڈیا', slug: 'herbs', icon: 'Leaf' },
  { id: 'remedies', name: 'گھریلو علاج و مجربات', slug: 'remedies', icon: 'Home' },
  { id: 'diet-chart', name: 'غذائی چارٹ و پرہیز', slug: 'diet-chart', icon: 'Apple' },
  { id: 'research', name: 'جدید طبی و سائنسی تحقیقات', slug: 'research', icon: 'FileText' },
];

export const DOCTORS = [
  {
    id: 1,
    name: 'حکیم محمد طارق محمود چغتائی',
    slug: 'hakeem-tariq-mahmood-chughtai',
    title: 'طبیب حاذق، ماہر طب یونانی و قانون مفرد اعضاء',
    qualifications: 'BEMS (Gold Medalist), FTJ (Karachi University)',
    experience: 22,
    rating: 4.9,
    reviewsCount: 384,
    city: 'lahore',
    cityName: 'لاہور',
    specialties: ['امراض معدہ، گیس و تبخیر', 'جوڑوں و پٹھوں کا درد (عرق النساء)', 'قانون مفرد اعضاء و تشخیص نبض'],
    treatmentType: 'طب یونانی',
    clinicName: 'عبقری شفا خانہ و الحکمت کلینک',
    address: 'مین فیروز پور روڈ، بالمقابل شمع میٹرو اسٹیشن، لاہور',
    timing: 'پیر تا ہفتہ: شام 4:00 تا رات 9:30',
    fee: 1000,
    phone: '+923001234567',
    whatsapp: '923001234567',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    isFeatured: true,
    about: 'حکیم طارق محمود گزشتہ 22 سال سے طب یونانی اور مفرد اعضاء کے تحت ہزاروں لاعلاج مریضوں کا شافی علاج کر چکے ہیں۔ نبض شناسی اور قرورہ کے ذریعے بیماری کی اصل جڑ معلوم کرنے میں خاص مہارت رکھتے ہیں۔',
    services: ['نبض کے ذریعے مکمل طبی معائنہ', 'معدہ و جگر کے دائمی امراض کا دیسی علاج', 'جوڑوں کے درد اور مہروں کے لیے خاص معجونات', 'زنانہ و مردانہ پوشیدہ امراض کا رازداری سے علاج'],
    education: [
      { degree: 'BEMS (Bachelor of Eastern Medicine & Surgery)', institute: 'اسلامیہ یونیورسٹی بہاولپور' },
      { degree: 'فاضل الطب والجراحت (FTJ)', institute: 'طبیہ کالج لاہور' },
      { degree: 'ڈپلومہ ان حجامہ تھیراپی', institute: 'بین الاقوامی اکیڈمی برائے ہربل میڈیسن' }
    ]
  },
  {
    id: 2,
    name: 'ڈاکٹر / حکیمہ فوزیہ تبسم',
    slug: 'dr-hakeema-fouzia-tabassum',
    title: 'ماہر امراض نسواں، زنانہ بانجھ پن و ہربل نیوٹریشن',
    qualifications: 'BEMS, M.Phil (Eastern Medicine), Certified Hijama Specialist',
    experience: 14,
    rating: 4.8,
    reviewsCount: 215,
    city: 'karachi',
    cityName: 'کراچی',
    specialties: ['امراض نسواں و زنانہ بانجھ پن', 'جلدی امراض و الرجی', 'شوگر و بلڈ پریشر'],
    treatmentType: 'طب نبوی',
    clinicName: 'الشفاء ہربل کیئر سنٹر فار ویمن',
    address: 'بلاک 13-D، گلشن اقبال، بالمقابل بیت المکرم مسجد، کراچی',
    timing: 'پیر تا جمعرات: صبح 11:00 تا شام 5:00',
    fee: 800,
    phone: '+923219876543',
    whatsapp: '923219876543',
    image: 'https://images.unsplash.com/photo-1594824813593-393240212ff9?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    isFeatured: true,
    about: 'ڈاکٹر حکیمہ فوزیہ تبسم خواتین کے پوشیدہ مسائل، ہارمونل امراض، پی سی او ایس اور بانجھ پن کے قدرتی طریقہ علاج میں 14 سالہ تجربہ رکھتی ہیں۔',
    services: ['خواتین کے لیے مخصوص کلینک اور پرائیویٹ مشاورت', 'PCOS اور ماہواری کے مسائل کا قدرتی حل', 'زنانہ ہارمونز بیلنس ڈائٹ پلان', 'لیڈیز سپیشلسٹ حجامہ'],
    education: [
      { degree: 'BEMS', institute: 'ہمدرد یونیورسٹی کراچی' },
      { degree: 'M.Phil (Eastern Medicine)', institute: 'جامعہ کراچی' }
    ]
  },
  {
    id: 3,
    name: 'حکیم سید عبدالرحمن شاہ گیلانی',
    slug: 'hakeem-syed-abdul-rehman-shah',
    title: 'ماہر نباض، استاد قانون مفرد اعضاء',
    qualifications: 'فاضل طب والجراحت (FTJ)، ریسرچ فیلو نیشنل کونسل فار طب',
    experience: 30,
    rating: 5.0,
    reviewsCount: 512,
    city: 'rawalpindi',
    cityName: 'اسلام آباد / راولپنڈی',
    specialties: ['قانون مفرد اعضاء و تشخیص نبض', 'امراض جگر و یرقان', 'امراض تنفس، دمہ و نزلہ'],
    treatmentType: 'طب پاکستانی (قانون مفرد اعضاء)',
    clinicName: 'گیلانی شفا خانہ قانون مفرد اعضاء',
    address: 'مرکزی صدر بازار، نزد جی پی او، راولپنڈی',
    timing: 'روزانہ: دوپہر 2:00 تا رات 8:00 (جمعہ تعطیل)',
    fee: 700,
    phone: '+923335551234',
    whatsapp: '923335551234',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    isFeatured: true,
    about: 'حکیم سید عبدالرحمن شاہ گیلانی صابر ملتانی رحمۃ اللہ علیہ کے مکتبہ فکر سے تعلق رکھتے ہیں اور قانون مفرد اعضاء کے تحت اعصابی، عضلاتی اور غدی علاج کے مستند ترین استاد ہیں۔',
    services: ['نبض کے 6 مزاج کی دقیق تشخیص', 'ہیپاٹائٹس اور فیٹی لیور کا اصولِ علاج', 'دائمی الرجی، چھینکیں اور دمہ کا مستقل علاج', 'مفرد اغذیہ و قہوہ جات کی رہنمائی'],
    education: [
      { degree: 'فاضل الطب والجراحت', institute: 'طبیہ کالج راولپنڈی' }
    ]
  },
  {
    id: 4,
    name: 'حکیم میاں محمد رضوان فاروقی',
    slug: 'hakeem-mian-muhammad-rizwan',
    title: 'ماہر امراض گردہ و مثانہ، پتھری و یورک ایسڈ',
    qualifications: 'BEMS (Hamdard), Certified Herbal Urologist',
    experience: 16,
    rating: 4.7,
    reviewsCount: 168,
    city: 'faisalabad',
    cityName: 'فیصل آباد',
    specialties: ['امراض معدہ، گیس و تبخیر', 'جوڑوں و پٹھوں کا درد (عرق النساء)'],
    treatmentType: 'طب یونانی',
    clinicName: 'فاروقیہ ہربل میڈیکل سنٹر',
    address: 'ستیانہ روڈ، بالمقابل کارڈیالوجی ہسپتال، فیصل آباد',
    timing: 'پیر تا ہفتہ: شام 5:00 تا رات 10:00',
    fee: 600,
    phone: '+923017778899',
    whatsapp: '923017778899',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    isFeatured: false,
    about: 'گردہ و مثانہ کی پتھری کو بغیر آپریشن خارج کرنے اور یورک ایسڈ و جوڑوں کے درد کے علاج میں معروف ہیں۔',
    services: ['گردہ و مثانہ کی پتھری کا ہربل علاج', 'یورک ایسڈ سے نجات', 'معدے کی تیزابیت کا دیسی علاج'],
    education: [{ degree: 'BEMS', institute: 'ہمدرد یونیورسٹی' }]
  },
  {
    id: 5,
    name: 'حکیم حاجی منظور احمد ملتانی',
    slug: 'hakeem-haji-manzoor-ahmed',
    title: 'طبیب حاذق، ماہر نباض و موروثی امراض',
    qualifications: 'FTJ (Punjab Board of Technical Education)',
    experience: 35,
    rating: 4.9,
    reviewsCount: 420,
    city: 'multan',
    cityName: 'ملتان',
    specialties: ['امراض معدہ، گیس و تبخیر', 'امراض جگر و یرقان', 'قانون مفرد اعضاء و تشخیص نبض'],
    treatmentType: 'طب پاکستانی (قانون مفرد اعضاء)',
    clinicName: 'ملتانی مطب قدیم',
    address: 'بوہڑ گیٹ، نزد اندرون شہر، ملتان',
    timing: 'صبح 10:00 تا شام 4:00',
    fee: 500,
    phone: '+923006661122',
    whatsapp: '923006661122',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    isFeatured: false,
    about: 'ملتان کے قدیم ترین خاندان اطباء کے چشم و چراغ، معدہ، جگر اور اعصابی کمزوری کے موروثی اور مجرب نسخہ جات کے امین۔',
    services: ['دائمی قبض اور بواسیر کا جڑی بوٹیوں سے علاج', 'پیٹ کے کیڑے اور تبخیر معدہ', 'جگر کی اصلاح'],
    education: [{ degree: 'فاضل طب والجراحت', institute: 'انجمن حمایت اسلام طبیہ کالج لاہور' }]
  },
  {
    id: 6,
    name: 'ڈاکٹر حکیم محمد وقاص اعوان',
    slug: 'dr-waqas-awan',
    title: 'ماہر حجامہ و ہربل آرتھوپیڈک تھیراپی',
    qualifications: 'BEMS, Dip. in Hijama (UK Certified), Physiotherapy',
    experience: 10,
    rating: 4.8,
    reviewsCount: 190,
    city: 'lahore',
    cityName: 'لاہور',
    specialties: ['جوڑوں و پٹھوں کا درد (عرق النساء)', 'حجامہ و کپنگ تھیراپی'],
    treatmentType: 'حجامہ',
    clinicName: 'طیبہ حجامہ و پین ریلیف سنٹر',
    address: 'مین بلیوارڈ، جوہر ٹاؤن، بالمقابل ڈاکٹرز ہسپتال، لاہور',
    timing: 'شام 4:00 تا رات 10:00',
    fee: 1500,
    phone: '+923004445566',
    whatsapp: '923004445566',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    isFeatured: true,
    about: 'سائیکا (عرق النساء)، مہروں کے گیپ، شیاٹیکا اور مائیگرین کے درد کا سنت طریقہ حجامہ اور ہربل تیلوں سے علاج کرتے ہیں۔',
    services: ['مکمل باڈی کلینزنگ حجامہ', 'جوڑوں اور گھٹنوں کے درد کے لیے سنتی پوائنٹس', 'ہائی بلڈ پریشر میں حجامہ کی افادیت'],
    education: [{ degree: 'BEMS', institute: 'اسلامیہ یونیورسٹی' }]
  }
];

export const ARTICLES = [
  {
    id: 101,
    title: 'کلونجی اور شہد: موت کے علاوہ ہر بیماری کا علاج - سائنسی اور طب نبوی کے حیرت انگیز حقائق',
    slug: 'kalonji-and-honey-benefits-tibb-nabawi',
    category: 'tibb-unani',
    categoryName: 'طب یونانی و نبوی',
    featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    excerpt: 'رسول اکرم ﷺ کا فرمانِ عالی شان ہے کہ کالے دانے میں موت کے سوا ہر مرض کے لیے شفا ہے۔ جانیے کلونجی کے اصل طبی فوائد، مزاج اور استعمال کا صحیح طریقہ۔',
    author: 'حکیم محمد طارق محمود',
    authorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    publishedAt: '2024-08-15',
    views: 14850,
    readingTime: '5 منٹ',
    tags: ['کلونجی', 'شہد', 'طب نبوی', 'قوت مدافعت', 'معدہ'],
    relatedDiseases: ['امراض معدہ، گیس و تبخیر', 'شوگر و بلڈ پریشر'],
    content: `
      <h2>مقدمہ و طب نبوی کا نظریہ</h2>
      <p>صحیح بخاری و مسلم کی متفق علیہ حدیث مبارکہ میں حضرت ابوہریرہ رضی اللہ عنہ سے روایت ہے کہ رسول اللہ ﷺ نے فرمایا: <strong>"تم کلونجی کو لازم پکڑو، کیونکہ اس سیاہ دانے میں موت کے سوا ہر بیماری کی شفا ہے۔"</strong></p>
      
      <p>طب یونانی اور جدید سائنسی تحقیق میں کلونجی (Nigella Sativa) کو قدرتی اینٹی آکسیڈنٹس، تھائموکوئینون (Thymoquinone) اور طاقتور اینٹی انفلیمیٹری اجزاء کا خزانہ مانا جاتا ہے۔</p>

      <h3>کلونجی کا طبی مزاج اور اثرات</h3>
      <p>طب یونانی اور قانون مفرد اعضاء کی رو سے کلونجی کا مزاج <strong>گرم و خشک بدرجہ دوم</strong> ہے۔ یہ جسم میں رطوباتِ فاسدہ کو خشک کرتی ہے، بلغم کو خارج کرتی ہے اور جگر و معدہ کے افعال کو تیز کرتی ہے۔</p>

      <div class="my-6 p-4 rounded-xl bg-emerald-50 border-r-4 border-emerald-600 text-emerald-900">
        <h4 class="font-bold text-lg mb-2">کلونجی کے چند بنیادی فوائد:</h4>
        <ul class="list-disc pr-6 space-y-2">
          <li><strong>معدے اور پیٹ کی گیس:</strong> تبخیر، ریاح اور پیٹ کے پھولنے میں فوری آرام دیتی ہے۔</li>
          <li><strong>قوت مدافعت میں اضافہ:</strong> جسم کو وائرل اور بیکٹیریل انفیکشنز سے بچاتی ہے۔</li>
          <li><strong>کولیسٹرول اور بلڈ پریشر:</strong> خون کی نالیوں میں جمے فاسد مادوں اور چکنائی کو صاف کرتی ہے۔</li>
          <li><strong>دماغی تیزی:</strong> شہد کے ساتھ استعمال سے یادداشت تیز ہوتی ہے۔</li>
        </ul>
      </div>

      <h3>استعمال کا درست اور سائنسی طریقہ</h3>
      <p>اکثر لوگ کلونجی کی زیادہ مقدار کھا کر فائدے کے بجائے نقصان اٹھاتے ہیں۔ یاد رکھیں کہ کلونجی ایک دوا ہے، غذا نہیں۔ روزانہ صرف <strong>7 سے 11 دانے</strong> صبح نہار منہ ایک چمچ خالص شہد یا نیم گرم پانی کے ساتھ چبا کر کھانا کافی ہے۔</p>

      <h3>احتیاطی تدابیر</h3>
      <p>حاملہ خواتین اور ہائی بلڈ پریشر کے مریض جن کا مزاج شدید گرم ہو، اپنے معالج یا حکیم کے مشورے کے بغیر زیادہ مقدار میں استعمال نہ کریں۔</p>
    `
  },
  {
    id: 102,
    title: 'قانون مفرد اعضاء کے تحت معدے کی تیزابیت، جلن اور السر کا مکمل اصولِ علاج',
    slug: 'qanoon-mufrad-aza-stomach-acidity-ulcer-cure',
    category: 'qanoon-mufrad-aza',
    categoryName: 'قانون مفرد اعضاء',
    featuredImage: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=800&q=80',
    excerpt: 'صابر ملتانی رحمۃ اللہ علیہ کے نظریۂ مفرد اعضاء کے مطابق تیزابیت اور معدے کے السر کی اصل وجہ کیا ہے؟ جانیے عضلاتی و غدی تحریک کی پہچان اور آسان نسخہ۔',
    author: 'حکیم سید عبدالرحمن شاہ گیلانی',
    authorImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80',
    publishedAt: '2024-07-28',
    views: 11200,
    readingTime: '7 منٹ',
    tags: ['قانون مفرد اعضاء', 'معدے کا السر', 'تیزابیت', 'صابر ملتانی', 'نبض'],
    relatedDiseases: ['امراض معدہ، گیس و تبخیر'],
    content: `
      <h2>نظریۂ صابر ملتانی اور معدے کے امراض</h2>
      <p>بانی قانون مفرد اعضاء حضرت صابر ملتانیؒ کے مطابق انسانی جسم تین بنیادی اعضاء رئیسہ (دل، دماغ، جگر) اور ان سے متعلق تین بافتوں (اعصاب، عضلات، غدد) پر مشتمل ہے۔ جب کسی عضو میں ضرورت سے زیادہ تحریک پیدا ہو جاتی ہے تو وہیں سے بیماری کا آغاز ہوتا ہے۔</p>

      <h3>تیزابیت (Acidity) کی اصل وجہ: عضلاتی سوزش</h3>
      <p>معدے میں تیزابیت اور جلن دراصل <strong>عضلاتی اعصابی یا عضلاتی غدی تحریک (خشکی سردی یا خشکی گرمی)</strong> کا نتیجہ ہوتی ہے۔ اس کیفیت میں جسم میں سوداویت اور تُرشی بڑھ جاتی ہے جس سے معدے کی دیواروں پر خراش اور السر بنتا ہے۔</p>

      <div class="my-6 p-4 rounded-xl bg-amber-50 border-r-4 border-amber-600 text-amber-900">
        <h4 class="font-bold text-lg mb-2">مریض کی نبض اور علامات کی پہچان:</h4>
        <ul class="list-disc pr-6 space-y-1">
          <li>نبض انگلیوں کے نیچے موٹی اور سخت محسوس ہوگی۔</li>
          <li>منہ کا ذائقہ ترش یا پھیکا رہے گا۔</li>
          <li>پیشاب کی رنگت سفید مائل یا سرخی مائل کم مقدار میں آئے گی۔</li>
          <li>پیٹ میں اپھارہ، قبض اور دل کی گھبراہٹ عام علامات ہیں۔</li>
        </ul>
      </div>

      <h3>اصولِ علاج: غدی عضلاتی تحریک (حرارت کی بحالی)</h3>
      <p>چونکہ مرض کا سبب خشکی اور تیزابیت ہے، لہٰذا علاج کے لیے جگر کو متحرک کر کے حرارتِ غریزیہ کو بحال کیا جائے گا۔</p>

      <h4>مجرب نسخہ (تریاقِ معدہ):</h4>
      <p>اجزاء: سونف 50 گرام، ملٹھی 50 گرام، ریوند خطائی 50 گرام، گل سرخ 50 گرام۔ تمام ادویہ کا باریک سفوف بنا لیں اور روزانہ صبح، دوپہر، شام آدھا چمچ کھانے کے بعد سادہ پانی کے ساتھ لیں۔</p>
    `
  },
  {
    id: 103,
    title: 'اسبغول کا چھلکا: فوائد، نقصانات اور استعمال کا سب سے بڑا عام مغالطہ',
    slug: 'isabgol-husk-benefits-and-proper-usage',
    category: 'herbs',
    categoryName: 'جڑی بوٹیوں کی انسائیکلوپیڈیا',
    featuredImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    excerpt: 'کیا آپ اسبغول پانی میں گھول کر فورا پی لیتے ہیں؟ جانیے اطباء کی نظر میں اسبغول کے صحیح استعمال کا طریقہ جو قبض اور پیچش دونوں کے لیے الگ الگ ہے۔',
    author: 'حکیم حاجی منظور احمد ملتانی',
    authorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    publishedAt: '2024-09-02',
    views: 9400,
    readingTime: '4 منٹ',
    tags: ['اسبغول', 'قبض', 'آنتیں', 'جڑی بوٹیاں', 'کولیسٹرول'],
    relatedDiseases: ['امراض معدہ، گیس و تبخیر'],
    content: `
      <h2>اسبغول کا نباتاتی تعارف اور مزاج</h2>
      <p>اسبغول (Plantago Ovata) کے بیجوں پر موجود باریک چھلکا قدرت کی ایک انمول نعمت ہے۔ طب یونانی کے مطابق اس کا مزاج <strong>سرد تر بدرجہ دوم</strong> ہے۔ یہ معدے اور آنتوں کی سوزش اور خشکی کو دور کرنے والی لاجواب قدرتی دوا ہے۔</p>

      <h3>سب سے بڑا عام مغالطہ</h3>
      <p>اکثر لوگ اسبغول کا چھلکا پانی میں ڈالتے ہی فوری پی لیتے ہیں۔ یہ طریقہ بعض اوقات آنتوں میں مزید خشکی کا سبب بن سکتا ہے۔ اسبغول کو پانی یا دودھ میں کم از کم <strong>10 سے 15 منٹ</strong> تک بھگو کر رکھنا چاہیے تاکہ اس کا لیس دار مادہ (Mucilage) مکمل طور پر پھول جائے۔</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <h4 class="font-bold text-emerald-800 text-lg mb-2">قبض دور کرنے کے لیے:</h4>
          <p class="text-sm text-slate-700 leading-relaxed">ایک بڑا چمچ اسبغول نیم گرم میٹھے دودھ میں 15 منٹ بھگو کر رات سوتے وقت پیئیں۔ یہ آنتوں کو نرم کر کے پاخانہ باآسانی خارج کرتا ہے۔</p>
        </div>
        <div class="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 class="font-bold text-blue-800 text-lg mb-2">مروڑ، پیچش اور دست کے لیے:</h4>
          <p class="text-sm text-slate-700 leading-relaxed">ایک چمچ اسبغول ایک کپ تازہ دہی یا لسی میں ملا کر دن میں دو بار کھائیں۔ یہ آنتوں کے السر اور جلن کو فوری ٹھنڈک بخشتا ہے۔</p>
        </div>
      </div>
    `
  },
  {
    id: 104,
    title: 'عرق النساء (Sciatica) اور جوڑوں کے درد کا شافی دیسی علاج اور احتیاطیں',
    slug: 'sciatica-joint-pain-herbal-remedy-tibb',
    category: 'remedies',
    categoryName: 'گھریلو علاج و مجربات',
    featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    excerpt: 'کمر سے پاؤں تک جانے والا شدید درد کیسے منٹوں میں قابو پایا جا سکتا ہے؟ جانیے لہسن، سونٹھ اور سرنجاں شیریں کا مجرب ہربل نسخہ۔',
    author: 'ڈاکٹر حکیم محمد وقاص اعوان',
    authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
    publishedAt: '2024-08-01',
    views: 8200,
    readingTime: '6 منٹ',
    tags: ['عرق النساء', 'جوڑوں کا درد', 'سائیکا', 'حجامہ', 'سرنجاں'],
    relatedDiseases: ['جوڑوں و پٹھوں کا درد (عرق النساء)'],
    content: `
      <h2>عرق النساء کیا ہے؟</h2>
      <p>عرق النساء جسے انگریزی میں Sciatica کہا جاتا ہے، دراصل جسم کی سب سے بڑی اعصابی رگ (Sciatic Nerve) پر دباؤ یا سوزش کی وجہ سے پیدا ہوتا ہے۔ یہ درد کولہے سے شروع ہو کر ران کے پیچھے سے ہوتا ہوا پاؤں کے انگوٹھے تک جاتا ہے۔</p>
      
      <h3>طب قدیم میں اس کی وجوہات</h3>
      <p>طب یونانی کے مطابق بلغمی یا ریحی رطوبات کا عصب پر گرنا اس درد کا بنیادی سبب ہے۔ سردی لگنے یا وزنی چیز اٹھانے سے یہ تکلیف شدید ہو جاتی ہے۔</p>

      <h3>مجرب نسخہ</h3>
      <p>اجزاء: سرنجاں شیریں 30 گرام، سونٹھ 30 گرام، اسگندھ ناگوری 30 گرام، مصبر سیاہ 10 گرام۔ تمام چیزوں کا سفوف بنا کر 500 ملی گرام کے کیپسول بھر لیں۔ صبح اور شام کھانے کے بعد دودھ کے ساتھ استعمال کریں۔</p>
    `
  },
  {
    id: 105,
    title: 'خواتین میں پی سی او ایس (PCOS) اور ہارمونز کی بے قاعدگی کا قدرتی ہربل علاج',
    slug: 'pcos-hormonal-imbalance-treatment-herbal',
    category: 'tibb-unani',
    categoryName: 'طب یونانی و نبوی',
    featuredImage: 'https://images.unsplash.com/photo-1512290900672-1f41d999086a?auto=format&fit=crop&w=800&q=80',
    excerpt: 'خواتین کے لیے پولی سسٹک اووری سنڈروم، چہرے کے غیر ضروری بال، موٹاپا اور ماہواری کی بندش کا ہربل و غذائی حل۔',
    author: 'ڈاکٹر / حکیمہ فوزیہ تبسم',
    authorImage: 'https://images.unsplash.com/photo-1594824813593-393240212ff9?auto=format&fit=crop&w=150&q=80',
    publishedAt: '2024-09-10',
    views: 13500,
    readingTime: '6 منٹ',
    tags: ['پی سی او ایس', 'امراض نسواں', 'ہارمونز', 'دارچینی', 'میتھی دانہ'],
    relatedDiseases: ['امراض نسواں و زنانہ بانجھ پن'],
    content: `
      <h2>PCOS کی بڑھتی ہوئی شرح اور وجوہات</h2>
      <p>موجودہ دور میں ناقص خوراک، برائلر مرغی، بازاری فاسٹ فوڈ اور سست طرز زندگی کے باعث خواتین میں ہارمونز کا توازن بگڑ جاتا ہے، جس کے نتیجے میں بیضہ دانی میں سسٹس (پانی کی تھیلیاں) بن جاتی ہیں۔</p>
      
      <h3>ہربل طریقہ علاج اور دارچینی کا جادو</h3>
      <p>جدید تحقیقات اور طب یونانی دونوں اس بات پر متفق ہیں کہ دارچینی (Cinnamon) انسولین ریزسٹنس کو کم کرتی ہے اور بیضہ دانی کے افعال کو درست کرتی ہے۔</p>
    `
  },
  {
    id: 106,
    title: 'زعفران کے فوائد، پہچان اور دل و دماغ کے لیے اکسیر نسخہ جات',
    slug: 'saffron-zafran-benefits-and-purity-test',
    category: 'herbs',
    categoryName: 'جڑی بوٹیوں کی انسائیکلوپیڈیا',
    featuredImage: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80',
    excerpt: 'سرخ سونے (زعفران) کی اصل اور نقلی کی پہچان کیسے کریں؟ اور دل، ڈپریشن اور جلد کی رونق کے لیے اس کے استعمال کے نادر طریقے کیا ہیں؟',
    author: 'حکیم میاں محمد رضوان فاروقی',
    authorImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=150&q=80',
    publishedAt: '2024-08-20',
    views: 7600,
    readingTime: '5 منٹ',
    tags: ['زعفران', 'دل کی کمزوری', 'ڈپریشن', 'جلد کی خوبصورتی', 'جڑی بوٹیاں'],
    relatedDiseases: ['اعصابی و دماغی امراض', 'امراض قلب و بلڈ پریشر'],
    content: `
      <h2>زعفران: نباتاتی دنیا کا شاہکار</h2>
      <p>زعفران کو عربی میں 'زعفران' اور انگریزی میں Saffron کہتے ہیں۔ اس کا مزاج گرم خشک ہے اور یہ مفرح قلب و دماغ (دل اور دماغ کو فرحت بخشنے والی) اول درجے کی دوا ہے۔</p>
    `
  }
];

export const HERBS_DATA = [
  {
    id: 1,
    name: 'زعفران (Saffron)',
    botanicalName: 'Crocus sativus',
    mizaj: 'گرم ۲ ، خشک ۱',
    category: 'مفرح قلب و دماغ، مقوی باہ',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=400&q=80',
    shortDesc: 'دل و دماغ کو تقویت دینے والا، جلد کو نکھارنے والا اور اعصابی تھکن دور کرنے والا اکسیر۔',
    benefits: ['ڈپریشن اور اینگزائٹی کا خاتمہ', 'دل کی دھڑکن معمول پر لانا', 'چہرے کی رنگت صاف کرنا'],
    dose: '1 سے 2 رتی دودھ یا چائے میں'
  },
  {
    id: 2,
    name: 'کلونجی (Black Seed)',
    botanicalName: 'Nigella sativa',
    mizaj: 'گرم ۲ ، خشک ۲',
    category: 'دافع امراض، مقوی معدہ و جگر',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    shortDesc: 'طب نبوی کی شاہکار دوا جس میں موت کے سوا تمام امراض کی شفا موجود ہے۔',
    benefits: ['قوت مدافعت بڑھانا', 'دمہ اور سانس کی بندش دور کرنا', 'پیٹ کی گیس و تبخیر کا علاج'],
    dose: '7 سے 11 دانے نہار منہ'
  },
  {
    id: 3,
    name: 'اسبغول کا چھلکا (Psyllium Husk)',
    botanicalName: 'Plantago ovata',
    mizaj: 'سرد ۲ ، تر ۲',
    category: 'ملین، دافع قبض و السر',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    shortDesc: 'آنتوں اور معدے کی خشکی و گرمی کو دور کرنے والا لاجواب قدرتی فائبر۔',
    benefits: ['دائمی قبض اور بواسیر سے نجات', 'کولیسٹرول اور موٹاپا کم کرنا', 'معدے کی جلن ٹھنڈی کرنا'],
    dose: 'ایک بڑا چمچ پانی یا دودھ میں'
  },
  {
    id: 4,
    name: 'اشوگندھا / اسگندھ ناگوری (Ashwagandha)',
    botanicalName: 'Withania somnifera',
    mizaj: 'گرم ۲ ، خشک ۱',
    category: 'مقوی اعصاب، دافع تناؤ',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
    shortDesc: 'اعصابی کمزوری، پٹھوں کے کھنچاؤ، نیند کی کمی اور جنسی قوت بحال کرنے والی جڑی بوٹی۔',
    benefits: ['کورٹیسول اور اسٹریس کم کرنا', 'مردانہ ہارمونز کی افزائش', 'جوڑوں اور ہڈیوں کی مضبوطی'],
    dose: '3 سے 5 گرام سفوف ہمراہ نیم گرم دودھ'
  },
  {
    id: 5,
    name: 'دارچینی (Cinnamon)',
    botanicalName: 'Cinnamomum verum',
    mizaj: 'گرم ۳ ، خشک ۲',
    category: 'کاسر ریاح، دافع بلغم، مقوی معدہ',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80',
    shortDesc: 'خون کی روانی بہتر بنانے، شوگر کنٹرول کرنے اور چربی پگھلانے والی خوشبودار چھال۔',
    benefits: ['خون میں شوگر لیول کنٹرول کرنا', 'نزلہ زکام اور سردی کا اثر دور کرنا', 'PCOS اور ماہواری کے درد میں مفید'],
    dose: '1 تا 2 گرام قہوہ یا سفوف کی صورت'
  },
  {
    id: 6,
    name: 'ملٹھی (Licorice Root)',
    botanicalName: 'Glycyrrhiza glabra',
    mizaj: 'معتدل / گرم ۱ ، تر ۱',
    category: 'دافع کھانسی، ملین، مدمل قروح',
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=400&q=80',
    shortDesc: 'گلے کی خرابی، خشک کھانسی اور معدے کے السر کے زخم بھرنے والی میٹھی جڑ۔',
    benefits: ['آواز کا بیٹھنا اور گلے کی سوزش', 'معدے کی تیزابیت کا ازالہ', 'خشک کھانسی میں فوری تسکین'],
    dose: '2 سے 3 گرام جوشاندہ یا چوسنے کے لیے'
  }
];

export const QANOON_MUFRAD_SYSTEM = [
  {
    id: 'asabi-ghudi',
    name: 'اعصابی غدی تحریک (تر گرم)',
    organ: 'دماغ و اعصاب',
    mizaj: 'تر درجہ اول، گرم درجہ دوم',
    symptoms: 'جسم میں رطوبت اور تری کی زیادتی، پیشاب سفید اور وافر، لعاب دہن کی کثرت۔',
    diet: 'گرم خشک اور عضلاتی غذائیں جیسے گوشت، کریلا، لونگ دارچینی کا قہوہ۔',
    medicines: 'تریاقِ اعصاب، مقوی اعصاب، حب مقوی'
  },
  {
    id: 'asabi-azlati',
    name: 'اعصابی عضلاتی تحریک (تر سرد)',
    organ: 'اعصاب و بلغمی بافتیں',
    mizaj: 'تر درجہ اول، سرد درجہ دوم',
    symptoms: 'سردی زیادہ لگنا، بلغم، گیس، سستی، شوگر (ذیابیطس کاذب)۔',
    diet: 'خشک گرم اشیاء، مصالحہ دار سالن، چنے، قہوہ سونٹھ۔',
    medicines: 'اکسیر اعصاب، معجون چوب چینی'
  },
  {
    id: 'azlati-asabi',
    name: 'عضلاتی اعصابی تحریک (خشک سرد)',
    organ: 'دل و عضلات',
    mizaj: 'خشک درجہ اول، سرد درجہ دوم',
    symptoms: 'شدید گیس، تبخیر معدہ، دل کی گھبراہٹ، قبض، خفقان، بواسیر بادی۔',
    diet: 'گرم تر غذائیں، کدو، ٹینڈے، مونگ کی دال، دیسی گھی۔',
    medicines: 'تریاقِ عضلات، ہاضم، جوارش کمونی'
  },
  {
    id: 'azlati-ghudi',
    name: 'عضلاتی غدی تحریک (خشک گرم)',
    organ: 'عضلات و سوداوی مادے',
    mizaj: 'خشک درجہ اول، گرم درجہ دوم',
    symptoms: 'یورک ایسڈ، جوڑوں کے درد، خارش، بواسیر خونی، کھٹے ڈکار۔',
    diet: 'تر گرم غذائیں، دودھ، مکھن، گاجر، پالک، مربہ املہ۔',
    medicines: 'اکسیر عضلات، حب سرنجاں، حب صابر'
  },
  {
    id: 'ghudi-azlati',
    name: 'غدی عضلاتی تحریک (گرم خشک)',
    organ: 'جگر و پتہ',
    mizaj: 'گرم درجہ اول، خشک درجہ دوم',
    symptoms: 'صفراء کی زیادتی، منہ کڑوا ہونا، یرقان، جلن کے ساتھ زرد پیشاب، بلڈ پریشر۔',
    diet: 'سرد تر غذائیں، شربت بزوری، اسبغول، تربوز، لسی۔',
    medicines: 'تریاقِ غدد، اکسیر جگر، شربت صندل'
  },
  {
    id: 'ghudi-asabi',
    name: 'غدی اعصابی تحریک (گرم تر)',
    organ: 'جگر و غدود',
    mizaj: 'گرم درجہ اول، تر درجہ دوم',
    symptoms: 'جسم میں گرمی کی لہریں، پیاس، پسینہ زیادہ آنا، خونی دست یا سوزاک۔',
    diet: 'سرد خشک غذائیں، جامن، فالسہ، انار، دہی۔',
    medicines: 'اکسیر جدید، قرص کافور، سفوف ٹھنڈک'
  }
];
