import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import DoctorDirectory from './components/DoctorDirectory';
import DoctorProfileModal from './components/DoctorProfileModal';
import DoctorProfileView from './components/DoctorProfileView';
import DoctorAuthModal from './components/DoctorAuthModal';
import DoctorDashboard from './components/DoctorDashboard';
import BlogSection from './components/BlogSection';
import ArticleDetailView from './components/ArticleDetailView';
import PageView from './components/PageView';
import HerbsEncyclopedia from './components/HerbsEncyclopedia';
import QanoonMufradAzaGuide from './components/QanoonMufradAzaGuide';
import AdminCMS from './components/AdminCMS';
import Footer from './components/Footer';
import SEOHelmet from './components/SEOHelmet';
import HerbEffectivenessCalculator from './components/HerbEffectivenessCalculator';
import GlossaryDirectory from './components/GlossaryDirectory';
import GlossaryTermView from './components/GlossaryTermView';
import glossaryInitialData from './data/glossaryData.json';
import { fetchLiveDoctors, fetchLiveArticles, fetchSettingsApi, fetchCategoriesApi, saveArticlesApi, fetchLivePages, savePagesApi, fetchLiveGlossary, saveGlossaryApi } from './api';

import { 
  SPECIALTIES, 
  DOCTORS, 
  ARTICLES, 
  HERBS_DATA,
  CITIES
} from './data/mockData';

import { 
  Stethoscope, 
  BookOpen, 
  Leaf, 
  Cpu, 
  ShieldCheck, 
  Star, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  ChevronLeft, 
  Sparkles,
  Building2,
  CheckCircle2,
  UserCheck,
  Award,
  Calculator
} from 'lucide-react';

const STORAGE_KEY_ARTICLES = 'tabeeb_articles_data_v1';
const STORAGE_KEY_SETTINGS = 'tabeeb_site_settings_v1';
const STORAGE_KEY_DOCTORS = 'tabeeb_doctors_data_v1';
const STORAGE_KEY_LOGGED_DOCTOR = 'tabeeb_logged_in_doctor_v1';
const STORAGE_KEY_CITIES = 'tabeeb_cities_data_v2';

const getInitialCities = () => {
  let baseCities = [...CITIES];
  const existingNames = new Set(baseCities.map(c => (c && c.name ? String(c.name).trim() : '')).filter(Boolean));

  try {
    localStorage.removeItem('tabeeb_cities_data_v1');
    const saved = localStorage.getItem(STORAGE_KEY_CITIES);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(c => {
          if (c && c.name && typeof c.name === 'string' && !/[a-zA-Z]/.test(c.name) && !existingNames.has(c.name.trim())) {
            baseCities.push({ id: c.id || c.name.trim().toLowerCase(), name: c.name.trim() });
            existingNames.add(c.name.trim());
          }
        });
      }
    }
  } catch (e) {
    console.error('Failed to load cities from localStorage:', e);
  }

  // Also collect any cities from existing doctors (Urdu only)
  try {
    const savedDocs = localStorage.getItem(STORAGE_KEY_DOCTORS);
    const docs = savedDocs && savedDocs !== 'undefined' ? JSON.parse(savedDocs) : DOCTORS;
    if (Array.isArray(docs)) {
      docs.forEach(doc => {
        if (!doc) return;
        const cName = doc.cityName || (baseCities.find(c => c && c.id === doc.city)?.name);
        if (cName && typeof cName === 'string' && !/[a-zA-Z]/.test(cName) && !existingNames.has(cName.trim())) {
          const slug = doc.city || cName.trim().toLowerCase().replace(/[\s\-_]+/g, '-');
          baseCities.push({
            id: slug,
            name: cName.trim()
          });
          existingNames.add(cName.trim());
        }
      });
    }
  } catch (e) {}

  return baseCities;
};

const getInitialArticles = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_ARTICLES);
  } catch (e) {}
  return [];
};

const getInitialDoctors = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DOCTORS);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DOCTORS;
};

const getInitialLoggedDoctor = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOGGED_DOCTOR);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
};

const getInitialSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        if (!parsed.youtubeUrl || parsed.youtubeUrl === 'https://youtube.com/tabeebpedia') {
          parsed.youtubeUrl = 'https://www.youtube.com/@TabeebPedia';
        }
        return parsed;
      }
    }
  } catch (e) {}
  return {
    siteName: 'طبیب پیڈیا',
    tagline: 'جامع ہربل و طبی انسائیکلوپیڈیا',
    logoUrl: '',
    helplinePhone: '0300-1234567',
    whatsappNumber: '923001234567',
    headOffice: 'اسلام آباد، پاکستان',
    topbarNotice: 'طب یونانی، قانون مفرد اعضاء اور پاکستان کے مستند اطباء کی ڈائریکٹری',
    heroTitle: 'مستند اطباء اور حکماء سے مفت آن لائن رہنمائی و فوری رابطہ',
    heroSubtitle: 'طب یونانی، قانون مفرد اعضاء، ہربل علاج اور مستند سائنسی و طبی مضامین کا سب سے بڑا ڈیجیٹل خزانہ',
    footerAbout: 'پاکستان کا سب سے معتبر ڈیجیٹل ہربل پورٹل۔ ہمارا مقصد طب یونانی، طب نبوی اور قانون مفرد اعضاء کو جدید سائنسی معیار اور سہولت کے ساتھ ہر فرد تک پہنچانا ہے۔',
    copyrightText: 'تمام جملہ حقوق محفوظ ہیں۔',
    facebookUrl: 'https://facebook.com/tabeebpedia',
    instagramUrl: 'https://instagram.com/tabeebpedia',
    youtubeUrl: 'https://www.youtube.com/@TabeebPedia',
    metaTitle: 'طبیب پیڈیا - طب یونانی، قانون مفرد اعضاء اور اطباء ڈائریکٹری',
    metaDescription: 'طبیب پیڈیا: پاکستان کی سب سے بڑی اور مستند طب یونانی، جڑی بوٹیاں اور اطباء و ڈاکٹرز ڈائریکٹری۔',
    doctorBlockTitle: 'پاکستان کے معروف و مستند اطباء کرام',
    doctorBlockSubtitle: 'آن لائن رہنمائی حاصل کریں یا واٹس ایپ پر براہ راست مشورہ طلب کریں',
    doctorBlockColumns: '4',
    doctorBlockRows: '2',
    doctorBlockSort: 'latest',
    featuredDoctorBlockEnabled: true,
    featuredDoctorBlockTitle: 'نمایاں اطباء کرام (Featured Doctors)',
    featuredDoctorBlockSubtitle: 'پاکستان بھر کے منتخب اور مستند اطباء و ماہرین طب یونانی',
    featuredDoctorBlockColumns: '4',
    featuredDoctorBlockRows: '1',
    featuredDoctorBlockSort: 'latest'
  };
};

