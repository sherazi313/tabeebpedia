import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import DoctorDirectory from './components/DoctorDirectory';
import DoctorProfileModal from './components/DoctorProfileModal';
import DoctorAuthModal from './components/DoctorAuthModal';
import DoctorDashboard from './components/DoctorDashboard';
import BlogSection from './components/BlogSection';
import ArticleDetailView from './components/ArticleDetailView';
import HerbsEncyclopedia from './components/HerbsEncyclopedia';
import QanoonMufradAzaGuide from './components/QanoonMufradAzaGuide';
import AdminCMS from './components/AdminCMS';
import { fetchLiveDoctors, fetchLiveArticles } from './api';
import Footer from './components/Footer';

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
  Award
} from 'lucide-react';

const STORAGE_KEY_ARTICLES = 'tabeeb_articles_data_v1';
const STORAGE_KEY_SETTINGS = 'tabeeb_site_settings_v1';
const STORAGE_KEY_DOCTORS = 'tabeeb_doctors_data_v1';
const STORAGE_KEY_LOGGED_DOCTOR = 'tabeeb_logged_in_doctor_v1';
const STORAGE_KEY_CITIES = 'tabeeb_cities_data_v1';

const getInitialCities = () => {
  let baseCities = [...CITIES];
  const existingNames = new Set(baseCities.map(c => (c && c.name ? String(c.name).trim() : '')).filter(Boolean));

  try {
    const saved = localStorage.getItem(STORAGE_KEY_CITIES);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(c => {
          if (c && c.name && typeof c.name === 'string' && !existingNames.has(c.name.trim())) {
            baseCities.push({ id: c.id || c.name.trim().toLowerCase(), name: c.name.trim() });
            existingNames.add(c.name.trim());
          }
        });
      }
    }
  } catch (e) {
    console.error('Failed to load cities from localStorage:', e);
  }

  // Also collect any cities from existing doctors
  try {
    const savedDocs = localStorage.getItem(STORAGE_KEY_DOCTORS);
    const docs = savedDocs && savedDocs !== 'undefined' ? JSON.parse(savedDocs) : DOCTORS;
    if (Array.isArray(docs)) {
      docs.forEach(doc => {
        if (!doc) return;
        const cName = doc.cityName || (baseCities.find(c => c && c.id === doc.city)?.name);
        if (cName && typeof cName === 'string' && !existingNames.has(cName.trim())) {
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
    const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load articles from localStorage:', e);
  }
  return ARTICLES;
};

const getInitialDoctors = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DOCTORS);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load doctors from localStorage:', e);
  }
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
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return {
    siteName: 'طبیب پیڈیا',
    tagline: 'جامع ہربل و طبی انسائیکلوپیڈیا',
    logoUrl: '',
    helplinePhone: '0300-1234567',
    whatsappNumber: '923001234567',
    topbarNotice: 'طب یونانی، قانون مفرد اعضاء اور پاکستان کے مستند اطباء کی ڈائریکٹری',
    heroTitle: 'مستند اطباء اور حکماء سے مفت آن لائن رہنمائی و فوری رابطہ',
    heroSubtitle: 'طب یونانی، قانون مفرد اعضاء، ہربل علاج اور مستند سائنسی و طبی مضامین کا سب سے بڑا ڈیجیٹل خزانہ',
    footerAbout: 'پاکستان کا سب سے معتبر ڈیجیٹل ہربل پورٹل۔ ہمارا مقصد طب یونانی، طب نبوی اور قانون مفرد اعضاء کو جدید سائنسی معیار اور سہولت کے ساتھ ہر فرد تک پہنچانا ہے۔',
    copyrightText: 'تمام جملہ حقوق محفوظ ہیں۔',
    facebookUrl: 'https://facebook.com/tabeebpedia',
    instagramUrl: 'https://instagram.com/tabeebpedia',
    youtubeUrl: 'https://youtube.com/tabeebpedia',
    metaTitle: 'طبیب پیڈیا - طب یونانی، قانون مفرد اعضاء اور اطباء ڈائریکٹری',
    metaDescription: 'طبیب پیڈیا: پاکستان کی سب سے بڑی اور مستند طب یونانی، جڑی بوٹیاں اور اطباء و ڈاکٹرز ڈائریکٹری۔'
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'doctors', 'blog', 'herbs', 'qanoon', 'admin', 'doctor-dashboard'
  const [theme, setTheme] = useState('navy'); // 'navy' or 'herbal'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articlesList, setArticlesList] = useState(getInitialArticles);
  const [doctorsList, setDoctorsList] = useState(getInitialDoctors);
  const [loggedInDoctor, setLoggedInDoctor] = useState(getInitialLoggedDoctor);
  const [citiesList, setCitiesList] = useState(getInitialCities);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [siteSettings, setSiteSettings] = useState(getInitialSettings);

  // Admin Login Protection
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
    try { return sessionStorage.getItem('tabeeb_admin_auth') === 'true'; } catch { return false; }
  });
  const [adminLoginInput, setAdminLoginInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const ADMIN_PASSWORD = 'tabeeb@admin2025';

  // Scroll-to-top
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Doctor Auth Modal state
  const [doctorAuthModalOpen, setDoctorAuthModalOpen] = useState(false);

  // --- LIVE DATABASE SYNC ---
  useEffect(() => {
    const syncData = async () => {
      try {
        const liveDoctors = await fetchLiveDoctors();
        if (liveDoctors && liveDoctors.length > 0) {
          // Transform if needed or just set
          setDoctorsList(liveDoctors);
        }
        
        const liveArticles = await fetchLiveArticles();
        if (liveArticles && liveArticles.length > 0) {
          setArticlesList(liveArticles);
        }
      } catch(e) {
        console.error("Live sync failed", e);
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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articlesList));
    } catch (e) {}
  }, [articlesList]);

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
    setSelectedDoctor(doctor);
  };

  const handleSelectArticle = (article) => {
    const current = (article && articlesList.find(a => a.id === article.id || a.slug === article.slug)) || article;
    setSelectedArticle(current);
    setActiveTab('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const articleParam = params.get('article') || params.get('slug');
      const portalParam = params.get('portal') || params.get('tab');

      if (portalParam === 'doctor' || portalParam === 'doctor-dashboard') {
        if (loggedInDoctor) {
          setActiveTab('doctor-dashboard');
        } else {
          setDoctorAuthModalInitialMode('login');
          setDoctorAuthModalOpen(true);
        }
        return;
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
          setActiveTab('article-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    handleUrlNavigation();
    window.addEventListener('popstate', handleUrlNavigation);
    return () => window.removeEventListener('popstate', handleUrlNavigation);
  }, [articlesList, loggedInDoctor]);

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
              <h2 className="text-xl font-bold text-white font-simple">ایڈمن پینل</h2>
              <p className="text-xs text-slate-400 mt-1 font-simple">صرف مجاز افراد کے لیے</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (adminLoginInput === ADMIN_PASSWORD) {
                try { sessionStorage.setItem('tabeeb_admin_auth', 'true'); } catch {}
                setAdminAuthenticated(true);
                setAdminLoginError('');
              } else {
                setAdminLoginError('پاسورڈ غلط ہے۔ دوبارہ کوشش کریں۔');
                setAdminLoginInput('');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 font-simple">ایڈمن پاسورڈ:</label>
                <input
                  type="password"
                  value={adminLoginInput}
                  onChange={(e) => { setAdminLoginInput(e.target.value); setAdminLoginError(''); }}
                  placeholder="پاسورڈ درج کریں..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  dir="ltr"
                  autoFocus
                />
              </div>
              {adminLoginError && (
                <p className="text-xs text-red-400 font-bold font-simple bg-red-900/20 border border-red-800/40 rounded-xl px-3 py-2">{adminLoginError}</p>
              )}
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md font-simple">
                داخل ہوں
              </button>
              <button type="button" onClick={() => { setActiveTab('home'); setAdminLoginInput(''); setAdminLoginError(''); }} className="w-full text-slate-500 hover:text-slate-300 text-xs font-simple py-1 transition-colors">
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
          setSelectedDoctor(doc);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Global Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        siteSettings={siteSettings}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'article-detail') setSelectedArticle(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearchClick={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        loggedInDoctor={loggedInDoctor}
        onOpenDoctorPortal={handleOpenDoctorPortal}
        onOpenDoctorAuthModal={handleOpenDoctorAuthModal}
        onLogoutDoctor={handleDoctorLogout}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {(activeTab === 'home' || !['doctors', 'blog', 'article-detail', 'herbs', 'qanoon'].includes(activeTab)) && (
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
              onNavigateToDirectory={() => setActiveTab('doctors')}
              theme={theme}
            />

            {/* Specialties & Ailments Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className={`text-xs font-bold ${isNavy ? 'text-blue-700' : 'text-emerald-700'} uppercase font-sans`}>تخصصات و امراض</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-h2">
                    بیماری یا طریقہ علاج کے لحاظ سے طبیب تلاش کریں
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('doctors')}
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

            {/* Featured Doctors Banner */}
            <section className={`${isNavy ? 'bg-[#0b1d3a] text-white border-y border-slate-800' : 'bg-emerald-950 text-white'} py-16 transition-colors duration-500`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-h2">
                      پاکستان کے معروف و مستند نبض شناس اطباء
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      آن لائن رہنمائی حاصل کریں یا واٹس ایپ پر براہ راست مشورہ طلب کریں
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDoctorAuthModal('signup')}
                      className="text-xs sm:text-sm font-bold text-amber-300 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/30 px-4 py-2.5 rounded-xl transition-all font-h2"
                    >
                      بطور طبیب شامل ہوں
                    </button>
                    <button
                      onClick={() => setActiveTab('doctors')}
                      className="text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl transition-all font-h2"
                    >
                      تمام اطباء دیکھیں ({doctorsList.filter(d => d && d.isApproved !== false && d.status !== 'pending').length}+)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctorsList.filter(d => d && d.isApproved !== false && d.status !== 'pending').slice(0, 3).map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white text-slate-800 rounded-3xl p-5 shadow-lg border border-white/10 flex flex-col justify-between space-y-4 relative group"
                    >
                      <div>
                        {/* Top Profile info */}
                        <div className="flex items-start gap-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
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
                      onClick={() => setActiveTab('qanoon')}
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
                    تازہ ترین طبی تحقیقات اور نسخہ جات
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`text-xs sm:text-sm font-bold ${isNavy ? 'text-blue-700 hover:text-blue-900' : 'text-emerald-700 hover:text-emerald-900'} flex items-center gap-1 group font-h2`}
                >
                  <span>تمام مضامین دیکھیں</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articlesList.slice(0, 3).map((article) => (
                  <div
                    key={article.id}
                    onClick={() => handleSelectArticle(article)}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute top-3 right-3 bg-white/90 backdrop-blur-xs ${isNavy ? 'text-blue-900' : 'text-emerald-900'} text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs font-sans`}>
                          {article.categoryName}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className={`text-base font-bold text-slate-900 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} transition-colors line-clamp-2 leading-snug font-h2`}>
                          {article.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
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
                ))}
              </div>
            </section>

            {/* Herbs Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className={`text-xs font-bold ${isNavy ? 'text-blue-700' : 'text-emerald-700'} uppercase font-sans`}>نباتاتی خزانہ</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-h2">
                    مشہور طبی جڑی بوٹیاں اور ان کے مزاج
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('herbs')}
                  className={`text-xs sm:text-sm font-bold ${isNavy ? 'text-blue-700 hover:text-blue-900' : 'text-emerald-700 hover:text-emerald-900'} flex items-center gap-1 group font-h2`}
                >
                  <span>جڑی بوٹیوں کی انسائیکلوپیڈیا کھولیں</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {HERBS_DATA.slice(0, 4).map((herb) => (
                  <div
                    key={herb.id}
                    onClick={() => setActiveTab('herbs')}
                    className={`bg-white p-4 rounded-3xl border border-slate-200 ${isNavy ? 'hover:border-blue-400' : 'hover:border-emerald-400'} shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3`}
                  >
                    <img src={herb.image} alt={herb.name} className="w-full h-36 rounded-2xl object-cover" />
                    <div>
                      <h4 className={`text-sm font-bold text-slate-900 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} transition-colors font-h2`}>
                        {herb.name}
                      </h4>
                      <span className={`text-[10px] ${isNavy ? 'text-blue-800 bg-blue-50' : 'text-emerald-700 bg-emerald-50'} px-2 py-0.5 rounded font-sans inline-block mt-1 font-bold`}>
                        مزاج: {herb.mizaj}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: DOCTOR DIRECTORY */}
        {activeTab === 'doctors' && (
          <DoctorDirectory
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
          <BlogSection
            articlesList={articlesList}
            onSelectArticle={handleSelectArticle}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {/* VIEW 4: ARTICLE DETAIL READER */}
        {activeTab === 'article-detail' && (
          <ArticleDetailView
            article={selectedArticle}
            articlesList={articlesList}
            onBack={() => setActiveTab('blog')}
            onSelectArticle={handleSelectArticle}
            onSelectDoctor={handleSelectDoctor}
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

      </main>

      {/* Global Doctor Profile Modal (Patient View) */}
      {selectedDoctor && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

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
      <Footer 
        siteSettings={siteSettings}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
