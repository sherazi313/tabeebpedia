import React, { useState, useMemo, useEffect } from 'react';
import { fetchLivePdfBooks } from '../api';
import { 
  BookOpen, 
  Download, 
  Eye, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Globe, 
  FileText, 
  X, 
  ExternalLink, 
  BookMarked,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const BOOKS_DATA = [
  {
    id: 1,
    title: 'طب پاکستانی اردو',
    author: 'حکیم سید عبدالوہاب شاہ شیرازی',
    category: 'قانون مفرد اعضاء',
    categoryEn: 'qanoon',
    language: 'Urdu',
    pages: 'مختصر و جامع',
    description: 'کتاب طب پاکستانی (قانون مفرد اعضاء) کی مبادیات کو سمجھنے اور ابتدائی طلبہ کے لیے انتہائی آسان فہم، مصور اور بنیادی طبی کتاب۔',
    image: '/images/books/tib-e-pakistani-urdu.jpg',
    downloadUrl: 'https://drive.usercontent.google.com/u/0/uc?id=16loOy7s57F7SUvqhn7_4nqx42pUWIBmt&export=download',
    embedUrl: 'https://drive.google.com/file/d/16loOy7s57F7SUvqhn7_4nqx42pUWIBmt/preview'
  },
  {
    id: 2,
    title: 'دوا کی شکل اور جڑی بوٹیوں کے اثرات',
    author: 'حکیم سید عبدالوہاب شاہ شیرازی',
    category: 'ادویات و فارماکوپیا',
    categoryEn: 'herbs',
    language: 'Urdu',
    pages: 'تفصیلی تحقیق',
    description: 'دوا کی طبعی شکل، رنگ، ساخت اور انسانی جسم پر جڑی بوٹیوں کے مزاجی و کیفیاتی اثرات میں تبدیلی پر لاجواب اور نایاب تحقیقی دستاویز۔',
    image: '/images/books/dawa-shakal-jaribotian.jpg',
    downloadUrl: 'https://drive.usercontent.google.com/u/0/uc?id=1gmWNOu1p08JdLdOcqPgLcsjdQhmHZiUo&export=download',
    embedUrl: 'https://drive.google.com/file/d/1gmWNOu1p08JdLdOcqPgLcsjdQhmHZiUo/preview'
  },
  {
    id: 3,
    title: 'Tib e Pakistani English',
    author: 'Hakim Syed Abdul Wahab Shah',
    category: 'تراجم طب پاکستانی',
    categoryEn: 'translations',
    language: 'English',
    pages: 'Standard Text',
    description: 'Tibb-e-Pakistani (The Law of Simple Organs) is a fundamental, easy-to-understand, concise yet comprehensive introductory textbook dedicated to students of alternative medicine.',
    image: '/images/books/tib-e-pakistani-english.jpg',
    downloadUrl: 'https://archive.org/download/tib-e-pakistani-book-english/Tib%20e%20Pakistani%20Book%20English%20Qanun%20Mufrad%20Aaza%20Law%20of%20Simple%20Organs.pdf',
    embedUrl: 'https://archive.org/embed/tib-e-pakistani-book-english'
  },
  {
    id: 4,
    title: 'तिब्ब-ए-पाकिस्तानी Tibb-e-Pakistani in Hindi',
    author: 'हकीम सय्यद अब्दुल वहाब शाह',
    category: 'تراجم طب پاکستانی',
    categoryEn: 'translations',
    language: 'Hindi',
    pages: 'हिंदी संस्करण',
    description: 'कानून मुफर्द आज़ा (तिब्ब-ए-पाकिस्तानी) के छात्रों के लिए एक बुनियादी, आसान, संक्षिप्त मगर व्यापक प्रारंभिक चिकित्सा पुस्तक।',
    image: '/images/books/tib-e-pakistani-hindi.jpg',
    downloadUrl: 'https://archive.org/download/tib-e-pakistani-book-hindi/Tib%20e%20Pakistani%20Book%20Hindi%20%E0%A4%A4%E0%A4%BF%E0%A4%AC%E0%A5%8D%E0%A4%AC-%E0%A4%8F-%E0%A4%AA%E0%A4%BE%E0%A4%95%E0%A4%BF%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A4%BE%E0%A4%A8%E0%A5%80.pdf',
    embedUrl: 'https://archive.org/embed/tib-e-pakistani-book-hindi'
  },
  {
    id: 5,
    title: 'الطب الباكستاني عربک',
    author: 'الحكيم السيد عبد الوهاب شاه',
    category: 'تراجم طب پاکستانی',
    categoryEn: 'translations',
    language: 'Arabic',
    pages: 'النسخة العربية',
    description: 'طب باكستان (قانون الأعضاء المفردة) هو كتاب طبي تمهيدي، صُمم خصيصاً لطلاب العلم؛ فهو يمتاز بكونه أساسياً، سهلاً، مختصراً، ومع ذلك فهو شامل في معانيه وقواعده الطبية.',
    image: '/images/books/tib-e-pakistani-arabic.jpg',
    downloadUrl: 'https://archive.org/download/tib-e-pakistani-arabic/%D8%B7%D8%A8%20%D9%BE%D8%A7%DA%A9%D8%B3%D8%AA%D8%A7%D9%86%DB%8C%20%D8%B9%D8%B1%D8%A8%DA%A9.pdf',
    embedUrl: 'https://archive.org/embed/tib-e-pakistani-arabic'
  },
  {
    id: 6,
    title: 'طب پاکستانی فارسی',
    author: 'حکیم سید عبدالوہاب شاہ شیرازی',
    category: 'تراجم طب پاکستانی',
    categoryEn: 'translations',
    language: 'Persian',
    pages: 'نسخه فارسی',
    description: 'کتاب مقدماتی، ساده، مختصر و در عین حال جامع برای دانشجویان طب سنتی و علاقمندان به شناخت اصول علمی قانون مفرد اعضاء.',
    image: '/images/books/tib-e-pakistani-persian.jpg',
    downloadUrl: 'https://archive.org/download/tib-e-pakistani-book-persian/Tib%20e%20Pakistani%20Book%20%D8%B7%D8%A8%20%D9%BE%D8%A7%DA%A9%D8%B3%D8%AA%D8%A7%D9%86%DB%8C%20%D9%81%D8%A7%D8%B1%D8%B3%DB%8C.pdf',
    embedUrl: 'https://archive.org/embed/tib-e-pakistani-book-persian'
  },
  {
    id: 7,
    title: '巴基斯坦医学 Tibb-e-Pakistani in Chinese',
    author: 'Hakim Syed Abdul Wahab Shah',
    category: 'تراجم طب پاکستانی',
    categoryEn: 'translations',
    language: 'Chinese',
    pages: '中文版',
    description: '巴基斯坦医学 为 巴基斯坦医学 (单一人体器官法) 学生编写的基础、简单、简明且全面的入门医学书籍。',
    image: '/images/books/tib-e-pakistani-chinese.jpg',
    downloadUrl: 'https://archive.org/download/tib-e-pakistani-book-1/%E5%B7%B4%E5%9F%BA%E6%96%AF%E5%9D%A6%E5%8C%BB%E5%AD%A6%20%20Tib%20e%20Pakistani%20Book%20%281%29.pdf',
    embedUrl: 'https://archive.org/embed/tib-e-pakistani-book-1'
  },
  {
    id: 8,
    title: 'کلیات تحقیقات صابر ملتانی (حصہ اول)',
    author: 'حکیم انقلاب دوست محمد صابر ملتانی',
    category: 'قانون مفرد اعضاء',
    categoryEn: 'qanoon',
    language: 'Urdu',
    pages: 'کلاسیک شاہکار',
    description: 'بانی قانون مفرد اعضاء حکیم انقلاب صابر ملتانی کی بنیادی و اصولی تحقیقات کا پہلا حصہ۔ اس میں انسانی جسم کے افعال اور اعضاء رئیسہ کے باہمی تعلق پر مدلل بحث کی گئی ہے۔',
    image: '/images/books/kulyat-sabir-multani-1.jpg',
    downloadUrl: 'https://archive.org/download/kulyat-tahqeeqat-sabir-multani-part-1/%DA%A9%D9%84%DB%8C%D8%A7%D8%AA%20%D8%AA%D8%AD%D9%82%DB%8C%D9%82%D8%A7%D8%AA%20%D8%B5%D8%A7%D8%A8%D8%B1%20%D9%85%D9%84%D8%AA%D8%A7%D9%86%DB%8C%20%D8%AD%D8%B5%DB%81%20%D8%A7%D9%88%D9%84.pdf',
    embedUrl: 'https://archive.org/embed/kulyat-tahqeeqat-sabir-multani-part-1'
  },
  {
    id: 9,
    title: 'کلیات تحقیقات صابر ملتانی (حصہ دوم)',
    author: 'حکیم انقلاب دوست محمد صابر ملتانی',
    category: 'قانون مفرد اعضاء',
    categoryEn: 'qanoon',
    language: 'Urdu',
    pages: 'کلاسیک شاہکار',
    description: 'حکیم صابر ملتانی کی کلیات کا دوسرا حصہ جس میں علاج بالمفردات، بیماریوں کے اسباب، تدابیرِ علاج اور مختلف امراض کی باقاعدہ تشخیص و تجاویز درج ہیں۔',
    image: '/images/books/kulyat-sabir-multani-2.jpg',
    downloadUrl: 'https://archive.org/download/kulyat-tahqeeqat-sabir-multani-part-2/%DA%A9%D9%84%DB%8C%D8%A7%D8%AA%20%D8%AA%D8%AD%D9%82%DB%8C%D9%82%D8%A7%D8%AA%20%D8%B5%D8%A7%D8%A8%D8%B1%20%D9%85%D9%84%D8%AA%D8%A7%D9%86%DB%8C%20%D8%AD%D8%B5%DB%81%20%D8%AF%D9%88%D9%85.pdf',
    embedUrl: 'https://archive.org/embed/kulyat-tahqeeqat-sabir-multani-part-2'
  },
  {
    id: 10,
    title: 'چھ نبض کل امراض',
    author: 'حکیم صابر ملتانی / اطباء کونسل',
    category: 'تشخیص و لیبارٹری',
    categoryEn: 'diagnosis',
    language: 'Urdu',
    pages: 'علم النبض',
    description: 'علم النبض پر نایاب ترین دستاویز جس میں صرف چھ نبضوں کے ذریعے پورے جسم کے اعصابی، عضلاتی اور غدی امراض کی درست تشخیص کا طریقہ آسان انداز میں سمجھایا گیا ہے۔',
    image: '/images/books/chheh-nabz-kul-amraz.jpg',
    downloadUrl: 'https://archive.org/download/20210212_20210212_0729/%DA%86%DA%BE%20%D9%86%D8%A8%D8%B6%20%DA%A9%D9%84%20%D8%A7%D9%85%D8%B1%D8%A7%D8%B6%20%28%DA%A9%D8%AA%D8%A8%20%D8%AE%D8%A7%D9%86%DB%81%20%D8%B7%D8%A8%DB%8C%D8%A8%29.pdf',
    embedUrl: 'https://archive.org/embed/20210212_20210212_0729'
  },
  {
    id: 11,
    title: 'دواؤں کو محفوظ رکھنے کے طریقے',
    author: 'محققینِ طب و فارمیسی',
    category: 'ادویات و فارماکوپیا',
    categoryEn: 'herbs',
    language: 'Urdu',
    pages: 'فارمیسی گائیڈ',
    description: 'جڑی بوٹیوں، کشتہ جات، شربت اور معجونات کو نمی، کیڑے مکوڑوں اور خراب ہونے سے بچانے کے جدید اور قدیم روایتی طریقوں پر جامع و عملی گائیڈ۔',
    image: '/images/books/dawaon-ko-mehfooz-rakhna.jpg',
    downloadUrl: 'https://archive.org/download/ways-to-store-medicines-safely/%D8%AF%D9%88%D8%A7%D8%A6%D9%88%DA%BA%20%DA%A9%D9%88%20%D9%85%D8%AD%D9%81%D9%88%D8%B8%20%D8%B1%DA%A9%DA%BE%D9%86%DB%92%20%DA%A9%DB%92%20%D8%B7%D8%B1%DB%8C%D9%82%DB%92.pdf',
    embedUrl: 'https://archive.org/embed/ways-to-store-medicines-safely'
  },
  {
    id: 12,
    title: 'کیٹو ڈائٹ (Keto Diet Guide)',
    author: 'ڈاکٹر خالد جمیل',
    category: 'صحت و مطب',
    categoryEn: 'health',
    language: 'Urdu',
    pages: 'ڈائٹ و میٹابولزم',
    description: 'معروف معالج ڈاکٹر خالد جمیل کی لکھی ہوئی رہنما کتاب جس میں وزن میں کمی، شوگر کنٹرول اور میٹابولزم کی بہتری کے لیے کیٹو ڈائٹ کے سائنسی اصول آسان اردو میں درج ہیں۔',
    image: '/images/books/keto-diet.jpg',
    downloadUrl: 'https://archive.org/download/20250305_20250305_1457/%DA%88%D8%A7%DA%A9%D9%B9%D8%B1%20%D8%AE%D8%A7%D9%84%D8%AF%20%D8%AC%D9%85%DB%8C%D9%84%20%DA%A9%DB%8C%D9%B9%D9%88%20%DA%88%D8%A7%D8%A6%D9%B9.pdf',
    embedUrl: 'https://archive.org/embed/20250305_20250305_1457'
  },
  {
    id: 13,
    title: 'جیبی فارماکوپیا (Pocket Pharmacopoeia)',
    author: 'اطباء بورڈ پاکستان',
    category: 'ادویات و فارماکوپیا',
    categoryEn: 'herbs',
    language: 'Urdu',
    pages: 'پاکٹ ایڈیشن',
    description: 'معالجین اور طلبہ کے لیے روزمرہ کلینیکل پریکٹس کے مجرب اور مستند دیسی نسخہ جات، اوزان اور ترکیبات کا فوری دستی رہنما مجموعہ۔',
    image: '/images/books/jabi-pharmacopoeia.jpg',
    downloadUrl: 'https://archive.org/download/jabiformacopia/jabi%2Bformacopia.pdf',
    embedUrl: 'https://archive.org/embed/jabiformacopia'
  },
  {
    id: 14,
    title: 'لیبارٹری ٹیسٹ گائیڈ',
    author: 'ڈاکٹر محمد مستنصر',
    category: 'تشخیص و لیبارٹری',
    categoryEn: 'diagnosis',
    language: 'Urdu',
    pages: 'میڈیکل گائیڈ',
    description: 'خون، پیشاب اور کلینیکل ٹیسٹوں کے نتائج سمجھنے، نارمل ویلیوز اور بیماریوں کی لیبارٹری تشخیصی تفہیم پر مستند و مفید اردو میڈیکل کتاب۔',
    image: '/images/books/lab-test-guide.jpg',
    downloadUrl: 'https://archive.org/download/laboratory-test-guide-urdu-dr-muhammad-mustansir/%D9%84%DB%8C%D8%A8%D8%A7%D8%B1%D9%B9%D8%B1%DB%8C%20%D9%B9%DB%8C%D8%B3%D9%B9%20%DA%AF%D8%A7%D8%A6%DB%8C%DA%88.pdf',
    embedUrl: 'https://archive.org/embed/laboratory-test-guide-urdu-dr-muhammad-mustansir'
  },
  {
    id: 15,
    title: 'لیبارٹری ٹیسٹس فار پیرامیڈیکس',
    author: 'طبی ماہرین و محققین',
    category: 'تشخیص و لیبارٹری',
    categoryEn: 'diagnosis',
    language: 'English/Urdu',
    pages: 'پیرامیڈیکل سائنس',
    description: 'ہسپتالوں اور کلینکس کے پیرامیڈیکل اسٹاف اور لیب ٹیکنیشنز کے لیے بنیادی ٹیسٹوں کے عملی طریقہ کار، سیمپلنگ اور حفاظتی تدابیر پر مشتمل جامع گائیڈ۔',
    image: '/images/books/lab-tests-paramedics.jpg',
    downloadUrl: 'https://archive.org/download/laboratory-tests-for-paramedics/LABORATORY%20TESTS%20FOR%20PARAMEDICS.pdf',
    embedUrl: 'https://archive.org/embed/laboratory-tests-for-paramedics'
  },
  {
    id: 16,
    title: 'فارماکوپیا قانون مفرد اعضاء',
    author: 'حکیم انقلاب دوست محمد صابر ملتانی',
    category: 'قانون مفرد اعضاء',
    categoryEn: 'qanoon',
    language: 'Urdu',
    pages: 'مرکبات و مفردات',
    description: 'قانون مفرد اعضاء کے باقاعدہ فارمولیشن اصول، تریاق، ہاضم، ملین، مسہل اور مقویات کے اعصابی، عضلاتی اور غدی مرکبات کی مستند قرابادین۔',
    image: '/images/books/pharmacopoeia-qanoon.jpg',
    downloadUrl: 'https://archive.org/download/FarmacopiaQanoonMufradAzaHakimSabirMultani/Farmacopia%20Qanoon%20Mufrad%20aza%20Hakim%20Sabir%20Multani.pdf',
    embedUrl: 'https://archive.org/embed/FarmacopiaQanoonMufradAzaHakimSabirMultani'
  },
  {
    id: 17,
    title: 'کلر تھراپی (Color Therapy)',
    author: 'ماہرین قدرتی علاج',
    category: 'صحت و مطب',
    categoryEn: 'health',
    language: 'Urdu',
    pages: 'شعاعی و رنگ علاج',
    description: 'رنگوں اور شعاعوں کے ذریعے امراض کے علاج، اعصابی نظام پر رنگوں کے اثرات اور ان کے سائنسی استعمال پر دلچسپ و معلوماتی کتاب۔',
    image: '/images/books/color-therapy.jpg',
    downloadUrl: 'https://archive.org/download/color-therapy/color_thrapy.pdf',
    embedUrl: 'https://archive.org/embed/color-therapy'
  },
  {
    id: 18,
    title: 'تحقیقات انسانی بلڈ گروپ و غذا',
    author: 'حکیم محمد عمر ملکپوری',
    category: 'تشخیص و لیبارٹری',
    categoryEn: 'diagnosis',
    language: 'Urdu',
    pages: 'بلڈ گروپ و طب',
    description: 'انسانی بلڈ گروپس (A, B, AB, O) کا مزاج، طب یونانی، ہومیو پیتھی اور مناسب غذاؤں کے انتخاب پر ایک منفرد اور چشم کشا تحقیق۔',
    image: '/images/books/blood-group-diet.jpg',
    downloadUrl: 'https://archive.org/download/20230801_20230801_0039/%D8%A8%D9%84%DA%88_%DA%AF%D8%B1%D9%88%D9%BE_%DB%94%D8%BA%D8%B0%D8%A7_%D8%B7%D8%A8_%DB%81%DB%8C%D9%88%D9%85%DB%8C%D9%88%D8%AD%DA%A9%DB%8C%D9%85_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%85%D8%B1_%D9%85%D9%84%DA%A9%D9%BE%D9%88%D8%B1%DB%8C_.pdf',
    embedUrl: 'https://archive.org/embed/20230801_20230801_0039'
  },
  {
    id: 19,
    title: 'مبادیاتِ طب صابر ملتانی',
    author: 'حکیم دوست محمد صابر ملتانی',
    category: 'قانون مفرد اعضاء',
    categoryEn: 'qanoon',
    language: 'Urdu',
    pages: 'بنیادی کورس',
    description: 'طبیب طلبہ کے لیے قانون مفرد اعضاء کے تمام بنیادی قواعد، اصطلاحات، امراض کے درجات اور علاج کے ضوابط کا مکمل نصاب۔',
    image: '/images/books/mubadiyat-e-tibb.jpg',
    downloadUrl: 'https://archive.org/download/mubadiyat-e-tibb/%D9%85%D8%A8%D8%A7%D8%AF%DB%8C%D8%A7%D8%AA.%D8%B7%D8%A8.%D8%B5%D8%A7%D8%A8%D8%B1.%D9%85%D9%84%D8%AA%D8%A7%D9%86%DB%8C%20%28%DA%A9%D8%AA%D8%A8%20%D8%AE%D8%A7%D9%86%DB%81%20%D8%B7%D8%A8%DB%8C%D8%A8%29.pdf',
    embedUrl: 'https://archive.org/embed/mubadiyat-e-tibb'
  },
  {
    id: 20,
    title: 'میرا مطب (کلینیکل تجربات)',
    author: 'حکیم محمد احمد سلیمی (صدر نیشنل کونسل فار طب)',
    category: 'صحت و مطب',
    categoryEn: 'health',
    language: 'Urdu',
    pages: 'مجربات و تجربات',
    description: 'پاکستان کی تاریخ کے عظیم طبیب حکیم محمد احمد سلیمی صاحب کے 50 سالہ کلینیکل مشاہدات، نایاب نسخہ جات اور نادر مطب ڈائری۔',
    image: '/images/books/mera-matab.jpg',
    downloadUrl: 'https://archive.org/download/mera-matab/%D9%85%DB%8C%D8%B1%D8%A7%20%D9%85%D8%B7%D8%A8%20%D8%AD%DA%A9%DB%8C%D9%85%20%D9%85%D8%AD%D9%85%D8%AF%20%D8%A7%D8%AD%D9%85%D8%AF%20%D8%B3%D9%84%DB%8C%D9%85%DB%8C%20%D8%B5%D8%A7%D8%AD%D8%A8%20%D8%B5%D8%AF%D8%B1%20%D9%86%DB%8C%D8%B4%D9%86%D9%84%20%DA%A9%D9%88%D9%86%D8%B3%D9%84%20%D9%81%D8%A7%D8%B1%20%D8%B7%D8%A8.pdf',
    embedUrl: 'https://archive.org/embed/mera-matab'
  },
  {
    id: 21,
    title: 'MSDS Matab (یونانی مطب کے لازمی معیارات)',
    author: 'پنجاب ہیلتھ کیئر کمیشن (PHC)',
    category: 'صحت و مطب',
    categoryEn: 'health',
    language: 'Urdu/English',
    pages: 'قانونی ریگولیشنز',
    description: 'پنجاب ہیلتھ کیئر کمیشن کی جاری کردہ مستند ترین دستاویز جس میں یونانی کلینکس کے لیے 17 بنیادی معیارات اور 34 انڈیکیٹرز کی قانونی وضاحت ہے۔',
    image: '/images/books/msds-matab.jpg',
    downloadUrl: 'https://archive.org/download/msds-matab-ed-2-180221-rp.cdr/MSDS-Matab-Ed2-180221-RP.cdr.pdf',
    embedUrl: 'https://archive.org/embed/msds-matab-ed-2-180221-rp.cdr'
  }
];

export default function PdfBooksLibrary({ books: propBooks }) {
  const [internalBooks, setInternalBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('tabeeb_pdf_books');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return BOOKS_DATA;
  });

  const books = propBooks || internalBooks;

  useEffect(() => {
    const loadLiveBooks = async () => {
      try {
        const live = await fetchLivePdfBooks();
        if (Array.isArray(live) && live.length > 0) {
          setInternalBooks(live);
          try { localStorage.setItem('tabeeb_pdf_books', JSON.stringify(live)); } catch(e) {}
        }
      } catch(e) {}
    };
    loadLiveBooks();

    const handleStorageChange = (e) => {
      if (e.key === 'tabeeb_pdf_books' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInternalBooks(parsed);
          }
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReaderBook, setActiveReaderBook] = useState(null);
  const [copied, setCopied] = useState(false);

  const [selectedBook, setSelectedBook] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bParam = params.get('book');
      if (bParam) {
        const found = BOOKS_DATA.find(b => String(b.id) === bParam || b.title === bParam || (b.slug && b.slug === bParam));
        if (found) return found;
      }
    } catch(e) {}
    return null;
  });

  // Keep selectedBook synced with URL / browser Back-Forward buttons
  useEffect(() => {
    const syncUrlBook = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const bParam = params.get('book');
        if (bParam) {
          const found = books.find(b => String(b.id) === bParam || b.title === bParam || (b.slug && b.slug === bParam));
          if (found) {
            setSelectedBook(found);
            return;
          }
        }
        setSelectedBook(null);
      } catch(e) {}
    };

    window.addEventListener('popstate', syncUrlBook);
    return () => window.removeEventListener('popstate', syncUrlBook);
  }, [books]);

  const handleSelectBook = (book) => {
    if (!book) return;
    setSelectedBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = `?tab=pdf-books&book=${book.id}`;
      if (window.location.search !== url) {
        window.history.pushState({ type: 'book', id: book.id }, '', url);
      }
    } catch(e) {}
  };

  const handleBackToLibrary = () => {
    setSelectedBook(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = '/pdf-books';
      if (window.location.pathname !== url || window.location.search) {
        window.history.pushState({ type: 'page', slug: 'pdf-books' }, '', url);
      }
    } catch(e) {}
  };

  const categories = [
    { id: 'all', name: 'تمام کتب' },
    { id: 'qanoon', name: 'قانون مفرد اعضاء' },
    { id: 'translations', name: 'تراجم طب پاکستانی' },
    { id: 'diagnosis', name: 'تشخیص و لیبارٹری' },
    { id: 'herbs', name: 'ادویات و فارماکوپیا' },
    { id: 'health', name: 'صحت و مطب' }
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchCategory = selectedCategory === 'all' || b.categoryEn === selectedCategory || b.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (b.title || '').toLowerCase().includes(q);
      const authorMatch = (b.author || '').toLowerCase().includes(q);
      const descMatch = (b.description || '').toLowerCase().includes(q);
      const catMatch = (b.category || '').toLowerCase().includes(q);
      return titleMatch || authorMatch || descMatch || catMatch;
    });
  }, [books, selectedCategory, searchQuery]);

  const relatedBooks = useMemo(() => {
    if (!selectedBook) return [];
    return books
      .filter(b => b.id !== selectedBook.id && (b.category === selectedBook.category || b.categoryEn === selectedBook.categoryEn))
      .slice(0, 4);
  }, [books, selectedBook]);

  const renderDescriptionHtml = (desc) => {
    if (!desc) return '<p>اس کتاب کے لیے فی الوقت تفصیلی تعارف دستیاب نہیں ہے۔</p>';
    if (/<[a-z][\s\S]*>/i.test(desc)) {
      return desc;
    }
    return desc.split('\n\n').map(p => `<p class="mb-4 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`).join('');
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch(e) {}
  };

  // IF A SPECIFIC BOOK IS SELECTED -> RENDER COMPLETE BOOK DETAIL PAGE
  if (selectedBook) {
    return (
      <div className="space-y-8 text-right font-sans animate-fade-in">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 sm:px-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-simple">
            <button
              type="button"
              onClick={handleBackToLibrary}
              className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>کتب خانہ</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">{selectedBook.category}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-md">{selectedBook.title}</span>
          </div>

          <button
            type="button"
            onClick={handleBackToLibrary}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer font-simple shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
            <span>واپس تمام کتب پر جائیں</span>
          </button>
        </div>

        {/* Main Book Detail Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Right: Book Showcase Cover (In RTL) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-5">
              <div className="relative w-56 sm:w-64 aspect-[3/4.2] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200 bg-slate-100 group">
                <img
                  src={selectedBook.image}
                  alt={selectedBook.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/books/tib-e-pakistani-urdu.jpg';
                  }}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {/* 3D Book Spine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
                <div className="absolute top-0 right-0 bottom-0 w-3.5 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />
                
                {/* Format ribbon */}
                <div className="absolute top-3 right-3 bg-emerald-600/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow-md font-simple">
                  PDF ایڈیشن
                </div>
              </div>

              {/* Action Buttons Under Cover */}
              <div className="w-full max-w-xs space-y-2.5">
                <a
                  href={selectedBook.downloadUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all font-simple cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>پی ڈی ایف ڈاؤن لوڈ کریں (Free Download)</span>
                </a>

                {selectedBook.embedUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveReaderBook(selectedBook)}
                    className="w-full py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 border border-slate-200 transition-colors font-simple cursor-pointer text-xs"
                  >
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>آن لائن مکمل اسکرین میں پڑھیں</span>
                  </button>
                )}

                {/* Social Share & Copy Link */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`طبیب پیڈیا کتب خانہ: کتاب "${selectedBook.title}" مصنف ${selectedBook.author} مفت پی ڈی ایف مطالعہ و ڈاؤن لوڈ کریں۔\n${window.location.href}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors font-simple"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>واٹس ایپ شیئر</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors font-simple cursor-pointer"
                    title="کتاب کا لنک کاپی کریں"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'کاپی ہو گیا' : 'لنک کاپی'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Left: Book Meta & Rich Description (In RTL) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category & Language Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold font-simple">
                  {selectedBook.category}
                </span>
                <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  {selectedBook.language}
                </span>
                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold font-simple">
                  {selectedBook.pages}
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold font-simple">
                  مفت علمی مطالعہ (Open Access)
                </span>
              </div>

              {/* Book Title */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight font-h1">
                  {selectedBook.title}
                </h1>
                
                <p className="mt-3 text-sm sm:text-base text-emerald-800 font-bold flex items-center gap-2 font-simple">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>مصنف / محقق: <strong className="text-slate-900">{selectedBook.author}</strong></span>
                </p>
              </div>

              {/* Fast Metadata Summary Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-xs font-simple">
                <div>
                  <span className="text-slate-400 block mb-0.5">شعبہ علم:</span>
                  <strong className="text-slate-800">{selectedBook.category}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">زبان:</span>
                  <strong className="text-slate-800">{selectedBook.language}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">ضخامت / نوعیت:</span>
                  <strong className="text-slate-800">{selectedBook.pages}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">فارمیٹ:</span>
                  <strong className="text-emerald-700">Digital PDF Document</strong>
                </div>
              </div>

              {/* Rich Description Section */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-h2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>کتاب کا تعارف، اہم ابواب و تفصیلی خلاصہ</span>
                </h3>

                <div
                  className="article-rendered-content text-slate-800 leading-relaxed font-nastaliq text-base sm:text-lg bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-2xs"
                  dangerouslySetInnerHTML={{ __html: renderDescriptionHtml(selectedBook.description) }}
                />
              </div>

            </div>

          </div>
        </div>

        {/* Inline PDF Embedded Viewer Frame (if embedUrl is provided) */}
        {selectedBook.embedUrl && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-h2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  <span>آن لائن کتاب کا مطالعہ فرمائیں (Live Document Viewer)</span>
                </h3>
                <p className="text-xs text-slate-500 font-simple mt-0.5">
                  کتاب کے صفحات پلٹنے، زوم کرنے اور مطالعہ کرنے کے لیے نیچے دیا گیا ویور استعمال کریں۔
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReaderBook(selectedBook)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors font-simple cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>مکمل اسکرین پر کھولیں</span>
                </button>

                <a
                  href={selectedBook.downloadUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors font-simple"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ڈاؤن لوڈ PDF</span>
                </a>
              </div>
            </div>

            <div className="w-full h-[600px] sm:h-[720px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                src={selectedBook.embedUrl}
                title={selectedBook.title}
                className="w-full h-full border-0"
                allow="fullscreen"
              />
            </div>
          </div>
        )}

        {/* Related Books in Same Category */}
        {relatedBooks.length > 0 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-h2">
                  اسی شعبے کی مزید منتخب کتب ({selectedBook.category})
                </h3>
                <p className="text-xs text-slate-500 font-simple">
                  طبیب پیڈیا لائبریری سے ملتی جلتی دیگر مستند کتب کا مطالعہ کریں
                </p>
              </div>

              <button
                type="button"
                onClick={handleBackToLibrary}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 font-simple hover:underline cursor-pointer"
              >
                تمام کتب دیکھیں ({books.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedBooks.map((relBook) => (
                <div
                  key={relBook.id}
                  onClick={() => handleSelectBook(relBook)}
                  className="group bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-22 rounded-lg overflow-hidden bg-slate-200 shrink-0 shadow-xs border border-slate-200">
                      <img
                        src={relBook.image}
                        alt={relBook.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/books/tib-e-pakistani-urdu.jpg'; }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 font-h2 leading-snug">
                        {relBook.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate font-simple">{relBook.author}</p>
                      <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-simple">
                        {relBook.pages}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-right space-y-1.5 text-xs text-slate-600">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 font-simple">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>علمی نوٹ برائے قارئین و محققین:</span>
          </h4>
          <p className="leading-relaxed font-nastaliq">
            طبیب پیڈیا کتب خانے میں شائع شدہ تمام کتب خالصتاً تعلیمی، تدریسی اور تحقیقی مقاصد (Educational Fair Use) کے لیے قارئین و اطباء کی علمی سہولت کی خاطر اکٹھی کی گئی ہیں۔ اگر کسی تصنیف کے جملہ حقوقِ اشاعت آپ کے نام محفوظ ہیں اور آپ اسے ہٹوانا چاہتے ہیں، تو ہمارے صفحۂ رابطہ پر مطلع فرمائیں۔
          </p>
        </div>

        {/* Online Embedded Reader Modal if opened from modal button */}
        {activeReaderBook && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-300">
              <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveReaderBook(null)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="بند کریں"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="text-right">
                    <h4 className="text-sm sm:text-base font-bold text-white font-simple truncate max-w-xs sm:max-w-md">
                      {activeReaderBook.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-simple">
                      مصنف: {activeReaderBook.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeReaderBook.downloadUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors font-simple"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ڈاؤن لوڈ</span>
                  </a>
                  <a
                    href={activeReaderBook.embedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="نئی ونڈو میں کھولیں"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex-1 bg-slate-100 relative">
                <iframe
                  src={activeReaderBook.embedUrl}
                  title={activeReaderBook.title}
                  className="w-full h-full border-0"
                  allow="fullscreen"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // DEFAULT VIEW: COMPLETE LIBRARY GRID VIEW
  return (
    <div className="space-y-8 text-right font-sans">
      
      {/* 1. HERO BANNER - Bright, crisp, high-contrast styling */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border border-emerald-200/90 p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-4xl space-y-4">
          
          <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>طبیب پیڈیا کتب خانہ (Digital Medical Library)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight font-h1">
            مفت طبی کتب ڈاؤن لوڈ کریں اور آن لائن پڑھیں
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-nastaliq">
            طبیب پیڈیا کے اس خصوصی کتب خانے میں طب یونانی، قانونِ مفرد اعضاء، جدید کلینیکل تشخیص، لیبارٹری گائیڈز، اور غذائی تحقیق کی <strong>مستند اور نایاب کتب</strong> اصلی سرورق کے ساتھ پی ڈی ایف فارمیٹ میں ڈاؤن لوڈ اور آن لائن مطالعہ کے لیے بلا معاوضہ پیش کی گئی ہیں۔
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs text-emerald-800">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>کل کتب: <strong>{books.length} کتب</strong></span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs text-emerald-800">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>ڈائریکٹ و مفت PDF ڈاؤن لوڈ</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-indigo-200 px-3 py-1.5 rounded-xl shadow-xs text-indigo-800">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>6 بین الاقوامی زبانوں میں</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-teal-200 px-3 py-1.5 rounded-xl shadow-xs text-teal-800">
              <Eye className="w-4 h-4 text-teal-600" />
              <span>براہِ راست آن لائن ریڈر</span>
            </span>
          </div>
        </div>

        {/* Decorative corner illustration */}
        <div className="absolute left-6 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <BookMarked className="w-64 h-64 text-emerald-900" />
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER TOOLBAR */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="کتاب کا نام، مصنف (مثلاً: صابر ملتانی)، یا موضوع تلاش کریں..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-11 pl-10 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-simple"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              title="تلاش صاف کریں"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 ml-1 font-simple hidden sm:inline">شعبہ جات:</span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? books.length 
              : books.filter(b => b.categoryEn === cat.id || b.category === cat.name).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-simple ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-102'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Count bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>دستیاب نتائج: <strong className="text-slate-800">{filteredBooks.length}</strong> کتب</span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-emerald-700 hover:text-emerald-900 font-bold transition-colors underline cursor-pointer"
            >
              فلٹرز ختم کریں
            </button>
          )}
        </div>

      </div>

      {/* 3. BOOKS GRID - 4 Columns Full Width on Large Screens */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-simple">کوئی کتاب نہیں ملی</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            آپ کے تلاش کردہ الفاظ کے مطابق کوئی کتاب دستیاب نہیں ہے۔ براہ کرم مختلف الفاظ آزمائیں یا فلٹر ختم کریں۔
          </p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            تمام کتب دکھائیں
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id || book.title}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => handleSelectBook(book)}
            >
              {/* TOP: Real Book Cover Display with 3D spine and shadow */}
              <div className="relative bg-gradient-to-b from-slate-100 via-slate-50 to-white p-5 pb-3 flex items-center justify-center border-b border-slate-100 group/cover">
                
                {/* Category Pill Tag */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-emerald-700/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs font-simple">
                    {book.category}
                  </span>
                </div>

                {/* Language Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md shadow-2xs">
                    {book.language}
                  </span>
                </div>

                {/* Book Thumbnail Container with Realistic Spine & Drop Shadow */}
                <div className="relative my-2 w-44 aspect-[3/4.2] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-slate-200 border border-slate-200/80">
                  <img
                    src={book.image}
                    alt={book.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/books/tib-e-pakistani-urdu.jpg';
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle book 3D Spine and glossy finish */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20 pointer-events-none" />
                  <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* MIDDLE: Book Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 font-h2">
                    {book.title}
                  </h3>

                  <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5 font-simple">
                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{book.author}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-nastaliq leading-relaxed line-clamp-3">
                  {book.description ? book.description.replace(/<[^>]+>/g, ' ') : ''}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-simple border-t border-slate-100">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold">
                    {book.pages}
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span>تفصیلات و مطالعہ</span>
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>

              </div>

              {/* BOTTOM: Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <a
                  href={book.downloadUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all font-simple cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ڈاؤن لوڈ PDF</span>
                </a>

                {book.embedUrl ? (
                  <button
                    type="button"
                    onClick={() => setActiveReaderBook(book)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors font-simple cursor-pointer"
                    title="آن لائن مطالعہ کریں"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>مطالعہ</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectBook(book)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors font-simple cursor-pointer"
                    title="کتاب کی تفصیلات دیکھیں"
                  >
                    <BookOpen className="w-4 h-4 text-slate-600" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 4. ONLINE EMBEDDED READER MODAL */}
      {activeReaderBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-300">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveReaderBook(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="بند کریں"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-right">
                  <h4 className="text-sm sm:text-base font-bold text-white font-simple truncate max-w-xs sm:max-w-md">
                    {activeReaderBook.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-simple">
                    مصنف: {activeReaderBook.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeReaderBook.downloadUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors font-simple"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ڈاؤن لوڈ</span>
                </a>
                <a
                  href={activeReaderBook.embedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="نئی ونڈو میں کھولیں"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Modal Frame Body */}
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={activeReaderBook.embedUrl}
                title={activeReaderBook.title}
                className="w-full h-full border-0"
                allow="fullscreen"
              />
            </div>

          </div>
        </div>
      )}

      {/* 5. LEGAL & FAIR USE NOTICE */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-right space-y-1.5 text-xs text-slate-600">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 font-simple">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>علمی نوٹ برائے قارئین و محققین:</span>
        </h4>
        <p className="leading-relaxed font-nastaliq">
          طبیب پیڈیا کتب خانے میں شائع شدہ تمام کتب خالصتاً تعلیمی، تدریسی اور تحقیقی مقاصد (Educational Fair Use) کے لیے قارئین و اطباء کی علمی سہولت کی خاطر اکٹھی کی گئی ہیں۔ اگر کسی تصنیف کے جملہ حقوقِ اشاعت آپ کے نام محفوظ ہیں اور آپ اسے ہٹوانا چاہتے ہیں، تو ہمارے صفحۂ رابطہ پر مطلع فرمائیں۔
        </p>
      </div>

    </div>
  );
}
