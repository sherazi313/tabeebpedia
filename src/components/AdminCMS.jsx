import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  Hash, 
  Edit3, 
  Trash2, 
  UploadCloud, 
  Database, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  X,
  Eye,
  Save,
  RefreshCw,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Palette,
  Type,
  Maximize2,
  Minimize2,
  ArrowRight,
  Globe,
  Lock,
  Calendar,
  Layers,
  Search,
  SlidersHorizontal,
  FolderOpen,
  Check,
  Undo,
  Redo,
  Eraser,
  Code,
  Minus,
  Paperclip,
  ChevronDown,
  BoxSelect,
  AlertTriangle,
  Info,
  Heart,
  Settings,
  Phone,
  MessageCircle,
  Share2,
  Home,
  Layout,
  Table as TableIcon,
  HelpCircle,
  Highlighter,
  Subscript,
  Superscript,
  Indent,
  Outdent,
  BookOpen,
  FileSpreadsheet,
  Music,
  CheckSquare,
  ArrowLeftRight,
  ExternalLink,
  Sliders,
  Crop,
  Move,
  CornerUpRight,
  Copy,
  Clock,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  Award,
  Building2,
  Plus,
  Loader2,
  Download,
  ArrowUp,
  ArrowDown,
  Upload
,
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  Smartphone,
  Laptop,
  Tablet,
  Radio,
  ArrowUpRight,
  LogOut
} from 'lucide-react';
import { ARTICLES, DOCTORS, CATEGORIES, SPECIALTIES } from '../data/mockData';
import { 
  fetchCategoriesApi, 
  saveCategoriesApi, 
  saveArticlesApi, 
  saveSettingsApi, 
  saveDoctorsApi, 
  uploadImageApi, 
  fetchLivePages, 
  savePagesApi, 
  fetchLiveGlossary, 
  saveGlossaryApi, 
  fetchAnalyticsApi,
  get2faSetupApi,
  changeCredentialsApi,
  revokeDevicesApi,
  logoutAdminApi
} from '../api';
import { BOOKS_DATA } from './PdfBooksLibrary';
import AdminSecurityTab from './AdminSecurityTab';

// Helper to generate clean, high-contrast HTML for PDF Books library page
export const generatePdfBooksPageHtml = (books = []) => {
  return `
    <div class="space-y-8 text-right font-sans not-prose">
      <div class="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border border-emerald-200/90 text-slate-800 shadow-xs relative overflow-hidden">
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
            <span>📚 طبیب پیڈیا کا ڈیجیٹل کتب خانہ</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight font-h1">
            مفت طبی کتب ڈاؤن لوڈ کریں اور آن لائن پڑھیں
          </h2>
          <p class="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl font-nastaliq">
            طبیب پیڈیا کے اس خصوصی کتب خانے میں طبِ یونانی، قانونِ مفرد اعضاء، جدید کلینیکل تشخیص، لیبارٹری گائیڈز اور غذائی تحقیق کی <strong>مستند اور نایاب کتب</strong> اصلی سرورق کے ساتھ پی ڈی ایف فارمیٹ میں ڈاؤن لوڈ اور آن لائن مطالعہ کے لیے بلا معاوضہ پیش کی گئی ہیں۔
          </p>
          <div class="flex flex-wrap gap-2.5 pt-2 text-xs font-bold text-slate-700">
            <span class="bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs text-emerald-800">📖 کل کتب: <strong>${books.length} کتب</strong></span>
            <span class="bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs text-emerald-800">⚡ تیز رفتار ڈائریکٹ ڈاؤن لوڈ</span>
            <span class="bg-white border border-indigo-200 px-3 py-1.5 rounded-xl shadow-xs text-indigo-800">🌐 6 مختلف بین الاقوامی زبانوں میں</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2 font-sans">
        ${books.map((b, i) => `
          <div class="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div class="relative bg-gradient-to-b from-slate-100 via-slate-50 to-white p-5 pb-3 flex items-center justify-center border-b border-slate-100">
              <div class="absolute top-3 right-3 z-10">
                <span class="bg-emerald-700/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                  ${b.category}
                </span>
              </div>
              <div class="absolute top-3 left-3 z-10">
                <span class="bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md shadow-2xs">
                  ${b.language || 'Urdu'}
                </span>
              </div>
              <div class="relative my-2 w-44 aspect-[3/4.2] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-slate-200 border border-slate-200/80">
                <img src="${b.image || '/images/books/tib-e-pakistani-urdu.jpg'}" alt="${b.title}" loading="lazy" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20 pointer-events-none"></div>
                <div class="absolute top-0 right-0 bottom-0 w-2.5 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div class="space-y-1.5">
                <h3 class="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 font-h2">
                  ${b.title}
                </h3>
                <p class="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                  <span>👤</span>
                  <span class="truncate">${b.author}</span>
                </p>
              </div>
              <p class="text-xs text-slate-600 font-nastaliq leading-relaxed line-clamp-3">
                ${b.description || ''}
              </p>
              <div class="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                <span class="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold">
                  ${b.pages || 'PDF'}
                </span>
                <span class="text-emerald-700 font-bold">PDF ایڈیشن</span>
              </div>
            </div>
            <div class="p-4 pt-0 flex items-center gap-2">
              <a href="${b.downloadUrl}" target="_blank" rel="noreferrer" download class="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer">
                <span>ڈاؤن لوڈ PDF</span>
                <span>⬇️</span>
              </a>
              ${b.embedUrl ? `
                <a href="${b.embedUrl}" target="_blank" rel="noreferrer" class="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer" title="آن لائن مطالعہ کریں">
                  <span>مطالعہ</span>
                  <span class="text-xs">👁️</span>
                </a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// Slug Generator Helper (Supports Urdu and English clean URL friendly slugs)
const generateSlugFromTitle = (title) => {
  if (!title) return '';
  return title
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^\w\u0600-\u06FF\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isCategoryMatch = (cat, targetRef) => {
  if (!cat || !targetRef) return false;
  const refStr = String(targetRef).trim().toLowerCase();
  return (
    (cat.id !== undefined && cat.id !== null && String(cat.id).trim().toLowerCase() === refStr) ||
    (cat.slug && String(cat.slug).trim().toLowerCase() === refStr) ||
    (cat.name && String(cat.name).trim().toLowerCase() === refStr)
  );
};

// Hierarchical category tree builder helper (WordPress Style)
export const buildHierarchicalCategoryTree = (categories) => {
  if (!Array.isArray(categories)) return [];

  const findParent = (cat) => {
    if (!cat.parentId) return null;
    return categories.find(p => p !== cat && isCategoryMatch(p, cat.parentId));
  };

  const topParents = categories.filter(c => !c.parentId || !findParent(c));
  const result = [];
  const visited = new Set();

  const traverse = (cat, depth) => {
    const key = cat.id || cat.slug || cat.name;
    if (visited.has(key)) return;
    visited.add(key);
    result.push({ ...cat, depth });

    const kids = categories.filter(c => c !== cat && c.parentId && isCategoryMatch(cat, c.parentId));

    kids.forEach(k => traverse(k, depth + 1));
  };

  topParents.forEach(p => traverse(p, 0));

  categories.forEach(c => {
    const key = c.id || c.slug || c.name;
    if (!visited.has(key)) {
      result.push({ ...c, depth: 0 });
    }
  });

  return result;
};

export default function AdminCMS({ 
  onBackToWebsite, 
  onAdminLogout,
  onLogout,
  initialTab = 'dashboard', 
  siteSettings, 
  setSiteSettings, 
  onViewArticle,
  articlesList: propArticlesList,
  setArticlesList: propSetArticlesList,
  doctorsList: propDoctorsList,
  setDoctorsList: propSetDoctorsList,
  pagesList: propPagesList,
  setPagesList: propSetPagesList,
  glossaryList: propGlossaryList,
  setGlossaryList: propSetGlossaryList
}) {
  const [adminTab, setAdminTab] = useState(initialTab);

  const handleLogout = async () => {
    try {
      await logoutAdminApi();
    } catch (e) {}
    try {
      sessionStorage.removeItem('tabeeb_admin_token');
      sessionStorage.removeItem('tabeeb_admin_auth');
    } catch (e) {}
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
    if (onAdminLogout) onAdminLogout();
    else if (onLogout) onLogout();
    else if (onBackToWebsite) onBackToWebsite();
  };

  const handleBackToWebsite = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
    if (onBackToWebsite) onBackToWebsite();
  };

  // Real-Time Visitor & Page Views Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all'

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const data = await fetchAnalyticsApi();
      if (data) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.warn('Analytics fetch notice:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(() => {
      if (adminTab === 'dashboard') {
        loadAnalytics();
      }
    }, 20000); // Live poll every 20 seconds
    return () => clearInterval(interval);
  }, [adminTab]);
  const [settingsSubTab, setSettingsSubTab] = useState('general');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showBgPalette, setShowBgPalette] = useState(false);
  const [showPageColorPalette, setShowPageColorPalette] = useState(false);
  const [showPageBgPalette, setShowPageBgPalette] = useState(false);

  // Glossary Management State
  const [glossaryList, setGlossaryList] = useState(() => {
    if (propGlossaryList && Array.isArray(propGlossaryList) && propGlossaryList.length > 0) {
      return propGlossaryList;
    }
    try {
      const saved = localStorage.getItem('tabeeb_glossary_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return [];
  });

  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryLetterFilter, setGlossaryLetterFilter] = useState('all');
  const [editingGlossaryTerm, setEditingGlossaryTerm] = useState(null);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const [glossaryForm, setGlossaryForm] = useState({
    term: '',
    slug: '',
    shortDefinition: '',
    content: ''
  });

  useEffect(() => {
    if (propGlossaryList && Array.isArray(propGlossaryList) && propGlossaryList.length > 0) {
      setGlossaryList(propGlossaryList);
    }
  }, [propGlossaryList]);

  const updateAndSaveGlossary = (newList) => {
    setGlossaryList(newList);
    if (propSetGlossaryList) {
      propSetGlossaryList(newList);
    }
    try {
      localStorage.setItem('tabeeb_glossary_data_v1', JSON.stringify(newList));
    } catch(e) {}
    saveGlossaryApi(newList);
  };

  const RICH_COLORS = [
    { name: 'سفید', hex: '#ffffff' },
    { name: 'ہلکا سرمئی', hex: '#cbd5e1' },
    { name: 'گہرا سرمئی', hex: '#64748b' },
    { name: 'کالا', hex: '#0f172a' },
    { name: 'زمردی سبز', hex: '#10b981' },
    { name: 'گہرا سبز', hex: '#047857' },
    { name: 'ہلکا نیلا', hex: '#38bdf8' },
    { name: 'شاہی نیلا', hex: '#2563eb' },
    { name: 'گہرا نیلا', hex: '#1e3a8a' },
    { name: 'سرخ / لال', hex: '#ef4444' },
    { name: 'گہرا سرخ', hex: '#b91c1c' },
    { name: 'نارنجی', hex: '#f97316' },
    { name: 'سنہری پیلا', hex: '#eab308' },
    { name: 'امبری پیلا', hex: '#f59e0b' },
    { name: 'جامنی', hex: '#a855f7' },
    { name: 'گلابی', hex: '#ec4899' },
    { name: 'ٹیل سبز', hex: '#14b8a6' },
    { name: 'زیتونی', hex: '#84cc16' },
  ];

  const [categoriesList, setCategoriesList] = useState(() => {
    const parentId = 'herbs-intro';
    
    // Complete Urdu Alphabet Categories (آ تا ی)
    const allUrduAlphabetCats = [
      { id: 'cat-a-madd', name: '( آ )', slug: 'alif-madda-wp', parentId },
      { id: 'cat-alif', name: '( ا )', slug: 'alif-wp', parentId },
      { id: 'cat-bay', name: '( ب )', slug: 'bay-wp', parentId },
      { id: 'cat-pay', name: '( پ )', slug: 'pay-wp', parentId },
      { id: 'cat-tay', name: '( ت )', slug: 'tay-wp', parentId },
      { id: 'cat-ttay', name: '( ٹ )', slug: 'ttay-wp', parentId },
      { id: 'cat-say', name: '( ث )', slug: 'say-wp', parentId },
      { id: 'cat-jeem', name: '( ج )', slug: 'jeem-wp', parentId },
      { id: 'cat-chay', name: '( چ )', slug: 'chay-wp', parentId },
      { id: 'cat-hay', name: '( ح )', slug: 'hay-wp', parentId },
      { id: 'cat-khay', name: '( خ )', slug: 'khay-wp', parentId },
      { id: 'cat-daal', name: '( د )', slug: 'daal-wp', parentId },
      { id: 'cat-ddaal', name: '( ڈ )', slug: 'ddaal-wp', parentId },
      { id: 'cat-zaal', name: '( ذ )', slug: 'zaal-wp', parentId },
      { id: 'cat-ray', name: '( ر )', slug: 'ray-wp', parentId },
      { id: 'cat-rray', name: '( ڑ )', slug: 'rray-wp', parentId },
      { id: 'cat-zay', name: '( ز )', slug: 'zay-wp', parentId },
      { id: 'cat-zhay', name: '( ژ )', slug: 'zhay-wp', parentId },
      { id: 'cat-seen', name: '( س )', slug: 'seen-wp', parentId },
      { id: 'cat-sheen', name: '( ش )', slug: 'sheen-wp', parentId },
      { id: 'cat-suad', name: '( ص )', slug: 'suad-wp', parentId },
      { id: 'cat-zuad', name: '( ض )', slug: 'zuad-wp', parentId },
      { id: 'cat-toe', name: '( ط )', slug: 'toe-wp', parentId },
      { id: 'cat-zoe', name: '( ظ )', slug: 'zoe-wp', parentId },
      { id: 'cat-ain', name: '( ع )', slug: 'ain-wp', parentId },
      { id: 'cat-ghain', name: '( غ )', slug: 'ghain-wp', parentId },
      { id: 'cat-fay', name: '( ف )', slug: 'fay-wp', parentId },
      { id: 'cat-qaaf', name: '( ق )', slug: 'qaaf-wp', parentId },
      { id: 'cat-kaaf', name: '( ک )', slug: 'kaaf-wp', parentId },
      { id: 'cat-gaaf', name: '( گ )', slug: 'gaaf-wp', parentId },
      { id: 'cat-laam', name: '( ل )', slug: 'laam-wp', parentId },
      { id: 'cat-meem', name: '( م )', slug: 'meem-wp', parentId },
      { id: 'cat-noon', name: '( ن )', slug: 'noon-wp', parentId },
      { id: 'cat-wao', name: '( و )', slug: 'wao-wp', parentId },
      { id: 'cat-gol-hay', name: '( ہ )', slug: 'gol-hay-wp', parentId },
      { id: 'cat-do-chashmi-hay', name: '( ھ )', slug: 'do-chashmi-hay-wp', parentId },
      { id: 'cat-hamza', name: '( ء )', slug: 'hamza-wp', parentId },
      { id: 'cat-yay', name: '( ی )', slug: 'yay-wp', parentId }
    ];

    // Complete English Alphabet Categories (A to Z) under Herbs English Alphabetical Order
    const allEnglishAlphabetCats = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
      id: `cat-en-${letter.toLowerCase()}`,
      name: letter,
      slug: letter.toLowerCase(),
      parentId: 'herbs-english-alphabetical-order'
    }));

    // Herbs classification
    const herbClassifications = [
      { id: 'ghazayein', name: 'غذائیں', slug: 'ghazayein', parentId: 'herbs-intro' },
      { id: 'phal', name: 'پھل', slug: 'phal', parentId: 'herbs-intro' },
      { id: 'zahreeli-bootiyan', name: 'زہریلی بوٹیاں', slug: 'zahreeli-bootiyan', parentId: 'herbs-intro' },
      { id: 'animals', name: 'Animals', slug: 'animals', parentId: 'herbs-intro' },
    ];

    // Base Top-Level Categories (Exact WordPress Match)
    const baseCats = [
      { id: 'chemicals', name: 'کیمیکلز', slug: 'chemicals', parentId: null },
      { id: 'mukhtalif-tariqay', name: 'مختلف طریقہ ہائے علاج', slug: 'mukhtalif-tariqay', parentId: null },
      { id: 'mizaj', name: 'مزاج', slug: 'mizaj', parentId: null },
      { id: 'mazameen', name: 'مضامین', slug: 'mazameen', parentId: null },
      { id: 'herbs-intro', name: 'جڑی بوٹیوں کا تعارف', slug: 'herbs-intro', parentId: null },
      { id: 'herbs-english-alphabetical-order', name: 'Herbs English Alphabetical Order', slug: 'herbs-english-alphabetical-order', parentId: null },
      { id: 'qanoon-mufrad-aza', name: 'قانون مفرد اعضاء', slug: 'qanoon-mufrad-aza', parentId: null },
      { id: 'tibb-unani', name: 'طب یونانی و نبوی', slug: 'tibb-unani', parentId: null },
      { id: 'remedies', name: 'گھریلو علاج و مجربات', slug: 'remedies', parentId: null },
      { id: 'diet-chart', name: 'غذائی چارٹ و پرہیز', slug: 'diet-chart', parentId: null },
      { id: 'research', name: 'جدید طبی و سائنسی تحقیقات', slug: 'research', parentId: null },
      { id: 'uncategorized', name: 'Uncategorized', slug: 'uncategorized', parentId: null },
    ];

    // Sub-Categories under مزاج (Exactly two sub-categories)
    const mizajSubCats = [
      { id: 'mizaj-tibb-pakistani', name: 'مزاج طب پاکستانی', slug: 'mizaj-tibb-pakistani', parentId: 'mizaj' },
      { id: 'mizaj-tibb-unani', name: 'مزاج طب یونانی', slug: 'mizaj-tibb-unani', parentId: 'mizaj' },
    ];

    // Sub-categories under مزاج طب پاکستانی (Exactly these 6)
    const mizajPakistaniCats = [
      { id: 'asabi-azlati', name: 'اعصابی عضلاتی', slug: 'asabi-azlati', parentId: 'mizaj-tibb-pakistani' },
      { id: 'azlati-asabi', name: 'عضلاتی اعصابی', slug: 'azlati-asabi', parentId: 'mizaj-tibb-pakistani' },
      { id: 'azlati-ghudi', name: 'عضلاتی غدی', slug: 'azlati-ghudi', parentId: 'mizaj-tibb-pakistani' },
      { id: 'ghudi-azlati', name: 'غدی عضلاتی', slug: 'ghudi-azlati', parentId: 'mizaj-tibb-pakistani' },
      { id: 'ghudi-asabi', name: 'غدی اعصابی', slug: 'ghudi-asabi', parentId: 'mizaj-tibb-pakistani' },
      { id: 'asabi-ghudi', name: 'اعصابی غدی', slug: 'asabi-ghudi', parentId: 'mizaj-tibb-pakistani' },
    ];

    // Sub-categories under مزاج طب یونانی (Exactly these 6)
    const mizajUnaniCats = [
      { id: 'tar-sard', name: 'تر سرد', slug: 'tar-sard', parentId: 'mizaj-tibb-unani' },
      { id: 'khushk-sard', name: 'خشک سرد', slug: 'khushk-sard', parentId: 'mizaj-tibb-unani' },
      { id: 'khushk-garm', name: 'خشک گرم', slug: 'khushk-garm', parentId: 'mizaj-tibb-unani' },
      { id: 'garm-khushk', name: 'گرم خشک', slug: 'garm-khushk', parentId: 'mizaj-tibb-unani' },
      { id: 'garm-tar', name: 'گرم تر', slug: 'garm-tar', parentId: 'mizaj-tibb-unani' },
      { id: 'tar-garm', name: 'تر گرم', slug: 'tar-garm', parentId: 'mizaj-tibb-unani' },
    ];

    // Degrees of Mizaj (under qanoon-mufrad-aza)
    const darajatCats = [
      { id: 'mizaj-1', name: 'مزاج درجہ اول', slug: 'mizaj-1', parentId: 'qanoon-mufrad-aza' },
      { id: 'mizaj-2', name: 'مزاج درجہ دوم', slug: 'mizaj-2', parentId: 'qanoon-mufrad-aza' },
      { id: 'mizaj-3', name: 'مزاج درجہ سوم', slug: 'mizaj-3', parentId: 'qanoon-mufrad-aza' },
      { id: 'mizaj-4', name: 'مزاج درجہ چہارم', slug: 'mizaj-4', parentId: 'qanoon-mufrad-aza' },
    ];

    // Tibb Unani Sub-categories
    const tibbUnaniCats = [
      { id: 'tibbi-maloomat', name: 'طبی معلومات', slug: 'tibbi-maloomat', parentId: 'tibb-unani' },
      { id: 'nuskha-jaat', name: 'نسخہ جات', slug: 'nuskha-jaat', parentId: 'tibb-unani' },
      { id: 'asool-e-ilaaj', name: 'اصول علاج', slug: 'asool-e-ilaaj', parentId: 'tibb-unani' },
      { id: 'tibbi-istilahat', name: 'طبی اصطلاحات', slug: 'tibbi-istilahat', parentId: 'tibb-unani' },
      { id: 'pdf-books', name: 'PDF Books', slug: 'pdf-books', parentId: 'tibb-unani' },
    ];

    const allSeeds = [
      ...baseCats,
      ...mizajSubCats,
      ...mizajPakistaniCats,
      ...mizajUnaniCats,
      ...darajatCats,
      ...allUrduAlphabetCats,
      ...allEnglishAlphabetCats,
      ...herbClassifications,
      ...tibbUnaniCats
    ];

    try {
      const saved = localStorage.getItem('tabeeb_categories');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch(e) {}

    try { localStorage.setItem('tabeeb_categories', JSON.stringify(allSeeds)); } catch(e) {}
    return allSeeds;
  });
  const [tagsList, setTagsList] = useState(() => { try { return JSON.parse(localStorage.getItem('tabeeb_tags')) || [{id:1, name:'عضلاتی غدی', slug:'azlati-ghudi'}]; } catch(e) { return [{id:1, name:'عضلاتی غدی', slug:'azlati-ghudi'}]; } });
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', slug: '', parentId: '' });
  const [categorySearchMeta, setCategorySearchMeta] = useState('');

  const hierarchicalCategories = useMemo(() => {
    return buildHierarchicalCategoryTree(categoriesList);
  }, [categoriesList]);
  // Media Library State
  const [mediaList, setMediaList] = useState(() => {
    try {
      const saved = localStorage.getItem('tabeeb_media_library');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    const extracted = [];
    const seenUrls = new Set();
    ARTICLES.forEach(art => {
      if (art.featuredImage && !seenUrls.has(art.featuredImage)) {
        seenUrls.add(art.featuredImage);
        extracted.push({
          id: 'media-' + Math.random().toString(36).substr(2, 9),
          url: art.featuredImage,
          name: (art.slug || 'article-image') + '.jpg',
          date: '2026/09/25',
          attachedTo: art.title,
          articleId: art.id
        });
      }
    });
    return extracted;
  });
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all', 'attached', 'unattached'
  const [mediaSearch, setMediaSearch] = useState('');

  // Pages State
  const [internalPagesList, setInternalPagesList] = useState(() => {
    try {
      const saved = localStorage.getItem('tabeeb_pages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return [];
  });
  const pagesList = propPagesList || internalPagesList;
  const setPagesList = propSetPagesList || setInternalPagesList;
  const [pageForm, setPageForm] = useState(null); // null or { id, title, slug, content, status }

  useEffect(() => {
    const loadPagesFromDb = async () => {
      try {
        if (!pagesList || pagesList.length === 0) {
          const data = await fetchLivePages();
          if (Array.isArray(data) && data.length > 0) {
            setPagesList(data);
          }
        }
      } catch (e) {}
    };
    loadPagesFromDb();
  }, []);

  useEffect(() => {
    localStorage.setItem('tabeeb_media_library', JSON.stringify(mediaList));
  }, [mediaList]);

  useEffect(() => {
    if (pagesList && pagesList.length > 0) {
      try {
        localStorage.setItem('tabeeb_pages', JSON.stringify(pagesList));
      } catch (e) {}
      savePagesApi(pagesList);
    }
  }, [pagesList]);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const newMedia = {
          id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          url: uploadEvent.target.result,
          name: file.name,
          date: '2026/09/25',
          attachedTo: null
        };
        setMediaList(prev => [newMedia, ...prev]);
      };
      reader.readAsDataURL(file);
    });
    showNotification('تصاویر کامیابی کے ساتھ میڈیا لائبریری میں شامل کر دی گئیں!');
  };

  const handleDeleteSingleMedia = (id) => {
    if (window.confirm('کیا آپ واقعی یہ تصویر میڈیا لائبریری سے ڈیلیٹ کرنا چاہتے ہیں؟')) {
      setMediaList(prev => prev.filter(m => m.id !== id));
      setSelectedMediaIds(prev => prev.filter(item => item !== id));
      showNotification('تصویر ڈیلیٹ کر دی گئی');
    }
  };

  const handleBulkDeleteMedia = () => {
    if (selectedMediaIds.length === 0) return;
    if (window.confirm(`کیا آپ واقعی تمام منتخب شدہ ${selectedMediaIds.length} تصاویر ڈیلیٹ کرنا چاہتے ہیں؟`)) {
      setMediaList(prev => prev.filter(m => !selectedMediaIds.includes(m.id)));
      setSelectedMediaIds([]);
      showNotification('منتخب تصاویر ڈیلیٹ کر دی گئیں');
    }
  };

  const [tagForm, setTagForm] = useState({ id: null, name: '', slug: '' });

  // Load categories from permanent database file on mount
  useEffect(() => {
    const loadCategoriesFromDb = async () => {
      try {
        const data = await fetchCategoriesApi();
        if (Array.isArray(data) && data.length > 0) {
          setCategoriesList(data);
        }
      } catch (e) {}
    };
    loadCategoriesFromDb();
  }, []);

  // Sync changes directly to permanent database file / API
  useEffect(() => {
    localStorage.setItem('tabeeb_categories', JSON.stringify(categoriesList));
    saveCategoriesApi(categoriesList);
  }, [categoriesList]);

  useEffect(() => { localStorage.setItem('tabeeb_tags', JSON.stringify(tagsList)); }, [tagsList]);

  const [internalArticlesList, setInternalArticlesList] = useState(ARTICLES);
  const articlesList = propArticlesList || internalArticlesList;
  const setArticlesList = propSetArticlesList || setInternalArticlesList;

  // Sync articles directly to permanent database file / API
  useEffect(() => {
    if (articlesList && articlesList.length > 0) {
      saveArticlesApi(articlesList);
    }
  }, [articlesList]);

  const [internalDoctorsList, setInternalDoctorsList] = useState([]);
  const doctorsList = propDoctorsList || internalDoctorsList;
  const setDoctorsList = propSetDoctorsList || setInternalDoctorsList;


  // Sync settings directly to permanent database file / API
  useEffect(() => {
    if (siteSettings) {
      localStorage.setItem('tabeeb_site_settings_v1', JSON.stringify(siteSettings));
      saveSettingsApi(siteSettings);
      setSettingsForm(prev => ({ ...prev, ...siteSettings }));
    }
  }, [siteSettings]);

  // Search & Filter in Articles table
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedArticleIds, setSelectedArticleIds] = useState([]);

  // WordPress-style Pagination for Articles Table (Default 20, selectable 50, 100)
  const [postsPerPage, setPostsPerPage] = useState(() => {
    try {
      const saved = localStorage.getItem('tabeeb_admin_posts_per_page');
      return saved ? parseInt(saved, 10) : 20;
    } catch {
      return 20;
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [postSortOrder, setPostSortOrder] = useState('latest'); // 'latest' | 'oldest'

  // Reset to page 1 when search, status filter, postsPerPage or sort order changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, statusFilter, postsPerPage, postSortOrder]);

  // Doctor Approvals & Management States
  const [doctorTabFilter, setDoctorTabFilter] = useState('all'); // 'all', 'pending', 'approved'
  const [doctorSearchFilter, setDoctorSearchFilter] = useState('');
  const [doctorVerifiedFilter, setDoctorVerifiedFilter] = useState('all'); // 'all', 'verified', 'unverified'
  const [doctorFeaturedFilter, setDoctorFeaturedFilter] = useState('all'); // 'all', 'featured', 'standard'
  const [doctorCityFilter, setDoctorCityFilter] = useState('all');
  const [doctorSortOrder, setDoctorSortOrder] = useState('latest'); // 'latest' | 'oldest' | 'name' | 'exp'

  // WordPress-style Pagination for Doctors Table (Default 20, selectable 50, 100, all)
  const [doctorsPerPage, setDoctorsPerPage] = useState(() => {
    try {
      const saved = localStorage.getItem('tabeeb_admin_doctors_per_page');
      if (saved === 'all') return 'all';
      return saved ? parseInt(saved, 10) : 20;
    } catch {
      return 20;
    }
  });
  const [doctorCurrentPage, setDoctorCurrentPage] = useState(1);

  // Reset to page 1 when doctor filters change
  useEffect(() => {
    setDoctorCurrentPage(1);
  }, [
    doctorTabFilter,
    doctorSearchFilter,
    doctorVerifiedFilter,
    doctorFeaturedFilter,
    doctorCityFilter,
    doctorSortOrder,
    doctorsPerPage
  ]);

  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [doctorForm, setDoctorForm] = useState(null);
  const [doctorEditTab, setDoctorEditTab] = useState('basic');
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  const [newServiceInput, setNewServiceInput] = useState('');
  const [newConditionInput, setNewConditionInput] = useState('');
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const adminDoctorGalleryFileRef = useRef(null);
  const [isAdminUploadingGallery, setIsAdminUploadingGallery] = useState(false);

  const handleAdminDoctorGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsAdminUploadingGallery(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadImageApi(file);
        if (url) uploadedUrls.push(url);
      }
      if (uploadedUrls.length > 0) {
        setDoctorForm(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...uploadedUrls]
        }));
        showNotification(`${uploadedUrls.length} تصویر/تصاویر کامیابی سے شامل ہو گئیں`);
      }
    } catch (err) {
      console.error(err);
      showNotification('تصویر اپلوڈ کرنے میں مسئلہ آیا');
    } finally {
      setIsAdminUploadingGallery(false);
      if (adminDoctorGalleryFileRef.current) adminDoctorGalleryFileRef.current.value = '';
    }
  };

  const adminDoctorAvatarFileRef = useRef(null);
  const [isAdminUploadingAvatar, setIsAdminUploadingAvatar] = useState(false);

  const handleAdminDoctorAvatarUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setIsAdminUploadingAvatar(true);
    try {
      const url = await uploadImageApi(file);
      if (url) {
        setDoctorForm(prev => ({ ...prev, image: url }));
        showNotification('طبیب کی پروفائل تصویر کامیابی سے اپلوڈ ہو گئی!');
      }
    } catch (err) {
      console.error(err);
      showNotification('تصویر اپلوڈ کرنے میں مسئلہ آیا');
    } finally {
      setIsAdminUploadingAvatar(false);
      if (adminDoctorAvatarFileRef.current) adminDoctorAvatarFileRef.current.value = '';
    }
  };

  const [newEduForm, setNewEduForm] = useState({ degree: '', institute: '', year: '' });
  const [newExpForm, setNewExpForm] = useState({ companyName: '', jobTitle: '', duration: '', description: '' });
  const [newAwardForm, setNewAwardForm] = useState({ title: '', year: '' });
  const [passwordRequests, setPasswordRequests] = useState([]);
  
  useEffect(() => {
    try {
      const reqs = JSON.parse(localStorage.getItem('tabeeb_password_requests') || '[]');
      setPasswordRequests(reqs);
    } catch(err) {}
  }, [adminTab]);
  
  const handleClearPasswordRequest = (id) => {
    try {
      const updated = passwordRequests.filter(r => r.id !== id);
      localStorage.setItem('tabeeb_password_requests', JSON.stringify(updated));
      setPasswordRequests(updated);
    } catch(err) {}
  };

  // Quick Draft State (WordPress Style)
  const [quickDraftTitle, setQuickDraftTitle] = useState('');
  const [quickDraftContent, setQuickDraftContent] = useState('');

  const handleSaveQuickDraft = (e) => {
    e.preventDefault();
    if (!quickDraftTitle.trim()) {
      showNotification('براہ کرم ڈرافٹ کا عنوان درج کریں');
      return;
    }
    const newDraft = {
      id: Date.now(),
      title: quickDraftTitle.trim(),
      slug: generateSlugFromTitle(quickDraftTitle.trim()),
      content: quickDraftContent ? `<p>${quickDraftContent.replace(/\n/g, '<br/>')}</p>` : '<p></p>',
      excerpt: quickDraftContent ? quickDraftContent.slice(0, 150) : '',
      author: 'syed abdul wahab shah',
      categories: ['غیر زمرہ بند (Uncategorized)'],
      category: 'غیر زمرہ بند (Uncategorized)',
      tags: [],
      featuredImage: siteSettings?.defaultArticleImage || '',
      status: 'private',
      date: new Date().toISOString().split('T')[0],
      publishedAt: new Date().toISOString().split('T')[0],
      readingTime: '2 منٹ'
    };
    const updated = [newDraft, ...articlesList];
    setArticlesList(updated);
    saveArticlesApi(updated);
    setQuickDraftTitle('');
    setQuickDraftContent('');
    showNotification('ڈرافٹ کامیابی کے ساتھ محفوظ ہو گیا!');
  };

  // Editing state
  const [editingArticleId, setEditingArticleId] = useState(null);

  // Permalink Edit Mode States
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState('');

  // Article Form State
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    category: 'tibb-unani',
    status: 'published', // 'published', 'private'
    excerpt: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    imageType: 'url', // 'url' or 'upload'
    tags: 'طب یونانی, جڑی بوٹیاں, صحت',
    author: 'حکیم محمد طارق محمود',
    readingTime: '5 منٹ',
  });

  // Editor styling states
  const [editorFont, setEditorFont] = useState('nastaliq');
  const [editorFontSize, setEditorFontSize] = useState('14px');
  const [editorMode, setEditorMode] = useState('visual'); // 'visual', 'code', 'preview'
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
  const [isFocusMode, setIsFocusMode] = useState(false);
  const autoSaveTimerRef = useRef(null);
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (adminTab !== 'new-article') return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const draftContent = editorMode === 'visual' && visualEditorRef.current 
          ? visualEditorRef.current.innerHTML 
          : articleForm.content;
        const draft = { ...articleForm, content: draftContent, savedAt: new Date().toISOString() };
        localStorage.setItem('tabeeb_article_draft', JSON.stringify(draft));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2500);
      } catch(e) { setAutoSaveStatus(''); }
    }, 30000);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [articleForm, adminTab]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Interactive Selected Image State (Clicked Inside Editor Canvas)
  const [selectedImgElement, setSelectedImgElement] = useState(null);
  const [selectedImgProps, setSelectedImgProps] = useState({
    src: '',
    alt: '',
    widthPercent: 100,
    align: 'center', // 'center', 'right', 'left', 'full'
    borderRadius: '16px',
    border: 'none',
    caption: ''
  });

  // Modals & Menus
  const [showBoxMenu, setShowBoxMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showSpecialChars, setShowSpecialChars] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [activeMenuDropdown, setActiveMenuDropdown] = useState(null); // 'file', 'edit', 'view', 'insert', 'format', 'tools', 'table'

  // Find & Replace state
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');

  // Media Modal state
  const [mediaTab, setMediaTab] = useState('upload'); // 'upload', 'url', 'library'
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaAlignment, setMediaAlignment] = useState('center'); // 'center', 'right', 'left', 'full'
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaWidth, setMediaWidth] = useState('100%');

  // WordPress Sidebar State (Tags & Categories)
  const [tagInput, setTagInput] = useState('');
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  // availableCategories synced with categoriesList

  // Form Modal state
  const [formType, setFormType] = useState('consultation'); // 'consultation', 'order', 'question'

  // Word count & stats
  const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 1 });

  // Live Active Format Detection for Toolbar Highlight
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    heading: 'p', // 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote'
    align: 'right', // 'right', 'center', 'left', 'justify'
    ul: false,
    ol: false,
    subscript: false,
    superscript: false
  });

  // Site Settings Form State
  
  // Admin Username & Password Management State
  const [credentialsForm, setCredentialsForm] = useState(() => ({
    currentPassword: '',
    username: (typeof window !== 'undefined' && localStorage.getItem('tabeeb_admin_custom_username')) || 'sherazi313',
    newPassword: '',
    confirmPassword: ''
  }));
  const [passwordStatusMsg, setPasswordStatusMsg] = useState({ type: '', text: '' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Admin Recovery Emails State
  const [adminRecoveryEmails, setAdminRecoveryEmails] = useState(() => {
    return siteSettings?.adminRecoveryEmails || (typeof localStorage !== 'undefined' ? localStorage.getItem('tabeeb_admin_recovery_emails') : null) || 'sherazi313@gmail.com, nukta313@gmail.com';
  });
  const [recoveryEmailMsg, setRecoveryEmailMsg] = useState('');

  const handleSaveRecoveryEmails = async () => {
    const cleanEmails = adminRecoveryEmails.trim();
    try {
      localStorage.setItem('tabeeb_admin_recovery_emails', cleanEmails);
      const updatedSettings = {
        ...(siteSettings || {}),
        adminRecoveryEmails: cleanEmails
      };
      if (setSiteSettings) {
        setSiteSettings(updatedSettings);
      }
      await saveSettingsApi(updatedSettings);
      setRecoveryEmailMsg('ریکوری ای میل ایڈریسز کامیابی کے ساتھ محفوظ ہو گئے!');
      showNotification('ریکوری ای میل ایڈریسز کامیابی سے محفوظ ہو گئے!');
      setTimeout(() => setRecoveryEmailMsg(''), 4000);
    } catch (err) {
      setRecoveryEmailMsg('ای میلز محفوظ کرنے میں خرابی پیش آئی۔');
    }
  };

  const handleChangeAdminCredentials = (e) => {
    e.preventDefault();
    const currentStoredPassword = localStorage.getItem('tabeeb_admin_custom_password') || '5903911a';
    
    if (credentialsForm.currentPassword !== currentStoredPassword) {
      setPasswordStatusMsg({ type: 'error', text: 'موجودہ پاس ورڈ درست نہیں ہے۔ تصدیق کے لیے درست پاس ورڈ درج کریں۔' });
      return;
    }

    const trimmedUser = credentialsForm.username.trim();
    if (!trimmedUser || trimmedUser.length < 3) {
      setPasswordStatusMsg({ type: 'error', text: 'یوزر نیم کم از کم 3 حروف پر مشتمل ہونا چاہیے۔' });
      return;
    }

    if (credentialsForm.newPassword) {
      if (credentialsForm.newPassword.length < 6) {
        setPasswordStatusMsg({ type: 'error', text: 'نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔' });
        return;
      }
      if (credentialsForm.newPassword !== credentialsForm.confirmPassword) {
        setPasswordStatusMsg({ type: 'error', text: 'نیا پاس ورڈ اور تصدیقی پاس ورڈ ایک جیسے نہیں ہیں۔' });
        return;
      }
    }

    try {
      localStorage.setItem('tabeeb_admin_custom_username', trimmedUser);
      if (credentialsForm.newPassword) {
        localStorage.setItem('tabeeb_admin_custom_password', credentialsForm.newPassword);
      }
      setPasswordStatusMsg({ type: 'success', text: 'ایڈمن یوزر نیم اور پاس ورڈ کامیابی کے ساتھ اپ ڈیٹ کر دیا گیا ہے!' });
      setCredentialsForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      showNotification('ایڈمن لاگ ان کوائف کامیابی سے تبدیل ہو گئے!');
    } catch (err) {
      setPasswordStatusMsg({ type: 'error', text: 'کوائف محفوظ کرنے میں خرابی پیش آئی۔' });
    }
  };

  const [settingsForm, setSettingsForm] = useState(siteSettings || {
    siteName: 'طبیب پیڈیا',
    tagline: 'جامع ہربل و طبی انسائیکلوپیڈیا',
    logoUrl: '',
      faviconUrl: '',
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
    youtubeUrl: 'https://youtube.com/tabeebpedia',
    metaTitle: 'طبیب پیڈیا - طب یونانی، قانون مفرد اعضاء اور اطباء ڈائریکٹری',
    metaDescription: 'طبیب پیڈیا: پاکستان کی سب سے بڑی اور مستند طب یونانی، جڑی بوٹیاں اور اطباء و ڈاکٹرز ڈائریکٹری۔',
    sidebarAdEnabled: true,
    sidebarAdImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    sidebarAdTitle: 'طبی مشورہ اور رہنمائی',
    sidebarAdSubtitle: 'مستند اور ماہر اطباء سے آن لائن رہنمائی اور نسخہ جات حاصل کریں۔',
    sidebarAdLink: 'https://wa.me/923001234567',
    sidebarAdButtonText: 'ابھی رابطہ کریں',
    sidebarShowSearch: true,
    sidebarShowCategories: true,
    sidebarShowRecent: true,
    sidebarShowConsultation: true,
    sidebarShowCategoriesDropdown: true,
    sidebarShowPagesDropdown: true,
    pageSidebarShowPagesList: true,
    pageSidebarShowRecentPosts: true,
    pageSidebarShowDoctors: true,
    pageSidebarShowCategories: true,
    pageSidebarShowHelpline: true,
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
  });

  const visualEditorRef = useRef(null);
  const pageVisualEditorRef = useRef(null);
  // Handle Featured Image Upload from Computer for Page
  const handlePageFeaturedImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPageForm(prev => ({ ...prev, featuredImage: uploadEvent.target.result }));
        showNotification('صفحے کی نمایاں تصویر کامیابی سے اپلوڈ ہو گئی!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Execute Page Formatting Commands
  const execPageCmd = (command, value = null) => {
    if (pageEditorMode !== 'visual') return;
    if (pageVisualEditorRef.current) {
      pageVisualEditorRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (pageVisualEditorRef.current) {
      setPageForm(prev => ({ ...prev, content: pageVisualEditorRef.current.innerHTML }));
    }
  };

  // Handle Inline Image Upload into Page Content
  const handlePageInlineImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        execPageCmd('insertHTML', `<img src="${uploadEvent.target.result}" alt="" style="max-width:100%; border-radius:1rem; margin:1rem auto; display:block;" />`);
        showNotification('تصویر صفحے کے اندر کامیابی سے شامل ہو گئی!');
      };
      reader.readAsDataURL(file);
    }
  };

  const [pageEditorMode, setPageEditorMode] = useState('visual'); // 'visual', 'code', 'preview'
  const [pageEditorFont, setPageEditorFont] = useState('nastaliq');
  const [pageEditorFontSize, setPageEditorFontSize] = useState('16px');
  const [editingPageId, setEditingPageId] = useState(null);
  const [isEditingPageSlug, setIsEditingPageSlug] = useState(false);
  const [tempPageSlug, setTempPageSlug] = useState('');

  // Dedicated PDF Books Management Studio State
  const [pdfBooksList, setPdfBooksList] = useState(() => {
    try {
      const local = localStorage.getItem('tabeeb_pdf_books');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return BOOKS_DATA;
  });

  const [editingBookIndex, setEditingBookIndex] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookModalForm, setBookModalForm] = useState({
    title: '',
    author: 'حکیم سید عبدالوہاب شاہ شیرازی',
    category: 'قانون مفرد اعضاء',
    categoryEn: 'qanoon',
    language: 'Urdu',
    pages: 'مختصر و جامع',
    description: '',
    image: '/images/books/tib-e-pakistani-urdu.jpg',
    downloadUrl: '',
    embedUrl: ''
  });
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('all');
  const [pdfEditorSubTab, setPdfEditorSubTab] = useState('studio'); // 'studio', 'html'

  // Load latest live books from /api/pdf-books or /data/pdf-books.json
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/pdf-books');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPdfBooksList(data);
            try { localStorage.setItem('tabeeb_pdf_books', JSON.stringify(data)); } catch(e) {}
            return;
          }
        }
      } catch(e) {}
      try {
        const res2 = await fetch('/data/pdf-books.json');
        if (res2.ok) {
          const data2 = await res2.json();
          if (Array.isArray(data2) && data2.length > 0) {
            setPdfBooksList(data2);
            try { localStorage.setItem('tabeeb_pdf_books', JSON.stringify(data2)); } catch(e) {}
          }
        }
      } catch(e) {}
    };
    fetchBooks();
  }, []);

  const handleSavePdfBooksList = async (newList) => {
    setPdfBooksList(newList);
    try {
      localStorage.setItem('tabeeb_pdf_books', JSON.stringify(newList));
    } catch(e) {}
    try {
      await fetch('/api/pdf-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch(e) {}

    const generatedHtml = generatePdfBooksPageHtml(newList);
    setPageForm(prev => ({
      ...prev,
      content: generatedHtml
    }));

    setPagesList(prev => prev.map(p => {
      if (p.slug === 'pdf-books' || String(p.id) === '8339') {
        return { ...p, content: generatedHtml };
      }
      return p;
    }));
  };

  const handleOpenAddBook = () => {
    setEditingBookIndex(null);
    setBookModalForm({
      title: '',
      author: 'حکیم سید عبدالوہاب شاہ شیرازی',
      category: 'قانون مفرد اعضاء',
      categoryEn: 'qanoon',
      language: 'Urdu',
      pages: 'مختصر و جامع',
      description: '',
      image: '/images/books/tib-e-pakistani-urdu.jpg',
      downloadUrl: '',
      embedUrl: ''
    });
    setShowBookModal(true);
  };

  const handleOpenEditBook = (book, index) => {
    setEditingBookIndex(index);
    setBookModalForm({
      ...book,
      image: book.image || '/images/books/tib-e-pakistani-urdu.jpg'
    });
    setShowBookModal(true);
  };

  const handleSaveBookModal = () => {
    if (!bookModalForm.title?.trim()) {
      alert('براہ کرم کتاب کا عنوان درج فرمائیں۔');
      return;
    }
    if (!bookModalForm.downloadUrl?.trim()) {
      alert('براہ کرم پی ڈی ایف فائل کا ڈاؤن لوڈ لنک درج فرمائیں۔');
      return;
    }

    let updated = [];
    if (editingBookIndex !== null && editingBookIndex >= 0) {
      updated = pdfBooksList.map((b, idx) => idx === editingBookIndex ? { ...b, ...bookModalForm } : b);
      showNotification(`کتاب "${bookModalForm.title}" کامیابی کے ساتھ اپڈیٹ ہو گئی!`);
    } else {
      const newBook = {
        id: Date.now(),
        ...bookModalForm
      };
      updated = [newBook, ...pdfBooksList];
      showNotification(`نئی کتاب "${bookModalForm.title}" کامیابی کے ساتھ شامل کر دی گئی!`);
    }

    handleSavePdfBooksList(updated);
    setShowBookModal(false);
    setEditingBookIndex(null);
  };

  const handleDeleteBook = (index) => {
    const bookToDelete = pdfBooksList[index];
    if (window.confirm(`کیا آپ واقعی کتاب "${bookToDelete?.title}" کو کتب خانے سے حذف کرنا چاہتے ہیں؟`)) {
      const updated = pdfBooksList.filter((_, idx) => idx !== index);
      handleSavePdfBooksList(updated);
      showNotification(`کتاب "${bookToDelete?.title}" حذف کر دی گئی۔`);
    }
  };

  const handleMoveBook = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pdfBooksList.length) return;
    const updated = [...pdfBooksList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    handleSavePdfBooksList(updated);
  };

  // Handle open new page
  const handleOpenNewPage = () => {
    setEditingPageId(null);
    setIsEditingPageSlug(false);
    setTempPageSlug('');
    setPageEditorFont('nastaliq');
    setPageEditorFontSize('16px');
    setPageForm({
      id: Date.now(),
      title: '',
      slug: '',
      content: '<p>یہاں اپنے صفحے کا تفصیلی مواد تحریر کریں...</p>',
      status: 'published',
      author: 'حکیم سید عبدالوہاب شاہ',
      date: '2026/09/25',
      featuredImage: ''
    });
    setPageEditorMode('visual');
    setAdminTab('new-page');
  };

  // Handle edit page
  const handleEditPage = (page) => {
    setEditingPageId(page.id);
    setIsEditingPageSlug(false);
    setPageEditorFont('nastaliq');
    setPageEditorFontSize('16px');
    const initialSlug = page.slug || page.title.toLowerCase().replace(/\s+/g, '-');
    setTempPageSlug(initialSlug);

    const isThisPdfPage = initialSlug === 'pdf-books' || String(page.id) === '8339' || (page.title && (page.title.includes('پی ڈی ایف') || page.title.includes('PDF Books')));

    let contentToSet = page.content;
    if (isThisPdfPage) {
      contentToSet = generatePdfBooksPageHtml(pdfBooksList);
      setPdfEditorSubTab('studio');
    }

    setPageForm({
      ...page,
      slug: initialSlug,
      content: contentToSet
    });
    setPageEditorMode('visual');
    setAdminTab('new-page');
  };

  // Sync page visual editor content on load
  useEffect(() => {
    if (adminTab === 'new-page' && pageEditorMode === 'visual' && pageVisualEditorRef.current) {
      if (pageVisualEditorRef.current.innerHTML !== (pageForm?.content || '')) {
        pageVisualEditorRef.current.innerHTML = pageForm?.content || '';
      }
    }
  }, [adminTab, editingPageId, pageEditorMode]);

  // Handle save page
  const handleSavePage = () => {
    if (!pageForm.title.trim()) {
      alert('براہ کرم صفحے کا عنوان درج کریں');
      return;
    }

    const isThisPdfPage = pageForm && (
      pageForm.slug === 'pdf-books' || 
      String(pageForm.id) === '8339' || 
      (pageForm.title && (pageForm.title.includes('پی ڈی ایف') || pageForm.title.includes('PDF Books')))
    );

    let finalContent = '';
    if (isThisPdfPage) {
      finalContent = generatePdfBooksPageHtml(pdfBooksList);
    } else {
      finalContent = (pageEditorMode === 'visual' && pageVisualEditorRef.current) 
        ? pageVisualEditorRef.current.innerHTML 
        : (pageForm.content || '');
    }

    const finalSlug = (pageForm.slug || pageForm.title.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-')).replace(/\s+/g, '-');

    const updatedPage = {
      ...pageForm,
      slug: finalSlug,
      content: finalContent
    };

    if (pagesList.some(p => p.id === updatedPage.id)) {
      setPagesList(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
      showNotification('صفحہ کامیابی کے ساتھ اپڈیٹ ہو گیا!');
    } else {
      setPagesList(prev => [...prev, updatedPage]);
      showNotification('نیا صفحہ کامیابی کے ساتھ شائع ہو گیا!');
    }
    setAdminTab('pages');
  };

  const savedSelectionRef = useRef(null); // Saves exact caret/cursor position!
  const fileInputRef = useRef(null);
  const mediaFileInputRef = useRef(null);
  const replaceImageFileInputRef = useRef(null);
  const logoFileInputRef = useRef(null);

  // Stock library images for easy 1-click media insertion
  const STOCK_MEDIA = [
    { title: 'کلونجی بیج اور فوائد', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', cat: 'Herbs' },
    { title: 'اسگندھ ناگوری جڑ', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', cat: 'Herbs' },
    { title: 'خالص شہد و دارچینی', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', cat: 'Remedies' },
    { title: 'ادرک اور سونف جوشاندہ', url: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=800&q=80', cat: 'Remedies' },
    { title: 'نبض شناسی و معائنہ', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', cat: 'Clinic' },
    { title: 'جڑی بوٹیوں کی تیاری', url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80', cat: 'Herbs' },
  ];

  // Special characters & Islamic honorifics
  const SPECIAL_SYMBOLS = [
    { label: 'ﷺ', desc: 'صلی اللہ علیہ وسلم' },
    { label: 'ؓ', desc: 'رضی اللہ عنہ' },
    { label: 'ؒ', desc: 'رحمۃ اللہ علیہ' },
    { label: 'ؑ', desc: 'علیہ السلام' },
    { label: 'ﷻ', desc: 'جل جلالہ' },
    { label: '﷽', desc: 'بسم اللہ الرحمن الرحیم' },
    { label: '℞', desc: 'نسخہ علامت (Prescription)' },
    { label: '℃', desc: 'سینٹی گریڈ درجہ حرارت' },
    { label: '℉', desc: 'فارن ہائیٹ' },
    { label: '٪', desc: 'فیصد علامت' },
    { label: '✓', desc: 'درست ٹک' },
    { label: '★', desc: 'ستارہ' },
    { label: '±', desc: 'جمع یا منفی' },
    { label: '÷', desc: 'تقسیم' },
    { label: '×', desc: 'ضرب' },
    { label: '≠', desc: 'برابر نہیں' },
    { label: '©', desc: 'کاپی رائٹ' },
    { label: '®', desc: 'رجسٹرڈ' },
    { label: '™', desc: 'ٹریڈ مارک' },
    { label: '«', desc: 'قوسین شروع' },
    { label: '»', desc: 'قوسین ختم' },
    { label: '؟', desc: 'اردو سوالیہ نشان' },
  ];

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // =========================================================
  // PRECISE CARET / CURSOR PRESERVATION ENGINE
  // =========================================================
    const getActiveEditorElement = () => {
    if (adminTab === 'new-page') return pageVisualEditorRef.current;
    return visualEditorRef.current;
  };

  const saveCurrentSelection = () => {
    const el = getActiveEditorElement();
    if (!el) return;
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (
          el.contains(range.commonAncestorContainer) || 
          range.commonAncestorContainer === el
        ) {
          savedSelectionRef.current = range.cloneRange();
        }
      }
    } catch (e) {}
  };

  const restoreSelection = () => {
    const el = getActiveEditorElement();
    if (!el) return false;
    el.focus();
    if (savedSelectionRef.current) {
      try {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const execUniversalCmd = (command, value = null) => {
    restoreSelection();
    document.execCommand(command, false, value);
    const el = getActiveEditorElement();
    if (el) {
      if (adminTab === 'new-page') {
        setPageForm(prev => ({ ...prev, content: el.innerHTML }));
      } else {
        setArticleForm(prev => ({ ...prev, content: el.innerHTML }));
      }
    }
    saveCurrentSelection();
  };

  const applyTextColor = (color) => {
    execUniversalCmd('foreColor', color);
  };

  const applyBgColor = (color) => {
    execUniversalCmd('hiliteColor', color);
  };

  // Live calculation of words, characters, and reading time
  const updateStats = () => {
    if (!visualEditorRef.current) return;
    const text = visualEditorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 150));
    setStats({ words, chars, readingTime });
  };

  // Check and update what format is applied at the current cursor position
  const updateActiveFormats = () => {
    if (editorMode !== 'visual' || !visualEditorRef.current) return;
    
    try {
      const bold = document.queryCommandState('bold');
      const italic = document.queryCommandState('italic');
      const underline = document.queryCommandState('underline');
      const strike = document.queryCommandState('strikeThrough');
      const ul = document.queryCommandState('insertUnorderedList');
      const ol = document.queryCommandState('insertOrderedList');
      const subscript = document.queryCommandState('subscript');
      const superscript = document.queryCommandState('superscript');
      const justifyRight = document.queryCommandState('justifyRight');
      const justifyCenter = document.queryCommandState('justifyCenter');
      const justifyLeft = document.queryCommandState('justifyLeft');
      const justifyFull = document.queryCommandState('justifyFull');

      let heading = 'p';
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.anchorNode;
        while (node && node !== visualEditorRef.current) {
          if (node.nodeType === 1) {
            const tagName = node.tagName?.toLowerCase();
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'pre'].includes(tagName)) {
              heading = tagName;
              break;
            }
          }
          node = node.parentNode;
        }
      }

      let align = 'right';
      if (justifyCenter) align = 'center';
      else if (justifyLeft) align = 'left';
      else if (justifyFull) align = 'justify';

      setActiveFormats({
        bold,
        italic,
        underline,
        strike,
        heading,
        align,
        ul,
        ol,
        subscript,
        superscript
      });

      updateStats();
    } catch (e) {
      // ignore
    }
  };

  // Sync content into visual editor whenever form or tab changes
  useEffect(() => {
    if (adminTab === 'new-article' && editorMode === 'visual' && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== articleForm.content) {
        visualEditorRef.current.innerHTML = articleForm.content || '';
      }
      visualEditorRef.current.style.fontSize = '14px';
      updateStats();
    }
  }, [adminTab, editingArticleId, editorMode]);

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuDropdown(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Open New Article Editor
  const handleOpenNewArticle = () => {
    setSelectedImgElement(null);
    setEditingArticleId(null);
    setIsEditingSlug(false);
    setTempSlug('');
    setEditorFont('nastaliq');
    setEditorFontSize('14px');
    setArticleForm({
      title: '',
      slug: '',
      category: 'tibb-unani',
      status: 'published',
      excerpt: '',
      content: '<p>یہاں اپنا تفصیلی اردو طبی مضمون تحریر کریں...</p>',
      featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      imageType: 'url',
      tags: 'طب یونانی, جڑی بوٹیاں',
      author: 'حکیم محمد طارق محمود',
      readingTime: '5 منٹ',
    });
    setEditorMode('visual');
    setAdminTab('new-article');
  };

  // Open Edit Article (Safe & Robust)
  const handleEditArticle = (art) => {
    setSelectedImgElement(null);
    setEditingArticleId(art.id);
    setIsEditingSlug(false);
    setEditorFont('nastaliq');
    setEditorFontSize('14px');
    const initialSlug = art.slug || generateSlugFromTitle(art.title);
    setTempSlug(initialSlug);
    const artCategories = Array.isArray(art.categories) && art.categories.length > 0 
      ? art.categories 
      : [art.categoryName || art.category || 'tibb-unani'].filter(Boolean);
    setArticleForm({
      title: art.title || '',
      slug: initialSlug,
      category: art.category || artCategories[0] || 'tibb-unani',
      categories: artCategories,
      status: art.status || 'published',
      excerpt: art.excerpt || '',
      content: art.content || '<p></p>',
      featuredImage: art.featuredImage || '',
      imageType: 'url',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || ''),
      author: art.author || 'حکیم محمد طارق محمود',
      readingTime: art.readingTime || '5 منٹ',
    });
    setEditorMode('visual');
    setAdminTab('new-article');
  };

  // Toggle Status (Public / Private)
  const handleToggleStatus = (id) => {
    const updatedList = articlesList.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'private' ? 'published' : 'private';
        return { ...a, status: nextStatus };
      }
      return a;
    });
    setArticlesList(updatedList);
    saveArticlesApi(updatedList);
    showNotification('مضمون کا پبلشنگ اسٹیٹس کامیابی سے تبدیل ہو گیا');
  };

  // Delete Article
  const handleDeleteArticle = (id) => {
    if (confirm('کیا آپ واقعی یہ مضمون مکمل ڈیلیٹ کرنا چاہتے ہیں؟')) {
      const updatedList = articlesList.filter(a => a.id !== id);
      setArticlesList(updatedList);
      saveArticlesApi(updatedList);
      setSelectedArticleIds(prev => prev.filter(item => item !== id));
      showNotification('مضمون کامیابی سے ڈیلیٹ کر دیا گیا');
    }
  };

  // Bulk Delete Articles
  const handleBulkDeleteArticles = () => {
    if (selectedArticleIds.length === 0) return;
    if (confirm(`کیا آپ واقعی منتخب کردہ ${selectedArticleIds.length} مضامین کو مکمل ڈیلیٹ کرنا چاہتے ہیں؟`)) {
      const updatedList = articlesList.filter(a => !selectedArticleIds.includes(a.id));
      setArticlesList(updatedList);
      saveArticlesApi(updatedList);
      setSelectedArticleIds([]);
      showNotification(`${selectedArticleIds.length} مضامین کامیابی سے ڈیلیٹ کر دیے گئے`);
    }
  };

  // Save Article (Create or Update)
  const handleSaveArticle = (e) => {
    if (e) e.preventDefault();
    if (!articleForm.title.trim()) {
      alert('براہ کرم مضمون کا عنوان درج کریں');
      return;
    }

    // Clean any editor selection outline before saving
    if (selectedImgElement) {
      selectedImgElement.style.outline = 'none';
      setSelectedImgElement(null);
    }

    let finalContent = articleForm.content;
    if (editorMode === 'visual' && visualEditorRef.current) {
      finalContent = visualEditorRef.current.innerHTML;
    }

    const catObj = CATEGORIES.find(c => c.id === articleForm.category || c.slug === articleForm.category) ||
      categoriesList.find(c => c.id === articleForm.category || c.slug === articleForm.category || c.name === articleForm.category);
    const categoryName = catObj ? catObj.name : (articleForm.categoryName || articleForm.category || 'طب یونانی');
    const finalCategories = Array.isArray(articleForm.categories) && articleForm.categories.length > 0 
      ? articleForm.categories 
      : [categoryName];

    let updatedList;
    if (editingArticleId) {
      updatedList = articlesList.map(a => {
        if (a.id === editingArticleId) {
          return {
            ...a,
            ...articleForm,
            content: finalContent,
            categoryName,
            categories: finalCategories,
            tags: typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean) : articleForm.tags,
            readingTime: `${stats.readingTime} منٹ`,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return a;
      });
      setArticlesList(updatedList);
      showNotification('مضمون کی تمام تبدیلیاں کامیابی سے محفوظ ہو گئیں!');
    } else {
      const newArticle = {
        id: Date.now(),
        ...articleForm,
        content: finalContent,
        slug: articleForm.slug || generateSlugFromTitle(articleForm.title),
        categoryName,
        categories: finalCategories,
        readingTime: `${stats.readingTime} منٹ`,
        publishedAt: new Date().toISOString().split('T')[0],
        views: 1,
        authorImage: '/images/author-photo.jpg',
        tags: typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean) : articleForm.tags,
      };
      updatedList = [newArticle, ...articlesList];
      setArticlesList(updatedList);
      showNotification('نیا مضمون کامیابی کے ساتھ پبلش ہو گیا!');
    }

      setAdminTab('articles');
  };

  // Tag helper functions
  const handleAddTag = (tagToAdd) => {
    const t = (tagToAdd || tagInput).trim();
    if (!t) return;
    const currentTags = typeof articleForm.tags === 'string' 
      ? articleForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      : (articleForm.tags || []);
    if (!currentTags.includes(t)) {
      const updated = [...currentTags, t];
      setArticleForm(prev => ({ ...prev, tags: updated.join(', ') }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = typeof articleForm.tags === 'string' 
      ? articleForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      : (articleForm.tags || []);
    const updated = currentTags.filter(t => t !== tagToRemove);
    setArticleForm(prev => ({ ...prev, tags: updated.join(', ') }));
  };

  const handleAddNewCategory = () => {
    if (!newCatName.trim()) return;
    const newSlug = newCatName.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-');
    const newCat = { id: newSlug, name: newCatName.trim(), slug: newSlug };
    setCategoriesList(prev => [...prev, newCat]);
    setArticleForm(prev => ({ ...prev, category: newSlug }));
    setNewCatName('');
    setShowNewCatModal(false);
    showNotification(`نئی کیٹیگری شامل ہو گئی: ${newCat.name}`);
  };

  // Local Thumbnail Upload Handler
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setArticleForm({
          ...articleForm,
          featuredImage: uploadEvent.target.result,
          imageType: 'upload'
        });
        showNotification('تھمبنل تصویر کامیابی کے ساتھ لوڈ ہو گئی');
      };
      reader.readAsDataURL(file);
    }
  };

  // Logo File Upload Handler for Settings
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSettingsForm({
          ...settingsForm,
          logoUrl: uploadEvent.target.result
        });
        showNotification('لوگو تصویر کامیابی سے اپلوڈ ہو گئی');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Website Settings Image (Favicon, Logo, etc.)
  const handleSettingImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showNotification('تصویر اپلوڈ کی جا رہی ہے، براہِ کرم انتظار کریں...');
      const uploadedUrl = await uploadImageApi(file);
      if (uploadedUrl) {
        setSettingsForm(prev => {
          const updated = { ...prev, [field]: uploadedUrl };
          if (field === 'faviconUrl') {
            // Immediately update browser tab icon preview
            const oldIcons = document.querySelectorAll("link[rel*='icon']");
            oldIcons.forEach(el => el.remove());
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = uploadedUrl;
            document.head.appendChild(newLink);
          }
          return updated;
        });
        showNotification('تصویر کامیابی سے اپلوڈ ہو گئی! اب نیچے "تبدیلیاں محفوظ کریں" پر کلک کریں۔');
      } else {
        // Fallback to DataURL
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const resultUrl = uploadEvent.target.result;
          setSettingsForm(prev => ({ ...prev, [field]: resultUrl }));
          showNotification('تصویر شامل کر دی گئی! اب نیچے "تبدیلیاں محفوظ کریں" پر کلک کریں۔');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error(err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSettingsForm(prev => ({ ...prev, [field]: uploadEvent.target.result }));
      };
      reader.readAsDataURL(file);
      showNotification('تصویر شامل کر دی گئی! اب نیچے "تبدیلیاں محفوظ کریں" پر کلک کریں۔');
    }
  };

  const handleSaveSettings = async (e) => {
      e.preventDefault();
      if (setSiteSettings) {
        setSiteSettings(settingsForm);
      }
      await saveSettingsApi(settingsForm);
      showNotification('ویب سائٹ کی تمام ترتیبات (لوگو، ہیڈر، فوٹر) کامیابی کے ساتھ محفوظ ہو گئیں!');
  };

  // Visual WYSIWYG Command Executor
  const execCmd = (command, value = null) => {
    if (editorMode !== 'visual') return;
    restoreSelection();
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    saveCurrentSelection();
    setTimeout(updateActiveFormats, 50);
  };

  // =========================================================
  // INTERACTIVE IMAGE SELECTION & EDITING METHODS
  // =========================================================
  const handleEditorClick = (e) => {
    // Check if clicked element is an <img>
    if (e.target && e.target.tagName === 'IMG') {
      e.stopPropagation();
      const img = e.target;

      // Remove outline from previous image
      if (selectedImgElement && selectedImgElement !== img) {
        selectedImgElement.style.outline = 'none';
      }

      // Add prominent blue selection outline
      img.style.outline = '4px solid #2563eb';
      img.style.outlineOffset = '3px';
      img.style.cursor = 'pointer';

      setSelectedImgElement(img);

      // Determine width
      let widthNum = 100;
      const w = img.style.width || '100%';
      if (w.includes('%')) {
        widthNum = parseInt(w) || 100;
      } else if (w.includes('px')) {
        widthNum = Math.min(100, Math.round((parseInt(w) / 700) * 100));
      }

      // Determine alignment
      let align = 'center';
      if (img.style.float === 'right') align = 'right';
      else if (img.style.float === 'left') align = 'left';
      else if (w === '100%') align = 'full';

      setSelectedImgProps({
        src: img.src,
        alt: img.alt || '',
        widthPercent: widthNum,
        align: align,
        borderRadius: img.style.borderRadius || '16px',
        border: img.style.border || 'none',
        caption: img.getAttribute('data-caption') || ''
      });
    } else {
      // If clicked elsewhere, deselect image
      if (selectedImgElement) {
        selectedImgElement.style.outline = 'none';
        setSelectedImgElement(null);
      }
    }
    saveCurrentSelection();
  };

  // Apply Image Width / Size
  const applyImageWidth = (percent) => {
    if (!selectedImgElement) return;
    const widthStr = `${percent}%`;
    selectedImgElement.style.width = widthStr;
    selectedImgElement.removeAttribute('width');
    
    setSelectedImgProps(prev => ({ ...prev, widthPercent: percent }));
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    showNotification(`تصویر کا سائز: ${percent}%`);
  };

  // Apply Image Alignment
  const applyImageAlign = (align) => {
    if (!selectedImgElement) return;

    if (align === 'right') {
      selectedImgElement.style.float = 'right';
      selectedImgElement.style.margin = '0 0 1rem 1.5rem';
      selectedImgElement.style.display = 'inline-block';
    } else if (align === 'left') {
      selectedImgElement.style.float = 'left';
      selectedImgElement.style.margin = '0 1.5rem 1rem 0';
      selectedImgElement.style.display = 'inline-block';
    } else if (align === 'center') {
      selectedImgElement.style.float = 'none';
      selectedImgElement.style.margin = '1.5rem auto';
      selectedImgElement.style.display = 'block';
    } else if (align === 'full') {
      selectedImgElement.style.float = 'none';
      selectedImgElement.style.margin = '1.5rem auto';
      selectedImgElement.style.display = 'block';
      selectedImgElement.style.width = '100%';
      setSelectedImgProps(prev => ({ ...prev, widthPercent: 100 }));
    }

    setSelectedImgProps(prev => ({ ...prev, align }));
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    showNotification(
      align === 'center' ? 'تصویر درمیان میں سیٹ ہوئی' :
      align === 'right' ? 'تصویر دائیں طرف لپٹی ہوئی (Float Right)' :
      align === 'left' ? 'تصویر بائیں طرف لپٹی ہوئی (Float Left)' : 'تصویر فل اسکرین سیٹ ہوئی'
    );
  };

  // Apply Image Border Radius
  const applyImageRadius = (radius) => {
    if (!selectedImgElement) return;
    selectedImgElement.style.borderRadius = radius;
    setSelectedImgProps(prev => ({ ...prev, borderRadius: radius }));
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
  };

  // Delete Selected Image
  const handleDeleteSelectedImage = () => {
    if (!selectedImgElement) return;
    selectedImgElement.remove();
    setSelectedImgElement(null);
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    showNotification('تصویر مضمون سے حذف کر دی گئی');
  };

  // Replace Selected Image from Computer
  const handleReplaceImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedImgElement) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        selectedImgElement.src = uploadEvent.target.result;
        setSelectedImgProps(prev => ({ ...prev, src: uploadEvent.target.result }));
        if (visualEditorRef.current) {
          setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
        }
        showNotification('تصویر کامیابی کے ساتھ تبدیل کر دی گئی');
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply specific inline style (fontSize, fontFamily) to the user's selected text or active block element
  const applyInlineStyle = (styleProp, styleVal) => {
    if (editorMode !== 'visual' || !visualEditorRef.current) return;
    restoreSelection();
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // If cursor is inside a block element without dragging selection, apply style to the enclosing element
      let node = selection.anchorNode;
      while (node && node !== visualEditorRef.current) {
        if (node.nodeType === 1 && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'BLOCKQUOTE', 'DIV', 'SPAN'].includes(node.tagName)) {
          node.style[styleProp] = styleVal;
          if (visualEditorRef.current) {
            setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
          }
          return;
        }
        node = node.parentNode;
      }
      return;
    }

    try {
      const fragment = range.extractContents();
      const span = document.createElement('span');
      span.style[styleProp] = styleVal;
      span.appendChild(fragment);
      range.insertNode(span);

      // Re-select the modified span
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);
      savedSelectionRef.current = newRange.cloneRange();

      if (visualEditorRef.current) {
        setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
      }
    } catch (err) {
      console.error('Error applying inline style:', err);
    }
  };

  // Apply Font Family to selected text
  const applyFontFamily = (font) => {
    setEditorFont(font);
    let fontVal = '"Noto Nastaliq Urdu", serif';
    if (font === 'tajawal') fontVal = '"Tajawal", sans-serif';
    if (font === 'cairo') fontVal = '"Cairo", sans-serif';
    if (font === 'almarai') fontVal = '"Almarai", sans-serif';
    if (font === 'georgia') fontVal = 'Georgia, serif';
    if (font === 'arial') fontVal = 'Arial, sans-serif';
    if (font === 'times') fontVal = '"Times New Roman", serif';
    if (font === 'segoe') fontVal = '"Segoe UI", sans-serif';

    applyInlineStyle('fontFamily', fontVal);
    showNotification(`منتخب متن کا فونٹ تبدیل ہو گیا`);
  };

  // Apply Font Size to selected text
  const applyFontSize = (size) => {
    setEditorFontSize(size);
    applyInlineStyle('fontSize', size);
    showNotification(`منتخب متن کا سائز: ${size}`);
  };

  // Text Direction Handler (RTL / LTR)
  const setDirection = (dir) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.anchorNode;
        while (node && node !== visualEditorRef.current) {
          if (node.nodeType === 1) {
            node.setAttribute('dir', dir);
            node.style.textAlign = dir === 'rtl' ? 'right' : 'left';
            break;
          }
          node = node.parentNode;
        }
      }
      showNotification(dir === 'rtl' ? 'سمت: دائیں سے بائیں (RTL)' : 'سمت: بائیں سے دائیں (LTR)');
    }
  };

  // Insert Special Symbol at exact cursor position
  const handleInsertSymbol = (sym) => {
    restoreSelection();
    execCmd('insertHTML', `<span>${sym}</span>&nbsp;`);
    setShowSpecialChars(false);
  };

  // Insert Custom Callout Box / Highlight Cards at exact cursor position
  const insertBox = (type) => {
    setShowBoxMenu(false);
    restoreSelection();

    let boxHTML = '';
    
    if (type === 'green') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-emerald-50 border-r-4 border-emerald-600 text-emerald-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-emerald-900 mb-2 font-simple">🌿 کلونجی اور ہربل فوائد کا خلاصہ:</h4>
          <ul class="list-disc pr-6 space-y-1 text-slate-800 font-normal">
            <li><strong>معدے اور پیٹ کی گیس:</strong> تبخیر، ریاح اور پیٹ کے پھولنے میں فوری آرام دیتی ہے۔</li>
            <li><strong>قوت مدافعت میں اضافہ:</strong> جسم کو موسمی وائرل اور انفیکشنز سے محفوظ رکھتی ہے۔</li>
            <li><strong>کولیسٹرول و شریانیں:</strong> خون کی نالیوں میں جمی چکنائی اور فاسد مادوں کو خارج کرتی ہے۔</li>
          </ul>
        </div>
        <p><br></p>
      `;
    } else if (type === 'blue') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-blue-50 border-r-4 border-blue-600 text-blue-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-blue-900 mb-2 font-simple">💊 طبی نسخہ و مقدارِ خوراک (Prescription):</h4>
          <p class="text-slate-800 leading-relaxed mb-2"><strong>اجزاء:</strong> سونف 50 گرام، ملٹھی 50 گرام، ریوند خطائی 50 گرام۔</p>
          <p class="text-slate-800 leading-relaxed"><strong>ترکیب و خوراک:</strong> تمام ادویہ کا باریک سفوف بنا لیں۔ روزانہ صبح اور شام کھانے کے آدھے گھنٹے بعد آدھا چمچ ہمراہ نیم گرم پانی استعمال کریں۔</p>
        </div>
        <p><br></p>
      `;
    } else if (type === 'amber') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-amber-50 border-r-4 border-amber-600 text-amber-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-amber-900 mb-1 font-simple">⚠️ پرہیز و احتیاطی تدابیر (Diet Precautions):</h4>
          <p class="text-slate-800 leading-relaxed">گرم مصالحہ جات، برائلر مرغی، بازاری تلی ہوئی اشیاء اور کولڈ ڈرنکس سے مکمل پرہیز کریں۔ تازہ سلاد اور پانی کا استعمال زیادہ کریں۔</p>
        </div>
        <p><br></p>
      `;
    } else if (type === 'red') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-red-50 border-r-4 border-red-600 text-red-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-red-900 mb-1 font-simple">🛑 طبی انتباہ (Medical Warning):</h4>
          <p class="text-slate-800 leading-relaxed">حاملہ خواتین اور ہائی بلڈ پریشر کے مریض معالج یا مستند حکیم کے مشورے کے بغیر یہ نسخہ ہرگز استعمال نہ کریں۔</p>
        </div>
        <p><br></p>
      `;
    }

    execCmd('insertHTML', boxHTML);
    showNotification('کارڈ کرسر کی جگہ پر شامل ہو گیا');
  };

  // Insert Tables at exact cursor position
  const handleInsertTable = (type) => {
    setShowTableMenu(false);
    restoreSelection();

    let tableHTML = '';

    if (type === '2x2') {
      tableHTML = `
        <div class="my-6 overflow-x-auto">
          <table class="w-full border-collapse border border-slate-300 rounded-xl text-right text-sm" style="direction: rtl;">
            <thead>
              <tr class="bg-blue-50 text-blue-950 font-bold border-b border-slate-300">
                <th class="p-3 border border-slate-300">کالم 1</th>
                <th class="p-3 border border-slate-300">کالم 2</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-200 hover:bg-slate-50">
                <td class="p-3 border border-slate-300">ڈیٹا 1</td>
                <td class="p-3 border border-slate-300">ڈیٹا 2</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-3 border border-slate-300">ڈیٹا 3</td>
                <td class="p-3 border border-slate-300">ڈیٹا 4</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    } else if (type === '3x3') {
      tableHTML = `
        <div class="my-6 overflow-x-auto">
          <table class="w-full border-collapse border border-slate-300 rounded-xl text-right text-sm" style="direction: rtl;">
            <thead>
              <tr class="bg-blue-50 text-blue-950 font-bold border-b border-slate-300">
                <th class="p-3 border border-slate-300">نمبر شمار</th>
                <th class="p-3 border border-slate-300">عنوان / مرض</th>
                <th class="p-3 border border-slate-300">علامات و تفصیل</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-200 hover:bg-slate-50">
                <td class="p-3 border border-slate-300">1</td>
                <td class="p-3 border border-slate-300">عضلاتی تحریک</td>
                <td class="p-3 border border-slate-300">خشکی، گیس، قبض</td>
              </tr>
              <tr class="border-b border-slate-200 hover:bg-slate-50">
                <td class="p-3 border border-slate-300">2</td>
                <td class="p-3 border border-slate-300">غدی تحریک</td>
                <td class="p-3 border border-slate-300">گرمی، جلن، صفراء کی زیادتی</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-3 border border-slate-300">3</td>
                <td class="p-3 border border-slate-300">اعصابی تحریک</td>
                <td class="p-3 border border-slate-300">تری، بلغم، سستی</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    } else if (type === 'dosage') {
      tableHTML = `
        <div class="my-6 overflow-x-auto">
          <table class="w-full border-collapse border border-emerald-300 rounded-xl text-right text-sm" style="direction: rtl;">
            <thead>
              <tr class="bg-emerald-100 text-emerald-950 font-bold border-b border-emerald-300">
                <th class="p-3 border border-emerald-300">جڑی بوٹی / جزو</th>
                <th class="p-3 border border-emerald-300">وزن / مقدار</th>
                <th class="p-3 border border-emerald-300">طریقہ و وقت استعمال</th>
                <th class="p-3 border border-emerald-300">خصوصی فائدہ</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-emerald-200 bg-emerald-50/40">
                <td class="p-3 border border-emerald-200 font-bold">ملٹھی سفوف</td>
                <td class="p-3 border border-emerald-200">50 گرام</td>
                <td class="p-3 border border-emerald-200">صبح نہار منہ چوتھائی چمچ</td>
                <td class="p-3 border border-emerald-200">معدے کا السر اور گلے کی سوزش</td>
              </tr>
              <tr class="border-b border-emerald-200">
                <td class="p-3 border border-emerald-200 font-bold">سونف دیسی</td>
                <td class="p-3 border border-emerald-200">50 گرام</td>
                <td class="p-3 border border-emerald-200">بعد از غذا ہمراہ پانی</td>
                <td class="p-3 border border-emerald-200">ہاضمہ اور تبخیر معدہ دور کرے</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    }

    execCmd('insertHTML', tableHTML);
    showNotification('ٹیبل کرسر کی جگہ داخل ہو گیا');
  };

  // Insert Link Prompt at exact cursor position
  const handleInsertLink = () => {
    saveCurrentSelection();
    const url = prompt('براہ کرم ویب لنک (URL) درج کریں:', 'https://');
    if (url) {
      restoreSelection();
      execCmd('createLink', url);
    }
  };

  // Find & Replace Execution
  const handleExecuteFindReplace = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    if (visualEditorRef.current) {
      const currentHtml = visualEditorRef.current.innerHTML;
      const regex = new RegExp(searchTerm, 'g');
      const count = (currentHtml.match(regex) || []).length;
      
      if (count === 0) {
        alert('مطلوبہ لفظ مضمون میں نہیں ملا');
        return;
      }

      const updatedHtml = currentHtml.replace(regex, replaceTerm);
      visualEditorRef.current.innerHTML = updatedHtml;
      setArticleForm({ ...articleForm, content: updatedHtml });
      setShowFindReplaceModal(false);
      showNotification(`${count} جگہوں پر لفظ کامیابی سے تبدیل کر دیا گیا`);
    }
  };

  // =========================================================
  // INSERT MEDIA AT EXACT CURSOR POSITION
  // =========================================================
  const handleInsertMediaFromModal = (imageUrl = null) => {
    const finalUrl = imageUrl || mediaUrlInput;
    if (!finalUrl) {
      alert('براہ کرم تصویر منتخب کریں یا لنک درج کریں');
      return;
    }

    let styleClass = 'my-4 rounded-2xl border border-slate-200 shadow-md max-w-full h-auto cursor-pointer transition-all';
    let floatStyle = 'none';
    let marginStyle = '1.5rem auto';
    let displayStyle = 'block';

    if (mediaAlignment === 'right') {
      floatStyle = 'right';
      marginStyle = '0 0 1rem 1.5rem';
      displayStyle = 'inline-block';
    } else if (mediaAlignment === 'left') {
      floatStyle = 'left';
      marginStyle = '0 1.5rem 1rem 0';
      displayStyle = 'inline-block';
    }

    // Restore exact cursor location before insertion
    restoreSelection();

    const mediaHTML = `
      <img 
        src="${finalUrl}" 
        alt="${mediaCaption || 'مضمون کی تصویر'}" 
        class="${styleClass}" 
        style="width: ${mediaWidth}; float: ${floatStyle}; margin: ${marginStyle}; display: ${displayStyle}; border-radius: 16px; object-fit: cover;" 
      />
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, mediaHTML);

    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }

    saveCurrentSelection();
    setShowMediaModal(false);
    setMediaUrlInput('');
    setMediaCaption('');
    showNotification('تصویر کرسر کے عین مقام پر شامل کر دی گئی!');
  };

  // Media Modal: File Upload Handler
  const handleModalFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        handleInsertMediaFromModal(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Modal: Insert Interactive Form Card at exact cursor position
  const handleInsertFormWidget = () => {
    restoreSelection();

    let formHTML = '';

    if (formType === 'consultation') {
      formHTML = `
        <div class="my-8 p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 shadow-md text-right" style="direction: rtl;">
          <div class="flex items-center gap-2 text-blue-900 font-bold text-lg mb-2 font-simple">
            <span>🩺 معالج و طبیب سے آن لائن مشورہ طلب کریں</span>
          </div>
          <p class="text-xs text-blue-800 mb-4 font-sans">اپنی علامات اور مرض کی تفصیل لکھ کر مستند حکیم سے فوری رہنمائی حاصل کریں:</p>
          <div class="space-y-3">
            <input type="text" placeholder="آپ کا نام..." class="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none" />
            <input type="tel" placeholder="واٹس ایپ / فون نمبر..." class="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none font-sans" />
            <textarea rows="2" placeholder="مرض یا مسئلہ کی مختصر تفصیل..." class="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"></textarea>
            <button type="button" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs font-simple">
              آن لائن رہنمائی کے لیے درخواست بھیجیں
            </button>
          </div>
        </div>
        <p><br></p>
      `;
    } else if (formType === 'order') {
      formHTML = `
        <div class="my-8 p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 shadow-md text-right" style="direction: rtl;">
          <div class="flex items-center gap-2 text-emerald-900 font-bold text-lg mb-2 font-simple">
            <span>📦 خالص طبی نسخہ / دوا گھر بیٹھے منگوائیں</span>
          </div>
          <p class="text-xs text-emerald-800 mb-4 font-sans">اس مضمون میں بیان کردہ اجزاء پر مشتمل 100% خالص سفوف یا شربت کی ہوم ڈیلیوری:</p>
          <div class="space-y-3">
            <input type="text" placeholder="خریدار کا نام..." class="w-full bg-white border border-emerald-200 rounded-xl p-2.5 text-xs text-slate-800" />
            <input type="tel" placeholder="واٹس ایپ نمبر اور شہر کا نام..." class="w-full bg-white border border-emerald-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans" />
            <input type="text" placeholder="مکمل ہوم ایڈریس..." class="w-full bg-white border border-emerald-200 rounded-xl p-2.5 text-xs text-slate-800" />
            <button type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs font-simple">
              کیش آن ڈیلیوری آرڈر کنفرم کریں
            </button>
          </div>
        </div>
        <p><br></p>
      `;
    } else if (formType === 'question') {
      formHTML = `
        <div class="my-8 p-6 rounded-3xl bg-purple-50 border-2 border-purple-200 shadow-md text-right" style="direction: rtl;">
          <div class="flex items-center gap-2 text-purple-900 font-bold text-lg mb-2 font-simple">
            <span>❓ اس مضمون کے متعلق سوال پوچھیں</span>
          </div>
          <p class="text-xs text-purple-800 mb-4 font-sans">ہمارے ریسرچ پینل اور حکماء آپ کے سوال کا 24 گھنٹوں میں تفصیلی جواب دیں گے:</p>
          <div class="space-y-3">
            <input type="text" placeholder="آپ کا نام و ای میل..." class="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs text-slate-800" />
            <textarea rows="2" placeholder="اپنا سوال تحریر کریں..." class="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs text-slate-800"></textarea>
            <button type="button" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs font-simple">
              سوال جمع کرائیں
            </button>
          </div>
        </div>
        <p><br></p>
      `;
    }

    document.execCommand('insertHTML', false, formHTML);
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    saveCurrentSelection();
    setShowFormModal(false);
    showNotification('رابطہ فارم کرسر کی جگہ شامل ہو گیا');
  };

  // Filtered list of articles for table
  const filteredArticles = useMemo(() => {
    const list = articlesList.filter(art => {
      const matchSearch = !searchFilter.trim() ||
        art.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        art.author?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        art.category?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (Array.isArray(art.categories) && art.categories.some(c => typeof c === 'string' && c.toLowerCase().includes(searchFilter.toLowerCase()))) ||
        (Array.isArray(art.tags) && art.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(searchFilter.toLowerCase()))) ||
        (typeof art.tags === 'string' && art.tags.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const artStatus = art.status || 'published';
      const matchStatus = statusFilter === 'all' || artStatus === statusFilter;

      return matchSearch && matchStatus;
    });

    return [...list].sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.date || 0).getTime();
      const timeB = new Date(b.publishedAt || b.date || 0).getTime();
      const idA = typeof a.id === 'number' ? a.id : parseInt(String(a.id).replace(/\D/g, '') || '0', 10);
      const idB = typeof b.id === 'number' ? b.id : parseInt(String(b.id).replace(/\D/g, '') || '0', 10);

      if (postSortOrder === 'oldest') {
        if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) return timeA - timeB;
        return idA - idB;
      }
      
      // Default: 'latest' first
      if (!isNaN(timeA) && !isNaN(timeB) && timeB !== timeA) return timeB - timeA;
      return idB - idA;
    });
  }, [articlesList, searchFilter, statusFilter, postSortOrder]);

  // WordPress-style Pagination Calculations
  const totalFilteredPosts = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredPosts / postsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, totalFilteredPosts);
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Helper for generating page numbers (e.g. 1, 2, ..., 5, 6, 7, ..., 25)
  const getPaginationPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages];
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 flex flex-col font-urdu text-right select-text ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-slate-900 text-slate-100' : ''}`} dir="rtl">
      
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in-50 duration-200 font-simple">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hidden File Input for Image Replacement */}
      <input
        type="file"
        ref={replaceImageFileInputRef}
        onChange={handleReplaceImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Admin Navbar */}
      {!isFullscreen && (
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 shadow-2xs sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 font-simple">طبیب پیڈیا ایڈمن CMS پورٹل</h1>
                  <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 font-sans font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                    v2.5 Pro Editor
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  اردو رچ ایڈیٹر، ہوم پیج، لوگو، لائیو وزٹرز اینالیٹکس اور اطباء ترتیبات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToWebsite}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200/90 font-simple shadow-xs cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>ویب سائٹ پر واپس جائیں</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 active:scale-95 px-4 py-2.5 rounded-xl text-xs font-bold transition-all font-simple shadow-xs cursor-pointer"
                title="ایڈمن سیشن ختم کریں اور لاگ آؤٹ ہوں"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>لاگ آؤٹ</span>
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Main Admin Layout */}
      <div className={`flex-1 ${isFullscreen ? 'w-full p-4 max-w-7xl mx-auto' : adminTab === 'new-article' ? 'w-full max-w-[1920px] mx-auto px-2 sm:px-4 py-3' : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'}`}>
        
        {/* Sidebar Navigation */}
        {!isFullscreen && adminTab !== 'new-article' && (
          <aside className="lg:col-span-3 bg-white border border-slate-200/90 rounded-3xl p-4 space-y-6 sticky top-24 shadow-xs">

            {/* WordPress-style Navigation Links */}
            <div className="space-y-5 text-xs font-bold font-simple">
              <div>
                <button 
                  onClick={() => setAdminTab('dashboard')} 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold ${
                    adminTab === 'dashboard' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 border border-slate-200/70 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className={`w-4 h-4 ${adminTab === 'dashboard' ? 'text-white' : 'text-blue-600'}`} />
                    <span className="text-sm">ڈیش بورڈ (Dashboard)</span>
                  </div>
                  {analyticsData?.activeNow > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${adminTab === 'dashboard' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      {analyticsData.activeNow} آن لائن
                    </span>
                  )}
                </button>
              </div>

              <div>
                <div className="px-4 py-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">Posts (مضامین)</div>
                <div className="space-y-1">
                  <button onClick={() => setAdminTab('articles')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'articles' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <FileText className="w-4 h-4 text-slate-400" /> <span>All Posts (آل پوسٹس)</span>
                  </button>
                  <button onClick={handleOpenNewArticle} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'new-article' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <PlusCircle className="w-4 h-4 text-slate-400" /> <span>Add New (نیا مضمون)</span>
                  </button>
                  <button onClick={() => setAdminTab('categories')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'categories' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <FolderOpen className="w-4 h-4 text-slate-400" /> <span>Categories (کیٹیگریز)</span>
                  </button>
                  <button onClick={() => setAdminTab('comments')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'comments' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <MessageCircle className="w-4 h-4 text-slate-400" /> <span>Comments</span>
                  </button>
                  <button onClick={() => setAdminTab('tags')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'tags' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <Hash className="w-4 h-4 text-slate-400" /> <span>Tags (ٹیگز)</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="px-4 py-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">Media & Pages</div>
                <div className="space-y-1">
                  <button onClick={() => setAdminTab('media')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'media' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <ImageIcon className="w-4 h-4 text-slate-400" /> <span>Media (میڈیا لائبریری)</span>
                  </button>
                  <button onClick={() => setAdminTab('pages')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'pages' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <BookOpen className="w-4 h-4 text-slate-400" /> <span>Pages (صفحات)</span>
                  </button>
                  <button onClick={() => setAdminTab('glossary')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'glossary' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <BookOpen className="w-4 h-4 text-emerald-600" /> <span>فرہنگِ اطباء (Glossary)</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="px-4 py-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">Directory & Tools</div>
                <div className="space-y-1">
                  <button onClick={() => setAdminTab('doctors')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'doctors' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <UserCheck className="w-4 h-4 text-slate-400" /> <span>اطباء و کلینکس</span>
                  </button>
                  <button onClick={() => setAdminTab('settings')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'settings' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <Settings className="w-4 h-4 text-slate-400" /> <span>ویب سائٹ سیٹنگز</span>
                  </button>
                  <button onClick={() => { setAdminTab('security'); setSettingsSubTab('security'); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'security' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <ShieldCheck className={`w-4 h-4 ${adminTab === 'security' ? 'text-emerald-700' : 'text-emerald-600'}`} /> <span>🛡️ ایڈمن سیکیورٹی و 2FA</span>
                  </button>
                  <button onClick={() => setAdminTab('migration')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${adminTab === 'migration' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}`}>
                    <Database className="w-4 h-4 text-slate-400" /> <span>مائیگریشن ٹول</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 font-simple">
              <div className="flex items-center justify-between">
                <span>پبلک مضامین:</span>
                <strong className="text-emerald-700 font-sans font-bold">{articlesList.filter(a => a.status !== 'private').length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>پرائیویٹ / ڈرافٹ:</span>
                <strong className="text-amber-700 font-sans font-bold">{articlesList.filter(a => a.status === 'private').length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>زیرِ جائزہ درخواستیں:</span>
                <strong className="text-amber-700 font-sans font-bold">
                  {doctorsList.filter(d => d && (d.isApproved === false || d.status === 'pending')).length}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>منظور شدہ اطباء:</span>
                <strong className="text-emerald-700 font-sans font-bold">
                  {doctorsList.filter(d => d && (d.isApproved !== false && d.status !== 'pending')).length}
                </strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all border border-red-200 cursor-pointer shadow-2xs"
                title="ایڈمن سیشن ختم کریں اور لاگ آؤٹ ہوں"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>ایڈمن لاگ آؤٹ (Logout)</span>
              </button>
            </div>

          </aside>
        )}

        {/* Content Area */}
        <main className={`${isFullscreen ? 'w-full' : adminTab === 'new-article' ? 'w-full' : 'lg:col-span-9'} space-y-4`}>
          
          {/* ========================================================= */}
          {/* VIEW 1: WORDPRESS / TINYMCE STYLE VISUAL WYSIWYG EDITOR */}
          {/* ========================================================= */}
          {adminTab === 'new-article' && (
            <div className="space-y-4">
              
              {/* WordPress Top Action Bar */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullscreen(false);
                      setAdminTab('articles');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 font-simple"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>تمام مضامین</span>
                  </button>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <div className="hidden sm:block">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-simple">
                      {editingArticleId ? 'مضمون میں ترمیم کریں (Post Editor)' : 'نیا اردو طبی مضمون تحریر کریں'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === 'visual' && visualEditorRef.current) {
                        setArticleForm({...articleForm, content: visualEditorRef.current.innerHTML});
                      }
                      setEditorMode(editorMode === 'preview' ? 'visual' : 'preview');
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border font-simple ${
                      editorMode === 'preview' ? 'bg-blue-600 text-white border-blue-500 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{editorMode === 'preview' ? 'ویژول موڈ' : 'پیش نظارہ (Preview)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setArticleForm(prev => ({ ...prev, status: 'private' }));
                      handleSaveArticle();
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors font-simple border border-slate-200"
                  >
                    ڈرافٹ محفوظ کریں
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveArticle}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all font-simple"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingArticleId ? 'تبدیلیاں محفوظ کریں (Update)' : 'پبلش کریں (Publish)'}</span>
                  </button>
                </div>
              </div>

              {/* WordPress 2-Column Main Form Grid */}
              <form onSubmit={handleSaveArticle} className="flex flex-col lg:flex-row gap-3.5 items-start w-full">
                
                {/* ========================================================= */}
                {/* 1. MAIN POST CONTENT AREA (Takes ~80% of width) */}
                {/* ========================================================= */}
                <div className="flex-1 min-w-0 w-full space-y-3.5">
                  
                  {/* Title Input & Permalink Bar (WordPress Style) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1 font-simple">
                        عنوان (Add Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={articleForm.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setArticleForm(prev => ({
                            ...prev,
                            title: newTitle,
                            slug: isEditingSlug ? prev.slug : (prev.slug && editingArticleId ? prev.slug : generateSlugFromTitle(newTitle))
                          }));
                        }}
                        placeholder="یہاں مضمون کا تفصیلی عنوان درج کریں (Add Title)..."
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 sm:p-3 text-lg sm:text-xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-simple transition-all shadow-xs"
                      />
                    </div>

                    {/* WordPress-Style Interactive Permalink Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-sans px-0.5 pt-1.5 border-t border-slate-200">
                      <span className="font-bold text-slate-700 font-simple">مستقل لنک (Permalink):</span>
                      
                      <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-mono dir-ltr">
                        <span className="text-slate-500 select-none">https://tabeebpedia.com/articles/</span>
                        
                        {isEditingSlug ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempSlug}
                              onChange={(e) => setTempSlug(e.target.value.toLowerCase().replace(/[\s_]+/g, '-'))}
                              placeholder="custom-slug"
                              className="bg-white border border-blue-500 rounded px-2 py-0.5 text-xs text-blue-700 font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-[150px] shadow-xs"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const finalSlug = tempSlug.trim() || generateSlugFromTitle(articleForm.title);
                                  setArticleForm(prev => ({ ...prev, slug: finalSlug }));
                                  setIsEditingSlug(false);
                                  showNotification('پرما لنک محفوظ ہو گیا');
                                } else if (e.key === 'Escape') {
                                  setIsEditingSlug(false);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const finalSlug = tempSlug.trim() || generateSlugFromTitle(articleForm.title);
                                setArticleForm(prev => ({ ...prev, slug: finalSlug }));
                                setIsEditingSlug(false);
                                showNotification('پرما لنک محفوظ ہو گیا');
                              }}
                              className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold font-simple transition-colors shadow-xs"
                            >
                              OK (محفوظ کریں)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTempSlug(articleForm.slug);
                                setIsEditingSlug(false);
                              }}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded text-[11px] font-simple transition-colors"
                            >
                              منسوخ
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-emerald-700 px-1 select-all font-mono">
                            {articleForm.slug || generateSlugFromTitle(articleForm.title) || 'untitled-article'}
                          </span>
                        )}
                      </div>

                      {!isEditingSlug && (
                        <div className="flex items-center gap-1.5 font-simple">
                          <button
                            type="button"
                            onClick={() => {
                              setTempSlug(articleForm.slug || generateSlugFromTitle(articleForm.title));
                              setIsEditingSlug(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-blue-700 hover:text-blue-800 rounded-lg border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                            title="پرما لنک اپنی مرضی سے ایڈٹ کریں"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>ایڈٹ کریں (Edit)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const autoSlug = generateSlugFromTitle(articleForm.title);
                              setArticleForm(prev => ({ ...prev, slug: autoSlug }));
                              setTempSlug(autoSlug);
                              showNotification('پرما لنک عنوان کے مطابق خودکار ری سیٹ ہو گیا');
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 text-[11px] transition-colors"
                            title="عنوان کے مطابق خودکار ری سیٹ کریں"
                          >
                            خودکار ری سیٹ
                          </button>

                          {(articleForm.slug || articleForm.title) && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentSlug = articleForm.slug || generateSlugFromTitle(articleForm.title);
                                  const fullUrl = `https://tabeebpedia.com/articles/${currentSlug}`;
                                  navigator.clipboard.writeText(fullUrl);
                                  showNotification('مکمل پرما لنک کاپی ہو گیا!');
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 text-[11px] transition-colors flex items-center gap-1"
                                title="لنک کاپی کریں"
                              >
                                <Copy className="w-3 h-3" />
                                <span>کاپی لنک</span>
                              </button>

                              <a
                                href={`?article=${articleForm.slug || editingArticleId || generateSlugFromTitle(articleForm.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                                title="مضمون کو نئی ونڈو / ٹیب میں لائیو کھولیں"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>مضمون دیکھیں (View)</span>
                              </a>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. ADVANCED WORDPRESS / TINYMCE VISUAL WYSIWYG EDITOR COMPONENT */}
                  <div className="border border-slate-200 bg-white rounded-2xl shadow-xs relative">
                  
                  {/* STICKY TOP TOOLBAR HEADER - Stays pinned to top when scrolling down */}
                  <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md rounded-t-2xl border-b border-slate-200 shadow-xs">
                    
                    {/* Top Action Bar with Add Media, Add Form, Quick Save, and Visual/Code switches */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 px-3 border-b border-slate-200">
                      
                      {/* Left Quick Inserters: Add Media & Add Form */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowMediaModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all shadow-xs font-simple"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>Add Media (میڈیا)</span>
                        </button>

                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowFormModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-xs font-simple"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Add Form (فارم)</span>
                        </button>
                      </div>

                      {/* Right Quick Actions & Visual / Code Toggles */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleSaveArticle}
                          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all font-simple"
                          title="مضمون محفوظ کریں (Save Article)"
                        >
                          <Save className="w-3 h-3" />
                          <span>محفوظ کریں</span>
                        </button>

                        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-xs font-simple border border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              if (editorMode === 'code' && visualEditorRef.current) {
                                visualEditorRef.current.innerHTML = articleForm.content;
                              }
                              setEditorMode('visual');
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition-colors font-bold ${editorMode === 'visual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Visual (ویژول)
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (editorMode === 'visual' && visualEditorRef.current) {
                                setArticleForm({...articleForm, content: visualEditorRef.current.innerHTML});
                              }
                              setEditorMode('code');
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition-colors font-bold ${editorMode === 'code' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Code (کوڈ)
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (editorMode === 'visual' && visualEditorRef.current) {
                                setArticleForm({...articleForm, content: visualEditorRef.current.innerHTML});
                              }
                              setEditorMode('preview');
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition-colors font-bold ${editorMode === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Preview (پریویو)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* INTERACTIVE SELECTED IMAGE FLOATING CONTROL TOOLBAR */}
                    {/* Appears smoothly when an image inside the editor is clicked */}
                    {/* ========================================================= */}
                    {selectedImgElement && (
                      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border-b-2 border-blue-500 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs z-30 animate-in slide-in-from-top-2 duration-200 font-simple">
                        
                        {/* Image Identifier */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-blue-400 shrink-0">
                              <img src={selectedImgProps.src} alt="thumbnail" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">تصویر منتخب ہے:</span>
                              <span className="text-[10px] text-blue-700 font-sans">{selectedImgProps.widthPercent}% چوڑائی • {selectedImgProps.align}</span>
                            </div>
                          </div>

                          {/* Quick Size Buttons & Live Slider */}
                          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                            <span className="text-slate-700 font-bold">سائز:</span>
                            {[25, 50, 75, 100].map(pct => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => applyImageWidth(pct)}
                                className={`px-2 py-0.5 rounded-lg text-xs font-sans font-bold transition-all ${
                                  selectedImgProps.widthPercent === pct 
                                    ? 'bg-blue-600 text-white shadow-xs' 
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {pct}%
                              </button>
                            ))}

                            <div className="flex items-center gap-1.5 mr-2">
                              <input
                                type="range"
                                min="15"
                                max="100"
                                value={selectedImgProps.widthPercent}
                                onChange={(e) => applyImageWidth(Number(e.target.value))}
                                className="w-20 accent-blue-600 cursor-pointer"
                                title="اپنی مرضی کا سائز سلائیڈ کریں"
                              />
                            </div>
                          </div>

                          {/* Quick Alignment Buttons */}
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                            <span className="text-slate-700 font-bold px-1.5">پوزیشن:</span>
                            
                            <button
                              type="button"
                              onClick={() => applyImageAlign('right')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'right' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                              title="دائیں طرف رکھیں اور ٹیکسٹ بائیں لپٹائیں (Float Right)"
                            >
                              ⬅ دائیں ریپ
                            </button>

                            <button
                              type="button"
                              onClick={() => applyImageAlign('center')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'center' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                              title="درمیان میں رکھیں (Center Block)"
                            >
                              ⬛ درمیان
                            </button>

                            <button
                              type="button"
                              onClick={() => applyImageAlign('left')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'left' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                              title="بائیں طرف رکھیں اور ٹیکسٹ دائیں لپٹائیں (Float Left)"
                            >
                              ➡ بائیں ریپ
                            </button>

                            <button
                              type="button"
                              onClick={() => applyImageAlign('full')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'full' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                              title="فل اسکرین بینر (Full Width 100%)"
                            >
                              ↔ فل بینر
                            </button>
                          </div>

                          {/* Rounded Corner Styles */}
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                            <span className="text-slate-700 font-bold px-1">گولائی:</span>
                            {[
                              { label: 'سادہ', val: '0px' },
                              { label: 'نرم', val: '12px' },
                              { label: 'گول', val: '24px' },
                            ].map(item => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => applyImageRadius(item.val)}
                                className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${selectedImgProps.borderRadius === item.val ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-100 text-slate-700'}`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>

                          {/* Image Actions: Replace, Delete, Close */}
                          <div className="flex items-center gap-1.5 mr-auto">
                            <button
                              type="button"
                              onClick={() => replaceImageFileInputRef.current?.click()}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              title="کمپیوٹر سے نئی تصویر منتخب کریں"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>تصویر بدلیں</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleDeleteSelectedImage}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-rose-200"
                              title="تصویر مضمون سے ڈیلیٹ کریں"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف کریں</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (selectedImgElement) selectedImgElement.style.outline = 'none';
                                setSelectedImgElement(null);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                              title="سلیکشن بند کریں"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      )}

                    {/* ========================================================= */}
                    {/* UNIFIED COMPACT FORMATTING TOOLBAR (Single Modern Row) */}
                    {/* ========================================================= */}
                    <div className="bg-slate-100/95 px-2 py-1.5 border-b border-slate-200 flex flex-wrap items-center gap-1 text-xs text-slate-700 select-none">
                      
                      {/* 1. Format / Heading Dropdown */}
                      <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded-lg border border-slate-300 font-simple shadow-xs">
                        <select
                          value={activeFormats.heading}
                          onChange={(e) => {
                            const tag = e.target.value;
                            if (tag === 'blockquote') {
                              execCmd('formatBlock', '<blockquote>');
                            } else if (tag === 'pre') {
                              execCmd('formatBlock', '<pre>');
                            } else {
                              execCmd('formatBlock', `<${tag}>`);
                            }
                          }}
                          className="bg-transparent border-0 text-xs text-slate-800 focus:outline-none cursor-pointer font-bold pr-0.5"
                          title="ہیڈنگ یا پیراگراف منتخب کریں"
                        >
                          <option value="p" className="bg-white text-slate-800">Paragraph (نارمل متن)</option>
                          <option value="h1" className="bg-white text-slate-800">Heading 1 (مین سرخی)</option>
                          <option value="h2" className="bg-white text-slate-800">Heading 2 (بڑی سرخی)</option>
                          <option value="h3" className="bg-white text-slate-800">Heading 3 (درمیانی سرخی)</option>
                          <option value="h4" className="bg-white text-slate-800">Heading 4 (چھوٹی سرخی)</option>
                          <option value="blockquote" className="bg-white text-slate-800">Quote (اقتباس)</option>
                          <option value="pre" className="bg-white text-slate-800">Preformatted</option>
                        </select>
                      </div>

                      {/* 2. Font Family Dropdown */}
                      <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded-lg border border-slate-300 shadow-xs">
                        <Type className="w-3 h-3 text-blue-600 shrink-0" />
                        <select
                          value={editorFont}
                          onMouseDown={() => saveCurrentSelection()}
                          onFocus={() => saveCurrentSelection()}
                          onChange={(e) => applyFontFamily(e.target.value)}
                          className="bg-transparent border-0 text-xs text-slate-800 focus:outline-none cursor-pointer pr-0.5 font-simple font-bold"
                          title="فونٹ کا انداز تبدیل کریں"
                        >
                          <option value="nastaliq" className="bg-white text-slate-800">نستعلیق (Noto Nastaliq)</option>
                          <option value="almarai" className="bg-white text-slate-800">المری سادہ (Almarai)</option>
                          <option value="tajawal" className="bg-white text-slate-800">تجوال (Tajawal)</option>
                          <option value="cairo" className="bg-white text-slate-800">قاہرہ (Cairo)</option>
                          <option value="segoe" className="bg-white text-slate-800">Segoe UI</option>
                          <option value="georgia" className="bg-white text-slate-800">Georgia</option>
                          <option value="arial" className="bg-white text-slate-800">Arial</option>
                          <option value="times" className="bg-white text-slate-800">Times New Roman</option>
                        </select>
                      </div>

                      {/* 3. Font Size Dropdown (Default 14px) */}
                      <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded-lg border border-slate-300 shadow-xs">
                        <span className="text-[10px] text-slate-500 font-sans">سائز:</span>
                        <select
                          value={editorFontSize}
                          onMouseDown={() => saveCurrentSelection()}
                          onFocus={() => saveCurrentSelection()}
                          onChange={(e) => applyFontSize(e.target.value)}
                          className="bg-transparent border-0 text-xs text-slate-800 focus:outline-none cursor-pointer pr-0.5 font-sans font-bold"
                          title="فونٹ سائز تبدیل کریں"
                        >
                          <option value="12px" className="bg-white text-slate-800">12px</option>
                          <option value="14px" className="bg-white text-slate-800">14px (معیاری)</option>
                          <option value="16px" className="bg-white text-slate-800">16px</option>
                          <option value="18px" className="bg-white text-slate-800">18px</option>
                          <option value="20px" className="bg-white text-slate-800">20px</option>
                          <option value="24px" className="bg-white text-slate-800">24px</option>
                          <option value="28px" className="bg-white text-slate-800">28px</option>
                          <option value="32px" className="bg-white text-slate-800">32px</option>
                          <option value="36px" className="bg-white text-slate-800">36px</option>
                          <option value="48px" className="bg-white text-slate-800">48px</option>
                        </select>
                      </div>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* 4. Text Styles: Bold, Italic, Underline, Strikethrough */}
                      <button
                        type="button"
                        onClick={() => execCmd('bold')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.bold 
                            ? 'bg-blue-600 text-white font-bold shadow-xs' 
                            : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="بولڈ (Bold: Ctrl+B)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('italic')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.italic 
                            ? 'bg-blue-600 text-white font-bold shadow-xs' 
                            : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="اٹالک (Italic: Ctrl+I)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('underline')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.underline 
                            ? 'bg-blue-600 text-white font-bold shadow-xs' 
                            : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="انڈر لائن (Underline: Ctrl+U)"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('strikeThrough')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.strike 
                            ? 'bg-blue-600 text-white font-bold shadow-xs' 
                            : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="اسٹرائیک تھرو (Strikethrough)"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* 5. Colors: Text Color & Highlight */}
                      <div className="flex items-center gap-1 bg-white border border-slate-300 px-1.5 py-0.5 rounded-md shadow-xs" title="ٹیکسٹ کا رنگ (Text Color)">
                        <span className="font-extrabold font-serif text-xs text-amber-600">A</span>
                        <input
                          type="color"
                          defaultValue="#0f172a"
                          onChange={(e) => execCmd('foreColor', e.target.value)}
                          className="w-3.5 h-3.5 bg-transparent border-0 cursor-pointer rounded"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-white border border-slate-300 px-1.5 py-0.5 rounded-md shadow-xs" title="ہائی لائٹر رنگ (Highlight Color)">
                        <Highlighter className="w-3 h-3 text-amber-500" />
                        <input
                          type="color"
                          defaultValue="#fef08a"
                          onChange={(e) => execCmd('hiliteColor', e.target.value)}
                          className="w-3.5 h-3.5 bg-transparent border-0 cursor-pointer rounded"
                        />
                      </div>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* 6. Alignment */}
                      <button
                        type="button"
                        onClick={() => execCmd('justifyRight')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'right' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="دائیں سے الائن (Right Align)"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('justifyCenter')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'center' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="درمیان الائن (Center Align)"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('justifyLeft')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'left' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="بائیں سے الائن (Left Align)"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('justifyFull')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'justify' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="مکمل پھیلاؤ (Justify Full)"
                      >
                        <AlignJustify className="w-3.5 h-3.5" />
                      </button>

                      {/* Text Direction RTL / LTR */}
                      <button
                        type="button"
                        onClick={() => setDirection('rtl')}
                        className="p-1 hover:bg-slate-200 rounded-md text-emerald-600 font-bold"
                        title="دائیں سے بائیں تحریر (RTL Direction)"
                      >
                        <span className="text-[11px] font-mono">¶⮞</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirection('ltr')}
                        className="p-1 hover:bg-slate-200 rounded-md text-blue-600 font-bold"
                        title="بائیں سے دائیں تحریر (LTR Direction)"
                      >
                        <span className="text-[11px] font-mono">⮜¶</span>
                      </button>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* 7. Lists & Indentation */}
                      <button
                        type="button"
                        onClick={() => execCmd('insertUnorderedList')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.ul ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="غیر ترتیبی فہرست (Bulleted List)"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('insertOrderedList')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.ol ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
                        }`}
                        title="نمبر وار فہرست (Numbered List)"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('formatBlock', '<blockquote>')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700"
                        title="اقتباس بلاک (Blockquote)"
                      >
                        <Quote className="w-3.5 h-3.5 text-amber-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('indent')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700"
                        title="انڈینٹ آگے بڑھائیں (Increase Indent)"
                      >
                        <Indent className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('outdent')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700"
                        title="انڈینٹ پیچھے ہٹائیں (Decrease Indent)"
                      >
                        <Outdent className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('insertHorizontalRule')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700"
                        title="افقی لکیر (Horizontal Divider)"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* 8. Media, Links, Tables, Symbols */}
                      <button
                        type="button"
                        onMouseDown={() => saveCurrentSelection()}
                        onClick={() => {
                          saveCurrentSelection();
                          setShowMediaModal(true);
                        }}
                        className="p-1 hover:bg-slate-200 rounded-md text-emerald-600"
                        title="تصویر شامل کریں (Insert Image)"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleInsertLink}
                        className="p-1 hover:bg-slate-200 rounded-md text-blue-600"
                        title="ویب لنک لگائیں (Insert Link)"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('unlink')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-500"
                        title="لنک ختم کریں (Remove Link)"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                      </button>

                      {/* Special Character / Symbols (Ω) */}
                      <div className="relative">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowSpecialChars(!showSpecialChars);
                          }}
                          className="p-1 hover:bg-slate-200 rounded-md text-slate-700 font-bold"
                          title="خاص علامات و اسلامی القابات (Special Characters: Ω)"
                        >
                          <span className="font-sans font-bold text-xs text-blue-600">Ω</span>
                        </button>

                        {showSpecialChars && (
                          <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-slate-200 rounded-xl p-2.5 shadow-xl z-50 text-right space-y-1.5 font-simple">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                              <span className="text-xs font-bold text-slate-800">خاص علامات و رموز</span>
                              <button type="button" onClick={() => setShowSpecialChars(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto p-0.5">
                              {SPECIAL_SYMBOLS.map((sym, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleInsertSymbol(sym.label)}
                                  className="p-1.5 text-center bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 rounded-md text-xs transition-colors"
                                  title={sym.desc}
                                >
                                  {sym.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Table Menu (⊞ ▾) */}
                      <div className="relative">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowTableMenu(!showTableMenu);
                          }}
                          className="p-1 hover:bg-slate-200 rounded-md text-blue-600 flex items-center gap-0.5"
                          title="ٹیبل داخل کریں (Insert Table)"
                        >
                          <TableIcon className="w-3.5 h-3.5" />
                          <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                        </button>

                        {showTableMenu && (
                          <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xl z-50 text-right space-y-1 font-simple">
                            <div className="text-[10px] text-slate-500 font-bold px-2 py-0.5 border-b border-slate-200 font-sans">
                              ٹیبل منتخب کریں:
                            </div>
                            <button
                              type="button"
                              onClick={() => handleInsertTable('2x2')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-slate-100 text-slate-800 text-xs font-bold"
                            >
                              2x2 سادہ ٹیبل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTable('3x3')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-slate-100 text-slate-800 text-xs font-bold"
                            >
                              3x3 علامات و امراض ٹیبل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTable('dosage')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 text-xs font-bold"
                            >
                              4-کالم طبی نسخہ و مقدار ٹیبل
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 1-Click Callout Box Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowBoxMenu(!showBoxMenu);
                          }}
                          className="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-md flex items-center gap-1 text-[11px] font-bold shadow-xs font-simple"
                          title="خوبصورت باکس / نسخہ کارڈ لگائیں"
                        >
                          <BoxSelect className="w-3.5 h-3.5" />
                          <span>باکس کارڈ</span>
                          <ChevronDown className="w-2.5 h-2.5" />
                        </button>

                        {showBoxMenu && (
                          <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xl z-50 space-y-1 text-right font-simple">
                            <div className="text-[10px] text-slate-500 font-bold px-2 py-0.5 border-b border-slate-200 font-sans">
                              باکس کا ڈیزائن منتخب کریں:
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => insertBox('green')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 flex items-center justify-between text-xs font-bold transition-colors"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span>سبز ہربل و فوائد باکس</span>
                              </div>
                              <Check className="w-3 h-3 text-emerald-600" />
                            </button>

                            <button
                              type="button"
                              onClick={() => insertBox('blue')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-blue-50 text-blue-800 flex items-center gap-1.5 text-xs font-bold transition-colors"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              <span>نیلا نسخہ و مقدار باکس</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => insertBox('amber')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-amber-50 text-amber-800 flex items-center gap-1.5 text-xs font-bold transition-colors"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              <span>پیلا پرہیز و احتیاط باکس</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => insertBox('red')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-rose-50 text-rose-800 flex items-center gap-1.5 text-xs font-bold transition-colors"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                              <span>سرخ طبی انتباہ باکس</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* 9. Utilities: Clear Formatting, Undo, Redo, Find/Replace, Shortcuts, Fullscreen */}
                      <button
                        type="button"
                        onClick={() => execCmd('removeFormat')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-600"
                        title="فارمیٹنگ ختم کریں (Clear Formatting)"
                      >
                        <Eraser className="w-3.5 h-3.5 text-amber-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('undo')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700"
                        title="واپس (Undo: Ctrl+Z)"
                      >
                        <Undo className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('redo')}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700"
                        title="دوبارہ (Redo: Ctrl+Y)"
                      >
                        <Redo className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowFindReplaceModal(true)}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700"
                        title="تلاش اور تبدیلی (Find & Replace)"
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowShortcutsModal(true)}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-500"
                        title="کی بورڈ شارٹ کٹس (Help & Shortcuts)"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-700 mr-auto"
                        title={isFullscreen ? "عام موڈ پر واپس جائیں" : "فل اسکرین لکھائی موڈ (Fullscreen)"}
                      >
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-600" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      </button>

                    </div>

                    </div>
                    {/* End of STICKY TOP TOOLBAR HEADER */}

                    {/* VISUAL CONTENTEDITABLE CANVAS */}
                    {editorMode === 'visual' && (
                      <div className="relative">
                        <div
                          ref={visualEditorRef}
                          contentEditable
                          onClick={handleEditorClick}
                          onInput={() => {
                            if (visualEditorRef.current) {
                              setArticleForm({ ...articleForm, content: visualEditorRef.current.innerHTML });
                            }
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onKeyUp={() => {
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onMouseUp={(e) => {
                            handleEditorClick(e);
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onSelect={() => {
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onTouchEnd={(e) => {
                            handleEditorClick(e);
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onBlur={() => {
                            saveCurrentSelection();
                          }}
                          className={`w-full bg-white text-slate-900 p-8 sm:p-12 min-h-[700px] lg:min-h-[800px] focus:outline-none focus:ring-0 visual-editor-content article-rendered-content selection:bg-blue-200 text-sm shadow-inner ${isFullscreen ? 'min-h-[85vh]' : ''}`}
                          style={{ direction: 'rtl', textAlign: 'right', fontSize: '14px' }}
                        />

                        {/* Bottom Status Bar */}
                        <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 rounded-b-3xl flex items-center justify-between text-xs text-slate-600 font-sans">
                          <div className="flex items-center gap-3">
                            <span>طبیب پیڈیا ویژول ایڈیٹر (Visual Canvas)</span>
                            <span>•</span>
                            <span>{selectedImgElement ? '🟢 تصویر منتخب ہے (ایڈٹ پینل فعال)' : 'حالت: فعال'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{stats.chars} حروف</span>
                            <span>•</span>
                            <span>{stats.words} الفاظ</span>
                            <span>•</span>
                            <span>{stats.readingTime} منٹ مطالعہ</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HTML SOURCE CODE MODE */}
                    {editorMode === 'code' && (
                      <div className="border-t border-slate-200 rounded-b-3xl overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 text-xs text-emerald-800 font-mono border-b border-slate-200 flex items-center justify-between">
                          <span>HTML Source Code View</span>
                          <span className="text-[11px] text-slate-500">کوڈ میں براہ راست ترمیم کر سکتے ہیں</span>
                        </div>
                        <textarea
                          rows={24}
                          value={articleForm.content}
                          onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                          placeholder="HTML Source Code..."
                          className="w-full bg-slate-950 text-emerald-400 p-6 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed min-h-[600px]"
                          style={{ direction: 'ltr', textAlign: 'left' }}
                        />
                      </div>
                    )}

                    {/* LIVE PREVIEW MODE */}
                    {editorMode === 'preview' && (
                      <div className="bg-white text-slate-900 border-t border-slate-200 rounded-b-3xl p-8 sm:p-12 min-h-[600px] overflow-y-auto space-y-6 font-nastaliq leading-[2.2] text-right">
                        <div className="border-b border-slate-100 pb-4">
                          <span className="text-xs bg-emerald-100 text-emerald-900 font-sans font-bold px-2.5 py-1 rounded-full">
                            لائیو پریویو
                          </span>
                          <h1 className="text-3xl font-bold font-simple text-slate-900 mt-3">
                            {articleForm.title || 'مضمون کا عنوان'}
                          </h1>
                        </div>
                        
                        {articleForm.featuredImage && (
                          <img src={articleForm.featuredImage} alt="Featured" className="w-full max-h-96 object-cover rounded-3xl shadow-sm" />
                        )}

                        <div 
                          className="prose max-w-none text-slate-800 text-sm leading-loose"
                          dangerouslySetInnerHTML={{ __html: articleForm.content || '<p class="text-slate-400">کوئی مواد درج نہیں کیا گیا...</p>' }}
                        />
                      </div>
                    )}

                  </div>

                  {/* 3. Short Excerpt Meta Box (خلاصہ سب سے آخر میں) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <label className="text-xs sm:text-sm font-bold text-slate-900 font-simple flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span>مختصر خلاصہ (Excerpt)</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-sans">اختیاری (Optional)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-simple">
                      مضمون کا خلاصہ جو ہوم پیج کارڈز، سرچ رزلٹس اور سوشل میڈیا پر نظر آئے گا:
                    </p>
                    <textarea
                      rows={2}
                      value={articleForm.excerpt}
                      onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                      placeholder="مضمون کا جامع خلاصہ یہاں درج کریں..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none font-nastaliq leading-relaxed shadow-xs"
                    />
                  </div>

                  {/* 4. Author & Reading Time Meta Box */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1 font-simple">مصنف / طبیب (Author)</label>
                      <input
                        type="text"
                        value={articleForm.author}
                        onChange={(e) => setArticleForm({...articleForm, author: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1 font-simple">مطالعہ کا تخمینی وقت (Reading Time)</label>
                      <input
                        type="text"
                        value={articleForm.readingTime}
                        onChange={(e) => setArticleForm({...articleForm, readingTime: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple shadow-xs"
                      />
                    </div>
                  </div>

                </div>

                {/* ========================================================= */}
                {/* 2. WORDPRESS DOCUMENT SIDEBAR (Right: Narrow ~280px-300px) */}
                {/* ========================================================= */}
                <div className="w-full lg:w-[280px] xl:w-[300px] shrink-0 space-y-3.5 sticky top-3">
                  
                  {/* Meta Box 1: Publish / Status */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 font-simple flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>پبلش و اسٹیٹس (Publish)</span>
                      </h3>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-sans ${articleForm.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                        {articleForm.status === 'published' ? 'پبلک' : 'پرائیویٹ'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-simple">
                      <div>
                        <label className="text-slate-600 block mb-1 text-[11px]">پبلشنگ اسٹیٹس:</label>
                        <select
                          value={articleForm.status}
                          onChange={(e) => setArticleForm({...articleForm, status: e.target.value})}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold shadow-xs"
                        >
                          <option value="published">🌐 پبلک (لائیو شائع کریں)</option>
                          <option value="private">🔒 ڈرافٹ (محفوظ رکھیں)</option>
                        </select>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>مطالعہ کا دورانیہ:</span>
                        <strong className="text-slate-800 font-sans">{stats.readingTime} منٹ ({stats.words} الفاظ)</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {editingArticleId ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteArticle(editingArticleId)}
                          className="text-red-600 hover:text-red-700 text-[11px] font-bold underline font-simple"
                        >
                          ڈیلیٹ
                        </button>
                      ) : <span />}

                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all font-simple"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingArticleId ? 'محفوظ کریں' : 'پبلش کریں'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Meta Box 2: Categories */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 font-simple flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        <span>زمرہ جات (Categories)</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowNewCatModal(!showNewCatModal)}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-bold font-simple"
                      >
                        + نیا زمرہ
                      </button>
                    </div>

                    {/* New Category Inline Input */}
                    {showNewCatModal && (
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 animate-in fade-in-50">
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="نئی کیٹیگری کا نام..."
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewCategory}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg font-simple shadow-xs"
                        >
                          شامل کریں
                        </button>
                      </div>
                    )}

                    {/* Category Search Filter */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="زمرہ تلاش کریں..."
                        value={categorySearchMeta}
                        onChange={(e) => setCategorySearchMeta(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-simple"
                      />
                    </div>

                    {/* Categories Hierarchical Tree List */}
                    <div className="space-y-1 max-h-64 overflow-y-auto p-0.5 font-simple text-xs custom-scrollbar">
                      {hierarchicalCategories
                        .filter(cat => !categorySearchMeta || cat.name.toLowerCase().includes(categorySearchMeta.toLowerCase()))
                        .map(cat => {
                          const isChecked = (Array.isArray(articleForm.categories) && (articleForm.categories.includes(cat.name) || articleForm.categories.includes(cat.id) || articleForm.categories.includes(cat.slug))) ||
                            articleForm.category === cat.id ||
                            articleForm.category === cat.name ||
                            articleForm.category === cat.slug;
                          return (
                            <label
                              key={cat.id || cat.slug || cat.name}
                              style={{ paddingRight: `${cat.depth * 18 + 8}px` }}
                              className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-all border ${
                                isChecked
                                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                                  : cat.depth === 0
                                    ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    let currentCats = Array.isArray(articleForm.categories) ? [...articleForm.categories] : [articleForm.category].filter(Boolean);
                                    if (e.target.checked) {
                                      if (!currentCats.includes(cat.name)) currentCats.push(cat.name);
                                    } else {
                                      currentCats = currentCats.filter(c => c !== cat.name && c !== cat.id && c !== cat.slug);
                                    }
                                    setArticleForm({
                                      ...articleForm,
                                      category: currentCats[0] || cat.id,
                                      categories: currentCats
                                    });
                                  }}
                                  className="accent-blue-600 w-3.5 h-3.5 cursor-pointer rounded shrink-0"
                                />
                                {cat.depth > 0 && (
                                  <span className="text-slate-400 select-none text-[11px] font-mono shrink-0">
                                    {cat.depth === 1 ? '— ' : '—— '}
                                  </span>
                                )}
                                <span className={`text-xs truncate ${cat.depth === 0 ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                                  {cat.name}
                                </span>
                              </div>
                              {isChecked && (
                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              )}
                            </label>
                          );
                        })}
                    </div>
                  </div>

                  {/* Meta Box 3: Featured Image */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 font-simple flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>فیچرڈ تصویر (Featured Image)</span>
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {/* Image Preview Box */}
                      <div className="h-36 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative flex items-center justify-center group shadow-xs">
                        {articleForm.featuredImage ? (
                          <>
                            <img
                              src={articleForm.featuredImage}
                              alt="Featured preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg shadow-md font-simple"
                              >
                                تصویر بدلیں
                              </button>
                              <button
                                type="button"
                                onClick={() => setArticleForm({...articleForm, featuredImage: ''})}
                                className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg shadow-md font-simple"
                              >
                                ہٹائیں
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-slate-400 text-xs p-3">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-40 text-slate-400" />
                            <span className="block font-simple font-bold text-slate-600 text-xs">کوئی تصویر نہیں</span>
                            <span className="text-[10px] text-slate-400">نیچے سے منتخب کریں</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Options */}
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-simple border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setArticleForm({...articleForm, imageType: 'upload'})}
                          className={`flex-1 py-1 rounded-md text-center text-[11px] font-bold transition-colors ${articleForm.imageType === 'upload' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          کمپیوٹر سے
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleForm({...articleForm, imageType: 'url'})}
                          className={`flex-1 py-1 rounded-md text-center text-[11px] font-bold transition-colors ${articleForm.imageType === 'url' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          آن لائن لنک
                        </button>
                      </div>

                      {articleForm.imageType === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleThumbnailUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 text-center text-xs text-slate-600 hover:text-slate-900 transition-all space-y-0.5 bg-slate-50"
                          >
                            <UploadCloud className="w-5 h-5 mx-auto text-blue-600" />
                            <span className="font-bold block font-simple text-[11px]">کمپیوٹر سے تصویر منتخب کریں</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={articleForm.featuredImage}
                            onChange={(e) => setArticleForm({...articleForm, featuredImage: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meta Box 5: SEO Settings */}
                  <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 font-simple flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>SEO / سرچ انجن سیٹنگز</span>
                      </h3>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="text-slate-600 block mb-1 text-[11px] font-simple">SEO عنوان (Google Title):</label>
                        <input
                          type="text"
                          value={articleForm.seoTitle || articleForm.title}
                          onChange={(e) => setArticleForm({...articleForm, seoTitle: e.target.value})}
                          placeholder="Google پر نظر آنے والا عنوان..."
                          maxLength={60}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block font-sans">{(articleForm.seoTitle || articleForm.title || '').length}/60</span>
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1 text-[11px] font-simple">SEO تفصیل (Meta Description):</label>
                        <textarea
                          value={articleForm.seoDescription || articleForm.excerpt}
                          onChange={(e) => setArticleForm({...articleForm, seoDescription: e.target.value})}
                          placeholder="Google میں نظر آنے والی مختصر تفصیل (160 حروف)..."
                          maxLength={160}
                          rows={3}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple resize-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block font-sans">{(articleForm.seoDescription || articleForm.excerpt || '').length}/160</span>
                      </div>
                      {/* Google Preview */}
                      <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-left">
                        <div className="text-[11px] text-green-700 font-sans truncate">tabeebpedia.com › {articleForm.slug || 'article-slug'}</div>
                        <div className="text-[12px] text-blue-700 font-bold font-sans truncate mt-0.5">{(articleForm.seoTitle || articleForm.title || 'مضمون کا عنوان').substring(0, 55)}</div>
                        <div className="text-[10px] text-slate-600 font-sans mt-0.5 line-clamp-2">{(articleForm.seoDescription || articleForm.excerpt || 'مضمون کی تفصیل یہاں نظر آئے گی...').substring(0, 140)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Meta Box 4: Tags */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 font-simple flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5 text-cyan-600" />
                        <span>ٹیگز (Tags)</span>
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {/* Tag Input Field with Button */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="ٹیگ لکھیں..."
                          className="flex-1 bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag()}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold font-simple transition-colors shadow-xs"
                        >
                          + شامل کریں
                        </button>
                      </div>

                      {/* Active Tag Pills */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean) : (articleForm.tags || [])).map(t => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-lg text-[11px] font-simple shadow-xs"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(t)}
                              className="hover:text-red-600 transition-colors"
                              title="ٹیگ ہٹائیں"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Popular Suggested Tags */}
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[10px] text-slate-500 block font-simple">اکثر استعمال ہونے والے ٹیگز:</span>
                        <div className="flex flex-wrap gap-1">
                          {['طب یونانی', 'قانون مفرد اعضاء', 'جڑی بوٹیاں', 'معدہ و تبخیر', 'ہربل نسخے', 'علاج بالغذائ'].map(pt => (
                            <button
                              key={pt}
                              type="button"
                              onClick={() => handleAddTag(pt)}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-simple transition-colors"
                            >
                              +{pt}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </form>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 0: WORDPRESS STYLE MAIN DASHBOARD */}
          {/* ========================================================= */}
          {adminTab === 'dashboard' && (
            <div className="space-y-7">
              
              {/* Dashboard Welcome Header */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white border border-blue-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
                        ورڈپریس طرز ایڈمن کنٹرول سینٹر
                      </span>
                      <span className="text-xs text-slate-500 font-sans">
                        TabeebPedia CMS v2.5
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-simple mt-2">
                      ڈیش بورڈ (Dashboard)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
                      خوش آمدید، حکیم سید عبد الوہاب شاہ صاحب! یہاں آپ کی ویب سائٹ کی تمام اہم سرگرمیاں، رئیل ٹائم وزٹرز اور سمریز موجود ہیں۔
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onBackToWebsite}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all font-simple"
                    >
                      <Globe className="w-4 h-4" />
                      <span>ویب سائٹ وزٹ کریں (Visit Site)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenNewArticle}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition-all font-simple"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>نیا مضمون لکھیں</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminTab('new-page')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition-all font-simple"
                    >
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>نیا صفحہ بنائیں</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* At a Glance (ایک نظر میں - WordPress Style Primary Widgets) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Posts */}
                <div 
                  onClick={() => setAdminTab('articles')}
                  className="bg-white border border-slate-200/90 hover:border-blue-400 p-5 rounded-2xl shadow-xs hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-sans">شائع شدہ مضامین</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 font-mono">{articlesList.length}</span>
                    <span className="text-xs text-emerald-700 font-bold font-sans">
                      ({articlesList.filter(a => a.status !== 'private').length} لائیو)
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="text-blue-600 group-hover:underline">تمام مضامین دیکھیں &larr;</span>
                    <span className="text-amber-600 font-mono">{articlesList.filter(a => a.status === 'private').length} ڈرافٹ</span>
                  </div>
                </div>

                {/* 2. Pages */}
                <div 
                  onClick={() => setAdminTab('pages')}
                  className="bg-white border border-slate-200/90 hover:border-purple-400 p-5 rounded-2xl shadow-xs hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-sans">ویب سائٹ صفحات</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 font-mono">{pagesList.length}</span>
                    <span className="text-xs text-purple-700 font-bold font-sans">صفحات</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="text-purple-600 group-hover:underline">صفحات کا انتظام &larr;</span>
                    <span>جامع ہربل صفحات</span>
                  </div>
                </div>

                {/* 3. Doctors */}
                <div 
                  onClick={() => setAdminTab('doctors')}
                  className="bg-white border border-slate-200/90 hover:border-emerald-400 p-5 rounded-2xl shadow-xs hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-sans">اطباء و ماہرین ڈائریکٹری</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 font-mono">{doctorsList.length}</span>
                    <span className="text-xs text-emerald-700 font-bold font-sans">رجسٹرڈ اطباء</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="text-emerald-600 group-hover:underline">اطباء لسٹ دیکھیں &larr;</span>
                    <span className="text-amber-700 font-sans">
                      {doctorsList.filter(d => d && (d.isApproved === false || d.status === 'pending')).length} زیرِ التواء
                    </span>
                  </div>
                </div>

                {/* 4. Categories */}
                <div 
                  onClick={() => setAdminTab('categories')}
                  className="bg-white border border-slate-200/90 hover:border-amber-400 p-5 rounded-2xl shadow-xs hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-sans">زمرہ جات و کیٹیگریز</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 font-mono">{categoriesList.length}</span>
                    <span className="text-xs text-amber-700 font-bold font-sans">کیٹیگریز</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="text-amber-600 group-hover:underline">کیٹیگریز دیکھیں &larr;</span>
                    <span>الف بائی و موضوعاتی</span>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* REAL-TIME VISITOR & TRAFFIC ANALYTICS SYSTEM (100% ACCURATE) */}
              {/* ========================================================= */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
                
                {/* Analytics Section Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 font-simple">
                          ویب سائٹ وزٹرز اور ٹریفک تجزیہ (Real-Time Analytics)
                        </h3>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                          <span>رئیل ٹائم فعال</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">
                        حقیقی اور مستند وزٹرز اور پیج ویوز کا خودکار شمار (ڈیلی، ہفتہ وار، ماہانہ اور سالانہ)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Active Live Visitors Pill */}
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
                      <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span>لائیو آن لائن:</span>
                      <strong className="font-mono text-sm text-emerald-700">{analyticsData?.activeNow || 1}</strong>
                      <span className="text-[10px] text-emerald-600">افراد</span>
                    </div>

                    {/* Refresh Analytics Button */}
                    <button
                      type="button"
                      onClick={loadAnalytics}
                      disabled={isLoadingAnalytics}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-2xs"
                      title="تازہ ترین ڈیٹا ریفریش کریں"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
                      <span>تازہ کریں</span>
                    </button>
                  </div>
                </div>

                {/* 4 Time-Frame Visitor & View Metrics Grid (Daily, Weekly, Monthly, Yearly) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* 1. Daily (آج کی ٹریفک) */}
                  <div className="bg-gradient-to-br from-blue-50/60 via-white to-white border border-blue-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-800">آج کی ٹریفک (Daily / Today)</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md font-mono">
                        آج
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <div className="text-[11px] text-slate-500">منفرد وزٹرز:</div>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                          {analyticsData?.today?.visitors ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">کل پیج ویوز:</div>
                        <div className="text-2xl font-bold text-blue-600 font-mono mt-0.5">
                          {analyticsData?.today?.views ?? 0}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>گزشتہ کل:</span>
                      <span className="font-mono text-slate-600 font-bold">
                        {analyticsData?.yesterday?.visitors ?? 0} وزٹرز ({analyticsData?.yesterday?.views ?? 0} ویوز)
                      </span>
                    </div>
                  </div>

                  {/* 2. Weekly (اس ہفتے کی ٹریفک) */}
                  <div className="bg-gradient-to-br from-emerald-50/60 via-white to-white border border-emerald-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">ہفتہ وار (Weekly / 7 Days)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md font-mono">
                        7 دن
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <div className="text-[11px] text-slate-500">منفرد وزٹرز:</div>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                          {analyticsData?.thisWeek?.visitors ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">کل پیج ویوز:</div>
                        <div className="text-2xl font-bold text-emerald-600 font-mono mt-0.5">
                          {analyticsData?.thisWeek?.views ?? 0}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>پچھلے 7 دنوں کا مجموعہ</span>
                      <span className="text-emerald-700 font-bold">مستند ڈیٹا</span>
                    </div>
                  </div>

                  {/* 3. Monthly (اس ماہ کی ٹریفک) */}
                  <div className="bg-gradient-to-br from-purple-50/60 via-white to-white border border-purple-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-800">ماہانہ (Monthly / This Month)</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-md font-mono">
                        رواں ماہ
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <div className="text-[11px] text-slate-500">منفرد وزٹرز:</div>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                          {analyticsData?.thisMonth?.visitors ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">کل پیج ویوز:</div>
                        <div className="text-2xl font-bold text-purple-600 font-mono mt-0.5">
                          {analyticsData?.thisMonth?.views ?? 0}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>رواں ماہ کا کل ریکارڈ</span>
                      <span className="text-purple-700 font-bold">100% اصلی</span>
                    </div>
                  </div>

                  {/* 4. Yearly (اس سال اور ہمہ وقتی ٹریفک) */}
                  <div className="bg-gradient-to-br from-amber-50/60 via-white to-white border border-amber-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">سالانہ (Yearly / This Year)</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md font-mono">
                        سال {new Date().getFullYear()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <div className="text-[11px] text-slate-500">منفرد وزٹرز:</div>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                          {analyticsData?.thisYear?.visitors ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">کل پیج ویوز:</div>
                        <div className="text-2xl font-bold text-amber-600 font-mono mt-0.5">
                          {analyticsData?.thisYear?.views ?? 0}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>ہمہ وقت (All-Time):</span>
                      <span className="font-mono text-amber-800 font-bold">
                        {analyticsData?.allTime?.views ?? 0} ویوز
                      </span>
                    </div>
                  </div>

                </div>

                {/* Interactive Daily Traffic Trend Visualization (Last 14 Days) */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-bold text-slate-800">
                        روزانہ ٹریفک کا تصویری چارٹ (پچھلے 14 دن)
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600 font-sans">
                        <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block"></span>
                        <span>پیج ویوز (Views)</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600 font-sans">
                        <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span>
                        <span>وزٹرز (Visitors)</span>
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="pt-4">
                    {(() => {
                      const days = analyticsData?.chartDays || [];
                      const maxViews = Math.max(...days.map(d => Math.max(d.views || 0, d.visitors || 0, 1)), 5);
                      
                      return (
                        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 items-end min-h-[140px] pt-4">
                          {days.map((day, idx) => {
                            const viewHeight = Math.max(Math.round(((day.views || 0) / maxViews) * 100), 6);
                            const visHeight = Math.max(Math.round(((day.visitors || 0) / maxViews) * 100), 6);
                            const isToday = idx === days.length - 1;

                            return (
                              <div key={day.date || idx} className="flex flex-col items-center gap-1 group relative">
                                {/* Hover Tooltip */}
                                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                                  <span className="font-bold">{day.date}</span>
                                  <span>ویوز: {day.views} | وزٹرز: {day.visitors}</span>
                                </div>

                                <div className="w-full flex items-end justify-center gap-1 h-24 bg-white/70 rounded-lg p-1 border border-slate-200/60">
                                  {/* Views Bar */}
                                  <div 
                                    style={{ height: `${viewHeight}%` }}
                                    className={`w-1/2 rounded-t-xs transition-all duration-300 ${isToday ? 'bg-blue-600' : 'bg-blue-400 group-hover:bg-blue-500'}`}
                                    title={`ویوز: ${day.views}`}
                                  />
                                  {/* Visitors Bar */}
                                  <div 
                                    style={{ height: `${visHeight}%` }}
                                    className={`w-1/2 rounded-t-xs transition-all duration-300 ${isToday ? 'bg-emerald-500' : 'bg-emerald-400 group-hover:bg-emerald-500'}`}
                                    title={`وزٹرز: ${day.visitors}`}
                                  />
                                </div>

                                <span className={`text-[10px] font-sans truncate w-full text-center ${isToday ? 'font-bold text-blue-600' : 'text-slate-500'}`}>
                                  {day.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 2-Column Analytics Details: Top Content & Device / Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Top Visited Pages & Articles (7 Columns) */}
                  <div className="lg:col-span-7 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold text-slate-800">
                          سب سے زیادہ وزٹ کیے جانے والے صفحات و مضامین
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500 font-sans">
                        لائیو ویوز شمار
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200/60">
                      {analyticsData?.topPages && analyticsData.topPages.length > 0 ? (
                        analyticsData.topPages.slice(0, 7).map((item, idx) => (
                          <div key={item.path || idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 truncate" title={item.title}>
                                  {item.title || item.path}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono truncate block" dir="ltr">
                                  {item.path}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono font-bold bg-white text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded-lg text-xs shadow-2xs">
                                {item.views} ویوز
                              </span>
                              <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-white transition-colors"
                                title="صفحہ کھولیں"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-slate-400 text-xs font-sans">
                          ابھی وزٹس کا ڈیٹا اکٹھا ہو رہا ہے... جیسے ہی وزیٹرز پیجز دیکھیں گے، یہاں فہرست ظاہر ہو جائے گی۔
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device Breakdown & Live Log (5 Columns) */}
                  <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                    
                    {/* Device Share */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-purple-600" />
                        <span>ڈیوائسز اور اسکرین تناسب</span>
                      </h4>

                      {(() => {
                        const dev = analyticsData?.devices || { mobile: 1, desktop: 1, tablet: 0 };
                        const totalDev = (dev.mobile || 0) + (dev.desktop || 0) + (dev.tablet || 0) || 1;
                        const mobPct = Math.round(((dev.mobile || 0) / totalDev) * 100);
                        const deskPct = Math.round(((dev.desktop || 0) / totalDev) * 100);
                        const tabPct = 100 - mobPct - deskPct;

                        return (
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-blue-600" /> موبائل فون:</span>
                              <strong className="font-mono">{mobPct}%</strong>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div style={{ width: `${mobPct}%` }} className="bg-blue-600 h-full rounded-full" />
                            </div>

                            <div className="flex items-center justify-between text-slate-600 pt-1">
                              <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-indigo-600" /> ڈیسک ٹاپ / کمپیوٹر:</span>
                              <strong className="font-mono">{deskPct}%</strong>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div style={{ width: `${deskPct}%` }} className="bg-indigo-600 h-full rounded-full" />
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Recent Live Activity Stream */}
                    <div className="pt-3 border-t border-slate-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>حالیہ وزٹس لاگ (Live Stream)</span>
                        <span className="text-[10px] text-emerald-600 font-bold">لائیو</span>
                      </h4>

                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-[11px]">
                        {analyticsData?.recentVisits && analyticsData.recentVisits.length > 0 ? (
                          analyticsData.recentVisits.slice(0, 5).map((v, i) => (
                            <div key={i} className="p-2 rounded-xl bg-white border border-slate-200/60 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <span className="font-bold text-slate-700 truncate block">{v.title || v.path}</span>
                                <span className="text-[10px] text-slate-400 font-sans">{v.device} • {v.browser}</span>
                              </div>
                              <span className="text-[10px] font-mono text-blue-600 shrink-0">{v.time}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 text-[11px] text-center py-2">کوئی حالیہ لاگ نہیں</p>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Main 2-Column WordPress Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Right Column: Quick Draft & Recent Activity */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Quick Draft Widget */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Edit3 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">فوری مسودہ (Quick Draft)</h3>
                          <p className="text-[11px] text-slate-500">کوئی نیا نسخہ یا خاکہ فوری طور پر بطور ڈرافٹ محفوظ کریں</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSaveQuickDraft} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={quickDraftTitle}
                          onChange={(e) => setQuickDraftTitle(e.target.value)}
                          placeholder="مضمون یا نسخے کا عنوان..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-simple"
                        />
                      </div>
                      <div>
                        <textarea
                          rows="3"
                          value={quickDraftContent}
                          onChange={(e) => setQuickDraftContent(e.target.value)}
                          placeholder="مضمون کے چیدہ نکات یا مواد یہاں لکھیں..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-simple leading-relaxed"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">
                          ڈرافٹ محفوظ کرنے کے بعد آپ <span className="text-blue-600 font-bold">All Posts</span> سے کبھی بھی مکمل ایڈیٹنگ کر سکتے ہیں۔
                        </span>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 font-simple shrink-0"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>ڈرافٹ محفوظ کریں</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Recent Activity Widget */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">حالیہ شائع شدہ مضامین (Recent Activity)</h3>
                          <p className="text-[11px] text-slate-500">تازہ ترین شامل کردہ طبی مضامین اور نسخہ جات</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAdminTab('articles')}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline"
                      >
                        تمام مضامین دیکھیں ({articlesList.length}) &larr;
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {filteredArticles.slice(0, 5).map((art) => (
                        <div key={art.id} className="py-3 flex items-center justify-between gap-3 group">
                          <div className="flex items-center gap-3 min-w-0">
                            <img 
                              src={art.featuredImage || siteSettings?.defaultArticleImage} 
                              alt="" 
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" 
                            />
                            <div className="min-w-0">
                              <h4 
                                onClick={() => handleEditArticle(art)}
                                className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate cursor-pointer font-h2"
                              >
                                {art.title}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="text-blue-600">{Array.isArray(art.categories) ? art.categories.slice(0, 2).join('، ') : art.category}</span>
                                <span>•</span>
                                <span className="font-mono">{art.publishedAt || art.date || '2024-09-24'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditArticle(art)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors"
                              title="ترمیم کریں"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`/${art.slug || art.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 transition-colors"
                              title="ویب سائٹ پر دیکھیں"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Left Column: Site Health & System Status */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Site Health Status (WordPress Style) */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">ویب سائٹ کی صحت (Site Health)</h3>
                          <p className="text-[11px] text-slate-500">سسٹم اور ہوسٹنگ پرفارمنس کا جائزہ</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        بہترین (Good)
                      </span>
                    </div>

                    <div className="space-y-3 pt-1 text-xs">
                      <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                        <div>
                          <h4 className="font-bold text-slate-800">مستقل ڈیٹا بیس سسٹم</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">تمام مضامین، صفحات اور سیٹنگز مستقل فائل ڈیٹا بیس میں محفوظ اور لائیو ہیں۔</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                        <div>
                          <h4 className="font-bold text-slate-800">ہوسٹنگر میڈیا لائبریری</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">3,000+ تمام تصاویر ہوسٹنگر سرور کے ساتھ تیز رفتار کنکشن پر کام کر رہی ہیں۔</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                        <div>
                          <h4 className="font-bold text-slate-800">ایڈمن سیکیورٹی پروٹیکشن</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">ایڈمن ڈیش بورڈ پاس ورڈ تصدیق کے تحت مکمل محفوظ ہے۔</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Shortcuts & Management */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 font-simple border-b border-slate-100 pb-3">
                      فوری ٹولز اور ترتیبات (Quick Tools)
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setAdminTab('settings')}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-400 text-right transition-all group"
                      >
                        <Settings className="w-4 h-4 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="block text-xs font-bold text-slate-800">ویب سائٹ ترتیبات</span>
                        <span className="text-[10px] text-slate-500">لوگو، ہوم پیج، اشتہارات</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminTab('media')}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-purple-400 text-right transition-all group"
                      >
                        <ImageIcon className="w-4 h-4 text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="block text-xs font-bold text-slate-800">میڈیا لائبریری</span>
                        <span className="text-[10px] text-slate-500">تصاویر اپلوڈ اور انتظام</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminTab('doctors')}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-400 text-right transition-all group"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="block text-xs font-bold text-slate-800">اطباء کا جائزہ</span>
                        <span className="text-[10px] text-slate-500">نئی درخواستیں منظور کریں</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminTab('migration')}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-amber-400 text-right transition-all group"
                      >
                        <Database className="w-4 h-4 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="block text-xs font-bold text-slate-800">مائیگریشن ٹول</span>
                        <span className="text-[10px] text-slate-500">ورڈپریس ڈیٹا بیک اپ</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: ARTICLES LIST & MANAGEMENT TABLE */}
          {/* ========================================================= */}
          {adminTab === 'articles' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple">
                    شائع شدہ اور پرائیویٹ مضامین
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans">
                    تمام 300 تا 400 آرٹیکلز کی مکمل مانیٹرنگ، ایڈیٹنگ اور اسٹیٹس کنٹرول
                  </p>
                </div>

                <button
                  onClick={handleOpenNewArticle}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md font-simple"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>نیا مضمون لکھیں</span>
                </button>
              </div>

              {/* Filters & WordPress-Style Pagination Bar (Top) */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:flex-initial sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="مضمون کا عنوان یا مصنف تلاش کریں..."
                      className="w-full bg-white border border-slate-300 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-simple shadow-xs"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-600 font-sans">اسٹیٹس:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold shadow-xs"
                    >
                      <option value="all">تمام مضامین</option>
                      <option value="published">صرف پبلک (Live)</option>
                      <option value="private">صرف پرائیویٹ (Draft)</option>
                    </select>
                  </div>

                  {/* Sort Order Selector (Latest First / Oldest First) */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-600 font-sans">ترتیب:</span>
                    <select
                      value={postSortOrder}
                      onChange={(e) => setPostSortOrder(e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold shadow-xs"
                    >
                      <option value="latest">تازہ ترین پہلے (Latest First)</option>
                      <option value="oldest">پرانے پہلے (Oldest First)</option>
                    </select>
                  </div>

                  {/* Posts Per Page Selector (Default 20, 50, 100) */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-600 font-sans">فی صفحہ:</span>
                    <select
                      value={postsPerPage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setPostsPerPage(val);
                        try {
                          localStorage.setItem('tabeeb_admin_posts_per_page', String(val));
                        } catch {}
                      }}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold shadow-xs"
                    >
                      <option value={20}>20 مضامین (ڈیفالٹ)</option>
                      <option value={50}>50 مضامین</option>
                      <option value={100}>100 مضامین</option>
                    </select>
                  </div>
                </div>

                {/* Top Pagination Summary & Quick Nav Buttons (WordPress Style) */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-600 font-sans border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-200">
                  <span className="whitespace-nowrap">
                    کل <strong className="text-slate-900 font-mono">{totalFilteredPosts}</strong> مضامین | صفحہ <strong className="text-blue-600 font-mono">{safeCurrentPage}</strong> از <strong className="text-slate-800 font-mono">{totalPages}</strong>
                  </span>
                  
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    <button
                      type="button"
                      disabled={safeCurrentPage <= 1}
                      onClick={() => setCurrentPage(1)}
                      title="پہلا صفحہ"
                      className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={safeCurrentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      title="پچھلا صفحہ"
                      className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={safeCurrentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      title="اگلا صفحہ"
                      className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={safeCurrentPage >= totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      title="آخری صفحہ"
                      className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Banner */}
              {selectedArticleIds.length > 0 && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl shadow-xs">
                  <span className="text-xs text-red-700 font-bold">
                    {selectedArticleIds.length} مضامین منتخب ہیں
                  </span>
                  <button
                    onClick={handleBulkDeleteArticles}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>منتخب مضامین ڈیلیٹ کریں (Bulk Delete)</span>
                  </button>
                </div>
              )}

              {/* Articles Table */}
              <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white shadow-xs">
                <table className="w-full text-right text-sm text-slate-700 font-sans">
                  <thead className="text-xs text-slate-700 border-b border-slate-200 bg-slate-50 font-bold">
                    <tr>
                      <th className="px-4 py-3.5 w-10 text-center">
                        <input 
                          type="checkbox" 
                          checked={paginatedArticles.length > 0 && paginatedArticles.every(a => selectedArticleIds.includes(a.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedArticleIds(prev => Array.from(new Set([...prev, ...paginatedArticles.map(a => a.id)])));
                            } else {
                              const pageIds = new Set(paginatedArticles.map(a => a.id));
                              setSelectedArticleIds(prev => prev.filter(id => !pageIds.has(id)));
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 cursor-pointer" 
                          title="اس صفحے کے تمام مضامین منتخب کریں"
                        />
                      </th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Title</th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Author</th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Categories</th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Tags</th>
                      <th 
                        className="px-4 py-3.5 font-bold text-slate-800 cursor-pointer hover:text-blue-600 select-none transition-colors"
                        onClick={() => setPostSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest')}
                        title="تاریخ کے حساب سے ترتیب بدلیں (کلک کریں)"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Date</span>
                          <span className="text-[10px] text-blue-600 font-mono">
                            {postSortOrder === 'latest' ? '▼ (Latest)' : '▲ (Oldest)'}
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedArticles.length === 0 ? (
                      <tr><td colSpan="6" className="p-8 text-center text-slate-500 font-simple">کوئی مضمون نہیں ملا</td></tr>
                    ) : (
                      paginatedArticles.map(art => (
                        <tr key={art.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-4 py-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedArticleIds.includes(art.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedArticleIds(prev => [...prev, art.id]);
                                } else {
                                  setSelectedArticleIds(prev => prev.filter(id => id !== art.id));
                                }
                              }}
                              className="rounded border-slate-300 text-blue-600 cursor-pointer" 
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img src={art.featuredImage || siteSettings?.defaultArticleImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                              <div>
                                <span onClick={() => handleEditArticle(art)} className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-h2 text-base">
                                  {art.title} {art.status === 'private' ? '— Draft' : ''}
                                </span>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                  <span onClick={() => handleEditArticle(art)} className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">Edit</span>
                                  <span onClick={() => handleDeleteArticle(art.id)} className="text-red-600 hover:text-red-800 cursor-pointer hover:underline">Trash</span>
                                  <a href={`/${art.slug || art.id}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 hover:underline">View</a>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs font-bold text-slate-700">
                            {art.author || 'syed abdul wahab shah'}
                          </td>
                          <td className="px-4 py-4 text-xs text-blue-600 font-medium">
                            {Array.isArray(art.categories) && art.categories.length > 0
                              ? art.categories.join('، ')
                              : (art.categoryName || art.category || 'عام زمرہ')}
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-600">
                            {Array.isArray(art.tags) && art.tags.length > 0
                              ? art.tags.join('، ')
                              : (art.tags || '—')}
                          </td>
                          <td className="px-4 py-4 text-xs">
                            <span className={art.status === 'published' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-medium'}>
                              {art.status === 'published' ? 'Published' : 'Draft'}
                            </span><br />
                            <span className="font-mono text-[11px] text-slate-500">
                              {art.publishedAt || art.date || '2024/09/24'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Comprehensive Pagination Bar (WordPress Style) */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs text-slate-600 font-sans">
                  {/* Range counter */}
                  <div>
                    مضامین <strong className="text-slate-900 font-mono">{startIndex + 1}</strong> تا <strong className="text-slate-900 font-mono">{endIndex}</strong> دکھائے جا رہے ہیں (کل <strong className="text-blue-600 font-mono">{totalFilteredPosts}</strong> میں سے)
                  </div>

                  {/* Numbered Pagination & Arrows */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={safeCurrentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span>پچھلا</span>
                    </button>

                    {/* Page Numbers */}
                    {getPaginationPages().map((pNum, idx) => {
                      if (pNum === '...') {
                        return <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-mono">…</span>;
                      }
                      const isCurrent = pNum === safeCurrentPage;
                      return (
                        <button
                          key={pNum}
                          type="button"
                          onClick={() => setCurrentPage(pNum)}
                          className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={safeCurrentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                    >
                      <span>اگلا</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Jump directly to Page Number */}
                  <div className="flex items-center gap-2">
                    <span>صفحہ نمبر:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      defaultValue={safeCurrentPage}
                      key={safeCurrentPage}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1 && val <= totalPages) {
                            setCurrentPage(val);
                          }
                        }
                      }}
                      className="w-14 bg-white border border-slate-300 text-slate-800 rounded-lg px-2 py-1 text-center font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
                      title="نمبر لکھ کر Enter دبائیں"
                    />
                    <span>از {totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: CATEGORIES */}
          {adminTab === 'categories' && (() => {
            const flattenedHierarchicalList = hierarchicalCategories;

            const getCategoryPostCount = (cat) => {
              const childCats = categoriesList.filter(c => c !== cat && c.parentId && isCategoryMatch(cat, c.parentId));
              const directCount = articlesList.filter(art => {
                if (isCategoryMatch(cat, art.category) || isCategoryMatch(cat, art.categoryName)) return true;
                if (Array.isArray(art.categories)) {
                  return art.categories.some(c => isCategoryMatch(cat, c));
                }
                return false;
              }).length;

              if (childCats.length > 0) {
                const totalCount = articlesList.filter(art => {
                  if (isCategoryMatch(cat, art.category) || isCategoryMatch(cat, art.categoryName)) return true;
                  if (Array.isArray(art.categories) && art.categories.some(c => isCategoryMatch(cat, c))) return true;
                  return childCats.some(ch => {
                    if (isCategoryMatch(ch, art.category) || isCategoryMatch(ch, art.categoryName)) return true;
                    if (Array.isArray(art.categories) && art.categories.some(c => isCategoryMatch(ch, c))) return true;
                    return false;
                  });
                }).length;
                return { direct: directCount, total: totalCount, hasChildren: true };
              }

              return { direct: directCount, total: directCount, hasChildren: false };
            };

            return (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple flex items-center gap-3">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                    <span>زمرہ جات / کیٹیگریز (Categories Hierarchy)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ورڈپریس طرز پر بنیادی کیٹیگریز اور ان کے تحت ذیلی کیٹیگریز (Sub-categories) کا مکمل نظام
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left Form: Add / Edit Category */}
                  <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-4 sticky top-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                      <h3 className="text-base font-bold text-slate-800 font-simple">
                        {categoryForm.id ? 'کیٹیگری میں ترمیم کریں (Edit)' : 'نیا زمرہ بنائیں (Add New)'}
                      </h3>
                      {categoryForm.id && (
                        <button
                          type="button"
                          onClick={() => setCategoryForm({ id: null, name: '', slug: '', parentId: '' })}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          کینسل
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                          نام (Category Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={e => {
                            const name = e.target.value;
                            setCategoryForm(prev => ({
                              ...prev,
                              name,
                              slug: prev.id ? prev.slug : name.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-')
                            }));
                          }}
                          placeholder="مثلاً: پھل و سبزیاں یا الف..."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-bold focus:border-blue-500 outline-none shadow-xs"
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                          سلگ (Slug URL)
                        </label>
                        <input
                          type="text"
                          value={categoryForm.slug}
                          onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          placeholder="alif یا fruits"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-blue-600 text-xs font-mono focus:border-blue-500 outline-none text-left dir-ltr shadow-xs"
                        />
                      </div>

                      {/* Parent Category Dropdown (WordPress Hierarchical) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                          والدین زمرہ (Parent Category)
                        </label>
                        <select
                          value={categoryForm.parentId || ''}
                          onChange={e => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs focus:border-blue-500 outline-none font-bold shadow-xs"
                        >
                          <option value="">— کوئی نہیں (None - بنیادی کیٹیگری) —</option>
                          {hierarchicalCategories
                            .filter(c => c.id !== categoryForm.id && c.slug !== categoryForm.slug)
                            .map(c => (
                              <option key={c.id || c.slug} value={c.id || c.slug}>
                                {c.depth > 0 ? (c.depth === 1 ? '— ' : '—— ') : ''}{c.name}
                              </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1">
                          اگر اسے کسی دوسری کیٹیگری کے تحت لانا ہو تو اوپر اس کا والدین زمرہ منتخب کریں۔
                        </p>
                      </div>

                      {/* Submit & Cancel Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!categoryForm.name.trim()) {
                              alert('براہ کرم کیٹیگری کا نام درج کریں');
                              return;
                            }
                            const cleanSlug = (categoryForm.slug || categoryForm.name.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-')).replace(/\s+/g, '-');
                            
                            if (categoryForm.id) {
                              setCategoriesList(prev => prev.map(c => (c.id === categoryForm.id || c.slug === categoryForm.id) ? { ...categoryForm, slug: cleanSlug } : c));
                              showNotification('کیٹیگری میں ترمیم محفوظ ہو گئی!');
                            } else {
                              const newCat = {
                                id: cleanSlug,
                                name: categoryForm.name.trim(),
                                slug: cleanSlug,
                                parentId: categoryForm.parentId || null
                              };
                              setCategoriesList(prev => [...prev, newCat]);
                              showNotification('نئی کیٹیگری کامیابی سے شامل ہو گئی!');
                            }
                            setCategoryForm({ id: null, name: '', slug: '', parentId: '' });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex-1 shadow-md font-simple"
                        >
                          {categoryForm.id ? 'تبدیلیاں محفوظ کریں (Update)' : 'نیا زمرہ شامل کریں (Add)'}
                        </button>

                        {categoryForm.id && (
                          <button
                            type="button"
                            onClick={() => setCategoryForm({ id: null, name: '', slug: '', parentId: '' })}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs transition-colors"
                          >
                            کینسل
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: WordPress Style Hierarchical Table */}
                  <div className="lg:col-span-2 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <table className="w-full text-right text-sm text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 font-bold">
                        <tr>
                          <th className="p-3.5 font-bold text-slate-800">Name (نام زمرہ)</th>
                          <th className="p-3.5 font-bold text-slate-800">Parent (والدین)</th>
                          <th className="p-3.5 font-bold text-slate-800">Slug (سلگ)</th>
                          <th className="p-3.5 w-28 text-center font-bold text-slate-800">مضامین (Count)</th>
                          <th className="p-3.5 w-24 text-center font-bold text-slate-800">ایکشنز</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {flattenedHierarchicalList.map(cat => {
                          const parentCat = cat.parentId ? categoriesList.find(p => p !== cat && isCategoryMatch(p, cat.parentId)) : null;
                          return (
                            <tr key={cat.id || cat.slug} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5" style={{ paddingRight: `${cat.depth * 1.5}rem` }}>
                                  {cat.depth > 0 && (
                                    <span className="text-slate-400 font-bold select-none font-mono">
                                      {cat.depth === 1 ? '— ' : '—— '}
                                    </span>
                                  )}
                                  <span
                                    onClick={() => setCategoryForm({ ...cat, parentId: cat.parentId || '' })}
                                    className={`cursor-pointer hover:underline font-h2 text-sm ${
                                      cat.depth === 0 ? 'text-slate-900 font-bold' : 'text-blue-600'
                                    }`}
                                  >
                                    {cat.name}
                                  </span>
                                </div>
                              </td>

                              <td className="p-3.5 text-xs text-slate-600 font-simple">
                                {parentCat ? (
                                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                                    {parentCat.name}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>

                              <td className="p-3.5 text-xs font-mono text-slate-500">
                                /{cat.slug}
                              </td>

                              <td className="p-3.5 text-center">
                                {(() => {
                                  const stats = getCategoryPostCount(cat);
                                  if (stats.hasChildren) {
                                    return (
                                      <span
                                        onClick={() => {
                                          setSearchFilter(cat.name);
                                          setAdminTab('articles');
                                        }}
                                        title={`اس زمرے اور ذیلی زمرہ جات میں کل ${stats.total} مضامین ہیں`}
                                        className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                                      >
                                        {stats.total}
                                      </span>
                                    );
                                  }
                                  if (stats.direct > 0) {
                                    return (
                                      <span
                                        onClick={() => {
                                          setSearchFilter(cat.name);
                                          setAdminTab('articles');
                                        }}
                                        title={`اس زمرہ کے ${stats.direct} مضامین دیکھنے کے لیے کلک کریں`}
                                        className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                      >
                                        {stats.direct}
                                      </span>
                                    );
                                  }
                                  return (
                                    <span
                                      title="یہ زمرہ فی الوقت خالی ہے"
                                      className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200 select-none"
                                    >
                                      0 (خالی)
                                    </span>
                                  );
                                })()}
                              </td>

                              <td className="p-3.5 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setCategoryForm({ ...cat, parentId: cat.parentId || '' })}
                                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-slate-100 rounded transition-colors"
                                    title="ترمیم کریں (Edit)"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`کیا آپ واقعی کیٹیگری "${cat.name}" ڈیلیٹ کرنا چاہتے ہیں؟`)) {
                                        setCategoriesList(prev => prev.filter(c => c.id !== cat.id && c.slug !== cat.slug));
                                        showNotification('کیٹیگری ڈیلیٹ کر دی گئی');
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-800 p-1 hover:bg-slate-100 rounded transition-colors"
                                    title="حذف کریں (Delete)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            );
          })()}


          {adminTab === 'comments' && (() => {
            const allComments = [];
            articlesList.forEach(article => {
              if (article.comments && Array.isArray(article.comments)) {
                article.comments.forEach(c => {
                  allComments.push({ ...c, articleId: article.id, articleTitle: article.title });
                });
              }
            });
            // sort by date descending
            allComments.sort((a, b) => new Date(b.date) - new Date(a.date));

            const handleApprove = (commentId, articleId) => {
              const updatedArticles = articlesList.map(a => {
                if (a.id === articleId) {
                  return {
                    ...a,
                    comments: a.comments.map(c => c.id === commentId ? { ...c, status: 'approved' } : c)
                  };
                }
                return a;
              });
              setArticlesList(updatedArticles);
            };

            const handleReject = (commentId, articleId) => {
              if(!confirm('Are you sure you want to delete this comment?')) return;
              const updatedArticles = articlesList.map(a => {
                if (a.id === articleId) {
                  return {
                    ...a,
                    comments: a.comments.filter(c => c.id !== commentId)
                  };
                }
                return a;
              });
              setArticlesList(updatedArticles);
            };

            return (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 text-right">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span>قارئین کے تبصرے</span>
                    <MessageCircle className="w-7 h-7 text-blue-600" />
                  </h2>
                </div>
                <div className="space-y-4 text-right">
                  {allComments.length === 0 ? (
                    <p className="text-slate-500">No comments found.</p>
                  ) : (
                    allComments.map(c => (
                      <div key={c.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                            {c.status !== 'approved' && (
                              <button onClick={() => handleApprove(c.id, c.articleId)} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-xs font-bold hover:bg-emerald-200">منظور کریں</button>
                            )}
                            <button onClick={() => handleReject(c.id, c.articleId)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-200">حذف کریں</button>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{c.name} ({c.email})</h4>
                            <p className="text-xs text-slate-500">on <span className="font-bold">{c.articleTitle}</span> - {new Date(c.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2 text-slate-700 whitespace-pre-wrap">{c.text}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-[10px] rounded font-bold ${c.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{c.status === 'approved' ? 'منظور شدہ' : 'زیر التواء'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* VIEW: TAGS */}
          {adminTab === 'tags' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple">Tags (ٹیگز)</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl h-fit shadow-xs">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{tagForm.id ? 'Edit Tag' : 'Add New Tag'}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Name (نام)</label>
                      <input type="text" value={tagForm.name} onChange={e => {
                         const name = e.target.value;
                         setTagForm(prev => ({ ...prev, name, slug: prev.id ? prev.slug : name.trim().toLowerCase().replace(/\s+/g, '-') }));
                      }} className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-500 font-bold shadow-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Slug (سلگ)</label>
                      <input type="text" value={tagForm.slug} onChange={e => setTagForm({...tagForm, slug: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-blue-600 outline-none focus:border-blue-500 font-mono shadow-xs" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => {
                            if (!tagForm.name) return;
                            if (tagForm.id) {
                                setTagsList(prev => prev.map(c => c.id === tagForm.id ? tagForm : c));
                            } else {
                                setTagsList(prev => [...prev, { ...tagForm, id: Date.now() }]);
                            }
                            setTagForm({ id: null, name: '', slug: '' });
                        }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex-1 shadow-md">
                          {tagForm.id ? 'Update Tag' : 'Add New Tag'}
                        </button>
                        {tagForm.id && (
                            <button onClick={() => setTagForm({ id: null, name: '', slug: '' })} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                                Cancel
                            </button>
                        )}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs self-start">
                  <table className="w-full text-right text-sm text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 font-bold text-slate-800">Name</th><th className="p-4 font-bold text-slate-800">Slug</th><th className="p-4 w-24 text-center font-bold text-slate-800">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {tagsList.map(tag => (
                          <tr key={tag.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4 text-blue-600 font-bold font-h2">{tag.name}</td>
                              <td className="p-4 text-slate-500 font-sans">{tag.slug}</td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button onClick={() => setTagForm(tag)} className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-slate-100 rounded" title="Edit"><Edit3 className="w-4 h-4" /></button>
                                  <button onClick={() => {
                                      if(window.confirm('کیا آپ واقعی یہ ٹیگ ڈیلیٹ کرنا چاہتے ہیں؟')) {
                                          setTagsList(prev => prev.filter(c => c.id !== tag.id));
                                      }
                                  }} className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-slate-100 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                          </tr>
                      ))}
                      {tagsList.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-slate-500 font-simple">کوئی ٹیگ موجود نہیں</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================= */}
      

          
          {/* ========================================================= */}
          {/* VIEW: MEDIA LIBRARY */}
          {/* ========================================================= */}
          {adminTab === 'media' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple flex items-center gap-3">
                    <ImageIcon className="w-6 h-6 text-purple-600" />
                    <span>میڈیا لائبریری (Media Library)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ویب سائٹ کی تمام تصاویر، منسلک مضامین اور اپلوڈز کا مکمل کنٹرول
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md font-simple flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    <span>نئی تصویر اپلوڈ کریں</span>
                    <input type="file" multiple accept="image/*" onChange={handleMediaUpload} className="hidden" />
                  </label>

                  {selectedMediaIds.length > 0 && (
                    <button
                      onClick={handleBulkDeleteMedia}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md font-simple flex items-center gap-2 animate-pulse"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>منتخب ڈیلیٹ کریں ({selectedMediaIds.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Media Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-bold">فلٹر:</span>
                  <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-xs">
                    <button
                      onClick={() => setMediaFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${mediaFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      تمام میڈیا ({mediaList.length})
                    </button>
                    <button
                      onClick={() => setMediaFilter('attached')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${mediaFilter === 'attached' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      منسلک / زیر استعمال ({mediaList.filter(m => m.attachedTo).length})
                    </button>
                    <button
                      onClick={() => setMediaFilter('unattached')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${mediaFilter === 'unattached' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      صرف اپلوڈ / غیر منسلک ({mediaList.filter(m => !m.attachedTo).length})
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-64">
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                    <input
                      type="text"
                      value={mediaSearch}
                      onChange={e => setMediaSearch(e.target.value)}
                      placeholder="تصویر یا فائل تلاش کریں..."
                      className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 font-sans shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaList
                  .filter(item => {
                    if (mediaFilter === 'attached') return !!item.attachedTo;
                    if (mediaFilter === 'unattached') return !item.attachedTo;
                    return true;
                  })
                  .filter(item => !mediaSearch || item.name.toLowerCase().includes(mediaSearch.toLowerCase()) || (item.attachedTo && item.attachedTo.toLowerCase().includes(mediaSearch.toLowerCase())))
                  .map(media => {
                    const isSelected = selectedMediaIds.includes(media.id);
                    return (
                      <div
                        key={media.id}
                        className={`group relative bg-white border rounded-2xl overflow-hidden transition-all flex flex-col shadow-xs ${
                          isSelected ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="absolute top-2 right-2 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMediaIds(prev => [...prev, media.id]);
                              } else {
                                setSelectedMediaIds(prev => prev.filter(id => id !== media.id));
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-300 bg-white text-purple-600 focus:ring-0 cursor-pointer shadow-xs"
                          />
                        </div>

                        {/* Image Preview */}
                        <div className="aspect-square bg-slate-100 overflow-hidden relative">
                          <img
                            src={media.url}
                            alt={media.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteSingleMedia(media.id)}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow"
                              title="ڈیلیٹ کریں"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={media.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-[10px] font-bold shadow"
                            >
                              دیکھیں
                            </a>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5 text-right">
                          <p className="text-[11px] font-bold text-slate-800 truncate font-sans" title={media.name}>
                            {media.name}
                          </p>
                          <div>
                            {media.attachedTo ? (
                              <span className="inline-block text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold truncate max-w-full" title={`منسلک: ${media.attachedTo}`}>
                                🟢 منسلک: {media.attachedTo}
                              </span>
                            ) : (
                              <span className="inline-block text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                                ⚪ غیر منسلک (صرف اپلوڈ)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {mediaList.length === 0 && (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <ImageIcon className="w-12 h-12 mx-auto opacity-30" />
                  <p className="font-bold text-sm font-simple text-slate-600">میڈیا لائبریری خالی ہے</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          
          {/* ========================================================= */}
          {/* VIEW: WORDPRESS STYLE FULL PAGE WYSIWYG EDITOR */}
          {/* ========================================================= */}
          {adminTab === 'new-page' && pageForm && (
            <div className="space-y-4">
              
              {/* WordPress Top Action Bar */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAdminTab('pages')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 font-simple"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>تمام صفحات (All Pages)</span>
                  </button>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <div className="hidden sm:block">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-simple">
                      {editingPageId ? 'صفحے میں ترمیم کریں (Page Editor)' : 'نیا صفحہ تحریر کریں (New Page Editor)'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (pageEditorMode === 'visual' && pageVisualEditorRef.current) {
                        setPageForm({ ...pageForm, content: pageVisualEditorRef.current.innerHTML });
                      }
                      setPageEditorMode(pageEditorMode === 'preview' ? 'visual' : 'preview');
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border font-simple ${
                      pageEditorMode === 'preview' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{pageEditorMode === 'preview' ? 'ویژول موڈ' : 'پیش نظارہ (Preview)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPageForm(prev => ({ ...prev, status: 'draft' }));
                      handleSavePage();
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors font-simple border border-slate-200"
                  >
                    ڈرافٹ محفوظ کریں
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePage}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all font-simple"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingPageId ? 'صفحہ اپڈیٹ کریں (Update)' : 'صفحہ پبلش کریں (Publish)'}</span>
                  </button>
                </div>
              </div>

              {/* WordPress 2-Column Main Form Grid */}
              <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
                
                {/* 1. MAIN CONTENT AREA */}
                <div className="flex-1 min-w-0 w-full space-y-4">
                  
                  {/* Title & Permalink */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1 font-simple">
                        صفحے کا عنوان (Page Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={pageForm.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setPageForm(prev => ({
                            ...prev,
                            title: newTitle,
                            slug: prev.slug || newTitle.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-')
                          }));
                        }}
                        placeholder="یہاں صفحے کا عنوان درج کریں (مثلاً: ہمارے بارے میں / رابطہ کریں)..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-base sm:text-lg font-bold focus:outline-none focus:border-blue-600 font-h2 shadow-xs"
                      />
                    </div>

                    {/* Permalink Display */}
                    <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600">
                      <span className="font-bold text-slate-700">مستقل لنک (Permalink):</span>
                      <span className="text-slate-400 font-mono">http://localhost:3000/</span>
                      {isEditingPageSlug ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={tempPageSlug}
                            onChange={(e) => setTempPageSlug(e.target.value)}
                            className="bg-white border border-blue-500 rounded px-2 py-0.5 text-xs text-blue-700 font-mono outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPageForm(prev => ({ ...prev, slug: tempPageSlug.trim().replace(/\s+/g, '-') }));
                              setIsEditingPageSlug(false);
                            }}
                            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold"
                          >
                            اوکے
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingPageSlug(false)}
                            className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                          >
                            منسوخ
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-600 font-bold">
                            {pageForm.slug || 'page-slug'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setTempPageSlug(pageForm.slug || '');
                              setIsEditingPageSlug(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 underline text-[11px]"
                          >
                            تبدیل کریں
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* Dedicated Digital Books Management Studio (PDF Books) */}
                  {/* ========================================================= */}
                  {(pageForm && (pageForm.slug === 'pdf-books' || String(pageForm.id) === '8339' || (pageForm.title && (pageForm.title.includes('پی ڈی ایف') || pageForm.title.includes('PDF Books'))))) ? (
                    <div className="space-y-4">
                      {/* Studio Top Control Card */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-center gap-3.5">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 shrink-0">
                            <BookOpen className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-simple">
                                پی ڈی ایف کتب لائبریری سٹوڈیو (Digital Books Studio)
                              </h3>
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                {pdfBooksList.length} کتب
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-sans mt-0.5">
                              یہاں سے آپ لائبریری کی تمام کتب میں بغیر کسی کوڈنگ کے آسانی سے اضافہ، ترمیم یا حذف کر سکتے ہیں۔
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={handleOpenAddBook}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all font-simple cursor-pointer"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>+ نئی کتاب شامل کریں</span>
                          </button>

                          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-simple">
                            <button
                              type="button"
                              onClick={() => setPdfEditorSubTab('studio')}
                              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                pdfEditorSubTab === 'studio' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              کتب مینیجر
                            </button>
                            <button
                              type="button"
                              onClick={() => setPdfEditorSubTab('html')}
                              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                pdfEditorSubTab === 'html' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              خام HTML کوڈ
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Tab 1: Books Manager Studio */}
                      {pdfEditorSubTab === 'studio' && (
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
                          {/* Search & Category Filter Toolbar */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <div className="relative w-full sm:w-80">
                              <input
                                type="text"
                                value={bookSearchQuery}
                                onChange={(e) => setBookSearchQuery(e.target.value)}
                                placeholder="کتاب کا نام، مصنف یا موضوع تلاش کریں..."
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 font-simple shadow-xs"
                              />
                              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
                              {[
                                { id: 'all', name: 'تمام کتب' },
                                { id: 'qanoon', name: 'قانون مفرد اعضاء' },
                                { id: 'translations', name: 'تراجم' },
                                { id: 'diagnosis', name: 'تشخیص و لیب' },
                                { id: 'herbs', name: 'ادویات و فارماکوپیا' },
                                { id: 'health', name: 'صحت و مطب' }
                              ].map((cat) => {
                                const isActive = bookCategoryFilter === cat.id;
                                const count = cat.id === 'all' 
                                  ? pdfBooksList.length 
                                  : pdfBooksList.filter(b => b.categoryEn === cat.id || b.category === cat.name).length;
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setBookCategoryFilter(cat.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-simple cursor-pointer ${
                                      isActive 
                                        ? 'bg-emerald-600 text-white shadow-xs' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                    }`}
                                  >
                                    <span>{cat.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20' : 'bg-slate-200'}`}>{count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Filtered Books List */}
                          {(() => {
                            const filtered = pdfBooksList.filter(b => {
                              const matchCat = bookCategoryFilter === 'all' || b.categoryEn === bookCategoryFilter || b.category === bookCategoryFilter;
                              if (!matchCat) return false;
                              if (!bookSearchQuery.trim()) return true;
                              const q = bookSearchQuery.toLowerCase().trim();
                              return (b.title || '').toLowerCase().includes(q) || 
                                     (b.author || '').toLowerCase().includes(q) ||
                                     (b.category || '').toLowerCase().includes(q);
                            });

                            if (filtered.length === 0) {
                              return (
                                <div className="p-8 text-center space-y-3">
                                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                                  <p className="text-sm font-bold text-slate-600 font-simple">کوئی کتاب نہیں ملی</p>
                                  <button
                                    type="button"
                                    onClick={() => { setBookSearchQuery(''); setBookCategoryFilter('all'); }}
                                    className="text-xs text-blue-600 hover:underline font-bold"
                                  >
                                    فلٹرز ختم کریں
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-2.5">
                                {filtered.map((book) => {
                                  const originalIndex = pdfBooksList.findIndex(b => (b.id && book.id && b.id === book.id) || b.title === book.title);
                                  return (
                                    <div
                                      key={book.id || book.title}
                                      className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-xs"
                                    >
                                      {/* Book Thumbnail + Info */}
                                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        {/* Reorder Buttons */}
                                        <div className="flex flex-col gap-1 text-slate-400 shrink-0">
                                          <button
                                            type="button"
                                            disabled={originalIndex === 0}
                                            onClick={() => handleMoveBook(originalIndex, -1)}
                                            className="p-1 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-20 cursor-pointer"
                                            title="اوپر کریں"
                                          >
                                            <ArrowUp className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            disabled={originalIndex === pdfBooksList.length - 1}
                                            onClick={() => handleMoveBook(originalIndex, 1)}
                                            className="p-1 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-20 cursor-pointer"
                                            title="نیچے کریں"
                                          >
                                            <ArrowDown className="w-3.5 h-3.5" />
                                          </button>
                                        </div>

                                        {/* Thumbnail Cover */}
                                        <div className="w-12 h-16 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 shadow-xs relative">
                                          <img
                                            src={book.image || '/images/books/tib-e-pakistani-urdu.jpg'}
                                            alt={book.title}
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/books/tib-e-pakistani-urdu.jpg'; }}
                                          />
                                        </div>

                                        {/* Text Details */}
                                        <div className="min-w-0 space-y-1 text-right">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold font-simple">
                                              {book.category}
                                            </span>
                                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                                              {book.language || 'Urdu'}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                              #{originalIndex + 1}
                                            </span>
                                          </div>

                                          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate font-h2">
                                            {book.title}
                                          </h4>

                                          <p className="text-xs text-slate-600 truncate">
                                            مصنف: <strong className="text-slate-800">{book.author}</strong> • {book.pages || 'PDF'}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                        {book.downloadUrl && (
                                          <a
                                            href={book.downloadUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs transition-colors"
                                            title="ڈاؤن لوڈ لنک ٹیسٹ کریں"
                                          >
                                            <Download className="w-4 h-4 text-emerald-600" />
                                          </a>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditBook(book, originalIndex)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all font-simple cursor-pointer"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                          <span>ترمیم</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteBook(originalIndex)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all font-simple cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>حذف</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Sub-Tab 2: Raw HTML Mode */}
                      {pdfEditorSubTab === 'html' && (
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>خام HTML کوڈ ایڈیٹر</span>
                            <button
                              type="button"
                              onClick={() => setPdfEditorSubTab('studio')}
                              className="text-emerald-700 hover:underline font-bold"
                            >
                              ← کتب سٹوڈیو پر واپس جائیں
                            </button>
                          </div>
                          <textarea
                            rows="18"
                            value={pageForm.content}
                            onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-500 text-left dir-ltr"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Visual / Code / Preview Container */
                    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                    
                    {/* TinyMCE-Style Rich Formatting Toolbar */}
                    {pageEditorMode === 'visual' && (
                      <div className="bg-slate-100/95 border-b border-slate-200 p-2.5 flex flex-wrap items-center gap-1.5 text-slate-700 sticky top-0 z-20 backdrop-blur-sm">
                        
                        {/* Font Family */}
                        <select
                          value={pageEditorFont}
                          onChange={(e) => {
                            setPageEditorFont(e.target.value);
                            if (pageVisualEditorRef.current) {
                              pageVisualEditorRef.current.className = `w-full max-w-4xl bg-white text-slate-900 shadow-2xl rounded-2xl p-8 sm:p-12 min-h-[550px] outline-none leading-loose text-right article-rendered-content border border-slate-200 ${
                                e.target.value === 'nastaliq' ? 'font-nastaliq text-xl' : e.target.value === 'simple' ? 'font-simple text-lg' : 'font-sans text-base'
                              }`;
                            }
                          }}
                          className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer font-bold shadow-xs"
                        >
                          <option value="nastaliq">خطِ نستعلیق (Urdu Nastaliq)</option>
                          <option value="simple">سادہ اردو (Simple Urdu)</option>
                          <option value="sans">English / Sans</option>
                        </select>

                        {/* Headings */}
                        <select
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) execUniversalCmd('formatBlock', val);
                          }}
                          defaultValue=""
                          className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer shadow-xs"
                        >
                          <option value="">ہیڈنگ اسٹائل...</option>
                          <option value="h1">ہیڈنگ 1 (H1 - مرکزی)</option>
                          <option value="h2">ہیڈنگ 2 (H2 - بڑی سرخی)</option>
                          <option value="h3">ہیڈنگ 3 (H3 - ذیلی سرخی)</option>
                          <option value="p">پیراگراف (عام متن)</option>
                          <option value="blockquote">اقتباس (Quote)</option>
                        </select>

                        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                        {/* Text Color Dropdown Palette with Selection Preservation */}
                        <div className="relative">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              saveCurrentSelection();
                              setShowPageColorPalette(!showPageColorPalette);
                              setShowPageBgPalette(false);
                            }}
                            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 shadow-xs transition-colors"
                            title="ٹیکسٹ کا رنگ تبدیل کریں"
                          >
                            <Palette className="w-3.5 h-3.5 text-amber-500" />
                            <span>رنگ</span>
                          </button>

                          {showPageColorPalette && (
                            <div 
                              onMouseDown={(e) => e.preventDefault()}
                              className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl z-50 w-64 space-y-2.5 text-right animate-in fade-in-50"
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-100 pb-1.5">
                                <span>ٹیکسٹ رنگ منتخب کریں</span>
                                <input
                                  type="color"
                                  defaultValue="#0f172a"
                                  onChange={(e) => {
                                    applyTextColor(e.target.value);
                                  }}
                                  className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded"
                                  title="کسٹم رنگ چنیں"
                                />
                              </div>
                              <div className="grid grid-cols-6 gap-1.5">
                                {RICH_COLORS.map(c => (
                                  <button
                                    key={c.hex}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      applyTextColor(c.hex);
                                      setShowPageColorPalette(false);
                                    }}
                                    className="w-7 h-7 rounded-lg border border-slate-200 hover:scale-110 hover:border-slate-400 transition-all flex items-center justify-center shadow-xs"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Background Highlighter Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              saveCurrentSelection();
                              setShowPageBgPalette(!showPageBgPalette);
                              setShowPageColorPalette(false);
                            }}
                            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 shadow-xs transition-colors"
                            title="بیک گراؤنڈ ہائی لائٹر"
                          >
                            <Highlighter className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ہائی لائٹ</span>
                          </button>

                          {showPageBgPalette && (
                            <div 
                              onMouseDown={(e) => e.preventDefault()}
                              className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl z-50 w-64 space-y-2.5 text-right animate-in fade-in-50"
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-100 pb-1.5">
                                <span>ہائی لائٹر رنگ منتخب کریں</span>
                                <input
                                  type="color"
                                  defaultValue="#047857"
                                  onChange={(e) => {
                                    applyBgColor(e.target.value);
                                  }}
                                  className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded"
                                  title="کسٹم ہائی لائٹر"
                                />
                              </div>
                              <div className="grid grid-cols-6 gap-1.5">
                                {RICH_COLORS.map(c => (
                                  <button
                                    key={c.hex}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      applyBgColor(c.hex);
                                      setShowPageBgPalette(false);
                                    }}
                                    className="w-7 h-7 rounded-lg border border-slate-200 hover:scale-110 hover:border-slate-400 transition-all flex items-center justify-center shadow-xs"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Instant Quick Color Swatches on Toolbar */}
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-300 shadow-xs">
                          <button type="button" onMouseDown={(e) => { e.preventDefault(); applyTextColor('#ffffff'); }} className="w-4 h-4 rounded-full bg-white border border-slate-300 hover:scale-125 transition-transform" title="سفید رنگ"></button>
                          <button type="button" onMouseDown={(e) => { e.preventDefault(); applyTextColor('#10b981'); }} className="w-4 h-4 rounded-full bg-emerald-500 hover:scale-125 transition-transform" title="زمردی سبز"></button>
                          <button type="button" onMouseDown={(e) => { e.preventDefault(); applyTextColor('#38bdf8'); }} className="w-4 h-4 rounded-full bg-sky-400 hover:scale-125 transition-transform" title="آسمانی نیلا"></button>
                          <button type="button" onMouseDown={(e) => { e.preventDefault(); applyTextColor('#ef4444'); }} className="w-4 h-4 rounded-full bg-red-500 hover:scale-125 transition-transform" title="سرخ رنگ"></button>
                          <button type="button" onMouseDown={(e) => { e.preventDefault(); applyTextColor('#f59e0b'); }} className="w-4 h-4 rounded-full bg-amber-500 hover:scale-125 transition-transform" title="سنہری رنگ"></button>
                        </div>

                        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                        {/* Basic Formatting with onMouseDown preventDefault */}
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('bold'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="بولڈ (Ctrl+B)">
                          <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('italic'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="اٹالک (Ctrl+I)">
                          <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('underline'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="انڈر لائن (Ctrl+U)">
                          <Underline className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('strikeThrough'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="سٹرائیک">
                          <Strikethrough className="w-4 h-4" />
                        </button>

                        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                        {/* Alignments with onMouseDown preventDefault */}
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('justifyRight'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="دائیں سیدھ">
                          <AlignRight className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('justifyCenter'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="درمیان">
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('justifyLeft'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="بائیں سیدھ">
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('justifyFull'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="مکمل سیدھ (Justify)">
                          <AlignJustify className="w-4 h-4" />
                        </button>

                        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                        {/* Lists */}
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('insertUnorderedList'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="بلٹ لسٹ">
                          <List className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('insertOrderedList'); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="نمبر والی لسٹ">
                          <ListOrdered className="w-4 h-4" />
                        </button>

                        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                        {/* Link & Computer Image Upload */}
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('لنک درج کریں (URL):', 'https://');
                            if (url) execUniversalCmd('createLink', url);
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
                          title="لنک شامل کریں"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>

                        {/* Upload Image directly into text from Computer */}
                        <label className="p-1.5 bg-white hover:bg-slate-50 rounded-lg text-emerald-600 cursor-pointer flex items-center gap-1 border border-slate-300 shadow-xs" title="کمپیوٹر سے تصویر شامل کریں">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-[10px] font-bold">+ تصویر</span>
                          <input type="file" accept="image/*" onChange={handlePageInlineImageUpload} className="hidden" />
                        </label>

                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); execUniversalCmd('insertHorizontalRule'); }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
                          title="لائن لگائیں (Divider)"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        {/* Mode Buttons on right */}
                        <div className="mr-auto flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg border border-slate-300">
                          <button
                            type="button"
                            onClick={() => setPageEditorMode('visual')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${pageEditorMode === 'visual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Visual (ویژول)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (pageVisualEditorRef.current) {
                                setPageForm({ ...pageForm, content: pageVisualEditorRef.current.innerHTML });
                              }
                              setPageEditorMode('code');
                            }}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${pageEditorMode === 'code' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Code (کوڈ)
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Editor Editable Body - International Standard Clean White Paper */}
                    {pageEditorMode === 'visual' && (
                      <div className="bg-slate-50 p-4 sm:p-8 flex justify-center border-t border-slate-200">
                        <div
                          ref={pageVisualEditorRef}
                          contentEditable
                          onInput={() => {
                            if (pageVisualEditorRef.current) {
                              setPageForm(prev => ({ ...prev, content: pageVisualEditorRef.current.innerHTML }));
                            }
                            saveCurrentSelection();
                          }}
                          onMouseUp={saveCurrentSelection}
                          onKeyUp={saveCurrentSelection}
                          onSelect={saveCurrentSelection}
                          className={`w-full max-w-4xl bg-white text-slate-900 shadow-xl rounded-2xl p-8 sm:p-12 min-h-[550px] outline-none leading-loose text-right article-rendered-content border border-slate-200 transition-all focus:ring-4 focus:ring-blue-500/20 ${
                            pageEditorFont === 'nastaliq' ? 'font-nastaliq text-xl' : pageEditorFont === 'simple' ? 'font-simple text-lg' : 'font-sans text-base'
                          }`}
                          style={{ minHeight: '550px', color: '#0f172a', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    )}

                    {/* HTML Code Editor Mode */}
                    {pageEditorMode === 'code' && (
                      <div className="p-4 bg-slate-50 border-t border-slate-200">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs text-slate-600">
                          <span>HTML سورس کوڈ ایڈیٹر</span>
                          <button
                            type="button"
                            onClick={() => setPageEditorMode('visual')}
                            className="text-blue-600 hover:underline font-bold"
                          >
                            ویژول موڈ پر واپس جائیں
                          </button>
                        </div>
                        <textarea
                          rows="16"
                          value={pageForm.content}
                          onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none focus:border-blue-500 text-left dir-ltr"
                        />
                      </div>
                    )}

                    {/* Preview Mode */}
                    {pageEditorMode === 'preview' && (
                      <div className="p-8 bg-white text-slate-800 min-h-[400px]">
                        <h1 className="text-3xl font-bold font-h1 border-b border-slate-100 pb-4 mb-6">{pageForm.title || 'صفحے کا عنوان'}</h1>
                        <div 
                          className="article-rendered-content text-base leading-relaxed font-nastaliq"
                          dangerouslySetInnerHTML={{ __html: pageForm.content }}
                        />
                      </div>
                    )}
                  </div>
                )}

                  {/* Add / Edit Book Modal */}
                  {showBookModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in-50">
                      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-right font-sans">
                        
                        {/* Modal Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-slate-900 font-simple">
                                {editingBookIndex !== null ? 'کتاب کی تفصیلات میں ترمیم (Edit Book)' : 'نئی کتاب شامل کریں (Add New Book)'}
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                عنوان، سرورق، مصنف، پی ڈی ایف اور دیگر تفصیلات درج فرمائیں
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => { setShowBookModal(false); setEditingBookIndex(null); }}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Modal Body Form */}
                        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                          
                          {/* Book Title */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                              کتاب کا عنوان (Book Title) *
                            </label>
                            <input
                              type="text"
                              required
                              value={bookModalForm.title}
                              onChange={(e) => setBookModalForm({ ...bookModalForm, title: e.target.value })}
                              placeholder="مثلاً: کلیات تحقیقات صابر ملتانی"
                              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-emerald-600 outline-none font-h2 shadow-xs"
                            />
                          </div>

                          {/* Author & Category in 2 columns */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                                مصنف / محقق کا نام *
                              </label>
                              <input
                                type="text"
                                required
                                value={bookModalForm.author}
                                onChange={(e) => setBookModalForm({ ...bookModalForm, author: e.target.value })}
                                placeholder="مثلاً: حکیم دوست محمد صابر ملتانی"
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:border-emerald-600 outline-none shadow-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                                شعبہ / کیٹگری *
                              </label>
                              <select
                                value={bookModalForm.category}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  let en = 'qanoon';
                                  if (val.includes('تراجم')) en = 'translations';
                                  else if (val.includes('تشخیص')) en = 'diagnosis';
                                  else if (val.includes('ادویات')) en = 'herbs';
                                  else if (val.includes('صحت')) en = 'health';
                                  setBookModalForm({ ...bookModalForm, category: val, categoryEn: en });
                                }}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:border-emerald-600 outline-none font-simple shadow-xs"
                              >
                                <option value="قانون مفرد اعضاء">قانون مفرد اعضاء</option>
                                <option value="تراجم طب پاکستانی">تراجم طب پاکستانی</option>
                                <option value="تشخیص و لیبارٹری">تشخیص و لیبارٹری</option>
                                <option value="ادویات و فارماکوپیا">ادویات و فارماکوپیا</option>
                                <option value="صحت و مطب">صحت و مطب</option>
                              </select>
                            </div>
                          </div>

                          {/* Language & Edition Tag in 2 columns */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                                کتاب کی زبان
                              </label>
                              <select
                                value={bookModalForm.language}
                                onChange={(e) => setBookModalForm({ ...bookModalForm, language: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:border-emerald-600 outline-none shadow-xs"
                              >
                                <option value="Urdu">اردو (Urdu)</option>
                                <option value="English">انگریزی (English)</option>
                                <option value="Arabic">عربی (Arabic)</option>
                                <option value="Persian">فارسی (Persian)</option>
                                <option value="Hindi">ہندی (Hindi)</option>
                                <option value="Chinese">چینی (Chinese)</option>
                                <option value="Urdu/English">اردو و انگریزی (Mixed)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                                نوعیت / صفحات کا ٹیگ
                              </label>
                              <input
                                type="text"
                                value={bookModalForm.pages}
                                onChange={(e) => setBookModalForm({ ...bookModalForm, pages: e.target.value })}
                                placeholder="مثلاً: مختصر و جامع، کلاسیک شاہکار، علم النبض"
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:border-emerald-600 outline-none shadow-xs"
                              />
                            </div>
                          </div>

                          {/* Cover Image Upload & URL with Preview */}
                          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <label className="block text-xs font-bold text-slate-700 font-simple">
                              کتاب کا سرورق / کور تصویر (Book Cover)
                            </label>
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              <div className="w-16 h-22 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                                <img
                                  src={bookModalForm.image || '/images/books/tib-e-pakistani-urdu.jpg'}
                                  alt="Book Cover Preview"
                                  className="w-full h-full object-cover object-top"
                                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/books/tib-e-pakistani-urdu.jpg'; }}
                                />
                              </div>
                              
                              <div className="space-y-2 flex-1 w-full">
                                <input
                                  type="text"
                                  value={bookModalForm.image}
                                  onChange={(e) => setBookModalForm({ ...bookModalForm, image: e.target.value })}
                                  placeholder="تصویر کا لوکل پاتھ یا انٹرنیٹ URL (مثلاً: /images/books/mybook.jpg)"
                                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs outline-none text-left dir-ltr font-mono shadow-xs"
                                />

                                <div className="flex items-center gap-2">
                                  <label className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 font-simple shadow-xs">
                                    <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                                    <span>کمپیوٹر سے کور تصویر منتخب کریں</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const url = await uploadImageApi(file);
                                          if (url) {
                                            setBookModalForm(prev => ({ ...prev, image: url }));
                                            showNotification('کور تصویر کامیابی سے اپلوڈ ہو گئی!');
                                          }
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Download URL & Embed Reader URL */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                                پی ڈی ایف کا ڈاؤن لوڈ لنک (Download PDF URL) *
                              </label>
                              <input
                                type="url"
                                required
                                value={bookModalForm.downloadUrl}
                                onChange={(e) => setBookModalForm({ ...bookModalForm, downloadUrl: e.target.value })}
                                placeholder="https://archive.org/download/... یا گوگل ڈرائیو ڈاؤن لوڈ لنک"
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-emerald-700 text-xs focus:border-emerald-600 outline-none text-left dir-ltr font-mono shadow-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                                آن لائن ریڈر لنک (Online Reader Embed URL - اختیاری)
                              </label>
                              <input
                                type="url"
                                value={bookModalForm.embedUrl}
                                onChange={(e) => setBookModalForm({ ...bookModalForm, embedUrl: e.target.value })}
                                placeholder="https://archive.org/embed/... یا گوگل ڈرائیو پریویو لنک"
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-blue-700 text-xs focus:border-emerald-600 outline-none text-left dir-ltr font-mono shadow-xs"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                              کتاب کا مختصر تعارف / تفصیل (Description)
                            </label>
                            <textarea
                              rows="3"
                              value={bookModalForm.description}
                              onChange={(e) => setBookModalForm({ ...bookModalForm, description: e.target.value })}
                              placeholder="کتاب کے اہم موضوعات، ابواب یا خصوصیات کا تعارف..."
                              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-800 text-xs focus:border-emerald-600 outline-none leading-relaxed font-nastaliq shadow-xs"
                            />
                          </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => { setShowBookModal(false); setEditingBookIndex(null); }}
                            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all font-simple cursor-pointer"
                          >
                            منسوخ کریں
                          </button>

                          <button
                            type="button"
                            onClick={handleSaveBookModal}
                            className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all font-simple flex items-center gap-2 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>کتاب محفوظ کریں</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>

                {/* 2. SIDEBAR OPTIONS */}
                <div className="w-full lg:w-72 space-y-4">
                  
                  {/* Status & Publish */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 font-simple border-b border-slate-100 pb-2">
                      پبلشنگ اسٹیٹس (Publish Status)
                    </h3>
                    
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">اسٹیٹس</label>
                      <select
                        value={pageForm.status}
                        onChange={(e) => setPageForm({ ...pageForm, status: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 outline-none font-bold shadow-xs"
                      >
                        <option value="published">پبلک (شائع شدہ / Live)</option>
                        <option value="draft">ڈرافٹ (غیر شائع)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">مصنف (Author)</label>
                      <input
                        type="text"
                        value={pageForm.author || ''}
                        onChange={(e) => setPageForm({ ...pageForm, author: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 outline-none shadow-xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSavePage}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs mt-2 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPageId ? 'تبدیلیاں محفوظ کریں' : 'صفحہ پبلش کریں'}</span>
                    </button>
                  </div>

                  {/* Featured Image */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 font-simple">
                        نمایاں تصویر (Featured Image)
                      </h3>
                      {pageForm.featuredImage && (
                        <button
                          type="button"
                          onClick={() => setPageForm({ ...pageForm, featuredImage: '' })}
                          className="text-[10px] text-red-600 hover:text-red-700 font-bold"
                        >
                          تصویر ہٹائیں
                        </button>
                      )}
                    </div>

                    {/* Upload from Computer Button */}
                    <label className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1 transition-all">
                      <UploadCloud className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 font-simple">کمپیوٹر سے تصویر اپلوڈ کریں</span>
                      <span className="text-[10px] text-slate-400">JPG, PNG, WebP فارمیٹس</span>
                      <input type="file" accept="image/*" onChange={handlePageFeaturedImageUpload} className="hidden" />
                    </label>

                    {/* Or URL input */}
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1">یا انٹرنیٹ سے تصویر کا لنک (URL):</span>
                      <input
                        type="text"
                        value={pageForm.featuredImage || ''}
                        onChange={(e) => setPageForm({ ...pageForm, featuredImage: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 outline-none text-left dir-ltr shadow-xs"
                      />
                    </div>

                    {pageForm.featuredImage && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                        <img src={pageForm.featuredImage} alt="Featured Preview" className="w-full h-36 object-cover" />
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* VIEW: PAGES MANAGEMENT (WORDPRESS STYLE) */}
          {/* ========================================================= */}
          {adminTab === 'pages' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <span>صفحات (Pages)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    ویب سائٹ کے تمام جامد صفحات (پرائیویسی، ہمارے بارے میں، رابطہ وغیرہ) کی ترامیم اور کنٹرول
                  </p>
                </div>

                <button
                  onClick={handleOpenNewPage}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md font-simple"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>نیا صفحہ بنائیں (Add New Page)</span>
                </button>
              </div>

              {/* Pages WordPress Style Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-right text-sm text-slate-700 font-sans">
                  <thead className="text-xs text-slate-700 border-b border-slate-200 bg-slate-50 font-bold">
                    <tr>
                      <th className="px-4 py-3.5 w-10 text-center"><input type="checkbox" className="rounded border-slate-300 bg-white text-blue-600" /></th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Title</th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Author</th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Slug</th>
                      <th className="px-4 py-3.5 font-bold text-slate-800">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagesList.map(page => (
                      <tr key={page.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-4 py-4 text-center">
                          <input type="checkbox" className="rounded border-slate-300 bg-white text-blue-600" />
                        </td>
                        <td className="px-4 py-4">
                          <span onClick={() => handleEditPage(page)} className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-h2 text-base">
                            {page.level === 2 ? '— — ' : page.level === 1 ? '— ' : ''}{page.title}
                          </span>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            <span onClick={() => handleEditPage(page)} className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">Edit</span>
                            <span onClick={() => {
                              if (window.confirm('کیا آپ واقعی یہ صفحہ ڈیلیٹ کرنا چاہتے ہیں؟')) {
                                setPagesList(prev => prev.filter(p => p.id !== page.id));
                                showNotification('صفحہ ڈیلیٹ کر دیا گیا');
                              }
                            }} className="text-red-600 hover:text-red-800 cursor-pointer hover:underline">Trash</span>
                            <a href={`/${page.slug}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-800 hover:underline">View</a>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-700">
                          {page.author || 'syed abdul wahab shah'}
                        </td>
                        <td className="px-4 py-4 text-xs font-mono text-slate-500">
                          /{page.slug}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600">
                          <span className="text-emerald-700 font-bold">Published</span><br />
                          <span className="font-mono text-[11px] text-slate-500">{page.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: GLOSSARY / فرہنگِ اطباء MANAGEMENT */}
          {/* ========================================================= */}
          {adminTab === 'glossary' && (() => {
            const URDU_LETTERS = [
              'سب', 'آ', 'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 
              'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 
              'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ی'
            ];

            const filteredGlossary = glossaryList.filter(item => {
              if (!item) return false;
              const matchesSearch = !glossarySearch.trim() || 
                (item.term && item.term.toLowerCase().includes(glossarySearch.toLowerCase())) ||
                (item.shortDefinition && item.shortDefinition.toLowerCase().includes(glossarySearch.toLowerCase())) ||
                (item.slug && item.slug.toLowerCase().includes(glossarySearch.toLowerCase()));
              
              if (!matchesSearch) return false;

              if (glossaryLetterFilter && glossaryLetterFilter !== 'all' && glossaryLetterFilter !== 'سب') {
                const firstChar = (item.term || '').trim().charAt(0);
                if (glossaryLetterFilter === 'ا' && (firstChar === 'ا' || firstChar === 'آ' || firstChar === 'إ' || firstChar === 'أ')) return true;
                if (glossaryLetterFilter === 'ی' && (firstChar === 'ی' || firstChar === 'ے' || firstChar === 'ي')) return true;
                if (glossaryLetterFilter === 'ک' && (firstChar === 'ک' || firstChar === 'ك')) return true;
                if (glossaryLetterFilter === 'ہ' && (firstChar === 'ہ' || firstChar === 'ھ' || firstChar === 'ة')) return true;
                return firstChar === glossaryLetterFilter;
              }

              return true;
            });

            const handleOpenAddGlossary = () => {
              setEditingGlossaryTerm(null);
              setGlossaryForm({
                term: '',
                slug: '',
                shortDefinition: '',
                content: ''
              });
              setIsGlossaryModalOpen(true);
            };

            const handleOpenEditGlossary = (item) => {
              setEditingGlossaryTerm(item);
              let plainDef = item.shortDefinition || '';
              if (!plainDef && item.content) {
                plainDef = item.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              }

              // Convert raw HTML into clean readable text for the editor
              let cleanContentText = (item.content || '')
                .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '$1\n\n')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\n\s*\n\s*\n/g, '\n\n')
                .trim();

              if (!cleanContentText) {
                cleanContentText = plainDef;
              }

              let decodedSlug = item.slug || '';
              try {
                decodedSlug = decodeURIComponent(decodedSlug);
              } catch(e) {}

              setGlossaryForm({
                term: item.term || '',
                slug: decodedSlug,
                shortDefinition: plainDef.replace(/<[^>]+>/g, '').trim(),
                content: cleanContentText
              });
              setIsGlossaryModalOpen(true);
            };

            const handleDeleteGlossary = (itemToDelete) => {
              if (window.confirm(`کیا آپ واقعی اصطلاح "${itemToDelete.term}" کو فرہنگِ اطباء سے ڈیلیٹ کرنا چاہتے ہیں؟`)) {
                const updated = glossaryList.filter(g => g.id !== itemToDelete.id && g.slug !== itemToDelete.slug && g.term !== itemToDelete.term);
                updateAndSaveGlossary(updated);
                showNotification(`اصطلاح "${itemToDelete.term}" حذف کر دی گئی ہے۔`);
              }
            };

            const handleSaveGlossaryForm = (e) => {
              e.preventDefault();
              if (!glossaryForm.term.trim()) {
                alert('براہ کرم اصطلاح کا نام درج فرمائیں۔');
                return;
              }

              const cleanTerm = glossaryForm.term.trim();
              let cleanSlug = glossaryForm.slug.trim() || generateSlugFromTitle(cleanTerm) || cleanTerm;
              try {
                cleanSlug = decodeURIComponent(cleanSlug);
              } catch(e) {}

              const cleanShort = glossaryForm.shortDefinition.replace(/<[^>]+>/g, '').trim() || cleanTerm;
              
              // Format clean content into structured clean HTML paragraphs without raw tags or styles
              const rawContentInput = glossaryForm.content.trim();
              let cleanContentHtml = '';
              if (rawContentInput.includes('<p>') || rawContentInput.includes('<h3>')) {
                cleanContentHtml = rawContentInput;
              } else {
                // Format plain paragraphs
                cleanContentHtml = rawContentInput
                  .split(/\n\s*\n/)
                  .map(p => p.trim())
                  .filter(Boolean)
                  .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
                  .join('\n');
              }

              if (!cleanContentHtml) {
                cleanContentHtml = `<p>${cleanShort}</p>`;
              }

              if (editingGlossaryTerm) {
                const updated = glossaryList.map(item => {
                  if (item.id === editingGlossaryTerm.id || item.slug === editingGlossaryTerm.slug || item.term === editingGlossaryTerm.term) {
                    return {
                      ...item,
                      term: cleanTerm,
                      slug: cleanSlug,
                      shortDefinition: cleanShort,
                      content: cleanContentHtml,
                      date: item.date || new Date().toISOString().split('T')[0]
                    };
                  }
                  return item;
                });
                updateAndSaveGlossary(updated);
                showNotification(`اصطلاح "${cleanTerm}" میں کامیابی سے ترمیم کر لی گئی۔`);
              } else {
                const newItem = {
                  id: Date.now(),
                  term: cleanTerm,
                  slug: cleanSlug,
                  shortDefinition: cleanShort,
                  content: cleanContentHtml,
                  date: new Date().toISOString().split('T')[0]
                };
                const updated = [newItem, ...glossaryList];
                updateAndSaveGlossary(updated);
                showNotification(`نئی اصطلاح "${cleanTerm}" فرہنگِ اطباء میں شامل ہو گئی۔`);
              }

              setIsGlossaryModalOpen(false);
            };

            return (
              <div className="space-y-6">
                
                {/* Header & Actions */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📖</span>
                      <h2 className="text-xl font-bold text-slate-900 font-simple">فرہنگِ اطباء (Medical Glossary Studio)</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-nastaliq">
                      طبی مضامین میں ان تمام اصطلاحات پر خودکار ڈاٹڈ لائن اور ٹول ٹپ ظاہر ہوگی، اور کلک کرنے پر اس کا مکمل صفحہ کھلے گا۔
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href="/farhang"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>لائیو فرہنگ دیکھیں</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleOpenAddGlossary}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 font-simple cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ نئی اصطلاح شامل کریں</span>
                    </button>
                  </div>
                </div>

                {/* Quick Statistics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <span className="text-[11px] text-slate-500 block font-simple">کل اصطلاحات:</span>
                    <strong className="text-2xl font-bold text-slate-900 font-sans">{glossaryList.length}</strong>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <span className="text-[11px] text-slate-500 block font-simple">فلٹر شدہ اصطلاحات:</span>
                    <strong className="text-2xl font-bold text-emerald-600 font-sans">{filteredGlossary.length}</strong>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <span className="text-[11px] text-slate-500 block font-simple">خودکار ٹول ٹپس:</span>
                    <strong className="text-2xl font-bold text-blue-600 font-sans">فعال (Active)</strong>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <span className="text-[11px] text-slate-500 block font-simple">گوگل رینکنگ / SEO:</span>
                    <strong className="text-2xl font-bold text-amber-600 font-sans">Indexable</strong>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={glossarySearch}
                        onChange={(e) => setGlossarySearch(e.target.value)}
                        placeholder="اصطلاح، تعریف یا سلگ تلاش کریں (مثلاً: مفرح، استرخا، ریاح)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                    {glossarySearch && (
                      <button
                        type="button"
                        onClick={() => setGlossarySearch('')}
                        className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2 bg-slate-100 rounded-xl transition-colors"
                      >
                        سرچ ختم کریں
                      </button>
                    )}
                  </div>

                  {/* Urdu Alphabet Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 pt-1 justify-start">
                    {URDU_LETTERS.map(letter => {
                      const isActive = (letter === 'سب' && (glossaryLetterFilter === 'all' || glossaryLetterFilter === 'سب')) || glossaryLetterFilter === letter;
                      return (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => setGlossaryLetterFilter(letter === 'سب' ? 'all' : letter)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isActive 
                              ? 'bg-emerald-600 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                          }`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Glossary Table */}
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm text-slate-800 font-sans">
                      <thead className="text-xs text-slate-600 border-b border-slate-200 bg-slate-50/90 font-bold">
                        <tr>
                          <th className="px-4 py-3.5 w-12 text-center">#</th>
                          <th className="px-4 py-3.5 font-bold text-slate-700">اصطلاح (Term)</th>
                          <th className="px-4 py-3.5 font-bold text-slate-700">مختصر تعریف (Tooltip Preview)</th>
                          <th className="px-4 py-3.5 font-bold text-slate-700">URL سلگ</th>
                          <th className="px-4 py-3.5 font-bold text-slate-700 w-36 text-center">ایکشنز</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredGlossary.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-simple">
                              کوئی اصطلاح نہیں ملی۔ تلاش کا لفظ تبدیل کریں یا نئی اصطلاح شامل کریں۔
                            </td>
                          </tr>
                        ) : (
                          filteredGlossary.map((item, index) => (
                            <tr key={item.id || item.slug || index} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-4 py-3.5 text-center text-xs text-slate-400 font-mono">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3.5">
                                <span 
                                  onClick={() => handleOpenEditGlossary(item)}
                                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer font-h2 text-base block"
                                >
                                  {item.term}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 max-w-md">
                                <p className="text-xs text-slate-600 line-clamp-2 font-nastaliq leading-relaxed">
                                  {item.shortDefinition || item.content?.replace(/<[^>]+>/g, ' ') || '—'}
                                </p>
                              </td>
                              <td className="px-4 py-3.5 text-xs font-mono text-slate-500">
                                /farhang/{item.slug || encodeURIComponent(item.term)}
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditGlossary(item)}
                                    className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all border border-blue-200"
                                    title="ترمیم کریں"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGlossary(item)}
                                    className="p-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-all border border-red-200"
                                    title="ڈیلیٹ کریں"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <a
                                    href={`/farhang/${item.slug || encodeURIComponent(item.term)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg transition-all border border-emerald-200"
                                    title="ویب سائٹ پر دیکھیں"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add/Edit Modal */}
                {isGlossaryModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-right space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200 text-slate-800">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <button
                          type="button"
                          onClick={() => setIsGlossaryModalOpen(false)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold text-slate-900 font-simple flex items-center gap-2">
                          <span>{editingGlossaryTerm ? 'اصطلاح میں ترمیم کریں' : 'نئی طبی اصطلاح شامل کریں'}</span>
                          <span>📖</span>
                        </h3>
                      </div>

                      <form onSubmit={handleSaveGlossaryForm} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            اصطلاح کا نام (مثلاً: مفرح، استرخا، ریاح، مسکن):
                          </label>
                          <input
                            type="text"
                            value={glossaryForm.term}
                            onChange={(e) => {
                              const val = e.target.value;
                              setGlossaryForm(prev => ({
                                ...prev,
                                term: val,
                                slug: prev.slug ? prev.slug : generateSlugFromTitle(val)
                              }));
                            }}
                            placeholder="طبی اصطلاح درج کریں..."
                            required
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            URL سلگ (Clean Slug for SEO):
                          </label>
                          <input
                            type="text"
                            value={glossaryForm.slug}
                            onChange={(e) => setGlossaryForm({ ...glossaryForm, slug: e.target.value })}
                            placeholder="مثلاً: salabat یا صلابت"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-sans focus:outline-none focus:border-emerald-500 focus:bg-white"
                            dir="auto"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            مختصر تعریف (Tooltip Preview - جو ماؤس لے جانے پر پاپ اپ کارڈ میں نظر آئے گی):
                          </label>
                          <textarea
                            rows={3}
                            value={glossaryForm.shortDefinition}
                            onChange={(e) => setGlossaryForm({ ...glossaryForm, shortDefinition: e.target.value })}
                            placeholder="سادہ 2-3 سطری خلاصہ..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-xs font-nastaliq leading-relaxed focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            مکمل تفصیلی تشریح و طبی افعال (Full Page Explanation):
                          </label>
                          <textarea
                            rows={7}
                            value={glossaryForm.content}
                            onChange={(e) => setGlossaryForm({ ...glossaryForm, content: e.target.value })}
                            placeholder="اصطلاح کی مکمل سائنسی و یونانی طبی تفصیل سادہ اردو پیراگراف میں درج کریں۔ (کوڈنگ یا HTML ٹیگز لکھنے کی ضرورت نہیں ہے)"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-xs font-nastaliq leading-relaxed focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setIsGlossaryModalOpen(false)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors font-simple border border-slate-200"
                          >
                            منسوخ کریں
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md font-simple flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>محفوظ کریں</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {
          adminTab === 'doctors' && (() => {
            const pendingDoctors = doctorsList.filter(d => d && (d.isApproved === false || d.status === 'pending'));
            const approvedDoctors = doctorsList.filter(d => d && (d.isApproved !== false && d.status !== 'pending'));

            const handleApproveDoctor = (doctorId) => {
              const docToApprove = doctorsList.find(d => d.id === doctorId);
              setDoctorsList(prev => prev.map(d => {
                if (d.id === doctorId) {
                  return {
                    ...d,
                    isApproved: true,
                    status: 'active',
                    isVerified: true
                  };
                }
                return d;
              }));
              showNotification(`طبیب ${docToApprove?.name || ''} کی رجسٹریشن منظور کر لی گئی ہے اور ویب سائٹ پر پبلش ہو چکی ہے!`);
            };

            
            const handleEditDoctor = (docItem) => {
              setEditingDoctorId(docItem.id);
              setDoctorForm({
                ...docItem,
                name: docItem.name || '',
                title: docItem.title || '',
                qualifications: docItem.qualifications || '',
                registrationNumber: docItem.registrationNumber || '',
                treatmentType: docItem.treatmentType || 'طب یونانی و قانون مفرد اعضاء',
                clinicName: docItem.clinicName || '',
                cityName: docItem.cityName || '',
                address: docItem.address || '',
                timing: docItem.timing || 'پیر تا ہفتہ: صبح 10:00 تا شام 7:00',
                fee: docItem.fee || 500,
                onlineFee: docItem.onlineFee || (docItem.fee ? docItem.fee + 300 : 800),
                waitTime: docItem.waitTime || '15 منٹ سے کم',
                experience: docItem.experience || 12,
                rating: docItem.rating || 4.9,
                reviewsCount: docItem.reviewsCount || 120,
                phone: docItem.phone || '',
                whatsapp: docItem.whatsapp || '',
                email: docItem.email || '',
                password: docItem.password || 'password123',
                image: docItem.image || '',
                about: docItem.about || '',
                isVerified: !!docItem.isVerified,
                isFeatured: !!docItem.isFeatured,
                languages: Array.isArray(docItem.languages) ? [...docItem.languages] : ['اردو', 'پنجابی'],
                memberships: Array.isArray(docItem.memberships) ? [...docItem.memberships] : ['قومی کونسل برائے طب (NCT)'],
                conditions: Array.isArray(docItem.conditions) ? [...docItem.conditions] : ['معدے کی تیزابیت و السر', 'جوڑوں کا درد اور عرق النساء', 'دائمی قبض و آئی بی ایس'],
                specialties: Array.isArray(docItem.specialties) ? [...docItem.specialties] : [],
                services: Array.isArray(docItem.services) ? [...docItem.services] : [],
                education: Array.isArray(docItem.education) ? JSON.parse(JSON.stringify(docItem.education)) : [],
                experiences: Array.isArray(docItem.experiences) ? JSON.parse(JSON.stringify(docItem.experiences)) : [],
                awards: Array.isArray(docItem.awards) ? JSON.parse(JSON.stringify(docItem.awards)) : [],
                gallery: Array.isArray(docItem.gallery) ? [...docItem.gallery] : []
              });
              setDoctorEditTab('basic');
              setNewSpecialtyInput('');
              setNewServiceInput('');
              setNewGalleryInput('');
              setNewEduForm({ degree: '', institute: '', year: '' });
              setNewExpForm({ companyName: '', jobTitle: '', duration: '', description: '' });
              setNewAwardForm({ title: '', year: '' });
            };

            const handleSaveDoctor = async () => {
              if (!editingDoctorId || !doctorForm) return;
              try {
                const updatedDocs = doctorsList.map(d => d.id === editingDoctorId ? { ...d, ...doctorForm } : d);
                setDoctorsList(updatedDocs);
                await saveDoctorsApi(updatedDocs);
                try {
                  localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updatedDocs));
                } catch(e) {}
                showNotification(`طبیب "${doctorForm.name || ''}" کی تمام تفصیلات کامیابی سے اپڈیٹ اور محفوظ ہو گئیں!`);
                setEditingDoctorId(null);
                setDoctorForm(null);
              } catch (error) {
                console.error('Error saving doctor:', error);
                showNotification('ایرر: ' + error.message, 'error');
              }
            };

            const handleDeleteDoctor = async (doctorId) => {
              const docToDelete = doctorsList.find(d => d.id === doctorId);
              if (!docToDelete) return;
              if (window.confirm(`کیا آپ واقعی طبیب "${docToDelete.name || ''}" کو مکمل طور پر حذف (Delete) کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکے گا۔`)) {
                try {
                  const updatedDocs = doctorsList.filter(d => d.id !== doctorId);
                  setDoctorsList(updatedDocs);
                  await saveDoctorsApi(updatedDocs);
                  try {
                    localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updatedDocs));
                  } catch(e) {}
                  showNotification(`طبیب "${docToDelete.name || ''}" کو کامیابی سے ڈیلیٹ کر دیا گیا۔`);
                  if (editingDoctorId === doctorId) {
                    setEditingDoctorId(null);
                    setDoctorForm(null);
                  }
                } catch (error) {
                  console.error('Error deleting doctor:', error);
                  showNotification('ڈیلیٹ کرنے میں خرابی پیش آئی: ' + error.message, 'error');
                }
              }
            };

            const handleRejectDoctor = (doctorId) => {
              handleDeleteDoctor(doctorId);
            };

            const handleToggleDoctorVerified = async (doctorId) => {
              const updated = doctorsList.map(d => {
                if (d.id === doctorId) {
                  return { ...d, isVerified: !d.isVerified };
                }
                return d;
              });
              setDoctorsList(updated);
              await saveDoctorsApi(updated);
              try {
                localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updated));
              } catch(e) {}
              showNotification('ویریفیکیشن اسٹیٹس تبدیل اور محفوظ کر دیا گیا');
            };

            const handleToggleDoctorFeatured = async (doctorId) => {
              const updated = doctorsList.map(d => {
                if (d.id === doctorId) {
                  return { ...d, isFeatured: !d.isFeatured };
                }
                return d;
              });
              setDoctorsList(updated);
              await saveDoctorsApi(updated);
              try {
                localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updated));
              } catch(e) {}
              showNotification('ہوم پیج نمایاں اسٹیٹس تبدیل اور محفوظ کر دیا گیا');
            };

            const handleUnpublishDoctor = async (doctorId) => {
              const doc = doctorsList.find(d => d.id === doctorId);
              if (window.confirm(`کیا آپ ${doc?.name || 'اس طبیب'} کو غیر پبلش (زیرِ التواء) کرنا چاہتے ہیں؟`)) {
                const updated = doctorsList.map(d => {
                  if (d.id === doctorId) {
                    return { ...d, isApproved: false, status: 'pending' };
                  }
                  return d;
                });
                setDoctorsList(updated);
                await saveDoctorsApi(updated);
                try {
                  localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updated));
                } catch(e) {}
                showNotification('طبیب کو پبلک ڈائریکٹری سے ہٹا دیا گیا');
              }
            };

            const availableDoctorCities = Array.from(new Set(
              doctorsList.map(d => (d?.cityName && typeof d.cityName === 'string' ? d.cityName.trim() : (d?.city && typeof d.city === 'string' ? d.city.trim() : ''))).filter(Boolean)
            )).sort((a, b) => a.localeCompare(b, 'ur'));

            let currentList = doctorTabFilter === 'pending'
              ? pendingDoctors
              : doctorTabFilter === 'approved'
                ? approvedDoctors
                : doctorsList;

            // Verified filter
            if (doctorVerifiedFilter === 'verified') {
              currentList = currentList.filter(d => d.isVerified === true || d.isVerified === '1' || d.isVerified === 'yes');
            } else if (doctorVerifiedFilter === 'unverified') {
              currentList = currentList.filter(d => !d.isVerified || d.isVerified === false || d.isVerified === '0' || d.isVerified === 'no');
            }

            // Featured filter
            if (doctorFeaturedFilter === 'featured') {
              currentList = currentList.filter(d => d.isFeatured === true || d.isFeatured === '1');
            } else if (doctorFeaturedFilter === 'standard') {
              currentList = currentList.filter(d => !d.isFeatured || d.isFeatured === false);
            }

            // City filter
            if (doctorCityFilter !== 'all') {
              currentList = currentList.filter(d => 
                (d.cityName && d.cityName.trim() === doctorCityFilter) ||
                (d.city && d.city.trim() === doctorCityFilter)
              );
            }

            // Search filter
            if (doctorSearchFilter.trim()) {
              const q = doctorSearchFilter.trim().toLowerCase();
              currentList = currentList.filter(d => 
                (d.name && d.name.toLowerCase().includes(q)) ||
                (d.clinicName && d.clinicName.toLowerCase().includes(q)) ||
                (d.cityName && d.cityName.toLowerCase().includes(q)) ||
                (d.address && d.address.toLowerCase().includes(q)) ||
                (d.qualifications && d.qualifications.toLowerCase().includes(q)) ||
                (d.councilRegNo && d.councilRegNo.toLowerCase().includes(q)) ||
                (d.email && d.email.toLowerCase().includes(q)) ||
                (d.whatsapp && d.whatsapp.includes(q)) ||
                (d.phone && d.phone.includes(q))
              );
            }

            // Sort order
            currentList = [...currentList].sort((a, b) => {
              if (doctorFeaturedFilter === 'featured') {
                const aOrder = a.featuredOrder != null ? a.featuredOrder : 999;
                const bOrder = b.featuredOrder != null ? b.featuredOrder : 999;
                if (aOrder !== bOrder) {
                  return aOrder - bOrder;
                }
              }
              
              if (doctorSortOrder === 'name') {
                return (a.name || '').localeCompare(b.name || '', 'ur');
              }
              if (doctorSortOrder === 'exp') {
                return (Number(b.experience) || 0) - (Number(a.experience) || 0);
              }
              const idA = Number(a.id) || 0;
              const idB = Number(b.id) || 0;
              if (doctorSortOrder === 'oldest') {
                return idA - idB;
              }
              // Default latest first
              return idB - idA;
            });

            // WordPress-style Pagination Calculations
            const totalFilteredDoctors = currentList.length;
            const effectiveDoctorsPerPage = doctorsPerPage === 'all' ? Math.max(1, totalFilteredDoctors) : Number(doctorsPerPage);
            const totalDoctorPages = Math.max(1, Math.ceil(totalFilteredDoctors / effectiveDoctorsPerPage));
            const safeDoctorCurrentPage = Math.min(Math.max(1, doctorCurrentPage), totalDoctorPages);
            const doctorStartIndex = doctorsPerPage === 'all' ? 0 : (safeDoctorCurrentPage - 1) * effectiveDoctorsPerPage;
            const doctorEndIndex = doctorsPerPage === 'all' ? totalFilteredDoctors : Math.min(doctorStartIndex + effectiveDoctorsPerPage, totalFilteredDoctors);
            const paginatedDoctors = currentList.slice(doctorStartIndex, doctorEndIndex);

            const getDoctorPaginationPages = () => {
              if (totalDoctorPages <= 7) {
                return Array.from({ length: totalDoctorPages }, (_, i) => i + 1);
              }
              if (safeDoctorCurrentPage <= 4) {
                return [1, 2, 3, 4, 5, '...', totalDoctorPages];
              }
              if (safeDoctorCurrentPage >= totalDoctorPages - 3) {
                return [1, '...', totalDoctorPages - 4, totalDoctorPages - 3, totalDoctorPages - 2, totalDoctorPages - 1, totalDoctorPages];
              }
              return [1, '...', safeDoctorCurrentPage - 1, safeDoctorCurrentPage, safeDoctorCurrentPage + 1, '...', totalDoctorPages];
            };

            return (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                
                
                {/* Password Requests Section */}
                {passwordRequests.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6 shadow-xs mb-8 animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-amber-800 font-simple">پاسورڈ بھولنے کی درخواستیں ({passwordRequests.length})</h3>
                          <p className="text-[11px] text-amber-700 mt-1 font-simple">مندرجہ ذیل اطباء نے پاسورڈ بھول جانے کی اطلاع دی ہے۔ ان کی پروفائل ایڈٹ کر کے پاسورڈ تبدیل کریں اور انہیں مطلع کریں۔</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {passwordRequests.map(req => (
                        <div key={req.id} className="bg-white border border-amber-200 rounded-xl p-3 flex justify-between items-center shadow-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block font-simple mb-0.5">شناخت (ای میل یا فون):</span>
                            <strong className="text-slate-800 text-sm font-sans tracking-wide">{req.identifier}</strong>
                            <span className="text-[10px] text-slate-400 block mt-1 font-sans">{new Date(req.date).toLocaleString('ur-PK')}</span>
                          </div>
                          <button
                            onClick={() => handleClearPasswordRequest(req.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 text-slate-700 font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1.5 font-simple border border-slate-200"
                            title="درخواست کو فہرست سے ہٹائیں"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            مکمل / حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                      <span>اطباء و کلینکس مینجمنٹ اور رجسٹریشن منظوری</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      نئی رجسٹریشن کی درخواستوں کا جائزہ لیں، قبول کریں یا مسترد کریں۔ صرف منظور شدہ اطباء ہی پبلک ویب سائٹ پر نظر آئیں گے۔
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const testDoc = {
                          id: Date.now(),
                          name: 'حکیم سید وقار علی شاہ',
                          slug: `tabeeb-${Date.now()}`,
                          email: `waqar.shah.${Date.now().toString().slice(-4)}@gmail.com`,
                          password: 'password123',
                          title: 'ماہر نباض، موروثی معالج طب یونانی',
                          qualifications: 'فاضل طب والجراحت (FTJ), گولڈ میڈلسٹ',
                          councilRegNo: 'NCT-99412',
                          experience: 12,
                          rating: 5.0,
                          reviewsCount: 0,
                          city: 'islamabad',
                          cityName: 'اسلام آباد / راولپنڈی',
                          specialties: ['امراض معدہ، گیس و تبخیر', 'جوڑوں و پٹھوں کا درد (عرق النساء)'],
                          treatmentType: 'طب یونانی',
                          clinicName: 'شاہ شفا خانہ و طب یونانی سنٹر',
                          address: 'سٹی سینٹر، صدر بازار، راولپنڈی',
                          timing: 'شام 5:00 تا رات 9:00',
                          fee: 700,
                          phone: '03009876543',
                          whatsapp: '923009876543',
                          image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
                          isVerified: false,
                          emailVerified: false,
                          isApproved: false, // ⚠️ Pending Admin Approval
                          status: 'pending',
                          isFeatured: false,
                          appliedDate: new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' }),
                          about: 'موروثی حکمت کے خاندانی نسخہ جات اور نبض شناسی سے کامیاب علاج۔',
                          services: ['مفت آن لائن رہنمائی', 'نبض شناسی و مزاج تشخیص', 'قدرتی ہربل نسخہ جات'],
                          education: [
                            { degree: 'فاضل طب والجراحت (FTJ)', institute: 'طبیہ کالج' }
                          ]
                        };
                        setDoctorsList(prev => {
                          const updated = [testDoc, ...prev];
                          try {
                            localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updated));
                          } catch (e) {}
                          return updated;
                        });
                        setDoctorTabFilter('pending');
                        showNotification('ٹیسٹ رجسٹریشن کی درخواست ایڈمن پینل میں شامل کر دی گئی ہے!');
                      }}
                      className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-all font-simple"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ فرضی ٹیسٹ درخواست شامل کریں</span>
                    </button>

                    <span className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold font-sans">
                      کل اطباء: <strong className="text-blue-600">{doctorsList.length}</strong>
                    </span>
                  </div>
                </div>

                {/* Sub-Tabs Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 font-simple text-xs">
                    <button
                      type="button"
                      onClick={() => setDoctorTabFilter('all')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        doctorTabFilter === 'all'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>تمام اطباء ({doctorsList.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDoctorTabFilter('pending')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        doctorTabFilter === 'pending'
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>نئی درخواستیں برائے منظوری</span>
                      {pendingDoctors.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-extrabold ${
                          doctorTabFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {pendingDoctors.length} نئی
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDoctorTabFilter('approved')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        doctorTabFilter === 'approved'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>منظور شدہ اطباء ({approvedDoctors.length})</span>
                    </button>
                  </div>

                  {/* Active Filters Clear Button if filtered */}
                  {(doctorSearchFilter || doctorVerifiedFilter !== 'all' || doctorFeaturedFilter !== 'all' || doctorCityFilter !== 'all' || doctorSortOrder !== 'latest') && (
                    <button
                      type="button"
                      onClick={() => {
                        setDoctorSearchFilter('');
                        setDoctorVerifiedFilter('all');
                        setDoctorFeaturedFilter('all');
                        setDoctorCityFilter('all');
                        setDoctorSortOrder('latest');
                      }}
                      className="text-xs text-amber-800 hover:text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors font-simple"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>تمام فلٹرز ختم کریں</span>
                    </button>
                  )}
                </div>

                {/* WordPress-style Doctors Filter & Pagination Toolbar */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Search Input */}
                    <div className="relative min-w-[210px] flex-1 sm:flex-none">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="ڈاکٹر، مطب، شہر، فون، رجسٹریشن..."
                        value={doctorSearchFilter}
                        onChange={(e) => setDoctorSearchFilter(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans shadow-xs"
                      />
                      {doctorSearchFilter && (
                        <button
                          type="button"
                          onClick={() => setDoctorSearchFilter('')}
                          className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                          title="تلاش ختم کریں"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Verification Filter Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-600 font-sans">تصدیق:</span>
                      <select
                        value={doctorVerifiedFilter}
                        onChange={(e) => setDoctorVerifiedFilter(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold shadow-xs"
                      >
                        <option value="all">تمام (تصدیق شدہ و غیر تصدیق شدہ)</option>
                        <option value="verified">صرف تصدیق شدہ (Verified ✓)</option>
                        <option value="unverified">صرف غیر تصدیق شدہ (Unverified ✗)</option>
                      </select>
                    </div>

                    {/* Featured Filter Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-600 font-sans">نمایاں:</span>
                      <select
                        value={doctorFeaturedFilter}
                        onChange={(e) => setDoctorFeaturedFilter(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold shadow-xs"
                      >
                        <option value="all">تمام اطباء</option>
                        <option value="featured">صرف ہوم پیج پر نمایاں (Featured ★)</option>
                        <option value="standard">عام اطباء (غیر نمایاں)</option>
                      </select>
                    </div>

                    {/* City Filter Dropdown */}
                    {availableDoctorCities.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-600 font-sans">شہر:</span>
                        <select
                          value={doctorCityFilter}
                          onChange={(e) => setDoctorCityFilter(e.target.value)}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold max-w-[150px] shadow-xs"
                        >
                          <option value="all">تمام شہر ({availableDoctorCities.length})</option>
                          {availableDoctorCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Sort Order Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-600 font-sans">ترتیب:</span>
                      <select
                        value={doctorSortOrder}
                        onChange={(e) => setDoctorSortOrder(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold shadow-xs"
                      >
                        <option value="latest">تازہ ترین پہلے (Latest First)</option>
                        <option value="oldest">پرانے پہلے (Oldest First)</option>
                        <option value="name">نام کے لحاظ سے (الف تا ے)</option>
                        <option value="exp">تجربہ کے لحاظ سے (زیادہ تجربہ کار)</option>
                      </select>
                    </div>

                    {/* Doctors Per Page Selector (Default 20, 50, 100, all) */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-600 font-sans">فی صفحہ:</span>
                      <select
                        value={doctorsPerPage}
                        onChange={(e) => {
                          const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
                          setDoctorsPerPage(val);
                          try {
                            localStorage.setItem('tabeeb_admin_doctors_per_page', String(val));
                          } catch {}
                        }}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-sans font-bold shadow-xs"
                      >
                        <option value={20}>20 اطباء (ڈیفالٹ)</option>
                        <option value={50}>50 اطباء</option>
                        <option value={100}>100 اطباء</option>
                        <option value="all">تمام اطباء (ایک ہی صفحے پر)</option>
                      </select>
                    </div>

                  </div>

                  {/* Top Pagination Summary & Quick Nav Buttons (WordPress Style) */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-600 font-sans border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-200">
                    <span className="whitespace-nowrap">
                      کل <strong className="text-slate-900 font-mono">{totalFilteredDoctors}</strong> اطباء | صفحہ <strong className="text-blue-600 font-mono">{safeDoctorCurrentPage}</strong> از <strong className="text-slate-800 font-mono">{totalDoctorPages}</strong>
                    </span>
                    
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                      <button
                        type="button"
                        disabled={safeDoctorCurrentPage <= 1}
                        onClick={() => setDoctorCurrentPage(1)}
                        title="پہلا صفحہ"
                        className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <ChevronsRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={safeDoctorCurrentPage <= 1}
                        onClick={() => setDoctorCurrentPage(p => Math.max(1, p - 1))}
                        title="پچھلا صفحہ"
                        className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={safeDoctorCurrentPage >= totalDoctorPages}
                        onClick={() => setDoctorCurrentPage(p => Math.min(totalDoctorPages, p + 1))}
                        title="اگلا صفحہ"
                        className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={safeDoctorCurrentPage >= totalDoctorPages}
                        onClick={() => setDoctorCurrentPage(totalDoctorPages)}
                        title="آخری صفحہ"
                        className="p-1.5 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <ChevronsLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Content List */}
                <div className="space-y-4">
                  {paginatedDoctors.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 font-simple">
                        {doctorTabFilter === 'pending'
                          ? 'اس وقت کوئی نئی رجسٹریشن کی درخواست زیرِ جائزہ نہیں ہے۔'
                          : 'کوئی معالج یا کلینک نہیں ملا۔'}
                      </p>
                      <p className="text-xs text-slate-500 font-simple">
                        {doctorTabFilter === 'pending'
                          ? 'جب بھی کوئی طبیب ای میل تصدیق کے ساتھ نیا فارم بھرے گا، وہ یہاں منظوری کے لیے ظاہر ہوگا۔'
                          : 'براہ کرم تلاش یا فلٹرز تبدیل کر کے دوبارہ کوشش کریں۔'}
                      </p>
                      {(doctorSearchFilter || doctorVerifiedFilter !== 'all' || doctorFeaturedFilter !== 'all' || doctorCityFilter !== 'all' || doctorSortOrder !== 'latest') && (
                        <button
                          type="button"
                          onClick={() => {
                            setDoctorSearchFilter('');
                            setDoctorVerifiedFilter('all');
                            setDoctorFeaturedFilter('all');
                            setDoctorCityFilter('all');
                            setDoctorSortOrder('latest');
                          }}
                          className="mt-2 text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl font-simple border border-slate-200 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>تمام فلٹرز ختم کریں</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    paginatedDoctors.map((doc, docIdx) => {
                      const isPending = doc.isApproved === false || doc.status === 'pending';

                      return (
                        <div
                          key={doc.id}
                          className={`rounded-3xl border p-5 sm:p-6 space-y-4 transition-all ${
                            isPending
                              ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                          }`}
                        >
                          {/* Doctor Top Header Row */}
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-100 pb-4">
                            
                            <div className="flex items-start gap-4">
                              <img
                                src={doc.image || '/images/default_doctor.webp'}
                                alt={doc.name}
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/default_doctor.webp'; }}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 bg-white shadow-xs"
                              />

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  {doc.isFeatured ? (
                                    <input
                                      type="number"
                                      min="1"
                                      max="99"
                                      defaultValue={doc.featuredOrder || ''}
                                      placeholder="#"
                                      title="ہوم پیج پر ترتیب نمبر — لکھیں اور Enter دبائیں"
                                      onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                          e.target.blur();
                                        }
                                      }}
                                      onBlur={async (e) => {
                                        const val = parseInt(e.target.value) || null;
                                        if (val !== (doc.featuredOrder || null)) {
                                          const updated = doctorsList.map(d => d.id === doc.id ? { ...d, featuredOrder: val } : d);
                                          setDoctorsList(updated);
                                          await saveDoctorsApi(updated);
                                          try { localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updated)); } catch(ex) {}
                                          showNotification(`${doc.name} کی ترتیب #${val || '—'} محفوظ ہو گئی`);
                                        }
                                      }}
                                      className="w-12 text-center text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-300 px-1 py-0.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-text shadow-xs"
                                    />
                                  ) : (
                                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                                      #{doctorStartIndex + docIdx + 1}
                                    </span>
                                  )}

                                  <h3 className="text-lg font-bold text-slate-900 font-simple">
                                    {doc.name}
                                  </h3>

                                  {isPending ? (
                                    <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                                      <Clock className="w-3 h-3" />
                                      <span>زیرِ جائزہ (Pending Approval)</span>
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>پبلش شدہ و فعال (Live)</span>
                                    </span>
                                  )}

                                  {doc.isVerified ? (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold font-sans flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      <span>تصدیق شدہ معالج ✓</span>
                                    </span>
                                  ) : (
                                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2 py-0.5 rounded-full font-bold font-sans">
                                      غیر تصدیق شدہ
                                    </span>
                                  )}

                                  {doc.emailVerified && (
                                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold font-sans">
                                      ای میل تصدیق شدہ ✓
                                    </span>
                                  )}

                                  {doc.isFeatured && (
                                    <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2 py-0.5 rounded-full font-bold font-sans flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-purple-600" />
                                      <span>ہوم پیج پر نمایاں ★</span>
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-blue-600 font-bold font-simple">{doc.title}</p>
                                <p className="text-[11px] text-slate-500 font-sans">
                                  {doc.qualifications} {doc.councilRegNo ? `• رجسٹریشن نمبر: ${doc.councilRegNo}` : ''}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons for this doctor */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end font-simple text-xs">
                              {isPending ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveDoctor(doc.id)}
                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>قبول کریں اور پبلش کریں (Approve)</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRejectDoctor(doc.id)}
                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl transition-all"
                                    title="پروفائل مسترد کریں"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleEditDoctor(doc)}
                                    className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 font-bold rounded-xl transition-all"
                                    title="تفصیلات تبدیل کریں"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>

                                  <a
                                    href={'https://wa.me/' + (doc.whatsapp?.replace(new RegExp('[^0-9]', 'g'), '') || doc.phone?.replace(new RegExp('[^0-9]', 'g'), '') || '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 font-bold rounded-xl transition-all"
                                    title="طبیب کو وٹس اپ میسج کریں"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleDoctorVerified(doc.id)}
                                    className={'px-3 py-2 rounded-xl font-bold border transition-all ' + (doc.isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200')}
                                    title="طبیب کی تصدیق کا سٹیٹس بدلیں"
                                  >
                                    {doc.isVerified ? 'تصدیق شدہ' : 'تصدیق کریں'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleDoctorFeatured(doc.id)}
                                    className={'px-3 py-2 rounded-xl font-bold border transition-all ' + (doc.isFeatured ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200')}
                                    title="ہوم پیج پر نمایاں کریں"
                                  >
                                    {doc.isFeatured ? 'نمایاں' : 'نمایاں کریں'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleUnpublishDoctor(doc.id)}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                    title="پروفائل کو غیر پبلش کریں"
                                  >
                                    ان پبلش کریں
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRejectDoctor(doc.id)}
                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl transition-all"
                                    title="پروفائل ڈیلیٹ کریں"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleEditDoctor(doc)}
                                    className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 font-bold rounded-xl transition-all"
                                    title="تفصیلات تبدیل کریں"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>

                                  <a
                                    href={'https://wa.me/' + (doc.whatsapp?.replace(new RegExp('[^0-9]', 'g'), '') || doc.phone?.replace(new RegExp('[^0-9]', 'g'), '') || '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 font-bold rounded-xl transition-all"
                                    title="طبیب کو وٹس اپ میسج کریں"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                </>
                              )}
                            </div>

                          </div>

                          {/* Doctor Information Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            
                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                              <span className="text-[10px] text-slate-500 font-simple block">مطب / کلینک کا نام:</span>
                              <strong className="text-slate-800 block font-simple">{doc.clinicName || 'مطب کا نام درج نہیں'}</strong>
                              <span className="text-[11px] text-slate-500 font-sans block">{doc.address || doc.cityName}</span>
                            </div>

                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                              <span className="text-[10px] text-slate-500 font-simple block">رابطہ و ای میل:</span>
                              <div className="text-emerald-700 font-sans font-bold flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{doc.whatsapp || doc.phone || 'نمبر موجود نہیں'}</span>
                              </div>
                              <div className="text-blue-600 font-sans truncate flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{doc.email || 'ای میل موجود نہیں'}</span>
                              </div>
                            </div>

                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                              <span className="text-[10px] text-slate-500 font-simple block">طریقہ علاج، تجربہ و فیس:</span>
                              <div className="text-amber-800 font-simple font-bold">{doc.treatmentType}</div>
                              <div className="text-slate-600 font-sans">
                                تجربہ: <strong className="text-slate-800">{doc.experience} سال</strong> • فیس: <strong className="text-slate-800">Rs. {doc.fee}</strong>
                              </div>
                            </div>

                          </div>

                          {/* Specialties Chips */}
                          {doc.specialties && Array.isArray(doc.specialties) && doc.specialties.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] text-slate-500 font-simple ml-1">منتخب شعبہ جات:</span>
                              {doc.specialties.map((spec, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-50 border border-blue-200 text-blue-700 text-[11px] px-2.5 py-0.5 rounded-full font-simple"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* About Doctor Bio (if present) */}
                          {doc.about && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed font-simple">
                              <strong className="text-slate-800">تعارف: </strong>
                              {doc.about}
                            </p>
                          )}

                          {/* Application timestamp (if pending) */}
                          {isPending && doc.appliedDate && (
                            <div className="text-[11px] text-amber-700 font-sans text-left">
                              درخواست تاریخ: {doc.appliedDate}
                            </div>
                          )}

                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Comprehensive Pagination Bar for Doctors (WordPress Style) */}
                {totalDoctorPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-600 font-sans">
                    {/* Range counter */}
                    <div>
                      اطباء <strong className="text-slate-900 font-mono">{doctorStartIndex + 1}</strong> تا <strong className="text-slate-900 font-mono">{doctorEndIndex}</strong> دکھائے جا رہے ہیں (کل <strong className="text-blue-600 font-mono">{totalFilteredDoctors}</strong> میں سے)
                    </div>

                    {/* Numbered Pagination & Arrows */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {/* Previous Button */}
                      <button
                        type="button"
                        disabled={safeDoctorCurrentPage <= 1}
                        onClick={() => setDoctorCurrentPage(p => Math.max(1, p - 1))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>پچھلا</span>
                      </button>

                      {/* Page Numbers */}
                      {getDoctorPaginationPages().map((pNum, idx) => {
                        if (pNum === '...') {
                          return <span key={`doc-ellipsis-${idx}`} className="px-2 text-slate-400 font-mono">…</span>;
                        }
                        const isCurrent = pNum === safeDoctorCurrentPage;
                        return (
                          <button
                            key={pNum}
                            type="button"
                            onClick={() => setDoctorCurrentPage(pNum)}
                            className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
                              isCurrent
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
                            }`}
                          >
                            {pNum}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        type="button"
                        disabled={safeDoctorCurrentPage >= totalDoctorPages}
                        onClick={() => setDoctorCurrentPage(p => Math.min(totalDoctorPages, p + 1))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                      >
                        <span>اگلا</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Jump directly to Page Number */}
                    <div className="flex items-center gap-2">
                      <span>صفحہ نمبر:</span>
                      <input
                        type="number"
                        min="1"
                        max={totalDoctorPages}
                        defaultValue={safeDoctorCurrentPage}
                        key={safeDoctorCurrentPage}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 1 && val <= totalDoctorPages) {
                              setDoctorCurrentPage(val);
                            }
                          }
                        }}
                        className="w-14 bg-white border border-slate-300 text-slate-800 rounded-lg px-2 py-1 text-center font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
                        title="نمبر لکھ کر Enter دبائیں"
                      />
                      <span>از {totalDoctorPages}</span>
                    </div>
                  </div>
                )}

                {/* Edit Doctor Modal */}
                {editingDoctorId && doctorForm && (
                  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                      
                      {/* Modal Header */}
                      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between gap-4 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={doctorForm.image || "/images/default_doctor.webp"} 
                            alt={doctorForm.name} 
                            onError={(e) => { e.target.onerror = null; e.target.src = "/images/default_doctor.webp"; }}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white shadow-xs"
                          />
                          <div className="min-w-0 text-right">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-simple truncate">
                              طبیب کا پروفائل ایڈٹ کریں: {doctorForm.name}
                            </h3>
                            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 font-sans mt-0.5">
                              {doctorForm.registrationNumber && (
                                <span className="text-emerald-600 font-mono font-bold" dir="ltr">{doctorForm.registrationNumber}</span>
                              )}
                              <span>• آئی ڈی: #{doctorForm.id}</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => { setEditingDoctorId(null); setDoctorForm(null); }} 
                          className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Navigation Sub-Tabs */}
                      <div className="sticky top-0 z-20 flex items-center gap-1.5 overflow-x-auto p-2.5 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 text-xs font-simple no-scrollbar shrink-0 shadow-xs">
                        {[
                          { id: 'basic', label: 'بنیادی معلومات', icon: UserCheck },
                          { id: 'clinic', label: 'مطب، اوقات و رابطہ', icon: Building2 },
                          { id: 'about', label: 'تعارف و طریقہ علاج', icon: FileText },
                          { id: 'specialties', label: `تخصص و خدمات (${(doctorForm.specialties || []).length + (doctorForm.services || []).length})`, icon: Sparkles },
                          { id: 'education', label: `اسناد و تعلیم (${(doctorForm.education || []).length})`, icon: GraduationCap },
                          { id: 'experiences', label: `طبی تجربات (${(doctorForm.experiences || []).length})`, icon: Award },
                          { id: 'awards', label: `اعزازات (${(doctorForm.awards || []).length})`, icon: Award },
                          { id: 'gallery', label: `فوٹو گیلری (${(doctorForm.gallery || []).length})`, icon: ImageIcon }
                        ].map(tab => {
                          const Icon = tab.icon;
                          const isActive = doctorEditTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => {
                                setDoctorEditTab(tab.id);
                                const el = document.getElementById(`admin-doc-${tab.id}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all font-bold ${
                                isActive 
                                  ? 'bg-blue-600 text-white shadow-xs' 
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Modal Scrollable Body */}
                      <div 
                        onScroll={(e) => {
                          const container = e.currentTarget;
                          const containerTop = container.getBoundingClientRect().top;
                          const sectionIds = ['basic', 'clinic', 'about', 'specialties', 'education', 'experiences', 'awards', 'gallery'];
                          for (let i = sectionIds.length - 1; i >= 0; i--) {
                            const el = document.getElementById(`admin-doc-${sectionIds[i]}`);
                            if (el) {
                              const rect = el.getBoundingClientRect();
                              if (rect.top - containerTop <= 130) {
                                setDoctorEditTab(sectionIds[i]);
                                break;
                              }
                            }
                          }
                        }}
                        className="p-4 sm:p-6 overflow-y-auto space-y-6 font-simple text-sm flex-1 text-right scroll-smooth"
                      >
                        
                        {/* SECTION 1: BASIC INFO */}
                        <div id="admin-doc-basic" className="scroll-mt-3 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-emerald-600">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-5 h-5 text-emerald-600" />
                              <h4 className="font-bold text-base text-slate-900">بنیادی معلومات و شخصی کوائف</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">نام، ٹائٹل، رجسٹریشن، فیس و رابطہ</span>
                          </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">پورا نام (Full Name)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.name || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">ٹائٹل / ذیلی عنوان (Sub Heading)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.title || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, title: e.target.value})}
                                  placeholder="طبیب حاذق، ماہر نباض..."
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">قومی کونسل برائے طب رجسٹریشن نمبر (Council Reg No)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.registrationNumber || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, registrationNumber: e.target.value})}
                                  placeholder="مثلاً: 16455-FTJ"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-emerald-600 font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              {/* Doctor Profile Picture Card */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                                <label className="block text-slate-700 text-xs font-bold">
                                  طبیب کی پروفائل تصویر (Profile Picture):
                                </label>

                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                  <div className="relative shrink-0">
                                    <img 
                                      src={doctorForm.image || '/images/default_doctor.webp'} 
                                      alt={doctorForm.name} 
                                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-md bg-white"
                                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/default_doctor.webp'; }}
                                    />
                                  </div>

                                  <div className="flex-1 space-y-2 text-center sm:text-right w-full">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                      <input 
                                        type="file" 
                                        ref={adminDoctorAvatarFileRef}
                                        onChange={handleAdminDoctorAvatarUpload}
                                        accept="image/*"
                                        className="hidden" 
                                      />
                                      <button
                                        type="button"
                                        disabled={isAdminUploadingAvatar}
                                        onClick={() => adminDoctorAvatarFileRef.current?.click()}
                                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                                      >
                                        {isAdminUploadingAvatar ? (
                                          <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>اپلوڈ ہو رہی ہے...</span>
                                          </>
                                        ) : (
                                          <>
                                            <UploadCloud className="w-4 h-4" />
                                            <span>موبائل / کمپیوٹر سے تصویر چنیں</span>
                                          </>
                                        )}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDoctorForm({ ...doctorForm, image: '/images/default_doctor.webp' });
                                          showNotification('ڈیفالٹ (غیر تصدیق شدہ) تصویر سیٹ کر دی گئی');
                                        }}
                                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs"
                                        title="غیر تصدیق شدہ بیج لگائیں"
                                      >
                                        ڈیفالٹ بیج لگائیں (Unverified)
                                      </button>
                                    </div>

                                    {/* Direct URL input option */}
                                    <div className="flex items-center gap-2 pt-1">
                                      <span className="text-[11px] text-slate-500 font-simple shrink-0">یا URL:</span>
                                      <input 
                                        type="text" 
                                        value={doctorForm.image || ''} 
                                        onChange={(e) => setDoctorForm({...doctorForm, image: e.target.value})}
                                        placeholder="تصویر کا آن لائن URL درج کریں..."
                                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-mono shadow-xs"
                                        dir="ltr"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">طریقہ علاج (Treatment System)</label>
                                <select
                                  value={doctorForm.treatmentType || 'طب یونانی و قانون مفرد اعضاء'}
                                  onChange={(e) => setDoctorForm({...doctorForm, treatmentType: e.target.value})}
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-xs"
                                >
                                  <option value="طب یونانی و قانون مفرد اعضاء">طب یونانی و قانون مفرد اعضاء</option>
                                  <option value="طب یونانی">طب یونانی (Unani Medicine)</option>
                                  <option value="طب پاکستانی (قانون مفرد اعضاء)">طب پاکستانی (قانون مفرد اعضاء)</option>
                                  <option value="طب نبوی">طب نبوی</option>
                                  <option value="حجامہ">حجامہ و کپنگ تھیراپی</option>
                                  <option value="ہومیو پیتھی">ہومیو پیتھی</option>
                                  <option value="دیگر قدرتی علاج">دیگر قدرتی علاج</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">طبی تجربہ سال (Experience in Years)</label>
                                <input 
                                  type="number" 
                                  value={doctorForm.experience || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, experience: Number(e.target.value)})}
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-sans shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">ریٹنگ (Rating out of 5)</label>
                                <input 
                                  type="number" 
                                  step="0.1"
                                  min="1"
                                  max="5"
                                  value={doctorForm.rating || 4.9} 
                                  onChange={(e) => setDoctorForm({...doctorForm, rating: parseFloat(e.target.value)})}
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-sans shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">ریویوز کی تعداد (Reviews Count)</label>
                                <input 
                                  type="number" 
                                  value={doctorForm.reviewsCount || 120} 
                                  onChange={(e) => setDoctorForm({...doctorForm, reviewsCount: parseInt(e.target.value, 10)})}
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-sans shadow-xs"
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            {/* Badges / Checkboxes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                              <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-colors shadow-xs">
                                <input 
                                  type="checkbox" 
                                  checked={!!doctorForm.isVerified}
                                  onChange={(e) => setDoctorForm({...doctorForm, isVerified: e.target.checked})}
                                  className="w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-white border-slate-300"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 text-xs block">مصدقہ طبیب بیج (Verified Badge)</span>
                                  <span className="text-[11px] text-slate-500 block">پروفائل پر سبز رنگ کا مصدقہ بیج دکھائی دے گا۔</span>
                                </div>
                              </label>

                              <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-amber-500/50 transition-colors shadow-xs">
                                <input 
                                  type="checkbox" 
                                  checked={!!doctorForm.isFeatured}
                                  onChange={(e) => setDoctorForm({...doctorForm, isFeatured: e.target.checked})}
                                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-white border-slate-300"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 text-xs block">نمایاں طبیب (Featured Status)</span>
                                  <span className="text-[11px] text-slate-500 block">ڈائریکٹری میں سرفہرست سنہری بیج کے ساتھ نظر آئے گا۔</span>
                                </div>
                              </label>
                            </div>
                          </div>

                        {/* SECTION 2: CLINIC, ADDRESS & CONTACT */}
                        <div id="admin-doc-clinic" className="scroll-mt-3 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-blue-600">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-blue-600" />
                              <h4 className="font-bold text-base text-slate-900">مطب / کلینک، اوقات و لوکیشن</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">شہر، پتہ، روزانہ کے اوقات، نقشہ لنک</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">مطب / کلینک کا نام (Clinic Name)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.clinicName || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, clinicName: e.target.value})}
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">شہر (City)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.cityName || ''} 
                                  onChange={(e) => {
                                    const c = e.target.value;
                                    const slug = c.toLowerCase().replace(/[\s\-_]+/g, '-');
                                    setDoctorForm({...doctorForm, cityName: c, city: slug});
                                  }}
                                  placeholder="لاہور، اسلام آباد، کراچی، ایبٹ آباد..."
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-slate-700 mb-1 text-xs font-bold">تفصیلی پتہ (Detailed Street Address)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.address || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, address: e.target.value})}
                                  placeholder="پلازہ، مین روڈ، نزد سنگ میل..."
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">اوقات کار (Clinic Timings)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.timing || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, timing: e.target.value})} 
                                  placeholder="پیر تا ہفتہ: صبح 10:00 تا شام 7:00"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">مشاورت فیس (Consultation Fee Rs)</label>
                                <input 
                                  type="number" 
                                  value={doctorForm.fee || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, fee: Number(e.target.value)})}
                                  placeholder="500"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-sans shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">آن لائن ویڈیو مشاورت فیس (Online Fee Rs)</label>
                                <input 
                                  type="number" 
                                  value={doctorForm.onlineFee || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, onlineFee: Number(e.target.value)})}
                                  placeholder="800"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-sans shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">اوسط انتظار کا وقت (Average Wait Time)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.waitTime || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, waitTime: e.target.value})}
                                  placeholder="15 منٹ سے کم"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">واٹس ایپ نمبر (WhatsApp)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.whatsapp || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, whatsapp: e.target.value})}
                                  placeholder="923001234567"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">فون / موبائل نمبر (Phone)</label>
                                <input 
                                  type="text" 
                                  value={doctorForm.phone || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                                  placeholder="0300-1234567"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 mb-1 text-xs font-bold">ای میل (Email)</label>
                                <input 
                                  type="email" 
                                  value={doctorForm.email || ''} 
                                  onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                                  placeholder="hakeem@example.com"
                                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono shadow-xs"
                                  dir="ltr"
                                />
                              </div>

                              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200 shadow-xs">
                                <label className="block text-blue-900 mb-1 text-xs font-bold flex items-center gap-1.5">
                                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                                  <span>لاگ ان پاسورڈ (Login Password):</span>
                                </label>
                                <input 
                                  type="text" 
                                  value={doctorForm.password || 'password123'} 
                                  onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                                  className="w-full bg-white border border-blue-300 rounded-xl p-2 text-emerald-600 font-bold focus:ring-2 focus:ring-blue-500 outline-none text-xs tracking-wider font-mono shadow-xs"
                                  dir="ltr"
                                />
                                <span className="text-[10px] text-slate-500 mt-1 block">طبیب اس پاسورڈ سے اپنے ڈیش بورڈ پر لاگ ان ہو سکتا ہے۔</span>
                              </div>
                            </div>
                          </div>

                        {/* SECTION 3: ABOUT / BIO */}
                        <div id="admin-doc-about" className="scroll-mt-3 space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-indigo-600">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-indigo-600" />
                              <h4 className="font-bold text-base text-slate-900">معالج کا تفصیلی تعارف اور طریقہ علاج</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">پیراگراف یا لسٹ کی صورت میں لکھیں</span>
                          </div>
                            <div className="flex items-center justify-between">
                              <label className="block text-slate-700 text-xs font-bold">
                                معالج کا تفصیلی تعارف اور طریقہ علاج (Doctor Bio):
                              </label>
                              <span className="text-[11px] text-slate-500">پیراگراف یا لسٹ کی صورت میں لکھیں</span>
                            </div>
                            <textarea 
                              value={doctorForm.about || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, about: e.target.value})}
                              placeholder="معالج کے تعارف، طریقہ علاج اور تجربات کے بارے میں تفصیلی معلومات..."
                              rows={9}
                              className="w-full bg-white border border-slate-300 rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed text-sm shadow-xs"
                            />
                          </div>

                        {/* SECTION 4: SPECIALTIES & SERVICES */}
                        <div id="admin-doc-specialties" className="scroll-mt-3 space-y-6 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-amber-600">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-amber-600" />
                              <h4 className="font-bold text-base text-slate-900">تخصص، امراض و فراہم کردہ خدمات</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              تخصص: {(doctorForm.specialties || []).length} | خدمات: {(doctorForm.services || []).length}
                            </span>
                          </div>
                          
                          {/* Specialties */}
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                              <label className="block text-slate-800 font-bold text-xs">
                                تخصص / امراض (Specialties)
                              </label>
                              
                              <div className="flex flex-wrap gap-2">
                                {(doctorForm.specialties || []).map((spec, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
                                  >
                                    <span>{spec}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const updated = doctorForm.specialties.filter((_, i) => i !== idx);
                                        setDoctorForm({...doctorForm, specialties: updated});
                                      }}
                                      className="text-slate-400 hover:text-red-500"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>

                              <div className="flex gap-2 pt-2">
                                <input 
                                  type="text" 
                                  value={newSpecialtyInput}
                                  onChange={(e) => setNewSpecialtyInput(e.target.value)}
                                  placeholder="نیا شعبہ یا بیماری لکھیں (مثلاً: امراض معدہ، جوڑوں کا درد)..."
                                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-simple shadow-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const trimmed = newSpecialtyInput.trim();
                                      if (trimmed) {
                                        const containsUrdu = (text) => /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text || '');
                                        if (/[a-zA-Z]/.test(trimmed) && !containsUrdu(trimmed)) {
                                          showNotification('برائے مہربانی مرض یا شعبہ کا نام صرف اردو زبان میں لکھیں', 'error');
                                          return;
                                        }
                                        setDoctorForm({...doctorForm, specialties: [...(doctorForm.specialties || []), trimmed]});
                                        setNewSpecialtyInput('');
                                      }
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const trimmed = newSpecialtyInput.trim();
                                    if (trimmed) {
                                      const containsUrdu = (text) => /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text || '');
                                      if (/[a-zA-Z]/.test(trimmed) && !containsUrdu(trimmed)) {
                                        showNotification('برائے مہربانی مرض یا شعبہ کا نام صرف اردو زبان میں لکھیں', 'error');
                                        return;
                                      }
                                      setDoctorForm({...doctorForm, specialties: [...(doctorForm.specialties || []), trimmed]});
                                      setNewSpecialtyInput('');
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 font-simple shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>شامل کریں</span>
                                </button>
                              </div>
                            </div>

                            {/* Services */}
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                              <label className="block text-slate-800 font-bold text-xs">
                                خصوصی طبی خدمات (Offered Services)
                              </label>

                              <div className="space-y-2">
                                {(doctorForm.services || []).map((srv, idx) => (
                                  <div 
                                    key={idx} 
                                    className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-800"
                                  >
                                    <span>{srv}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const updated = doctorForm.services.filter((_, i) => i !== idx);
                                        setDoctorForm({...doctorForm, services: updated});
                                      }}
                                      className="text-slate-400 hover:text-red-500 p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2 pt-2">
                                <input 
                                  type="text" 
                                  value={newServiceInput}
                                  onChange={(e) => setNewServiceInput(e.target.value)}
                                  placeholder="نئی طبی خدمت درج کریں (مثلاً: نبض سے مکمل تشخیص)..."
                                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      if (newServiceInput.trim()) {
                                        setDoctorForm({...doctorForm, services: [...(doctorForm.services || []), newServiceInput.trim()]});
                                        setNewServiceInput('');
                                      }
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newServiceInput.trim()) {
                                      setDoctorForm({...doctorForm, services: [...(doctorForm.services || []), newServiceInput.trim()]});
                                      setNewServiceInput('');
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>شامل کریں</span>
                                </button>
                              </div>
                            </div>

                            {/* Conditions Treated (Oladoc Style) */}
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                              <label className="block text-slate-800 font-bold text-xs">
                                زیرِ علاج امراض اور علامات (Conditions Treated)
                              </label>

                              <div className="flex flex-wrap gap-2">
                                {(doctorForm.conditions || []).map((cond, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs px-3 py-1.5 rounded-xl border border-blue-200 shadow-xs"
                                  >
                                    <span>• {cond}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const updated = doctorForm.conditions.filter((_, i) => i !== idx);
                                        setDoctorForm({...doctorForm, conditions: updated});
                                      }}
                                      className="text-blue-500 hover:text-red-500"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>

                              <div className="flex gap-2 pt-2">
                                <input 
                                  type="text" 
                                  value={newConditionInput}
                                  onChange={(e) => setNewConditionInput(e.target.value)}
                                  placeholder="نیا مرض لکھیں (مثلاً: معدے کا السر، دائمی قبض، جوڑوں کا درد)..."
                                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-simple shadow-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const trimmed = newConditionInput.trim();
                                      if (trimmed) {
                                        setDoctorForm({...doctorForm, conditions: [...(doctorForm.conditions || []), trimmed]});
                                        setNewConditionInput('');
                                      }
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const trimmed = newConditionInput.trim();
                                    if (trimmed) {
                                      setDoctorForm({...doctorForm, conditions: [...(doctorForm.conditions || []), trimmed]});
                                      setNewConditionInput('');
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 font-simple shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>شامل کریں</span>
                                </button>
                              </div>
                            </div>

                          </div>

                        {/* SECTION 5: EDUCATION & QUALIFICATIONS */}
                        <div id="admin-doc-education" className="scroll-mt-3 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-purple-600">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-purple-600" />
                              <h4 className="font-bold text-base text-slate-900">طبی اسناد، ڈگریاں و تعلیم</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">کل اسناد: {(doctorForm.education || []).length}</span>
                          </div>
                          <div className="space-y-2">
                              <label className="block text-slate-700 text-xs font-bold">موجودہ طبی اسناد (Degrees & Education):</label>
                              {(doctorForm.education || []).length === 0 ? (
                                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-xs shadow-xs">
                                  کوئی سند شامل نہیں ہے۔ نیچے فارم کے ذریعے نئی سند شامل کریں۔
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {doctorForm.education.map((edu, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-xs">
                                      <div>
                                        <span className="font-bold text-slate-900 block">{edu.degree}</span>
                                        <span className="text-slate-500 text-[11px] block">{edu.institute} {edu.year ? `(${edu.year})` : ''}</span>
                                      </div>
                                      <button 
                                        type="button" 
                                        onClick={() => {
                                          const updated = doctorForm.education.filter((_, i) => i !== idx);
                                          setDoctorForm({...doctorForm, education: updated});
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1.5"
                                        title="حذف کریں"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Add Education Form */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                              <span className="text-xs font-bold text-slate-800 block">نئی سند یا ڈگری شامل کریں:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input 
                                  type="text" 
                                  value={newEduForm.degree} 
                                  onChange={(e) => setNewEduForm({...newEduForm, degree: e.target.value})}
                                  placeholder="ڈگری کا نام (مثلاً: فاضل الطب)"
                                  className="bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                />
                                <input 
                                  type="text" 
                                  value={newEduForm.institute} 
                                  onChange={(e) => setNewEduForm({...newEduForm, institute: e.target.value})}
                                  placeholder="ادارہ (مثلاً: طبیہ کالج لاہور)"
                                  className="bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                />
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={newEduForm.year} 
                                    onChange={(e) => setNewEduForm({...newEduForm, year: e.target.value})}
                                    placeholder="سال (مثلاً: 2015)"
                                    className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none font-sans focus:ring-2 focus:ring-blue-500 shadow-xs"
                                    dir="ltr"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newEduForm.degree.trim()) {
                                        setDoctorForm({
                                          ...doctorForm, 
                                          education: [...(doctorForm.education || []), { ...newEduForm }]
                                        });
                                        setNewEduForm({ degree: '', institute: '', year: '' });
                                      }
                                    }}
                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs"
                                  >
                                    شامل کریں
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>

                        {/* SECTION 6: EXPERIENCES */}
                        <div id="admin-doc-experiences" className="scroll-mt-3 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-teal-600">
                            <div className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-teal-600" />
                              <h4 className="font-bold text-base text-slate-900">طبی و کلینیکل تجربات</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">کل تجربات: {(doctorForm.experiences || []).length}</span>
                          </div>
                          <div className="space-y-2">
                              <label className="block text-slate-700 text-xs font-bold">طبی تجربات و خدمات (Clinical Experiences):</label>
                              {(doctorForm.experiences || []).length === 0 ? (
                                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-xs shadow-xs">
                                  کوئی تجربہ شامل نہیں ہے۔ نیچے سے نیا تجربہ شامل کریں۔
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {doctorForm.experiences.map((exp, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs shadow-xs">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-slate-900">{exp.companyName || exp.jobTitle}</span>
                                          {exp.duration && <span className="text-slate-500 font-sans text-[11px]">({exp.duration})</span>}
                                        </div>
                                        {exp.jobTitle && <span className="text-blue-600 text-[11px] block">{exp.jobTitle}</span>}
                                        {exp.description && <p className="text-slate-600 text-[11px] mt-1">{exp.description}</p>}
                                      </div>
                                      <button 
                                        type="button" 
                                        onClick={() => {
                                          const updated = doctorForm.experiences.filter((_, i) => i !== idx);
                                          setDoctorForm({...doctorForm, experiences: updated});
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1.5 shrink-0"
                                        title="حذف کریں"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Add Experience Form */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                              <span className="text-xs font-bold text-slate-800 block">نیا تجربہ شامل کریں:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input 
                                  type="text" 
                                  value={newExpForm.companyName} 
                                  onChange={(e) => setNewExpForm({...newExpForm, companyName: e.target.value})}
                                  placeholder="ادارہ یا مطب کا نام"
                                  className="bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                />
                                <input 
                                  type="text" 
                                  value={newExpForm.jobTitle} 
                                  onChange={(e) => setNewExpForm({...newExpForm, jobTitle: e.target.value})}
                                  placeholder="عہدہ (مثلاً: سینئر طبیب)"
                                  className="bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                />
                                <input 
                                  type="text" 
                                  value={newExpForm.duration} 
                                  onChange={(e) => setNewExpForm({...newExpForm, duration: e.target.value})}
                                  placeholder="مدت (مثلاً: 2018 - 2024)"
                                  className="bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none font-sans focus:ring-2 focus:ring-blue-500 shadow-xs"
                                  dir="ltr"
                                />
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newExpForm.description} 
                                  onChange={(e) => setNewExpForm({...newExpForm, description: e.target.value})}
                                  placeholder="مختصر تفصیل..."
                                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newExpForm.companyName.trim() || newExpForm.jobTitle.trim()) {
                                      setDoctorForm({
                                        ...doctorForm, 
                                        experiences: [...(doctorForm.experiences || []), { ...newExpForm }]
                                      });
                                      setNewExpForm({ companyName: '', jobTitle: '', duration: '', description: '' });
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs"
                                >
                                  شامل کریں
                                </button>
                              </div>
                            </div>

                          </div>

                        {/* SECTION 7: AWARDS */}
                        <div id="admin-doc-awards" className="scroll-mt-3 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-yellow-600">
                            <div className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-yellow-600" />
                              <h4 className="font-bold text-base text-slate-900">اعزازات و شیلڈز (Awards & Distinctions)</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">کل اعزازات: {(doctorForm.awards || []).length}</span>
                          </div>
                          <div className="space-y-2">
                              <label className="block text-slate-700 text-xs font-bold">اعزازات و شیلڈز (Awards & Distinctions):</label>
                              {(doctorForm.awards || []).length === 0 ? (
                                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-xs shadow-xs">
                                  کوئی اعزاز درج نہیں ہے۔
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {doctorForm.awards.map((aw, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-xs">
                                      <div>
                                        <span className="font-bold text-amber-600 block">{aw.title}</span>
                                        {aw.year && <span className="text-slate-500 font-sans text-[11px] block">{aw.year}</span>}
                                      </div>
                                      <button 
                                        type="button" 
                                        onClick={() => {
                                          const updated = doctorForm.awards.filter((_, i) => i !== idx);
                                          setDoctorForm({...doctorForm, awards: updated});
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1.5"
                                        title="حذف کریں"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Add Award Form */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                              <span className="text-xs font-bold text-slate-800 block">نیا اعزاز شامل کریں:</span>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newAwardForm.title} 
                                  onChange={(e) => setNewAwardForm({...newAwardForm, title: e.target.value})}
                                  placeholder="اعزاز کا عنوان (مثلاً: گولڈ میڈل برائے نبض شناسی)"
                                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                />
                                <input 
                                  type="text" 
                                  value={newAwardForm.year} 
                                  onChange={(e) => setNewAwardForm({...newAwardForm, year: e.target.value})}
                                  placeholder="سال (2020)"
                                  className="w-28 bg-white border border-slate-300 rounded-xl p-2 text-slate-800 text-xs outline-none font-sans focus:ring-2 focus:ring-blue-500 shadow-xs"
                                  dir="ltr"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newAwardForm.title.trim()) {
                                      setDoctorForm({
                                        ...doctorForm, 
                                        awards: [...(doctorForm.awards || []), { ...newAwardForm }]
                                      });
                                      setNewAwardForm({ title: '', year: '' });
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs"
                                >
                                  شامل کریں
                                </button>
                              </div>
                            </div>

                          </div>

                        {/* SECTION 8: PHOTO GALLERY */}
                        <div id="admin-doc-gallery" className="scroll-mt-3 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-rose-600">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-5 h-5 text-rose-600" />
                              <h4 className="font-bold text-base text-slate-900">مطب و اسناد کی فوٹو گیلری</h4>
                            </div>
                            <span className="text-[11px] text-slate-500">کل تصاویر: {(doctorForm.gallery || []).length}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                              <label className="block text-slate-700 text-xs font-bold">
                                مطب اور اسناد کی تصاویر (Gallery Images):
                              </label>
                              <span className="text-xs text-slate-500 font-sans">
                                کل تصاویر: {(doctorForm.gallery || []).length}
                              </span>
                            </div>

                            {/* Gallery Grid with Delete Option */}
                            {(doctorForm.gallery || []).length === 0 ? (
                              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs space-y-1 shadow-xs">
                                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                                <p>فی الوقت کوئی تصویر شامل نہیں ہے۔</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {doctorForm.gallery.map((imgUrl, idx) => (
                                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-white shadow-xs">
                                    <img 
                                      src={imgUrl} 
                                      alt={`Gallery ${idx + 1}`} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      onError={(e) => { e.target.parentElement.style.opacity = '0.5'; }}
                                    />
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const updated = doctorForm.gallery.filter((_, i) => i !== idx);
                                        setDoctorForm({...doctorForm, gallery: updated});
                                      }}
                                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all opacity-90 group-hover:opacity-100"
                                      title="تصویر حذف کریں"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Gallery Image Form */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-xs font-bold text-slate-800">
                                  نئی تصاویر شامل کریں (کمپیوٹر/موبائل سے فائل اپلوڈ کریں یا URL درج کریں):
                                </span>
                                <input 
                                  type="file" 
                                  ref={adminDoctorGalleryFileRef}
                                  onChange={handleAdminDoctorGalleryUpload}
                                  accept="image/*"
                                  multiple
                                  className="hidden" 
                                />
                                <button 
                                  type="button" 
                                  disabled={isAdminUploadingGallery}
                                  onClick={() => adminDoctorGalleryFileRef.current?.click()}
                                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                                >
                                  {isAdminUploadingGallery ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      <span>اپلوڈ جاری ہے...</span>
                                    </>
                                  ) : (
                                    <>
                                      <UploadCloud className="w-4 h-4" />
                                      <span>کمپیوٹر / موبائل سے تصاویر چنیں</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newGalleryInput} 
                                  onChange={(e) => setNewGalleryInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      if (newGalleryInput.trim()) {
                                        setDoctorForm({
                                          ...doctorForm, 
                                          gallery: [...(doctorForm.gallery || []), newGalleryInput.trim()]
                                        });
                                        setNewGalleryInput('');
                                      }
                                    }
                                  }}
                                  placeholder="یا تصویر کا آن لائن لنک (URL) یہاں چسپاں کریں..."
                                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none font-mono focus:ring-2 focus:ring-blue-500 shadow-xs"
                                  dir="ltr"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    if (newGalleryInput.trim()) {
                                      setDoctorForm({
                                        ...doctorForm, 
                                        gallery: [...(doctorForm.gallery || []), newGalleryInput.trim()]
                                      });
                                      setNewGalleryInput('');
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>لنک شامل کریں</span>
                                </button>
                              </div>
                            </div>

                          </div>

                      </div>
                      
                      {/* Modal Footer */}
                      <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
                        <button 
                          type="button" 
                          onClick={() => handleDeleteDoctor(doctorForm.id)}
                          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>طبیب کو مکمل ڈیلیٹ کریں</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button 
                            type="button" 
                            onClick={() => { setEditingDoctorId(null); setDoctorForm(null); }}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all text-xs"
                          >
                            کینسل
                          </button>
                          <button 
                            type="button" 
                            onClick={handleSaveDoctor}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                          >
                            <Save className="w-4 h-4" />
                            <span>تبدیلیاں محفوظ کریں</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* VIEW 4: COMPREHENSIVE WEBSITE SETTINGS (LOGO, HEADER, FOOTER) */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* VIEW: DEDICATED ADMIN SECURITY & 2FA PANEL */}
          {/* ========================================================= */}
          {adminTab === 'security' && (
            <AdminSecurityTab 
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              showNotification={showNotification}
            />
          )}

          {adminTab === 'settings' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              
              {/* Header & Global Save */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple flex items-center gap-2.5">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <span>ویب سائٹ ترتیبات (Website Settings)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ورڈپریس طرز پر اپنی ویب سائٹ کی تمام ترتیبات، ہوم پیج، سائیڈ بار اشتہار اور سیکیورٹی کو منظم کریں
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all font-simple shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>تمام ترتیبات محفوظ کریں</span>
                </button>
              </div>

              {/* WordPress-Style Sub-Tabs Navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
                {[
                  { id: 'general', label: 'عمومی سیٹنگز', icon: Globe },
                  { id: 'homepage', label: 'ہوم پیج بلاکس', icon: Home },
                  { id: 'sidebar', label: 'سائیڈ بار و اشتہارات', icon: Layout },
                  { id: 'media', label: 'ڈیفالٹ میڈیا', icon: ImageIcon },
                  { id: 'security', label: '🛡️ ایڈمن سیکیورٹی و 2FA', icon: ShieldCheck },
                  { id: 'footer', label: 'فوٹر و سوشل لنکس', icon: Share2 },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = settingsSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSettingsSubTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs'
                      }`}
                    >
                      <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 1. GENERAL SETTINGS */}
                {settingsSubTab === 'general' && (
                  <div className="space-y-6 animate-in fade-in-50">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">ویب سائٹ کی بنیادی معلومات</h3>
                          <p className="text-xs text-slate-500">سائٹ کا عنوان، ٹیگ لائن اور ہیلپ لائن رابطہ نمبرز</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ویب سائٹ کا نام (Site Name)</label>
                          <input 
                            type="text" 
                            value={settingsForm.siteName || ''} 
                            onChange={e => setSettingsForm({...settingsForm, siteName: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ٹیگ لائن (Tagline)</label>
                          <input 
                            type="text" 
                            value={settingsForm.tagline || ''} 
                            onChange={e => setSettingsForm({...settingsForm, tagline: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">ٹاپ بار نوٹس / اعلان (Topbar Announcement)</label>
                          <input 
                            type="text" 
                            value={settingsForm.topbarNotice || ''} 
                            onChange={e => setSettingsForm({...settingsForm, topbarNotice: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>
                        <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                          <label className="block text-xs font-bold text-slate-700 mb-2">ویب سائٹ کا لوگو (Logo)</label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                value={settingsForm.logoUrl || ''} 
                                onChange={e => setSettingsForm({...settingsForm, logoUrl: e.target.value})} 
                                className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                                placeholder="تصویر کا لنک (URL) یہاں ڈالیں" 
                              />
                            </div>
                            <div className="relative overflow-hidden shrink-0">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleSettingImageUpload(e, 'logoUrl')} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              />
                              <button type="button" className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs">
                                <UploadCloud className="w-4 h-4" /> کمپیوٹر سے اپلوڈ کریں
                              </button>
                            </div>
                          </div>
                          {settingsForm.logoUrl && (
                            <div className="mt-3 inline-block bg-white p-2 rounded-xl shadow-xs border border-slate-200">
                              <img src={settingsForm.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 font-simple mt-4">آئیکن (Favicon - Browser Tab)</label>
                            <div className="flex flex-col sm:flex-row gap-2 relative">
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  value={settingsForm.faviconUrl || ''} 
                                  onChange={e => setSettingsForm({...settingsForm, faviconUrl: e.target.value})} 
                                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                                  placeholder="URL" 
                                />
                              </div>
                              <div className="relative overflow-hidden shrink-0">
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleSettingImageUpload(e, 'faviconUrl')} 
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                />
                                <button type="button" className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs">
                                  <Upload className="w-4 h-4" /> اپلوڈ کریں
                                </button>
                              </div>
                            </div>
                            {settingsForm.faviconUrl && (
                              <div className="mt-3 inline-block bg-white p-2 rounded-xl shadow-xs border border-slate-200">
                                <img src={settingsForm.faviconUrl} alt="Favicon Preview" className="h-10 w-10 object-contain" />
                              </div>
                            )}
                          </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ہیلپ لائن فون</label>
                          <input 
                            type="text" 
                            value={settingsForm.helplinePhone || ''} 
                            onChange={e => setSettingsForm({...settingsForm, helplinePhone: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">واٹس ایپ نمبر (بغیر + کے، جیسے 923001234567)</label>
                          <input 
                            type="text" 
                            value={settingsForm.whatsappNumber || ''} 
                            onChange={e => setSettingsForm({...settingsForm, whatsappNumber: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">مرکزی دفتر کا پتہ (Head Office Location)</label>
                          <input 
                            type="text" 
                            value={settingsForm.headOffice || ''} 
                            placeholder="اسلام آباد، پاکستان"
                            onChange={e => setSettingsForm({...settingsForm, headOffice: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-right font-simple shadow-xs" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HOMEPAGE SETTINGS */}
                {settingsSubTab === 'homepage' && (
                  <div className="space-y-6 animate-in fade-in-50">
                    {/* Hero Section */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">ہوم پیج: مرکزی ہیرو بینر (Hero Section)</h3>
                          <p className="text-xs text-slate-500">مین پیج کا نمایاں ٹائٹل اور سب ٹائٹل</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ہیرو کا مرکزی عنوان (Hero Title)</label>
                          <input 
                            type="text" 
                            value={settingsForm.heroTitle || ''} 
                            onChange={e => setSettingsForm({...settingsForm, heroTitle: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ہیرو کا ذیلی عنوان / تفصیل (Hero Subtitle)</label>
                          <textarea 
                            rows="2"
                            value={settingsForm.heroSubtitle || ''} 
                            onChange={e => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed shadow-xs" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Featured Doctors Block */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <h3 className="text-base font-bold text-slate-900 font-h2">
                            نمایاں اطباء کا بلاک (Featured Doctors Grid)
                          </h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-700">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.featuredDoctorBlockEnabled !== false} 
                            onChange={e => setSettingsForm({...settingsForm, featuredDoctorBlockEnabled: e.target.checked})}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-0 bg-white border-slate-300" 
                          />
                          <span>ہوم پیج پر شو کریں</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">بلاک کا ٹائٹل (Title)</label>
                          <input 
                            type="text" 
                            value={settingsForm.featuredDoctorBlockTitle || ''} 
                            onChange={e => setSettingsForm({...settingsForm, featuredDoctorBlockTitle: e.target.value})} 
                            placeholder="نمایاں اطباء کرام (Featured Doctors)"
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-xs" 
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">بلاک کی سب ٹائٹل / تفصیل (Subtitle)</label>
                          <input 
                            type="text" 
                            value={settingsForm.featuredDoctorBlockSubtitle || ''} 
                            onChange={e => setSettingsForm({...settingsForm, featuredDoctorBlockSubtitle: e.target.value})} 
                            placeholder="پاکستان بھر کے منتخب اور مستند اطباء و ماہرین طب یونانی"
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-xs" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">کالمز کی تعداد (Columns: 1 سے 4)</label>
                          <select 
                            value={settingsForm.featuredDoctorBlockColumns || '4'} 
                            onChange={e => setSettingsForm({...settingsForm, featuredDoctorBlockColumns: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-xs"
                          >
                            <option value="1">1 کالم</option>
                            <option value="2">2 کالم</option>
                            <option value="3">3 کالم</option>
                            <option value="4">4 کالم</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">لائنوں کی تعداد (Rows: 1 سے 10)</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={settingsForm.featuredDoctorBlockRows || '1'} 
                            onChange={e => setSettingsForm({...settingsForm, featuredDoctorBlockRows: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-xs" 
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">ترتیب (Sort Order)</label>
                          <select 
                            value={settingsForm.featuredDoctorBlockSort || 'latest'} 
                            onChange={e => setSettingsForm({...settingsForm, featuredDoctorBlockSort: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-xs"
                          >
                            <option value="latest">تازہ ترین نمایاں اطباء پہلے (Latest First)</option>
                            <option value="oldest">پرانے نمایاں اطباء پہلے (Oldest First)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Featured Doctors Order */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <h3 className="text-base font-bold text-slate-900 font-h2">نمایاں اطباء کی ترتیب (Featured Order)</h3>
                        </div>
                        <button
                          onClick={() => {
                            const inputs = document.querySelectorAll('[data-featured-order-id]');
                            let updated = [...doctorsList];
                            inputs.forEach(inp => {
                              const docId = inp.dataset.featuredOrderId;
                              const val = parseInt(inp.value) || null;
                              updated = updated.map(d => String(d.id) === String(docId) ? { ...d, featuredOrder: val } : d);
                            });
                            setDoctorsList(updated);
                            showNotification('نمایاں اطباء کی ترتیب محفوظ ہو گئی!');
                          }}
                          className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors font-simple shadow-xs"
                        >
                          ✓ ترتیب محفوظ کریں
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 font-simple">ہر نمایاں طبیب کے سامنے نمبر لکھیں — جو نمبر چھوٹا ہوگا وہ پہلے نظر آئے گا (1 = سب سے پہلے)، پھر <strong className="text-amber-700">ترتیب محفوظ کریں</strong> دبائیں۔</p>
                      <div className="space-y-2 max-h-72 overflow-y-auto pl-1">
                        {(doctorsList || []).filter(d => d && (d.isFeatured === true || d.isFeatured === '1' || d.isFeatured === 'yes' || d.featured)).map(doc => (
                          <div key={doc.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xs">
                            <img
                              src={doc.image || '/images/default_doctor.webp'}
                              alt={doc.name}
                              onError={e => { e.target.onerror = null; e.target.src = '/images/default_doctor.webp'; }}
                              className="w-8 h-8 rounded-full object-cover border border-amber-300 shrink-0"
                            />
                            <span className="flex-1 text-sm text-slate-800 font-simple truncate">{doc.name}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <label className="text-[10px] text-slate-500 font-simple">ترتیب نمبر:</label>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                data-featured-order-id={doc.id}
                                defaultValue={doc.featuredOrder || ''}
                                placeholder="—"
                                className="w-16 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2 py-1 text-sm text-center focus:ring-2 focus:ring-amber-500 outline-none shadow-xs"
                              />
                            </div>
                          </div>
                        ))}
                        {(doctorsList || []).filter(d => d && (d.isFeatured === true || d.isFeatured === '1' || d.isFeatured === 'yes' || d.featured)).length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-4 font-simple">کوئی نمایاں طبیب نہیں — پہلے اطباء سیکشن میں کسی طبیب کو "نمایاں" کریں</p>
                        )}
                      </div>
                    </div>

                    {/* Article Bottom Consultation Doctors */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <h3 className="text-base font-bold text-slate-900 font-h2">مضمون کے آخر میں طبیب (Article Consultation Doctors)</h3>
                      </div>
                      <p className="text-xs text-slate-500 font-simple">جن اطباء کو آپ ہر مضمون کے آخر میں "مستند طبی مشاورت" باکس میں دکھانا چاہتے ہیں انہیں منتخب کریں۔</p>

                      {/* Search */}
                      <input
                        type="text"
                        placeholder="طبیب تلاش کریں..."
                        className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs placeholder-slate-400"
                        onChange={e => {
                          const val = e.target.value.toLowerCase();
                          const items = document.querySelectorAll('[data-consult-doc]');
                          items.forEach(item => {
                            item.style.display = item.dataset.consultDoc.includes(val) ? '' : 'none';
                          });
                        }}
                      />

                      <div className="space-y-2 max-h-72 overflow-y-auto pl-1">
                        {(doctorsList || []).filter(d => d && d.isApproved !== false && d.status !== 'pending').map(doc => {
                          const consultIds = Array.isArray(settingsForm.articleConsultDoctorIds) ? settingsForm.articleConsultDoctorIds : [];
                          const isSelected = consultIds.includes(String(doc.id));
                          return (
                            <div
                              key={doc.id}
                              data-consult-doc={`${(doc.name || '').toLowerCase()} ${(doc.cityName || '').toLowerCase()}`}
                              className={`flex items-center gap-3 border rounded-xl px-3 py-2 cursor-pointer transition-all ${isSelected ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'}`}
                              onClick={() => {
                                const currentIds = Array.isArray(settingsForm.articleConsultDoctorIds) ? settingsForm.articleConsultDoctorIds : [];
                                const docId = String(doc.id);
                                const updated = isSelected
                                  ? currentIds.filter(id => id !== docId)
                                  : [...currentIds, docId];
                                setSettingsForm(prev => ({ ...prev, articleConsultDoctorIds: updated }));
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="w-4 h-4 rounded text-emerald-600 bg-white border-slate-300 shrink-0 pointer-events-none"
                              />
                              <img
                                src={doc.image || '/images/default_doctor.webp'}
                                alt={doc.name}
                                onError={e => { e.target.onerror = null; e.target.src = '/images/default_doctor.webp'; }}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-slate-800 font-simple block truncate">{doc.name}</span>
                                <span className="text-[10px] text-slate-500 font-simple">{doc.cityName} • {(doc.specialties || []).join(', ').slice(0, 40)}</span>
                              </div>
                              {isSelected && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold shrink-0 shadow-xs">منتخب</span>}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-slate-500 font-simple">
                        منتخب: {Array.isArray(settingsForm.articleConsultDoctorIds) ? settingsForm.articleConsultDoctorIds.length : 0} طبیب
                        {Array.isArray(settingsForm.articleConsultDoctorIds) && settingsForm.articleConsultDoctorIds.length > 2 && (
                          <span className="text-amber-600"> (مضمون میں صرف پہلے 2 نظر آئیں گے)</span>
                        )}
                      </p>
                    </div>

                    {/* Doctors Block */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <h3 className="text-base font-bold text-slate-900 font-h2 border-b border-slate-200/80 pb-3">عمومی اطباء کا بلاک (All / Latest Doctors Grid)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">بلاک کا ٹائٹل</label>
                          <input type="text" value={settingsForm.doctorBlockTitle || ''} onChange={e => setSettingsForm({...settingsForm, doctorBlockTitle: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">بلاک کی سب ٹائٹل / تفصیل</label>
                          <input type="text" value={settingsForm.doctorBlockSubtitle || ''} onChange={e => setSettingsForm({...settingsForm, doctorBlockSubtitle: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">کالمز کی تعداد (1 سے 4)</label>
                          <select value={settingsForm.doctorBlockColumns || '4'} onChange={e => setSettingsForm({...settingsForm, doctorBlockColumns: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs">
                            <option value="1">1 کالم</option>
                            <option value="2">2 کالم</option>
                            <option value="3">3 کالم</option>
                            <option value="4">4 کالم</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">لائنوں کی تعداد</label>
                          <input type="number" min="1" max="10" value={settingsForm.doctorBlockRows || '2'} onChange={e => setSettingsForm({...settingsForm, doctorBlockRows: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">ترتیب (کون پہلے نظر آئے؟)</label>
                          <select value={settingsForm.doctorBlockSort || 'latest'} onChange={e => setSettingsForm({...settingsForm, doctorBlockSort: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs">
                            <option value="latest">نئے شامل ہونے والے اطباء پہلے (Latest First)</option>
                            <option value="oldest">پرانے اطباء پہلے (Oldest First)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Articles Block */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <h3 className="text-base font-bold text-slate-900 font-h2 border-b border-slate-200/80 pb-3">طبی مضامین کا بلاک (Articles Grid)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">بلاک کا ٹائٹل</label>
                          <input type="text" value={settingsForm.articleBlockTitle || ''} onChange={e => setSettingsForm({...settingsForm, articleBlockTitle: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">کالمز کی تعداد (1 سے 4)</label>
                          <select value={settingsForm.articleBlockColumns || '4'} onChange={e => setSettingsForm({...settingsForm, articleBlockColumns: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs">
                            <option value="1">1 کالم</option>
                            <option value="2">2 کالم</option>
                            <option value="3">3 کالم</option>
                            <option value="4">4 کالم</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">لائنوں کی تعداد</label>
                          <input type="number" min="1" max="10" value={settingsForm.articleBlockRows || '3'} onChange={e => setSettingsForm({...settingsForm, articleBlockRows: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">ترتیب (کون پہلے نظر آئے؟)</label>
                          <select value={settingsForm.articleBlockSort || 'latest'} onChange={e => setSettingsForm({...settingsForm, articleBlockSort: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs">
                            <option value="latest">تازہ ترین مضامین پہلے (Latest)</option>
                            <option value="oldest">پرانے مضامین پہلے</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SIDEBAR & ADS SETTINGS */}
                {settingsSubTab === 'sidebar' && (
                  <div className="space-y-6 animate-in fade-in-50">
                    {/* Widget Toggles */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
                          <Layout className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">مضمون ریڈنگ پیج سائیڈ بار وجیٹس</h3>
                          <p className="text-xs text-slate-500">کنٹرول کریں کہ مضمون پڑھتے وقت سائیڈ بار پر کون سے سیکشنز نظر آئیں</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.sidebarShowSearch !== false}
                            onChange={e => setSettingsForm({...settingsForm, sidebarShowSearch: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded bg-white border-slate-300 focus:ring-blue-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">مضامین سرچ باکس دکھائیں</span>
                            <span className="text-[11px] text-slate-500">سائیڈ بار میں سرچ کی سہولت</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.sidebarShowCategories !== false}
                            onChange={e => setSettingsForm({...settingsForm, sidebarShowCategories: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded bg-white border-slate-300 focus:ring-blue-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">مقبول کیٹگریز کی لسٹ دکھائیں</span>
                            <span className="text-[11px] text-slate-500">کیٹگری کے مضامین کی تعداد معہ کلک ایبل فلٹر</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.sidebarShowRecent !== false}
                            onChange={e => setSettingsForm({...settingsForm, sidebarShowRecent: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded bg-white border-slate-300 focus:ring-blue-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">تازہ ترین مضامین لسٹ دکھائیں</span>
                            <span className="text-[11px] text-slate-500">حالیہ شائع شدہ طبی مضامین</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.sidebarShowConsultation !== false}
                            onChange={e => setSettingsForm({...settingsForm, sidebarShowConsultation: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded bg-white border-slate-300 focus:ring-blue-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">آن لائن رہنمائی و مشورہ کارڈ دکھائیں</span>
                            <span className="text-[11px] text-slate-500">اطباء سے فوری آن لائن رابطے کا کارڈ</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.sidebarShowCategoriesDropdown !== false}
                            onChange={e => setSettingsForm({...settingsForm, sidebarShowCategoriesDropdown: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded bg-white border-slate-300 focus:ring-blue-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">تمام کیٹگریز کا ڈراپ ڈاؤن دکھائیں</span>
                            <span className="text-[11px] text-slate-500">سائیڈ بار میں سلیکٹ ڈراپ ڈاؤن لسٹ</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.sidebarShowPagesDropdown !== false}
                            onChange={e => setSettingsForm({...settingsForm, sidebarShowPagesDropdown: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded bg-white border-slate-300 focus:ring-blue-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">صفحات کا ڈراپ ڈاؤن دکھائیں</span>
                            <span className="text-[11px] text-slate-500">سائیڈ بار میں اہم صفحات پر فوری چھلانگ</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Pages Sidebar Controls */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">ویب سائٹ صفحات (Pages) سائیڈ بار وجیٹس</h3>
                          <p className="text-xs text-slate-500">کنٹرول کریں کہ صفحات (ہمارے بارے میں، رابطہ، پرائیویسی وغیرہ) پر سائیڈ بار میں کون سے ویجیٹس نظر آئیں</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.pageSidebarShowPagesList !== false}
                            onChange={e => setSettingsForm({...settingsForm, pageSidebarShowPagesList: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 rounded bg-white border-slate-300 focus:ring-indigo-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">فہرستِ صفحات (Pages Directory)</span>
                            <span className="text-[11px] text-slate-500">تمام سرکاری و کارپوریٹ صفحات کی لسٹ</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.pageSidebarShowRecentPosts !== false}
                            onChange={e => setSettingsForm({...settingsForm, pageSidebarShowRecentPosts: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 rounded bg-white border-slate-300 focus:ring-indigo-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">حالیہ شائع شدہ مضامین (Recent Posts)</span>
                            <span className="text-[11px] text-slate-500">تازہ ترین مضامین کے تصویری کارڈز</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.pageSidebarShowDoctors !== false}
                            onChange={e => setSettingsForm({...settingsForm, pageSidebarShowDoctors: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 rounded bg-white border-slate-300 focus:ring-indigo-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">مستند اطباء و نبض شناس (Doctors)</span>
                            <span className="text-[11px] text-slate-500">معالجین کے کارڈز اور فوری رابطہ بٹن</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.pageSidebarShowCategories !== false}
                            onChange={e => setSettingsForm({...settingsForm, pageSidebarShowCategories: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 rounded bg-white border-slate-300 focus:ring-indigo-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">اہم کیٹگریز و شعبہ جات (Categories)</span>
                            <span className="text-[11px] text-slate-500">کیٹگریز ڈراپ ڈاؤن اور پِلز (Pills) لسٹ</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-all shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.pageSidebarShowHelpline !== false}
                            onChange={e => setSettingsForm({...settingsForm, pageSidebarShowHelpline: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 rounded bg-white border-slate-300 focus:ring-indigo-500" 
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">ہیلپ لائن و واٹس ایپ سپورٹ باکس</span>
                            <span className="text-[11px] text-slate-500">سرکاری اوقات، فون اور ایک کلک واٹس ایپ</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Custom Image Banner Ad */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 font-simple">کسٹم اشتہار / سپانسرڈ بینر (Custom Sidebar Banner)</h3>
                            <p className="text-xs text-slate-500">سائیڈ بار پر اپنی مرضی کی تصویر، اشتہار یا بینر لگائیں</p>
                          </div>
                        </div>

                        <label className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 cursor-pointer self-start sm:self-auto shadow-xs">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.sidebarAdEnabled !== false}
                            onChange={e => setSettingsForm({...settingsForm, sidebarAdEnabled: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded bg-white border-slate-300 focus:ring-blue-500" 
                          />
                          <span className="text-xs font-bold text-slate-800">اشتہار فعال کریں (Active)</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">اشتہار کا عنوان (Ad Title)</label>
                          <input 
                            type="text" 
                            value={settingsForm.sidebarAdTitle || ''} 
                            onChange={e => setSettingsForm({...settingsForm, sidebarAdTitle: e.target.value})} 
                            placeholder="مثلاً: طبی مشورہ اور رہنمائی"
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">اشتہار کی تفصیل / ذیلی عنوان (Ad Subtitle)</label>
                          <textarea 
                            rows="2"
                            value={settingsForm.sidebarAdSubtitle || ''} 
                            onChange={e => setSettingsForm({...settingsForm, sidebarAdSubtitle: e.target.value})} 
                            placeholder="مثلاً: مستند اور ماہر اطباء سے آن لائن رہنمائی حاصل کریں۔"
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed shadow-xs" 
                          />
                        </div>

                        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                          <label className="block text-xs font-bold text-slate-700 mb-2">اشتہار کی تصویر (Banner Image)</label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                value={settingsForm.sidebarAdImage || ''} 
                                onChange={e => setSettingsForm({...settingsForm, sidebarAdImage: e.target.value})} 
                                className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                                placeholder="تصویر کا URL لنک ڈالیں یا کمپیوٹر سے اپلوڈ کریں" 
                              />
                            </div>
                            <div className="relative overflow-hidden shrink-0">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleSettingImageUpload(e, 'sidebarAdImage')} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              />
                              <button type="button" className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs">
                                <UploadCloud className="w-4 h-4" /> کمپیوٹر سے تصویر منتخب کریں
                              </button>
                            </div>
                          </div>

                          {settingsForm.sidebarAdImage && (
                            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-xs">
                              <img 
                                src={settingsForm.sidebarAdImage} 
                                alt="Sidebar Ad Preview" 
                                className="w-full sm:w-48 h-28 object-cover rounded-xl border border-slate-200" 
                              />
                              <div className="text-right">
                                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">لائیو پری ویو</span>
                                <h4 className="font-bold text-slate-900 text-sm mt-1">{settingsForm.sidebarAdTitle || 'عنوان'}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{settingsForm.sidebarAdSubtitle || 'تفصیل'}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">اشتہار پر کلک کرنے کا ہدف لنک (URL / WhatsApp Link)</label>
                          <input 
                            type="text" 
                            value={settingsForm.sidebarAdLink || ''} 
                            onChange={e => setSettingsForm({...settingsForm, sidebarAdLink: e.target.value})} 
                            placeholder="https://wa.me/923001234567 یا ویب سائٹ لنک"
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">بٹن کا متن (Button Text)</label>
                          <input 
                            type="text" 
                            value={settingsForm.sidebarAdButtonText || ''} 
                            onChange={e => setSettingsForm({...settingsForm, sidebarAdButtonText: e.target.value})} 
                            placeholder="مثلاً: ابھی رابطہ کریں / تفصیلات دیکھیں"
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. MEDIA SETTINGS */}
                {settingsSubTab === 'media' && (
                  <div className="space-y-6 animate-in fade-in-50">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center font-bold">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">بائی ڈیفالٹ تصاویر کی سیٹنگز</h3>
                          <p className="text-xs text-slate-500">اگر کسی مضمون یا طبیب کے ساتھ تصویر نہ لگی ہو، تو یہ ڈیفالٹ تصاویر شو ہوں گی۔</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                          <label className="block text-xs font-bold text-slate-700 mb-2">طبی مضامین کی ڈیفالٹ تصویر</label>
                          <div className="flex flex-col gap-3">
                            <input type="text" value={settingsForm.defaultArticleImage || ''} onChange={e => setSettingsForm({...settingsForm, defaultArticleImage: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" placeholder="تصویر کا لنک (URL)" />
                            <div className="relative overflow-hidden shrink-0">
                              <input type="file" accept="image/*" onChange={(e) => handleSettingImageUpload(e, 'defaultArticleImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              <button type="button" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                <UploadCloud className="w-4 h-4" /> اپلوڈ کریں
                              </button>
                            </div>
                          </div>
                          {settingsForm.defaultArticleImage && <img src={settingsForm.defaultArticleImage} className="w-full h-32 mt-3 object-cover rounded-lg border border-slate-200 shadow-xs" alt="Preview" />}
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                          <label className="block text-xs font-bold text-slate-700 mb-2">اطباء کی ڈیفالٹ پروفائل تصویر</label>
                          <div className="flex flex-col gap-3">
                            <input type="text" value={settingsForm.defaultDoctorImage || ''} onChange={e => setSettingsForm({...settingsForm, defaultDoctorImage: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" placeholder="تصویر کا لنک (URL)" />
                            <div className="relative overflow-hidden shrink-0">
                              <input type="file" accept="image/*" onChange={(e) => handleSettingImageUpload(e, 'defaultDoctorImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              <button type="button" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                <UploadCloud className="w-4 h-4" /> اپلوڈ کریں
                              </button>
                            </div>
                          </div>
                          {settingsForm.defaultDoctorImage && <img src={settingsForm.defaultDoctorImage} className="w-24 h-24 mt-3 object-cover rounded-full border-2 border-slate-200 shadow-xs mx-auto" alt="Preview" />}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SECURITY & ADMIN 2FA */}
                {settingsSubTab === 'security' && (
                  <AdminSecurityTab 
                    settingsForm={settingsForm}
                    setSettingsForm={setSettingsForm}
                    siteSettings={siteSettings}
                    setSiteSettings={setSiteSettings}
                    showNotification={showNotification}
                  />
                )}

                {/* 6. FOOTER & SOCIAL SETTINGS */}
                {settingsSubTab === 'footer' && (
                  <div className="space-y-6 animate-in fade-in-50">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-simple">فوٹر کی سیٹنگز و سوشل لنکس</h3>
                          <p className="text-xs text-slate-500">ویب سائٹ کا تعارف، کاپی رائٹ اور تمام سوشل میڈیا اکاؤنٹس</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">ویب سائٹ کا تعارف (About Text)</label>
                          <textarea 
                            rows="3" 
                            value={settingsForm.footerAboutText || settingsForm.footerAbout || ''} 
                            onChange={e => setSettingsForm({...settingsForm, footerAboutText: e.target.value, footerAbout: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">پتہ (Address)</label>
                          <input 
                            type="text" 
                            value={settingsForm.footerAddress || ''} 
                            onChange={e => setSettingsForm({...settingsForm, footerAddress: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ای میل (Email)</label>
                          <input 
                            type="email" 
                            value={settingsForm.footerEmail || ''} 
                            onChange={e => setSettingsForm({...settingsForm, footerEmail: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">کاپی رائٹ ٹیکسٹ (Copyright)</label>
                          <input 
                            type="text" 
                            value={settingsForm.footerCopyright || settingsForm.copyrightText || ''} 
                            onChange={e => setSettingsForm({...settingsForm, footerCopyright: e.target.value, copyrightText: e.target.value})} 
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs" 
                          />
                        </div>

                        {/* Social Links */}
                        <div className="md:col-span-2 border-t border-slate-200 pt-3">
                          <h4 className="text-xs font-bold text-slate-800 mb-3">سوشل میڈیا لنکس (Social Profiles)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">فیس بک (Facebook URL)</label>
                              <input 
                                type="text" 
                                value={settingsForm.facebookUrl || ''} 
                                onChange={e => setSettingsForm({...settingsForm, facebookUrl: e.target.value})} 
                                className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">انسٹاگرام (Instagram URL)</label>
                              <input 
                                type="text" 
                                value={settingsForm.instagramUrl || ''} 
                                onChange={e => setSettingsForm({...settingsForm, instagramUrl: e.target.value})} 
                                className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">یوٹیوب (YouTube URL)</label>
                              <input 
                                type="text" 
                                value={settingsForm.youtubeUrl || ''} 
                                onChange={e => setSettingsForm({...settingsForm, youtubeUrl: e.target.value})} 
                                className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr shadow-xs" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Save Button Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    تبدیلیاں کرنے کے بعد <span className="text-blue-600 font-bold">محفوظ کریں</span> کے بٹن پر لازمی کلک کریں۔
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 font-h2 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>تبدیلیاں محفوظ کریں (Save Settings)</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 5: WORDPRESS MIGRATION ENGINE */}
          {/* ========================================================= */}
          {adminTab === 'migration' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-950 text-lg font-simple">
                  <Database className="w-6 h-6 text-blue-600" />
                  <span>ورڈپریس ٹو کسٹم ڈیٹا امپورٹ انجن (WordPress Migration)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  ورڈپریس ڈیٹا بیس کی تمام 300 سے 400 پوسٹس، تصاویر اور Doctreat تھیم سے ڈاکٹرز کا ڈیٹا 100% تحفظ اور پرانے یو آر ایل اسلگز (URL Slugs) کے ساتھ منتقل کرنے کے لیے یہ ٹول ڈیزائن کیا گیا ہے۔
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm font-simple">1. ورڈپریس SQL فائل</h4>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center space-y-2 cursor-pointer transition-colors bg-white shadow-xs">
                    <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                    <p className="text-xs text-slate-800 font-bold font-simple">ورڈپریس کا SQL ڈیٹا بیس یہاں اپلوڈ کریں</p>
                    <span className="text-[10px] text-slate-500 font-sans block">.sql, .sql.gz, .xml فارمیٹس</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm font-simple">2. میڈیا مائیگریشن (uploads.zip)</h4>
                  <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center space-y-2 cursor-pointer transition-colors bg-white shadow-xs">
                    <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs text-slate-800 font-bold font-simple">تمام تصاویر کا زپ فولڈر اپلوڈ کریں</p>
                    <span className="text-[10px] text-slate-500 font-sans block">wp-content/uploads.zip</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* MODAL 1: ADD MEDIA (COMPUTER UPLOAD, URL, STOCK LIBRARY) */}
      {/* ========================================================= */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl text-right animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-simple">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">میڈیا مینیجر (Add Media)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-simple">
              <button
                type="button"
                onClick={() => setMediaTab('upload')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold ${mediaTab === 'upload' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                کمپیوٹر سے اپلوڈ کریں
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('url')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold ${mediaTab === 'url' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ویب لنک (Image URL)
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('library')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold ${mediaTab === 'library' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                طبی و ہربل گیلری لائبریری
              </button>
            </div>

            {/* TAB 1: Local File Upload */}
            {mediaTab === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={mediaFileInputRef}
                  onChange={handleModalFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => mediaFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-10 text-center space-y-3 cursor-pointer transition-colors bg-slate-50"
                >
                  <UploadCloud className="w-10 h-10 text-blue-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-800 font-simple">کمپیوٹر سے فائل منتخب کریں</p>
                  <span className="text-xs text-slate-500 block font-sans">JPG, PNG, GIF, WebP (کوئی بھی سائز)</span>
                </div>
              </div>
            )}

            {/* TAB 2: Direct URL */}
            {mediaTab === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-simple">تصویر کا براہ راست URL:</label>
                  <input
                    type="url"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-sans shadow-xs"
                  />
                </div>
                {mediaUrlInput && (
                  <div className="h-40 rounded-2xl bg-slate-50 overflow-hidden border border-slate-200 flex items-center justify-center">
                    <img src={mediaUrlInput} alt="Preview" className="h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Stock Library */}
            {mediaTab === 'library' && (
              <div className="grid grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
                {STOCK_MEDIA.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleInsertMediaFromModal(item.url)}
                    className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 cursor-pointer bg-slate-50 transition-all space-y-1 p-1.5 hover:shadow-xs"
                  >
                    <img src={item.url} alt={item.title} className="w-full h-20 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1 font-simple">{item.title}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Common Image Options (Alignment, Caption, Width) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 font-simple text-xs">
              <div>
                <label className="block text-slate-700 mb-1">الائنمنٹ:</label>
                <select
                  value={mediaAlignment}
                  onChange={(e) => setMediaAlignment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-800 shadow-xs"
                >
                  <option value="center">درمیان (Center)</option>
                  <option value="right">دائیں لپٹا ہوا (Float Right)</option>
                  <option value="left">بائیں لپٹا ہوا (Float Left)</option>
                  <option value="full">مکمل چوڑائی (Full Width)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">چوڑائی سائز:</label>
                <select
                  value={mediaWidth}
                  onChange={(e) => setMediaWidth(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-800 font-sans shadow-xs"
                >
                  <option value="100%">100% (بڑا)</option>
                  <option value="75%">75% (درمیانہ)</option>
                  <option value="50%">50% (نصف)</option>
                  <option value="35%">35% (چھوٹا)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">تصویر کا کیپشن (اختیاری):</label>
                <input
                  type="text"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  placeholder="تصویر کے نیچے تحریر..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-800 shadow-xs"
                />
              </div>
            </div>

            {/* Insert Button */}
            {mediaTab === 'url' && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleInsertMediaFromModal()}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors font-simple shadow-xs"
                >
                  مضمون میں تصویر لگائیں
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD FORM (CONSULTATION, ORDER, QUESTION) */}
      {/* ========================================================= */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl text-right animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-simple">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">فارم شامل کریں (Add Form)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-simple">
              <label className="text-xs text-slate-700 font-bold block">مضمون کے اندر کس قسم کا فارم شامل کرنا چاہتے ہیں؟</label>
              
              <div
                onClick={() => setFormType('consultation')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formType === 'consultation' ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <h4 className="font-bold text-sm text-blue-700">1. طبیب سے آن لائن مشورہ فارم</h4>
                <p className="text-xs text-slate-600 mt-1">مریض مضمون پڑھنے کے دوران اپنا نام، واٹس ایپ اور علامات درج کر کے رابطہ کر سکے گا۔</p>
              </div>

              <div
                onClick={() => setFormType('order')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formType === 'order' ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <h4 className="font-bold text-sm text-emerald-700">2. ہربل نسخہ / دوا ہوم ڈیلیوری فارم</h4>
                <p className="text-xs text-slate-600 mt-1">مضمون میں بتائے گئے نسخہ کی کیش آن ڈیلیوری آرڈر حاصل کرنے کے لیے فارم بکس۔</p>
              </div>

              <div
                onClick={() => setFormType('question')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formType === 'question' ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <h4 className="font-bold text-sm text-purple-700">3. سوال پوچھیں و فیڈ بیک فارم</h4>
                <p className="text-xs text-slate-600 mt-1">مضمون کے متعلق قارئین سے طبی سوالات اور رائے حاصل کرنے کا فارم۔</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 font-simple">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs transition-colors"
              >
                منسوخ
              </button>
              <button
                type="button"
                onClick={handleInsertFormWidget}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                فارم مضمون میں داخل کریں
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: FIND & REPLACE */}
      {/* ========================================================= */}
      {showFindReplaceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-right animate-in zoom-in-95 duration-150 font-simple">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-bold text-slate-900">تلاش اور تبدیلی (Find & Replace)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFindReplaceModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteFindReplace} className="space-y-4">
              <div>
                <label className="text-xs text-slate-700 block mb-1">مطلوبہ لفظ (Find):</label>
                <input
                  type="text"
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="وہ لفظ جو تلاش کرنا ہے..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 block mb-1">نئے لفظ سے تبدیل کریں (Replace with):</label>
                <input
                  type="text"
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  placeholder="نیا متبادل لفظ..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 shadow-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFindReplaceModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs transition-colors"
                >
                  بند کریں
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  تمام کو تبدیل کریں (Replace All)
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: KEYBOARD SHORTCUTS & HELP */}
      {/* ========================================================= */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-right animate-in zoom-in-95 duration-150 font-simple">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">کی بورڈ شارٹ کٹس (Shortcuts)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 font-sans">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-700 font-simple">بولڈ (Bold)</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono shadow-xs">Ctrl + B</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-700 font-simple">اٹالک (Italic)</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono shadow-xs">Ctrl + I</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-700 font-simple">انڈر لائن (Underline)</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono shadow-xs">Ctrl + U</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-700 font-simple">واپس (Undo)</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono shadow-xs">Ctrl + Z</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-700 font-simple">دوبارہ (Redo)</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono shadow-xs">Ctrl + Y</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-700 font-simple">سب منتخب کریں</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono shadow-xs">Ctrl + A</kbd>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                ٹھیک ہے
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}