const DEFAULT_PAGES = [
  {
    id: 1,
    title: 'ہمارے بارے میں (About Tabeeb Pedia)',
    slug: 'about-us',
    author: 'حکیم سید عبدالوہاب شاہ',
    date: '2026/09/25',
    status: 'published',
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

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const rawPath = window.location.pathname.substring(1).replace(/\/$/, '');
      const path = decodeURIComponent(rawPath);
      const params = new URLSearchParams(window.location.search);
      if (path === 'admin' || params.get('tab') === 'admin' || localStorage.getItem('tabeeb_active_tab') === 'admin') {
        return 'admin';
      }
      if (path === 'doctors' || params.get('tab') === 'doctors') return 'doctors';
      if (path === 'blog' || params.get('tab') === 'blog') return 'blog';
      if (path === 'farhang' || path === 'glossary' || params.get('tab') === 'farhang' || params.get('tab') === 'glossary') return 'farhang';
      if (path.startsWith('farhang/') || path.startsWith('glossary/')) return 'farhang-term';
      if (path === 'herbs' || params.get('tab') === 'herbs') return 'herbs';
      if (path === 'qanoon' || params.get('tab') === 'qanoon') return 'qanoon';
      if (path === 'herb-calculator' || path === 'hec' || path === 'calculator' || path === 'mizaj-calculator' || params.get('tab') === 'herb-calculator' || params.get('tab') === 'hec') return 'herb-calculator';
    } catch(e) {}
    return 'home';
  }); // 'home', 'doctors', 'blog', 'farhang', 'farhang-term', 'herbs', 'qanoon', 'herb-calculator', 'admin', 'doctor-dashboard'
  const [theme, setTheme] = useState('navy'); // 'navy' or 'herbal'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [pagesList, setPagesList] = useState(() => {
    try {
      const saved = localStorage.getItem('tabeeb_pages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingSlugs = new Set(parsed.map(p => p.slug || p.id));
          const missingDefaults = DEFAULT_PAGES.filter(dp => !existingSlugs.has(dp.slug) && !existingSlugs.has(dp.id));
          if (missingDefaults.length > 0) {
            return [...parsed, ...missingDefaults];
          }
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_PAGES;
  });
  const [selectedPage, setSelectedPage] = useState(null);

  // فرہنگِ اطباء (Glossary) State
  const [glossaryList, setGlossaryList] = useState(() => {
    try {
      const saved = localStorage.getItem('tabeeb_glossary_data_v1');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return glossaryInitialData || [];
  });
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('tabeeb_glossary_data_v1', JSON.stringify(glossaryList));
      saveGlossaryApi(glossaryList);
    } catch (e) {}
  }, [glossaryList]);

  useEffect(() => {
    localStorage.setItem('tabeeb_pages', JSON.stringify(pagesList));
  }, [pagesList]);

  const [articlesList, setArticlesList] = useState(getInitialArticles);
  const [doctorsList, setDoctorsList] = useState(getInitialDoctors);
  const [loggedInDoctor, setLoggedInDoctor] = useState(getInitialLoggedDoctor);
  const [citiesList, setCitiesList] = useState(getInitialCities);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [siteSettings, setSiteSettings] = useState(getInitialSettings);

  const handleNavigateToTab = (tab, pushState = true) => {
    setActiveTab(tab);
    setSelectedArticle(null);
    setSelectedDoctor(null);
    setSelectedPage(null);
    setSelectedGlossaryTerm(null);

    let targetUrl = '/';
    if (tab === 'doctors') targetUrl = '/doctors';
    else if (tab === 'blog') targetUrl = '/blog';
    else if (tab === 'farhang') targetUrl = '/farhang';
    else if (tab === 'herbs') targetUrl = '/herbs';
    else if (tab === 'qanoon') targetUrl = '/qanoon';
    else if (tab === 'herb-calculator') targetUrl = '/herb-calculator';
    else if (tab === 'admin') targetUrl = '/admin';
    else if (tab === 'doctor-dashboard') targetUrl = '/doctor-dashboard';
    else if (tab === 'home') targetUrl = '/';

    if (pushState) {
      try {
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({}, '', targetUrl);
        }
      } catch(e) {}
    }

    try {
      localStorage.setItem('tabeeb_active_tab', tab);
    } catch(e) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromArticle = (catName) => {
    setSelectedCategory(catName);
    setSelectedTag(null);
    setBlogSearchQuery('');
    handleNavigateToTab('blog');
  };

  const handleSelectTagFromArticle = (tagName) => {
    setSelectedCategory('all');
    setSelectedTag(tagName);
    setBlogSearchQuery('');
    handleNavigateToTab('blog');
  };

  const handleSelectPage = (slugOrId) => {
    let p = pagesList.find(item => item.slug === slugOrId || String(item.id) === String(slugOrId));
    if (!p && typeof slugOrId === 'object') p = slugOrId;
    if (p) {
      setSelectedPage(p);
      setSelectedArticle(null);
      setSelectedDoctor(null);
      setSelectedGlossaryTerm(null);
      setActiveTab('page');
      window.history.pushState({}, '', `/${p.slug || p.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectGlossaryTerm = (termOrSlug) => {
    let termObj = null;
    if (typeof termOrSlug === 'string') {
      const decoded = decodeURIComponent(termOrSlug);
      termObj = glossaryList.find(g => 
        g.slug === decoded || 
        g.slug === termOrSlug || 
        g.term === decoded || 
        g.term === termOrSlug || 
        String(g.id) === termOrSlug
      );
      if (!termObj) {
        termObj = { slug: termOrSlug, term: decoded, content: '', shortDefinition: '' };
      }
    } else if (termOrSlug && typeof termOrSlug === 'object') {
      termObj = termOrSlug;
    }
    
    if (termObj) {
      setSelectedGlossaryTerm(termObj);
      setSelectedArticle(null);
      setSelectedDoctor(null);
      setSelectedPage(null);
      setActiveTab('farhang-term');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const encodedSlug = encodeURIComponent(termObj.slug || termObj.term);
        window.history.pushState({}, '', `/farhang/${encodedSlug}`);
      } catch(e) {}
    }
  };

  // Load permanent database data on initial mount (for live Hostinger and local dev)
  useEffect(() => {
    const loadDatabaseData = async () => {
      try {
        const liveArticles = await fetchLiveArticles();
        if (Array.isArray(liveArticles) && liveArticles.length > 0) {
          setArticlesList(liveArticles);
        }
        const liveDoctors = await fetchLiveDoctors();
        if (Array.isArray(liveDoctors) && liveDoctors.length > 0) {
          setDoctorsList(liveDoctors);
          try {
            localStorage.setItem(STORAGE_KEY_DOCTORS, JSON.stringify(liveDoctors));
          } catch (e) {}
        }
        const liveSettings = await fetchSettingsApi();
        if (liveSettings && typeof liveSettings === 'object' && liveSettings.siteName) {
          setSiteSettings(prev => ({ ...prev, ...liveSettings }));
        }
        const livePages = await fetchLivePages();
        if (Array.isArray(livePages) && livePages.length > 0) {
          setPagesList(livePages);
          try {
            localStorage.setItem('tabeeb_pages', JSON.stringify(livePages));
          } catch (e) {}
        }
        const liveGlossary = await fetchLiveGlossary();
        if (Array.isArray(liveGlossary) && liveGlossary.length > 0) {
          setGlossaryList(liveGlossary);
          try {
            localStorage.setItem('tabeeb_glossary_data_v1', JSON.stringify(liveGlossary));
          } catch (e) {}
        }
      } catch (err) {
        console.error('Error loading database data:', err);
      }
    };
    loadDatabaseData();
  }, []);

  // Admin Login Protection (Username + Password)
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
    try { return sessionStorage.getItem('tabeeb_admin_auth') === 'true'; } catch { return false; }
  });
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');

  const getAdminUsername = () => {
    try {
      return localStorage.getItem('tabeeb_admin_custom_username') || 'sherazi313';
    } catch(e) {
      return 'sherazi313';
    }
  };

  const getAdminPassword = () => {
    try {
      return localStorage.getItem('tabeeb_admin_custom_password') || '5903911a';
    } catch(e) {
      return '5903911a';
    }
  };

  // Scroll-to-top
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Automatic Copyright & Source Attribution on Text Copy
  useEffect(() => {
    const handleCopyAttribution = (e) => {
      // Ignore if user is typing or selecting inside an input, textarea, or contentEditable element
      const activeEl = document.activeElement;
      if (
        activeEl && 
        (activeEl.tagName === 'INPUT' || 
         activeEl.tagName === 'TEXTAREA' || 
         activeEl.isContentEditable ||
         activeEl.closest('.visual-editor-content') ||
         activeEl.closest('[contenteditable="true"]'))
      ) {
        return;
      }

      // Check if we are inside admin panel
      if (activeTab === 'admin') return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const selectedText = selection.toString().trim();

      // Only append attribution if copying more than 15 characters
      if (selectedText.length > 15) {
        const pageUrl = window.location.href;
        const pageTitle = document.title ? document.title.split(' - ')[0].trim() : 'طبیب پیڈیا';
        
        const plainAttribution = `\n\n--------------------\n📖 ماخذ: طبیب پیڈیا (${pageTitle})\n🔗 مکمل تحریر اور حوالہ دیکھیں:\n${pageUrl}\n© تمام جملہ حقوق محفوظ ہیں - TabeebPedia.com`;
        
        const fullPlainText = selectedText + plainAttribution;
        
        const htmlAttribution = `<br><br><hr><p>📖 <strong>ماخذ:</strong> <a href="${pageUrl}">طبیب پیڈیا (${pageTitle})</a><br>🔗 <strong>مکمل تحریر پڑھیں:</strong> <a href="${pageUrl}">${pageUrl}</a><br><small>© تمام جملہ حقوق محفوظ ہیں - <a href="https://tabeebpedia.com">TabeebPedia.com</a></small></p>`;
        
        // Get HTML of selection if available
        let selectedHtml = selectedText;
        try {
          const container = document.createElement('div');
          for (let i = 0; i < selection.rangeCount; ++i) {
            container.appendChild(selection.getRangeAt(i).cloneContents());
          }
          selectedHtml = container.innerHTML || selectedText;
        } catch(err) {}

        const fullHtmlText = selectedHtml + htmlAttribution;

        if (e.clipboardData) {
          e.preventDefault();
          e.clipboardData.setData('text/plain', fullPlainText);
          e.clipboardData.setData('text/html', fullHtmlText);
        }
      }
    };

    document.addEventListener('copy', handleCopyAttribution);
    return () => document.removeEventListener('copy', handleCopyAttribution);
  }, [activeTab]);

  // Doctor Auth Modal state
  const [doctorAuthModalOpen, setDoctorAuthModalOpen] = useState(false);

  const [articlesLoadedFromDb, setArticlesLoadedFromDb] = useState(false);

  // --- LIVE DATABASE SYNC ---
  useEffect(() => {
    const syncData = async () => {
      try {
        const liveDoctors = await fetchLiveDoctors();
        if (liveDoctors && liveDoctors.length > 0) {
          setDoctorsList(liveDoctors);
        }
        
        const liveArticles = await fetchLiveArticles();
        if (liveArticles && liveArticles.length > 0) {
          setArticlesList(liveArticles);
        }
      } catch(e) {
        console.error("Live sync failed", e);
      } finally {
        setArticlesLoadedFromDb(true);
      }
    };
    syncData();
  }, []);
  // -------------------------
  
  const [doctorAuthModalInitialMode, setDoctorAuthModalInitialMode] = useState('login');

  const isNavy = theme === 'navy';

  // Sync cities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CITIES, JSON.stringify(citiesList));
    } catch (e) {}
  }, [citiesList]);

  // Sync articles directly to permanent database API
  useEffect(() => {
    if (articlesLoadedFromDb && Array.isArray(articlesList)) {
      saveArticlesApi(articlesList);
    }
  }, [articlesList, articlesLoadedFromDb]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCTORS, JSON.stringify(doctorsList));
    } catch (e) {}
  }, [doctorsList]);

  useEffect(() => {
    try {
      if (loggedInDoctor) {
        localStorage.setItem(STORAGE_KEY_LOGGED_DOCTOR, JSON.stringify(loggedInDoctor));
      } else {
        localStorage.removeItem(STORAGE_KEY_LOGGED_DOCTOR);
      }
    } catch (e) {}
  }, [loggedInDoctor]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(siteSettings));
    } catch (e) {}
  }, [siteSettings]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY_ARTICLES && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setArticlesList(updated);
        } catch (err) {}
      }
      if (e.key === STORAGE_KEY_DOCTORS && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setDoctorsList(updated);
        } catch (err) {}
      }
      if (e.key === STORAGE_KEY_LOGGED_DOCTOR && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setLoggedInDoctor(updated);
        } catch (err) {}
      }
      if (e.key === STORAGE_KEY_CITIES && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setCitiesList(updated);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add new dynamic city handler
  const handleAddCity = (cityName) => {
    if (!cityName || !cityName.trim()) return null;
    const trimmed = cityName.trim();
    
    // Check if already exists in list (by name or id)
    const existing = citiesList.find(c => 
      c.name.trim().toLowerCase() === trimmed.toLowerCase() || 
      c.id.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing;

    const slug = trimmed.toLowerCase().replace(/[\s\-_]+/g, '-').replace(/[^\w\u0600-\u06FF\-]+/g, '') || `city-${Date.now()}`;
    const newCityObj = {
      id: slug,
      name: trimmed
    };

    setCitiesList(prev => {
      const alreadyHas = prev.some(c => c.name.trim().toLowerCase() === trimmed.toLowerCase());
      if (alreadyHas) return prev;
      return [...prev, newCityObj];
    });

    return newCityObj;
  };

  // Navigation handlers
  const handleSelectDoctor = (doctor) => {
    const current = (doctor && doctorsList.find(d => d.id === doctor.id || d.slug === doctor.slug)) || doctor;
    setSelectedDoctor(current);
    setSelectedArticle(null);
    setSelectedPage(null);
    setActiveTab('doctor-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', `/doctor/${current.slug || current.id}`);
    } catch(e) {}
  };

  const handleSelectArticle = (article) => {
    const current = (article && articlesList.find(a => a.id === article.id || a.slug === article.slug)) || article;
    setSelectedArticle(current);
    setSelectedPage(null);
    setSelectedDoctor(null);
    setActiveTab('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', `/${current.slug || current.id}`);
    } catch(e) {}
  };

  const handleSpecialtyClick = (specId) => {
    setSelectedSpecialty(specId);
    setActiveTab('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCityClick = (cityId) => {
    setSelectedCity(cityId);
    setActiveTab('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Doctor Auth & Dashboard Handlers
  const handleOpenDoctorAuthModal = (mode = 'login') => {
    setDoctorAuthModalInitialMode(mode);
    setDoctorAuthModalOpen(true);
  };

  const handleOpenDoctorPortal = () => {
    if (loggedInDoctor) {
      setActiveTab('doctor-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleOpenDoctorAuthModal('login');
    }
  };

  const handleRegisterDoctor = (newDoc) => {
    if (!newDoc) return;
    setDoctorsList(prev => {
      const exists = prev.some(d => d && (d.id === newDoc.id || (d.email && d.email.toLowerCase() === newDoc.email.toLowerCase())));
      if (exists) {
        return prev.map(d => (d && (d.id === newDoc.id || d.email === newDoc.email) ? newDoc : d));
      }
      return [newDoc, ...prev];
    });
  };

  const handleDoctorLoginSuccess = (doc, isNewRegistration = false) => {
    setLoggedInDoctor(doc);
    if (isNewRegistration && doc) {
      handleRegisterDoctor(doc);
    }
    setActiveTab('doctor-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDoctorLogout = () => {
    setLoggedInDoctor(null);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateDoctorProfile = (updatedDoctor) => {
    setLoggedInDoctor(updatedDoctor);
    setDoctorsList(doctorsList.map(d => (d.id === updatedDoctor.id ? updatedDoctor : d)));
  };

  // Direct URL Navigation Handler (Opens articles from query params like ?article=101 or ?portal=doctor)
  useEffect(() => {
    const handleUrlNavigation = () => {
      const params = new URLSearchParams(window.location.search);
      const rawPath = window.location.pathname.substring(1).replace(/\/$/, '');
      let path = '';
      try {
        path = decodeURIComponent(rawPath);
      } catch(e) {
        path = rawPath;
      }

      // Check Admin Route
      if (path === 'admin' || params.get('tab') === 'admin' || path === 'dashboard') {
        setActiveTab('admin');
        try { localStorage.setItem('tabeeb_active_tab', 'admin'); } catch(e) {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Check Doctor Portal
      const portalParam = params.get('portal') || params.get('tab');
      if (portalParam === 'doctor' || portalParam === 'doctor-dashboard' || path === 'doctor-dashboard') {
        if (loggedInDoctor) {
          setActiveTab('doctor-dashboard');
        } else {
          setDoctorAuthModalInitialMode('login');
          setDoctorAuthModalOpen(true);
        }
        return;
      }

      // Check Main Hubs/Tabs (/doctors, /blog, /herbs, /qanoon)
      if (path === 'doctors' || params.get('tab') === 'doctors') {
        setActiveTab('doctors');
        setSelectedArticle(null);
        setSelectedDoctor(null);
        setSelectedPage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (path === 'blog' || params.get('tab') === 'blog') {
        setActiveTab('blog');
        setSelectedArticle(null);
        setSelectedDoctor(null);
        setSelectedPage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (path === 'herbs' || params.get('tab') === 'herbs') {
        setActiveTab('herbs');
        setSelectedArticle(null);
        setSelectedDoctor(null);
        setSelectedPage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (path === 'qanoon' || params.get('tab') === 'qanoon') {
        setActiveTab('qanoon');
        setSelectedArticle(null);
        setSelectedDoctor(null);
        setSelectedPage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (path === 'herb-calculator' || path === 'hec' || path === 'calculator' || path === 'mizaj-calculator' || params.get('tab') === 'herb-calculator' || params.get('tab') === 'hec') {
        setActiveTab('herb-calculator');
        setSelectedArticle(null);
        setSelectedDoctor(null);
        setSelectedPage(null);
        setSelectedGlossaryTerm(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Check Farhang Directory Hub
      if (path === 'farhang' || path === 'glossary' || params.get('tab') === 'farhang' || params.get('tab') === 'glossary') {
        setActiveTab('farhang');
        setSelectedArticle(null);
        setSelectedDoctor(null);
        setSelectedPage(null);
        setSelectedGlossaryTerm(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Check Direct Farhang Glossary Term (/farhang/:slug or /glossary/:slug or ?farhang=slug)
      let glossaryParam = params.get('farhang') || params.get('glossary') || params.get('term');
      if (!glossaryParam && path && (path.startsWith('farhang/') || path.startsWith('glossary/'))) {
        glossaryParam = path.replace(/^(farhang|glossary)\//, '').trim();
      }

      if (glossaryParam) {
        const decodedTermParam = decodeURIComponent(glossaryParam);
        const foundTerm = glossaryList.find(g => 
          g.slug === decodedTermParam || 
          g.slug === glossaryParam || 
          g.term === decodedTermParam || 
          g.term === glossaryParam || 
          String(g.id) === glossaryParam
        );
        if (foundTerm) {
          setSelectedGlossaryTerm(foundTerm);
        } else {
          setSelectedGlossaryTerm({ slug: glossaryParam, term: decodedTermParam });
        }
        setSelectedArticle(null);
        setSelectedDoctor(null);
        setSelectedPage(null);
        setActiveTab('farhang-term');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Check Pages (e.g. /about-us, /contact, /privacy-policy, /disclaimer)
      if (path && !path.startsWith('api') && path !== 'login') {
        // Load latest pages from localStorage or state
        let currentPages = pagesList;
        try {
          const savedPages = JSON.parse(localStorage.getItem('tabeeb_pages') || '[]');
          if (Array.isArray(savedPages) && savedPages.length > 0) currentPages = savedPages;
        } catch(e) {}

        const normPath = path.toLowerCase().trim().replace(/[\s_]+/g, '-');
        const foundPage = currentPages.find(p => {
          if (!p || !p.slug) return false;
          const normSlug = p.slug.toLowerCase().trim().replace(/[\s_]+/g, '-');
          return normSlug === normPath ||
                 normPath.endsWith('/' + normSlug) ||
                 normSlug === rawPath.toLowerCase().trim().replace(/[\s_]+/g, '-') ||
                 rawPath.toLowerCase().trim().replace(/[\s_]+/g, '-').endsWith('/' + normSlug) ||
                 p.slug.toLowerCase() === path.toLowerCase() ||
                 encodeURIComponent(p.slug) === rawPath;
        });

        if (foundPage) {
          setSelectedPage(foundPage);
          setSelectedArticle(null);
          setSelectedDoctor(null);
          setSelectedGlossaryTerm(null);
          setActiveTab('page');
          try { localStorage.setItem('tabeeb_active_tab', 'page'); } catch(e) {}
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // Check Articles (Clean URLs like /slug or ?article=slug)
      let articleParam = params.get('article') || params.get('slug');
      if (!articleParam && path && !path.startsWith('api') && path !== 'admin' && path !== 'login' && path !== 'home' && !['doctors', 'blog', 'farhang', 'glossary', 'herbs', 'qanoon', 'herb-calculator', 'hec', 'calculator'].includes(path)) {
        articleParam = path;
      }

      if (articleParam) {
        const found = articlesList.find(a => {
          if (String(a.id) === articleParam || a.slug === articleParam) return true;
          if (!a.slug) return false;
          try {
            if (decodeURIComponent(a.slug) === articleParam) return true;
            if (a.slug === encodeURIComponent(articleParam)) return true;
          } catch(e) {}
          return false;
        });
        if (found) {
          setSelectedArticle(found);
          setSelectedPage(null);
          setSelectedDoctor(null);
          setActiveTab('article-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // Check Direct Doctor Profile (?doctor=slug or ?doctor=id or path.startsWith('doctor/'))
      let doctorParam = params.get('doctor') || params.get('hakeem');
      if (!doctorParam && path && path.startsWith('doctor/')) {
        doctorParam = path.replace('doctor/', '').trim();
      }

      if (doctorParam) {
        const foundDoc = doctorsList.find(d => String(d.id) === doctorParam || d.slug === doctorParam);
        if (foundDoc) {
          setSelectedDoctor(foundDoc);
          setSelectedArticle(null);
          setSelectedPage(null);
          setActiveTab('doctor-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // If on root path '/', clear active tab from admin if not in admin URL
      if (!path) {
        try { localStorage.setItem('tabeeb_active_tab', 'home'); } catch(e) {}
      }
    };
    handleUrlNavigation();
    window.addEventListener('popstate', handleUrlNavigation);
    return () => window.removeEventListener('popstate', handleUrlNavigation);
  }, [articlesList, loggedInDoctor, pagesList, glossaryList]);

  const seoConfig = React.useMemo(() => {
    const BASE = 'https://tabeebpedia.com';

    if (activeTab === 'article-detail' && selectedArticle) {
      let artSlug = selectedArticle.slug || selectedArticle.id;
      try {
        artSlug = encodeURI(decodeURIComponent(String(artSlug)));
      } catch (e) {
        artSlug = encodeURI(String(artSlug));
      }
      const artUrl = `${BASE}/${artSlug}`;
      const artDesc = selectedArticle.excerpt || selectedArticle.content || '';
      const cleanDesc = String(artDesc).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 180).trim();

      return {
        title: selectedArticle.title,
        description: cleanDesc,
        canonicalUrl: artUrl,
        ogImage: selectedArticle.featuredImage || `${BASE}/og-banner.png`,
        ogType: 'article',
        schemaData: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Article", "MedicalWebPage"],
              "@id": `${artUrl}#article`,
              "headline": selectedArticle.title,
              "description": cleanDesc,
              "image": selectedArticle.featuredImage || `${BASE}/og-banner.png`,
              "datePublished": selectedArticle.date || '2024-09-09',
              "dateModified": selectedArticle.modified || selectedArticle.date || '2026-09-27',
              "inLanguage": "ur",
              "author": {
                "@type": "Person",
                "name": selectedArticle.author || "طبیب پیڈیا تحقیقی بورڈ"
              },
              "publisher": {
                "@type": "MedicalOrganization",
                "name": "طبیب پیڈیا",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${BASE}/leaf.svg`
                }
              },
              "mainEntityOfPage": artUrl
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "صفحۂ اول",
                  "item": `${BASE}/`
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": selectedArticle.categoryName || (Array.isArray(selectedArticle.categories) ? selectedArticle.categories[0] : null) || "طبی مضامین",
                  "item": `${BASE}/blog`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": selectedArticle.title,
                  "item": artUrl
                }
              ]
            }
          ]
        }
      };
    }

    if (activeTab === 'doctor-detail' && selectedDoctor) {
      let docSlug = selectedDoctor.slug || selectedDoctor.id;
      try {
        docSlug = encodeURI(decodeURIComponent(String(docSlug)));
      } catch (e) {
        docSlug = encodeURI(String(docSlug));
      }
      const docUrl = `${BASE}/doctor/${docSlug}`;
      const docDesc = `${selectedDoctor.name} (${selectedDoctor.title || selectedDoctor.qualifications || 'طبیب'})، ${selectedDoctor.cityName}۔ اوقاتِ کار: ${selectedDoctor.timing || 'صبح تا شام'}، فون و واٹس ایپ مشاورت۔`;
      const cleanAbout = selectedDoctor.about ? String(selectedDoctor.about).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 180).trim() : docDesc;

      return {
        title: `${selectedDoctor.name} (${selectedDoctor.title || 'مستند معالج'})`,
        description: docDesc,
        canonicalUrl: docUrl,
        ogImage: selectedDoctor.image || `${BASE}/images/default_doctor.webp`,
        ogType: 'profile',
        schemaData: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Physician", "MedicalBusiness"],
              "@id": `${docUrl}#doctor`,
              "name": selectedDoctor.name,
              "jobTitle": selectedDoctor.title || "طبیب و نبض شناس",
              "description": cleanAbout,
              "image": selectedDoctor.image || `${BASE}/images/default_doctor.webp`,
              "telephone": selectedDoctor.phone || selectedDoctor.whatsapp,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": selectedDoctor.address || selectedDoctor.cityName,
                "addressLocality": selectedDoctor.cityName,
                "addressCountry": "PK"
              },
              "priceRange": selectedDoctor.fee ? `PKR ${selectedDoctor.fee}` : "مناسب ہدیہ",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": selectedDoctor.rating || "5.0",
                "reviewCount": selectedDoctor.reviewsCount || "12"
              },
              "url": docUrl
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "صفحۂ اول",
                  "item": `${BASE}/`
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "اطباء ڈائریکٹری",
                  "item": `${BASE}/doctors`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": selectedDoctor.name,
                  "item": docUrl
                }
              ]
            }
          ]
        }
      };
    }

    if (activeTab === 'page' && selectedPage) {
      const pageUrl = `${BASE}/${selectedPage.slug || selectedPage.id}`;
      return {
        title: selectedPage.title,
        description: String(selectedPage.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 180).trim(),
        canonicalUrl: pageUrl,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'website',
        schemaData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          "name": selectedPage.title,
          "url": pageUrl,
          "isPartOf": {
            "@type": "WebSite",
            "@id": `${BASE}/#website`
          }
        }
      };
    }

    if (activeTab === 'doctors') {
      return {
        title: 'مستند اطباء و حکماء ڈائریکٹری',
        description: 'پاکستان بھر کے تصدیق شدہ اور مستند اطباء، حکماء اور ہربل اسپیشلسٹس کی قومی ڈائریکٹری۔ فوری آن لائن رہنمائی حاصل کریں۔',
        canonicalUrl: `${BASE}/doctors`,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'website'
      };
    }

    if (activeTab === 'blog') {
      return {
        title: 'طبی مضامین، نسخہ جات و ریسرچ',
        description: 'طب یونانی، قانون مفرد اعضاء اور امراض کے گھریلو و دیسی علاج پر مستند علمی مقالات اور طبی تحقیقات کا خزانہ۔',
        canonicalUrl: `${BASE}/blog`,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'website'
      };
    }

    if (activeTab === 'farhang') {
      return {
        title: 'فرہنگِ اطباء - جامع طبی و یونانی لغت و اصطلاحات | طبیب پیڈیا',
        description: 'طب یونانی، قانون مفرد اعضاء، نبض شناسی اور ہربل میڈیسن کی 150+ مستند اصطلاحات اور ان کے مفاہیم کا اردو انسائیکلوپیڈیا۔',
        canonicalUrl: `${BASE}/farhang`,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'website'
      };
    }

    if (activeTab === 'farhang-term' && selectedGlossaryTerm) {
      const termSlug = encodeURI(decodeURIComponent(String(selectedGlossaryTerm.slug || selectedGlossaryTerm.term)));
      const termUrl = `${BASE}/farhang/${termSlug}`;
      const cleanDesc = selectedGlossaryTerm.shortDefinition || selectedGlossaryTerm.content?.replace(/<[^>]+>/g, ' ').slice(0, 180) || `طبی اصطلاح ${selectedGlossaryTerm.term} کی مکمل تعریف و تشریح`;

      return {
        title: `${selectedGlossaryTerm.term} (فرہنگِ اطباء) - معنی، مفہوم و طبی تشریح | طبیب پیڈیا`,
        description: cleanDesc,
        canonicalUrl: termUrl,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'article',
        schemaData: {
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          "name": selectedGlossaryTerm.term,
          "description": cleanDesc,
          "inDefinedTermSet": `${BASE}/farhang`
        }
      };
    }

    if (activeTab === 'herbs') {
      return {
        title: 'جامع ہربل انسائیکلوپیڈیا و جڑی بوٹیاں',
        description: 'جڑی بوٹیوں کے خواص، مزاج، افعال و فوائد اور طب یونانی و مفرد اعضاء میں ان کے استعمال کی مستند معلومات۔',
        canonicalUrl: `${BASE}/herbs`,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'website'
      };
    }

    if (activeTab === 'qanoon') {
      return {
        title: 'قانون مفرد اعضاء مکمل رہنمائی و نبض شناسی',
        description: 'صابر ملتانی رحمۃ اللہ علیہ کا قانون مفرد اعضاء: اعصابی، عضلاتی، غدی تحریکات اور نبض کے معائنے کی علمی گائیڈ۔',
        canonicalUrl: `${BASE}/qanoon`,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'website'
      };
    }

    if (activeTab === 'herb-calculator') {
      return {
        title: 'جڑی بوٹیوں و نسخہ جات کا مزاج کیلکولیٹر (HEC) - طبیب پیڈیا',
        description: 'قانون مفرد اعضاء اور طب یونانی کے عین مطابق کسی بھی نسخے یا جڑی بوٹیوں کے مرکب کا دقیق سائنسی مزاج اور حرارت، برودت، یبوست اور رطوبت کا فیصد تناسب معلوم کریں۔',
        canonicalUrl: `${BASE}/herb-calculator`,
        ogImage: `${BASE}/og-banner.png`,
        ogType: 'website'
      };
    }

    // Default Home
    return {
      title: siteSettings?.metaTitle || 'طبیب پیڈیا - طب یونانی، قانون مفرد اعضاء اور اطباء ڈائریکٹری',
      description: siteSettings?.metaDescription || 'طبیب پیڈیا: پاکستان کی سب سے بڑی اور مستند طب یونانی، جڑی بوٹیاں اور اطباء و ڈاکٹرز ڈائریکٹری۔',
      canonicalUrl: `${BASE}/`,
      ogImage: `${BASE}/og-banner.png`,
      ogType: 'website'
    };
  }, [activeTab, selectedArticle, selectedDoctor, selectedPage, selectedGlossaryTerm, siteSettings]);

  // If currently in Full-Page Admin Mode:
  if (activeTab === 'admin') {
    // Admin Login Gate
    if (!adminAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-right">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white font-simple">ایڈمن پینل لاگ ان</h2>
              <p className="text-xs text-slate-400 mt-1 font-simple">صرف مجاز ایڈمنسٹریٹر کے لیے</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const uInput = adminUsernameInput.trim();
              const pInput = adminPasswordInput.trim();
              const validU = getAdminUsername();
              const validP = getAdminPassword();

              if (uInput === validU && pInput === validP) {
                try { sessionStorage.setItem('tabeeb_admin_auth', 'true'); } catch {}
                setAdminAuthenticated(true);
                setAdminLoginError('');
              } else {
                setAdminLoginError('یوزر نیم یا پاسورڈ غلط ہے۔ دوبارہ کوشش کریں۔');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 font-simple">یوزر نیم (Username):</label>
                <input
                  type="text"
                  value={adminUsernameInput}
                  onChange={(e) => { setAdminUsernameInput(e.target.value); setAdminLoginError(''); }}
                  placeholder="یوزر نیم درج کریں..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-left font-mono"
                  dir="ltr"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 font-simple">پاسورڈ (Password):</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => { setAdminPasswordInput(e.target.value); setAdminLoginError(''); }}
                    placeholder="پاسورڈ درج کریں..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-left font-mono pr-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {adminLoginError && (
                <p className="text-xs text-red-400 font-bold font-simple bg-red-900/20 border border-red-800/40 rounded-xl px-3 py-2">{adminLoginError}</p>
              )}
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md font-simple cursor-pointer">
                ایڈمن لاگ ان
              </button>
              <button type="button" onClick={() => { handleNavigateToTab('home'); setAdminUsernameInput(''); setAdminPasswordInput(''); setAdminLoginError(''); }} className="w-full text-slate-500 hover:text-slate-300 text-xs font-simple py-1 transition-colors cursor-pointer">
                ویب سائٹ پر واپس جائیں
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <AdminCMS 
        articlesList={articlesList}
        setArticlesList={setArticlesList}
        doctorsList={doctorsList}
        setDoctorsList={setDoctorsList}
        pagesList={pagesList}
        setPagesList={setPagesList}
        glossaryList={glossaryList}
        setGlossaryList={setGlossaryList}
        siteSettings={siteSettings}
        setSiteSettings={setSiteSettings}
        onViewArticle={(article) => {
          handleSelectArticle(article);
        }}
        onBackToWebsite={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdminLogout={() => {
          try { sessionStorage.removeItem('tabeeb_admin_auth'); } catch {}
          setAdminAuthenticated(false);
          setActiveTab('home');
        }}
      />
    );
  }

  // If currently in Full-Page Doctor Dashboard:
  if (activeTab === 'doctor-dashboard') {
    const activeDoc = loggedInDoctor || (doctorsList && doctorsList[0]) || DOCTORS[0];
    return (
      <DoctorDashboard
        doctor={activeDoc}
        onUpdateDoctor={handleUpdateDoctorProfile}
        onLogout={handleDoctorLogout}
        citiesList={citiesList}
        onAddCity={handleAddCity}
        onBackToWebsite={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewPublicProfile={(doc) => {
          handleSelectDoctor(doc);
        }}
        onOpenArticleEditor={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        articlesList={articlesList}
        theme={theme}
      />
    );
  }

  
    // 1. Featured Doctors Block
    const featEnabled = siteSettings?.featuredDoctorBlockEnabled !== false;
    const featCols = siteSettings?.featuredDoctorBlockColumns || '4';
    const featGridClass = featCols === '1' ? 'grid-cols-1' : featCols === '2' ? 'grid-cols-1 sm:grid-cols-2' : featCols === '3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    let featuredDocs = doctorsList.filter(d => d && d.isApproved !== false && d.status !== 'pending' && (d.isFeatured === true || d.isFeatured === '1' || d.isFeatured === 'yes' || d.featured));
    if (siteSettings?.featuredDoctorBlockSort === 'oldest') {
      featuredDocs = [...featuredDocs].sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0));
    } else {
      featuredDocs = [...featuredDocs].sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0));
    }
    const featLimit = (parseInt(featCols) || 4) * (parseInt(siteSettings?.featuredDoctorBlockRows || '1') || 1);

    // 2. All / Latest Doctors Block
    const docCols = siteSettings?.doctorBlockColumns || '4';
    const docGridClass = docCols === '1' ? 'grid-cols-1' : docCols === '2' ? 'grid-cols-1 sm:grid-cols-2' : docCols === '3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    let homeDocs = doctorsList.filter(d => d && d.isApproved !== false && d.status !== 'pending');
    if (siteSettings?.doctorBlockSort === 'oldest') {
      homeDocs = [...homeDocs].sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0));
    } else {
      homeDocs = [...homeDocs].sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0));
    }
    const docLimit = (parseInt(docCols) || 4) * (parseInt(siteSettings?.doctorBlockRows || '2') || 2);
    
    const artCols = siteSettings?.articleBlockColumns || '4';
    const artGridClass = artCols === '1' ? 'grid-cols-1' : artCols === '2' ? 'grid-cols-1 sm:grid-cols-2' : artCols === '3' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    let homeArticles = [...articlesList];
    if (siteSettings?.articleBlockSort !== 'oldest') homeArticles = homeArticles.reverse();
    const artLimit = (parseInt(artCols) || 4) * (parseInt(siteSettings?.articleBlockRows || '3') || 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Dynamic SEO Meta & Schema.org Controller */}
      <SEOHelmet {...seoConfig} />
      
      {/* Global Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        siteSettings={siteSettings}
        setActiveTab={handleNavigateToTab}
        onOpenAdmin={() => {
          handleNavigateToTab('admin');
        }}
        onSearchClick={() => {
          handleNavigateToTab('home');
        }}
        loggedInDoctor={loggedInDoctor}
        onOpenDoctorPortal={handleOpenDoctorPortal}
        onOpenDoctorAuthModal={handleOpenDoctorAuthModal}
        onLogoutDoctor={handleDoctorLogout}
        onSelectPage={handleSelectPage}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-16">
            
            {/* Hero Search Section */}
            <HeroSearch
              articlesList={articlesList}
              doctorsList={doctorsList}
              citiesList={citiesList}
              onOpenDoctorAuthModal={handleOpenDoctorAuthModal}
              onSelectDoctor={handleSelectDoctor}
              onSelectArticle={handleSelectArticle}
              onSelectSpecialty={handleSpecialtyClick}
              onSelectCity={handleCityClick}
              onNavigateToDirectory={() => handleNavigateToTab('doctors')}
              theme={theme}
            />

            {/* Herb Effectiveness Calculator (HEC) Home Spotlight Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`p-6 sm:p-8 rounded-3xl ${isNavy ? 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 border-blue-900/60' : 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-emerald-800/60'} border shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-right`}>
                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30 shrink-0">
                    <Calculator className="w-8 h-8 text-amber-300 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold font-mono">
                        HEC Algorithm
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white font-h2">
                        جڑی بوٹیوں و نسخہ جات کا سائنسی مزاج کیلکولیٹر
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-nastaliq leading-relaxed max-w-2xl">
                      قانون مفرد اعضاء اور طب یونانی کے عین مطابق کسی بھی نسخے یا مرکب کے اجزاء اور اوزان درج کریں اور فوراً اس کا حتمی مزاج، حرارت، برودت، یبوست اور رطوبت کا عین ریاضیاتی تناسب معلوم کریں۔
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleNavigateToTab('herb-calculator');
                  }}
                  className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-900/30 transition-all active:scale-95 font-simple flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>کیلکولیٹر کھولیں (HEC)</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* Specialties & Ailments Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className={`text-xs font-bold ${isNavy ? 'text-blue-700' : 'text-emerald-700'} uppercase font-sans`}>تخصصات و امراض</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-h2">{siteSettings?.articleBlockTitle || "تازہ ترین طبی تحقیقات و مضامین"}</h2>
                </div>
                <button
                  onClick={() => handleNavigateToTab('doctors')}
                  className={`text-xs sm:text-sm font-bold ${isNavy ? 'text-blue-700 hover:text-blue-900' : 'text-emerald-700 hover:text-emerald-900'} flex items-center gap-1 group font-h2`}
                >
                  <span>تمام امراض و شعبہ جات دیکھیں</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {SPECIALTIES.filter(s => s.id !== 'all').map((spec) => (
                  <div
                    key={spec.id}
                    onClick={() => handleSpecialtyClick(spec.id)}
                    className={`bg-white p-5 rounded-3xl border border-slate-200/90 ${isNavy ? 'hover:border-blue-500/50' : 'hover:border-emerald-500/50'} shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl ${isNavy ? 'bg-blue-50 text-blue-700 group-hover:bg-blue-600' : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600'} group-hover:text-white flex items-center justify-center transition-colors shadow-xs`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] text-slate-400 font-sans ${isNavy ? 'group-hover:text-blue-600' : 'group-hover:text-emerald-600'} transition-colors font-bold`}>
                        اطباء دیکھیں ←
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-base font-bold text-slate-900 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} transition-colors font-h2`}>
                        {spec.name}
                      </h3>
                      {spec.desc && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {spec.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Doctors Section (نمایاں اطباء کرام) */}
            {featEnabled && featuredDocs.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>منتخب و نمایاں اطباء</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-h2">
                      {siteSettings?.featuredDoctorBlockTitle || "نمایاں اطباء کرام (Featured Doctors)"}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {siteSettings?.featuredDoctorBlockSubtitle || "پاکستان بھر کے منتخب اور مستند اطباء و ماہرین طب یونانی"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigateToTab('doctors')}
                    className={`text-xs sm:text-sm font-bold ${isNavy ? 'text-blue-700 hover:text-blue-900' : 'text-emerald-700 hover:text-emerald-900'} flex items-center gap-1 group font-h2`}
                  >
                    <span>تمام نمایاں اطباء دیکھیں ({featuredDocs.length})</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className={`grid ${featGridClass} gap-6`}>
                  {featuredDocs.slice(0, featLimit).map((doctor) => (
                    <div
                      key={`feat-${doctor.id}`}
                      className="bg-white text-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-xl border-2 border-amber-300/80 hover:border-amber-400 flex flex-col justify-between space-y-4 relative group transition-all duration-300"
                    >
                      {/* Top ribbon badge */}
                      <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>نمایاں معالج</span>
                      </div>

                      <div>
                        {/* Top Profile info */}
                        <div className="flex items-start gap-3.5 pt-1">
                          <img 
                            src={doctor.image || siteSettings?.defaultDoctorImage || "/images/default_doctor.webp"} 
                            alt={doctor.name}
                            onError={(e) => { e.target.onerror = null; e.target.src = "/images/default_doctor.webp"; }}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-200 shadow-sm shrink-0 bg-white"
                          />
                          <div className="flex-1 text-right space-y-1">
                            <h3 
                              onClick={() => handleSelectDoctor(doctor)}
                              className={`text-base font-bold text-slate-900 ${isNavy ? 'hover:text-blue-700' : 'hover:text-emerald-700'} cursor-pointer font-h2 leading-snug`}
                            >
                              {doctor.name}
                            </h3>
                            <p className={`text-xs ${isNavy ? 'text-blue-800' : 'text-emerald-800'} font-semibold line-clamp-1`}>
                              {doctor.title || doctor.qualifications || 'ماہر معالج طب یونانی'}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-sans font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>{doctor.rating || 5.0}</span>
                              <span className="text-slate-400 font-normal">({doctor.reviewsCount || 25} آراء)</span>
                            </div>
                          </div>
                        </div>

                        {/* Clinic & City */}
                        <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 mt-4 space-y-1 text-xs">
                          <div className="flex items-center justify-between gap-1.5 font-bold text-slate-800">
                            <div className="flex items-center gap-1.5 truncate">
                              <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span className="truncate">{doctor.clinicName || 'مطب / کلینک'}</span>
                            </div>
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-sans shrink-0">
                              {doctor.cityName || doctor.city || 'پاکستان'}
                            </span>
                          </div>
                          {doctor.address && (
                            <p className="text-[11px] text-slate-500 truncate">{doctor.address}</p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                        <button
                          onClick={() => handleSelectDoctor(doctor)}
                          className="flex-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-colors text-center font-h2"
                        >
                          پروفائل دیکھیں
                        </button>
                        {doctor.whatsapp && (
                          <a
                            href={`https://wa.me/${doctor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام علیکم حکیم صاحب، میں طبیب پیڈیا کے ذریعے آپ سے رابطہ کر رہا ہوں۔`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2.5 rounded-xl shadow-xs transition-colors font-h2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>واٹس ایپ</span>
                          </a>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Featured Doctors Banner */}
            <section className={`${isNavy ? 'bg-[#0b1d3a] text-white border-y border-slate-800' : 'bg-emerald-950 text-white'} py-16 transition-colors duration-500`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-h2">{siteSettings?.doctorBlockTitle || "پاکستان کے معروف و مستند اطباء کرام"}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{siteSettings?.doctorBlockSubtitle || "آن لائن رہنمائی حاصل کریں یا واٹس ایپ پر براہ راست مشورہ طلب کریں"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDoctorAuthModal('signup')}
                      className="text-xs sm:text-sm font-bold text-amber-300 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/30 px-4 py-2.5 rounded-xl transition-all font-h2"
                    >
                      بطور طبیب شامل ہوں
                    </button>
                    <button
                      onClick={() => handleNavigateToTab('doctors')}
                      className="text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl transition-all font-h2"
                    >
                      تمام اطباء دیکھیں ({doctorsList.filter(d => d && d.isApproved !== false && d.status !== 'pending').length}+)
                    </button>
                  </div>
                </div>

                <div className={`grid ${docGridClass} gap-6`}>
                  {homeDocs.slice(0, docLimit).map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white text-slate-800 rounded-3xl p-5 shadow-lg border border-white/10 flex flex-col justify-between space-y-4 relative group"
                    >
                      <div>
                        {/* Top Profile info */}
                        <div className="flex items-start gap-4">
                          <img 
                            src={doctor.image || siteSettings?.defaultDoctorImage || "/images/default_doctor.webp"} 
                            alt={doctor.name}
                            onError={(e) => { e.target.onerror = null; e.target.src = "/images/default_doctor.webp"; }}
                            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 bg-white"
                          />
                          <div className="flex-1 text-right space-y-1">
                            <h3 
                              onClick={() => handleSelectDoctor(doctor)}
                              className={`text-base font-bold text-slate-900 ${isNavy ? 'hover:text-blue-700' : 'hover:text-emerald-700'} cursor-pointer font-h2`}
                            >
                              {doctor.name}
                            </h3>
                            <p className={`text-xs ${isNavy ? 'text-blue-800' : 'text-emerald-800'} font-semibold line-clamp-1`}>{doctor.title}</p>
                            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-sans font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>{doctor.rating}</span>
                              <span className="text-slate-400 font-normal">({doctor.reviewsCount} آراء)</span>
                            </div>
                          </div>
                        </div>

                        {/* Clinic & City */}
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-4 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Building2 className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                            <span>{doctor.clinicName}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{doctor.address}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                        <button
                          onClick={() => handleSelectDoctor(doctor)}
                          className="flex-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-colors text-center font-h2"
                        >
                          پروفائل دیکھیں
                        </button>
                        <a
                          href={`https://wa.me/${doctor.whatsapp}?text=${encodeURIComponent(`السلام علیکم حکیم صاحب، میں طبیب پیڈیا کے ذریعے آپ سے رابطہ کر رہا ہوں۔`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2.5 rounded-xl shadow-xs transition-colors font-h2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>واٹس ایپ</span>
                        </a>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Qanoon Mufrad Aza Interactive Highlight */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`bg-gradient-to-r ${isNavy ? 'from-[#0f2952] via-[#0b1d3a] to-slate-900' : 'from-teal-900 via-emerald-900 to-emerald-950'} text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-right`}>
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-amber-300 font-sans font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>طب پاکستانی کا عظیم شاہکار</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold leading-snug font-h2">
                    نظریۂ قانون مفرد اعضاء و تشخیص نبض
                  </h2>
                  <p className="text-xs sm:text-base text-slate-200/90 leading-relaxed max-w-2xl">
                    حضرت صابر ملتانیؒ کا پیش کردہ انقلابی نظریہ جس نے طب قدیم کو سائنسی بنیادیں فراہم کیں۔ اعصابی، عضلاتی اور غدی 6 نبض اور ان کے اغذیہ و ادویہ چارٹ کا مکمل مطالعہ کریں۔
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleNavigateToTab('qanoon')}
                      className={`${isNavy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-500 hover:bg-emerald-600'} text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md font-h2`}
                    >
                      مکمل قانون مفرد اعضاء گائیڈ کھولیں
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
                  <h4 className="text-base font-bold text-amber-300 border-b border-white/10 pb-2 font-h2">
                    تین اعضاء رئیسہ:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span><strong>دماغ و اعصاب:</strong> احساسات و رطوبات کا مرکز</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span><strong>دل و عضلات:</strong> حرکات اور خون کا پمپ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span><strong>جگر و غدد:</strong> حرارت اور تغذیہ کا سرچشمہ</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Latest Articles from the Blog */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className={`text-xs font-bold ${isNavy ? 'text-blue-700' : 'text-emerald-700'} uppercase font-sans`}>بلاگ و طبی مضامین</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-h2">
                    تازہ ترین طبی تحقیقات و مضامین
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigateToTab('blog')}
                  className={`text-xs sm:text-sm font-bold ${isNavy ? 'text-blue-700 hover:text-blue-900' : 'text-emerald-700 hover:text-emerald-900'} flex items-center gap-1 group font-h2`}
                >
                  <span>تمام مضامین دیکھیں</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              <div className={`grid ${artGridClass} gap-6`}>
                {homeArticles.slice(0, artLimit).map((article) => {
                  const allCats = Array.isArray(article.categories) ? article.categories : (article.category ? [article.category] : []);
                  const isAlphabetLetter = (c) => typeof c === 'string' && /^\s*(\([^\)]+\)|[A-Za-z])\s*$/.test(c);
                  const isMizaj = (c) => typeof c === 'string' && /عضلاتی|غدی|اعصابی|سرد|گرم|خشک|تر|معتدل|مزاج/.test(c);
                  
                  const mizajCats = allCats.filter(c => isMizaj(c));
                  const otherCats = allCats.filter(c => !isMizaj(c) && !isAlphabetLetter(c));
                  const topBadge = mizajCats.length > 0 ? mizajCats[0] : (otherCats[0] || article.categoryName || article.category || 'طبی مضمون');

                  return (
                    <div
                      key={article.id}
                      onClick={() => handleSelectArticle(article)}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 overflow-hidden">
                          <img src={article.featuredImage || siteSettings?.defaultArticleImage || "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"} alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className={`absolute top-3 right-3 bg-white/95 backdrop-blur-xs ${isNavy ? 'text-blue-900 border-blue-200' : 'text-emerald-900 border-emerald-200'} border text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs font-sans max-w-[85%] truncate`}>
                            {topBadge}
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <h3 className={`text-base font-bold text-slate-900 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} transition-colors line-clamp-2 leading-snug font-h2`}>
                            {article.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>

                          {/* Categories & Mizaj Badges */}
                          {(mizajCats.length > 0 || otherCats.length > 0) && (
                            <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100">
                              {/* Mizaj Badges (Highlighted) */}
                              {mizajCats.map((mizaj, idx) => (
                                <span
                                  key={`mizaj-${idx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectCategoryFromArticle(mizaj);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-900 border border-amber-300/80 hover:bg-amber-500/20 transition-all font-sans cursor-pointer shadow-2xs"
                                  title={`مزاج: ${mizaj}`}
                                >
                                  <span className="text-[10px] text-amber-700 font-normal">مزاج:</span>
                                  <span className="font-bold">{mizaj}</span>
                                </span>
                              ))}

                              {/* General Descriptive Categories */}
                              {otherCats.slice(0, 2).map((cat, idx) => (
                                <span
                                  key={`cat-${idx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectCategoryFromArticle(cat);
                                  }}
                                  className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all cursor-pointer font-sans"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-600 font-medium">{article.author}</span>
                        <span className={`font-bold ${isNavy ? 'text-blue-700' : 'text-emerald-700'} flex items-center gap-1 font-h2`}>
                          <span>پڑھیں</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>

            </div>
        )}

        {/* VIEW 2: DOCTOR DIRECTORY */}
        {activeTab === 'doctors' && (
          <DoctorDirectory siteSettings={siteSettings}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
            onSelectDoctor={handleSelectDoctor}
            doctorsList={doctorsList}
            citiesList={citiesList}
            onOpenDoctorAuthModal={handleOpenDoctorAuthModal}
            theme={theme}
          />
        )}

        {/* VIEW 3: BLOG & ARTICLES */}
        {activeTab === 'blog' && (
          <BlogSection siteSettings={siteSettings}
            articlesList={articlesList}
            onSelectArticle={handleSelectArticle}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            searchQuery={blogSearchQuery}
            setSearchQuery={setBlogSearchQuery}
          />
        )}

        {/* VIEW 4: ARTICLE DETAIL READER */}
        
        {activeTab === 'page' && selectedPage && (
          <PageView
            page={selectedPage}
            pagesList={pagesList}
            articlesList={articlesList}
            doctorsList={doctorsList}
            siteSettings={siteSettings}
            onSelectPage={handleSelectPage}
            onSelectArticle={handleSelectArticle}
            onSelectDoctor={handleSelectDoctor}
            onSelectCategory={handleSelectCategoryFromArticle}
            onBack={() => {
              handleNavigateToTab('home');
            }}
            onNavigateArticles={() => {
              handleNavigateToTab('blog');
            }}
            onNavigateDoctors={() => {
              handleNavigateToTab('doctors');
            }}
          />
        )}

        {activeTab === 'article-detail' && (
          <ArticleDetailView 
            siteSettings={siteSettings}
            article={selectedArticle}
            articlesList={articlesList}
            pagesList={pagesList}
            glossaryList={glossaryList}
            onSelectGlossaryTerm={handleSelectGlossaryTerm}
            onSelectPage={handleSelectPage}
            onBack={() => handleNavigateToTab('blog')}
            onSelectArticle={handleSelectArticle}
            onSelectDoctor={handleSelectDoctor}
            onSelectCategory={handleSelectCategoryFromArticle}
            onSelectTag={handleSelectTagFromArticle}
          />
        )}

        {/* VIEW: فرہنگِ اطباء (MEDICAL GLOSSARY DIRECTORY) */}
        {activeTab === 'farhang' && (
          <GlossaryDirectory
            glossaryList={glossaryList}
            articlesList={articlesList}
            onSelectTerm={handleSelectGlossaryTerm}
            onSelectArticle={handleSelectArticle}
            siteSettings={siteSettings}
            theme={theme}
          />
        )}

        {/* VIEW: SINGLE GLOSSARY TERM DETAIL VIEW */}
        {activeTab === 'farhang-term' && selectedGlossaryTerm && (
          <GlossaryTermView
            term={selectedGlossaryTerm}
            glossaryList={glossaryList}
            articlesList={articlesList}
            onBack={() => {
              handleNavigateToTab('farhang');
            }}
            onSelectTerm={handleSelectGlossaryTerm}
            onSelectArticle={handleSelectArticle}
            siteSettings={siteSettings}
            theme={theme}
          />
        )}

        {/* VIEW 5: HERBS ENCYCLOPEDIA */}
        {activeTab === 'herbs' && (
          <HerbsEncyclopedia
            onSelectArticleByHerb={handleSelectArticle}
          />
        )}

        {/* VIEW 6: QANOON MUFRAD AZA GUIDE */}
        {activeTab === 'qanoon' && (
          <QanoonMufradAzaGuide />
        )}

        {/* VIEW 7: FULL-PAGE DOCTOR PROFILE (OLADOC ENHANCED) */}
        {activeTab === 'doctor-detail' && selectedDoctor && (
          <DoctorProfileView
            doctor={selectedDoctor}
            onBack={() => {
              handleNavigateToTab('doctors');
            }}
            onNavigateHome={() => handleNavigateToTab('home')}
            onNavigateDoctors={() => handleNavigateToTab('doctors')}
            articlesList={articlesList}
            onSelectArticle={handleSelectArticle}
            siteSettings={siteSettings}
          />
        )}

        {/* VIEW 8: HERB EFFECTIVENESS CALCULATOR (HEC) */}
        {activeTab === 'herb-calculator' && (
          <HerbEffectivenessCalculator
            articles={articlesList}
            onSelectArticle={handleSelectArticle}
            onBack={() => {
              handleNavigateToTab('home');
            }}
            theme={theme}
          />
        )}

      </main>

      {/* Doctor Portal Auth Modal (Login / Sign Up) */}
      <DoctorAuthModal
        isOpen={doctorAuthModalOpen}
        onClose={() => setDoctorAuthModalOpen(false)}
        onLoginSuccess={handleDoctorLoginSuccess}
        onRegisterDoctor={handleRegisterDoctor}
        doctorsList={doctorsList}
        citiesList={citiesList}
        onAddCity={handleAddCity}
        initialMode={doctorAuthModalInitialMode}
        theme={theme}
      />

      {/* Global Footer */}
      <Footer onSelectPage={(slug) => { const p = pagesList.find(item => item.slug === slug); if (p) { setSelectedPage(p); setActiveTab('page'); window.scrollTo({top:0, behavior:'smooth'}); } }} 
        siteSettings={siteSettings}
        onNavigate={(tab) => {
          handleNavigateToTab(tab);
        }} 
      />

      {/* WhatsApp Floating Button */}
      {siteSettings?.whatsappNumber && (
        <a
          href={`https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent('السلام علیکم! طبیب پیڈیا سے رابطہ کرنا چاہتا/چاہتی ہوں۔')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
          title="واٹس ایپ پر رابطہ کریں"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute left-16 bg-slate-900 text-white text-xs font-simple font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
            واٹس ایپ پر رابطہ کریں
          </span>
        </a>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 z-50 w-12 h-12 ${isNavy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-in fade-in zoom-in`}
          title="اوپر جائیں"
        >
          <ArrowLeft className="w-5 h-5 rotate-90" />
        </button>
      )}

    </div>
  );
}
