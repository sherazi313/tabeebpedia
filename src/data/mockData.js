import doctorsData from './doctorsData.json';

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
  { id: 'chemicals', name: 'کیمیکلز', slug: 'chemicals', parentId: null },
  { id: 'mukhtalif-tariqay', name: 'مختلف طریقہ ہائے علاج', slug: 'mukhtalif-tariqay', parentId: null },
  { id: 'mizaj', name: 'مزاج', slug: 'mizaj', icon: 'Compass', parentId: null },
  { id: 'mizaj-tibb-pakistani', name: 'مزاج طب پاکستانی', slug: 'mizaj-tibb-pakistani', parentId: 'mizaj' },
  { id: 'asabi-azlati', name: 'اعصابی عضلاتی', slug: 'asabi-azlati', parentId: 'mizaj-tibb-pakistani' },
  { id: 'azlati-asabi', name: 'عضلاتی اعصابی', slug: 'azlati-asabi', parentId: 'mizaj-tibb-pakistani' },
  { id: 'azlati-ghudi', name: 'عضلاتی غدی', slug: 'azlati-ghudi', parentId: 'mizaj-tibb-pakistani' },
  { id: 'ghudi-azlati', name: 'غدی عضلاتی', slug: 'ghudi-azlati', parentId: 'mizaj-tibb-pakistani' },
  { id: 'ghudi-asabi', name: 'غدی اعصابی', slug: 'ghudi-asabi', parentId: 'mizaj-tibb-pakistani' },
  { id: 'asabi-ghudi', name: 'اعصابی غدی', slug: 'asabi-ghudi', parentId: 'mizaj-tibb-pakistani' },
  { id: 'mizaj-tibb-unani', name: 'مزاج طب یونانی', slug: 'mizaj-tibb-unani', parentId: 'mizaj' },
  { id: 'tar-sard', name: 'تر سرد', slug: 'tar-sard', parentId: 'mizaj-tibb-unani' },
  { id: 'khushk-sard', name: 'خشک سرد', slug: 'khushk-sard', parentId: 'mizaj-tibb-unani' },
  { id: 'khushk-garm', name: 'خشک گرم', slug: 'khushk-garm', parentId: 'mizaj-tibb-unani' },
  { id: 'garm-khushk', name: 'گرم خشک', slug: 'garm-khushk', parentId: 'mizaj-tibb-unani' },
  { id: 'garm-tar', name: 'گرم تر', slug: 'garm-tar', parentId: 'mizaj-tibb-unani' },
  { id: 'tar-garm', name: 'تر گرم', slug: 'tar-garm', parentId: 'mizaj-tibb-unani' },
  { id: 'mizaj-1', name: 'مزاج درجہ اول', slug: 'mizaj-1', parentId: 'qanoon-mufrad-aza' },
  { id: 'mizaj-2', name: 'مزاج درجہ دوم', slug: 'mizaj-2', parentId: 'qanoon-mufrad-aza' },
  { id: 'mizaj-3', name: 'مزاج درجہ سوم', slug: 'mizaj-3', parentId: 'qanoon-mufrad-aza' },
  { id: 'mizaj-4', name: 'مزاج درجہ چہارم', slug: 'mizaj-4', parentId: 'qanoon-mufrad-aza' },
  { id: 'mazameen', name: 'مضامین', slug: 'mazameen', parentId: null },
  { id: 'herbs-intro', name: 'جڑی بوٹیوں کا تعارف', slug: 'herbs-intro', icon: 'Leaf', parentId: null },
  { id: 'herbs-english-alphabetical-order', name: 'Herbs English Alphabetical Order', slug: 'herbs-english-alphabetical-order', parentId: null },
  { id: 'tibb-unani', name: 'طب یونانی و نبوی', slug: 'tibb-unani', icon: 'BookOpen', parentId: null },
  { id: 'qanoon-mufrad-aza', name: 'قانون مفرد اعضاء', slug: 'qanoon-mufrad-aza', icon: 'Cpu', parentId: null },
  { id: 'remedies', name: 'گھریلو علاج و مجربات', slug: 'remedies', icon: 'Home', parentId: null },
  { id: 'diet-chart', name: 'غذائی چارٹ و پرہیز', slug: 'diet-chart', icon: 'Apple', parentId: null },
  { id: 'research', name: 'جدید طبی و سائنسی تحقیقات', slug: 'research', icon: 'FileText', parentId: null },
  // اردو حروفِ تہجی کیٹیگریز (آ تا ی) ورڈپریس فارمیٹ
  { id: 'cat-a-madd', name: '( آ )', slug: 'alif-madda-wp', parentId: 'herbs-intro' },
  { id: 'cat-alif', name: '( ا )', slug: 'alif-wp', parentId: 'herbs-intro' },
  { id: 'cat-bay', name: '( ب )', slug: 'bay-wp', parentId: 'herbs-intro' },
  { id: 'cat-pay', name: '( پ )', slug: 'pay-wp', parentId: 'herbs-intro' },
  { id: 'cat-tay', name: '( ت )', slug: 'tay-wp', parentId: 'herbs-intro' },
  { id: 'cat-ttay', name: '( ٹ )', slug: 'ttay-wp', parentId: 'herbs-intro' },
  { id: 'cat-say', name: '( ث )', slug: 'say-wp', parentId: 'herbs-intro' },
  { id: 'cat-jeem', name: '( ج )', slug: 'jeem-wp', parentId: 'herbs-intro' },
  { id: 'cat-chay', name: '( چ )', slug: 'chay-wp', parentId: 'herbs-intro' },
  { id: 'cat-hay', name: '( ح )', slug: 'hay-wp', parentId: 'herbs-intro' },
  { id: 'cat-khay', name: '( خ )', slug: 'khay-wp', parentId: 'herbs-intro' },
  { id: 'cat-daal', name: '( د )', slug: 'daal-wp', parentId: 'herbs-intro' },
  { id: 'cat-ddaal', name: '( ڈ )', slug: 'ddaal-wp', parentId: 'herbs-intro' },
  { id: 'cat-zaal', name: '( ذ )', slug: 'zaal-wp', parentId: 'herbs-intro' },
  { id: 'cat-ray', name: '( ر )', slug: 'ray-wp', parentId: 'herbs-intro' },
  { id: 'cat-rray', name: '( ڑ )', slug: 'rray-wp', parentId: 'herbs-intro' },
  { id: 'cat-zay', name: '( ز )', slug: 'zay-wp', parentId: 'herbs-intro' },
  { id: 'cat-zhay', name: '( ژ )', slug: 'zhay-wp', parentId: 'herbs-intro' },
  { id: 'cat-seen', name: '( س )', slug: 'seen-wp', parentId: 'herbs-intro' },
  { id: 'cat-sheen', name: '( ش )', slug: 'sheen-wp', parentId: 'herbs-intro' },
  { id: 'cat-suad', name: '( ص )', slug: 'suad-wp', parentId: 'herbs-intro' },
  { id: 'cat-zuad', name: '( ض )', slug: 'zuad-wp', parentId: 'herbs-intro' },
  { id: 'cat-toe', name: '( ط )', slug: 'toe-wp', parentId: 'herbs-intro' },
  { id: 'cat-zoe', name: '( ظ )', slug: 'zoe-wp', parentId: 'herbs-intro' },
  { id: 'cat-ain', name: '( ع )', slug: 'ain-wp', parentId: 'herbs-intro' },
  { id: 'cat-ghain', name: '( غ )', slug: 'ghain-wp', parentId: 'herbs-intro' },
  { id: 'cat-fay', name: '( ف )', slug: 'fay-wp', parentId: 'herbs-intro' },
  { id: 'cat-qaaf', name: '( ق )', slug: 'qaaf-wp', parentId: 'herbs-intro' },
  { id: 'cat-kaaf', name: '( ک )', slug: 'kaaf-wp', parentId: 'herbs-intro' },
  { id: 'cat-gaaf', name: '( گ )', slug: 'gaaf-wp', parentId: 'herbs-intro' },
  { id: 'cat-laam', name: '( ل )', slug: 'laam-wp', parentId: 'herbs-intro' },
  { id: 'cat-meem', name: '( م )', slug: 'meem-wp', parentId: 'herbs-intro' },
  { id: 'cat-noon', name: '( ن )', slug: 'noon-wp', parentId: 'herbs-intro' },
  { id: 'cat-wao', name: '( و )', slug: 'wao-wp', parentId: 'herbs-intro' },
  { id: 'cat-gol-hay', name: '( ہ )', slug: 'gol-hay-wp', parentId: 'herbs-intro' },
  { id: 'cat-do-chashmi-hay', name: '( ھ )', slug: 'do-chashmi-hay-wp', parentId: 'herbs-intro' },
  { id: 'cat-hamza', name: '( ء )', slug: 'hamza-wp', parentId: 'herbs-intro' },
  { id: 'cat-yay', name: '( ی )', slug: 'yay-wp', parentId: 'herbs-intro' },
  // انگریزی حروفِ تہجی کیٹیگریز (A تا Z)
  ...('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
    id: `cat-en-${letter.toLowerCase()}`,
    name: letter,
    slug: letter.toLowerCase(),
    parentId: 'herbs-english-alphabetical-order'
  }))),
  // جڑی بوٹیاں و اجناس
  { id: 'ghazayein', name: 'غذائیں', slug: 'ghazayein', parentId: 'herbs-intro' },
  { id: 'phal', name: 'پھل', slug: 'phal', parentId: 'herbs-intro' },
  { id: 'zahreeli-bootiyan', name: 'زہریلی بوٹیاں', slug: 'zahreeli-bootiyan', parentId: 'herbs-intro' },
  { id: 'animals', name: 'Animals', slug: 'animals', parentId: 'herbs-intro' },
  // طب یونانی ذیلی زمرہ جات
  { id: 'tibbi-maloomat', name: 'طبی معلومات', slug: 'tibbi-maloomat', parentId: 'tibb-unani' },
  { id: 'nuskha-jaat', name: 'نسخہ جات', slug: 'nuskha-jaat', parentId: 'tibb-unani' },
  { id: 'asool-e-ilaaj', name: 'اصول علاج', slug: 'asool-e-ilaaj', parentId: 'tibb-unani' },
  { id: 'tibbi-istilahat', name: 'طبی اصطلاحات', slug: 'tibbi-istilahat', parentId: 'tibb-unani' },
  { id: 'pdf-books', name: 'PDF Books', slug: 'pdf-books', parentId: 'tibb-unani' },
];

export const DOCTORS = doctorsData;

export const ARTICLES = [];

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
