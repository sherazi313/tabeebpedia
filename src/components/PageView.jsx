import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Share2, 
  Printer, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle,
  BookOpen,
  FileText,
  ShieldCheck,
  Scale,
  Info,
  ChevronLeft,
  ChevronDown,
  Copy,
  Sparkles,
  Stethoscope,
  FolderOpen,
  Clock,
  Eye,
  Star
} from 'lucide-react';
import { ARTICLES, DOCTORS } from '../data/mockData';
import PdfBooksLibrary from './PdfBooksLibrary';

export default function PageView({ 
  page, 
  pagesList = [], 
  articlesList = [],
  doctorsList = [],
  onBack, 
  onSelectPage,
  onSelectArticle,
  onSelectDoctor,
  onSelectCategory,
  onNavigateArticles,
  onNavigateDoctors,
  siteSettings 
}) {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [copied, setCopied] = useState(false);

  const [fontSize, setFontSize] = useState(() => {
    try {
      return localStorage.getItem('tabeeb_reading_font_size') || 'normal';
    } catch(e) {
      return 'normal';
    }
  });

  const handleSetFontSize = (size) => {
    setFontSize(size);
    try {
      localStorage.setItem('tabeeb_reading_font_size', size);
    } catch(e) {}
  };

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'article-font-small';
    if (fontSize === 'large') return 'article-font-large';
    return 'article-font-normal';
  };

  if (!page) return null;

  const isContactPage = page.slug === 'contact' || page.slug === 'contact-us' || (page.title && page.title.includes('رابطہ'));
  const isPdfBooks = page.slug === 'pdf-books' || String(page.id) === '8339' || page.slug === 'books' || (page.title && (page.title.includes('پی ڈی ایف') || page.title.includes('PDF Books')));

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  // Helper for choosing distinctive page icon
  const getPageIcon = (slug, title = '') => {
    const s = (slug || '').toLowerCase();
    const t = (title || '').toLowerCase();
    if (s.includes('about') || t.includes('بارے')) return <Info className="w-4 h-4 text-blue-500" />;
    if (s.includes('contact') || t.includes('رابطہ')) return <Phone className="w-4 h-4 text-emerald-500" />;
    if (s.includes('privacy') || t.includes('پرائیویسی')) return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
    if (s.includes('book') || s.includes('pdf') || t.includes('کتب') || t.includes('کتاب')) return <BookOpen className="w-4 h-4 text-emerald-500" />;
    if (s.includes('hakim') || s.includes('tabib') || t.includes('حکیم') || t.includes('طبیب')) return <Stethoscope className="w-4 h-4 text-emerald-600" />;
    if (s.includes('punjab') || s.includes('sind') || s.includes('kpk') || s.includes('balochistan') || s.includes('kashmir') || s.includes('gilgit') || t.includes('پنجاب') || t.includes('سندھ') || t.includes('صوبہ')) return <MapPin className="w-4 h-4 text-teal-600" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  const allPages = pagesList && pagesList.length > 0 ? pagesList : [
    { id: 1, title: 'ہمارے بارے میں (About Tabeeb Pedia)', slug: 'about-us' },
    { id: 2, title: 'رابطہ کریں (Contact Us)', slug: 'contact' },
    { id: 3, title: 'پرائیویسی پالیسی (Privacy Policy)', slug: 'privacy-policy' }
  ];

  // Articles & Doctors data
  const allArticles = articlesList && articlesList.length > 0 ? articlesList : ARTICLES;
  const allDoctors = doctorsList && doctorsList.length > 0 ? doctorsList : DOCTORS;

  // Recent 4 posts
  const recentPosts = allArticles.slice(0, 4);

  // Featured 2-3 Doctors
  const featuredDoctors = allDoctors.slice(0, 3);

  // Top Categories with Counts
  const topCategories = useMemo(() => {
    const counts = {};
    allArticles.forEach(a => {
      const cats = Array.isArray(a.categories) ? a.categories : [a.category, a.categoryName].filter(Boolean);
      cats.forEach(c => {
        if (c && typeof c === 'string') {
          const trimmed = c.trim();
          if (trimmed) counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allArticles]);

  const renderedHtml = useMemo(() => {
    if (!page || !page.content) return '';
    let html = page.content;

    // 1. Remove external broken responsive srcset/sizes attributes
    html = html.replace(/\ssrcset=["'][^"']+["']/gi, '');
    html = html.replace(/\ssizes=["'][^"']+["']/gi, '');

    // 2. Map all remote or broken paths to local downloaded images in /images/pages/
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-Hakeem-in-Sind[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-sindh.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-Hakeem-of-Gilgit[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-gilgit.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-Hakeem-Kashmir[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-kashmir.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-of-Certified-Hakims-in-Balochistan[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-balochistan.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-of-Certified-Hakeem-in-KHYBER[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-kpk.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*punjab-Hakeem-List[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-punjab.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-Hakim-Punjab-West[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-punjab-west.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-of-Eastern-Punjab-scholars[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-punjab-east.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-Hakim-Punjab-South[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-punjab-south.png');
    html = html.replace(/(?:https?:\/\/(?:www\.)?tabeebpedia\.com)?\/?(?:wp-content\/?uploads|images\/pages)\/[^\/]*List-Hakim-Punjab-North[^\."'\s]*\.png/gi, '/images/pages/list-hakeem-punjab-north.png');

    // 3. Cleanly parse WordPress caption shortcodes
    html = html.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, (match, body) => {
      const imgMatch = body.match(/(<a[\s\S]*?<\/a>|<img[\s\S]*?>)/i);
      let media = '';
      let captionText = body;
      if (imgMatch) {
        media = imgMatch[0];
        captionText = body.replace(media, '').trim();
      }
      return `<figure class="my-6 flex flex-col items-center justify-center text-center">${media || body}${captionText ? `<figcaption class="text-sm font-bold text-slate-600 mt-2">${captionText}</figcaption>` : ''}</figure>`;
    });
    html = html.replace(/\[\/?caption[^\]]*\]/gi, '');

    return html;
  }, [page?.content]);

  return (
    <div className="min-h-screen bg-slate-50/80 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 text-right font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Navigation & Tooling Bar (Mobile-friendly flex wrap) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xs">
          
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer font-simple"
          >
            <ArrowRight className="w-4 h-4 text-emerald-600" />
            <span>صفحۂ اول پر واپس جائیں</span>
          </button>

          {/* Controls: Font size, Print, Share (Optimized for Mobile Touch) */}
          <div className="flex items-center gap-2 text-xs">
            {/* Font Size controls */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 font-sans">
              <span className="text-[11px] text-slate-500 font-bold px-1.5 font-urdu hidden sm:inline">فونٹ سائز:</span>
              <button
                type="button"
                onClick={() => handleSetFontSize('small')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'small' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
                title="چھوٹا فونٹ"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleSetFontSize('normal')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'normal' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
                title="معمول کا فونٹ"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleSetFontSize('large')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'large' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
                title="بڑا فونٹ"
              >
                A+
              </button>
            </div>

            {/* Print Button (Hidden on tiny mobile) */}
            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-xl shadow-xs transition-colors hidden sm:block cursor-pointer"
              title="پرنٹ کریں"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 hover:text-indigo-700 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'کاپی ہو گیا' : 'لنک کاپی'}</span>
            </button>

            {/* Share to WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${page.title} - طبیب پیڈیا: ${window.location.href}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">شیئر کریں</span>
            </a>
          </div>
        </div>

        {/* Responsive Layout (Full Width for PDF Books, 2-Column for standard pages) */}
        <div className={isPdfBooks ? "w-full" : "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"}>

          {/* ========================================================= */}
          {/* Main Page Article */}
          {/* ========================================================= */}
          <article className={isPdfBooks 
            ? "w-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-8 shadow-xs space-y-6" 
            : "lg:col-span-8 order-1 lg:order-2 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-10 lg:p-12 shadow-sm space-y-6 sm:space-y-8"
          }>
            
            {/* Standard Page Header (Hidden on PDF Books which has its own rich hero banner) */}
            {!isPdfBooks && (
              <header className="border-b border-slate-100 pb-5 sm:pb-6 space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full font-sans">
                    <FileText className="w-3 h-3 text-indigo-600" />
                    <span>سرکاری صفحہ</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    /{page.slug || page.id}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight font-h1">
                  {page.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-sans pt-1">
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full text-slate-700 font-bold">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{page.author || 'ایڈمن طبیب پیڈیا'}</span>
                  </span>
                  {page.date && (
                    <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{page.date}</span>
                    </span>
                  )}
                </div>
              </header>
            )}

            {/* Page Body Content */}
            {isPdfBooks ? (
              <PdfBooksLibrary />
            ) : (
              <div 
                className={`prose max-w-none text-slate-800 article-rendered-content ${getFontSizeClass()} space-y-4 font-nastaliq leading-loose`}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            )}

            {/* Contact Interactive Form (Only shown if this is Contact page) */}
            {isContactPage && (
              <div className="pt-8 border-t border-slate-200 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-h2">ہمیں براہِ راست پیغام بھیجیں</h3>
                  <p className="text-xs sm:text-sm text-slate-500">ہماری طبی و انتظامی ٹیم 24 گھنٹوں کے اندر آپ سے رابطہ کرے گی۔</p>
                </div>
                
                {contactSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2 animate-fade-in">
                    <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-900 text-base sm:text-lg font-simple">آپ کا پیغام کامیابی سے موصول ہو گیا ہے!</h4>
                    <p className="text-xs sm:text-sm text-emerald-700">شکریہ! ہماری سپورٹ ٹیم جلد آپ کے واٹس ایپ یا فون پر جواب دے گی۔</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-5 bg-slate-50 p-4 sm:p-8 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">آپ کا نام *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-xs font-simple"
                          placeholder="مثلاً: محمد احمد خان"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">موبائل نمبر / واٹس ایپ *</label>
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-xs text-left dir-ltr font-sans"
                          placeholder="03001234567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">ای میل (اختیاری)</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-xs text-left dir-ltr font-sans"
                        placeholder="yourname@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">آپ کا سوال، مشورہ یا تجویز *</label>
                      <textarea
                        required
                        rows="4"
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-xs leading-relaxed font-simple"
                        placeholder="اپنا تفصیلی پیغام یہاں درج فرمائیں..."
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      {siteSettings?.whatsappNumber && (
                        <a
                          href={`https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent('السلام علیکم! مجھے طبیب پیڈیا کے حوالے سے رابطہ کرنا ہے۔')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5 text-emerald-600" />
                          <span>یا واٹس ایپ پر براہ راست بات کریں</span>
                        </a>
                      )}

                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-simple cursor-pointer active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                        <span>پیغام ارسال کریں</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Bottom Page Footer Note */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>طبیب پیڈیا (Tabeeb Pedia) — تمام حقوق بحقِ ادارہ محفوظ ہیں۔</span>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
              >
                ↑ اوپر جائیں
              </button>
            </div>

          </article>

          {/* ========================================================= */}
          {/* Distinct Pages Sidebar (Hidden on PDF Books page) */}
          {/* ========================================================= */}
          {!isPdfBooks && (
            <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6 lg:sticky lg:top-24 w-full">

            {/* Widget 1: Pages Directory Menu (فہرستِ صفحات) */}
            {siteSettings?.pageSidebarShowPagesList !== false && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full font-sans">
                    {allPages.length} صفحات
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-simple">
                    <span>فہرستِ صفحات (Pages)</span>
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </h3>
                </div>

                <div className="space-y-1.5 pt-1">
                  {allPages.map((p) => {
                    const isActive = (p.id && page.id && String(p.id) === String(page.id)) || (p.slug && page.slug && p.slug === page.slug);
                    const level = p.level || 0;
                    const indentClass = level === 2 ? 'mr-6 pr-2 border-r-2 border-indigo-200' : level === 1 ? 'mr-3 pr-2 border-r-2 border-slate-200' : '';
                    
                    return (
                      <div key={p.id || p.slug} className={indentClass}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isActive && onSelectPage) {
                              onSelectPage(p.slug || p.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-right cursor-pointer font-simple group ${
                            isActive 
                              ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-2 border-indigo-500 text-indigo-950 shadow-xs' 
                              : 'bg-slate-50/70 hover:bg-indigo-50/50 border border-slate-200/70 text-slate-700 hover:text-indigo-900 hover:border-indigo-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`p-1.5 rounded-xl shrink-0 ${isActive ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-100/50'} transition-colors`}>
                              {getPageIcon(p.slug, p.title)}
                            </div>
                            <span className="truncate">
                              {level === 2 ? '— — ' : level === 1 ? '— ' : ''}
                              {p.title}
                            </span>
                          </div>
                          
                          {isActive ? (
                            <span className="text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-full font-sans shrink-0">
                              موجودہ
                            </span>
                          ) : (
                            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:-translate-x-0.5 transition-all shrink-0" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Widget 2: Recent Posts (حالیہ شائع شدہ مضامین) */}
            {siteSettings?.pageSidebarShowRecentPosts !== false && recentPosts.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={onNavigateArticles}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full transition-colors font-simple cursor-pointer"
                  >
                    سب دیکھیں ←
                  </button>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-simple">
                    <span>حالیہ مضامین (Recent Posts)</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </h3>
                </div>

                <div className="space-y-3 pt-1">
                  {recentPosts.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        if (onSelectArticle) {
                          onSelectArticle(art);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                    >
                      <img
                        src={art.featuredImage || siteSettings?.defaultArticleImage || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=80"}
                        alt={art.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 px-2 py-0.5 rounded font-sans font-bold inline-block">
                          {art.categoryName || (Array.isArray(art.categories) ? art.categories[0] : art.category) || 'طبی مضمون'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 3: Verified Doctors & Specialists (مستند اطباء و نبض شناس) */}
            {siteSettings?.pageSidebarShowDoctors !== false && featuredDoctors.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={onNavigateDoctors}
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-0.5 rounded-full transition-colors font-simple cursor-pointer"
                  >
                    ڈائریکٹری ←
                  </button>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-simple">
                    <span>مستند اطباء (Doctors)</span>
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                  </h3>
                </div>

                <div className="space-y-3 pt-1">
                  {featuredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        if (onSelectDoctor) onSelectDoctor(doc);
                      }}
                      className="p-3 bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/70 hover:border-indigo-200 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={doc.image || "/images/default_doctor.webp"}
                          alt={doc.name}
                          onError={(e) => { e.target.onerror = null; e.target.src = "/images/default_doctor.webp"; }}
                          className="w-11 h-11 rounded-full object-cover border-2 border-indigo-200 shrink-0 group-hover:scale-105 transition-transform bg-white"
                        />
                        <div className="min-w-0 text-right space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 truncate">
                            {doc.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">
                            {doc.clinicName || doc.title} • {doc.cityName}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
                        مشورہ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 4: Popular Categories & Mizaj (اہم کیٹگریز و شعبہ جات) */}
            {siteSettings?.pageSidebarShowCategories !== false && topCategories.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-sans">
                    {topCategories.length} کیٹگریز
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-simple">
                    <span>اہم کیٹگریز (Categories)</span>
                    <FolderOpen className="w-4 h-4 text-emerald-600" />
                  </h3>
                </div>

                {/* Dropdown for quick selection */}
                <div className="relative pt-1">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value && onSelectCategory) {
                        onSelectCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-500 rounded-xl pr-3 pl-8 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer transition-all appearance-none text-right font-simple"
                  >
                    <option value="" disabled>-- کسی کیٹگری کے مضامین کھولیں ({topCategories.length}) --</option>
                    {topCategories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.count} مضامین)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-4 pointer-events-none" />
                </div>

                {/* Top 6 Popular Category Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {topCategories.slice(0, 8).map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-emerald-100 active:scale-95 text-slate-700 hover:text-emerald-900 text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer border border-slate-200/80 font-sans"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 5: Official Help & Contact Box (فوری رابطہ و معاونت) */}
            {siteSettings?.pageSidebarShowHelpline !== false && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-lg border border-slate-800 text-right">
                <div className="flex items-center justify-between text-xs font-bold font-sans">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px]">
                    آن لائن سپورٹ
                  </span>
                  <span className="text-slate-300 flex items-center gap-1.5 font-simple">
                    <span>ہیلپ لائن و رابطہ</span>
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug font-simple">
                    کیا آپ کو کسی معلومات میں مدد درکار ہے؟
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ہماری ٹیم معالجین، مضامین اور پلیٹ فارم کے استعمال سے متعلق تمام سوالات کے لیے حاضر ہے۔
                  </p>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  {siteSettings?.helplinePhone && (
                    <a
                      href={`tel:${siteSettings.helplinePhone}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                      <span className="text-emerald-400 font-bold font-mono dir-ltr">{siteSettings.helplinePhone}</span>
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>فون ہیلپ لائن:</span>
                      </span>
                    </a>
                  )}

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                    <span className="text-slate-200">صبح 9 تا شام 6</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>اوقاتِ کار:</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                    <span className="text-slate-200">{siteSettings?.headOffice || 'اسلام آباد، پاکستان'}</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>مرکزی دفتر:</span>
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${siteSettings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent('السلام علیکم! مجھے طبیب پیڈیا پورٹل کے حوالے سے رہنمائی چاہیے۔')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-simple"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واٹس ایپ پر فوری رابطہ کریں</span>
                </a>
              </div>
            )}

            </aside>
          )}

        </div>

      </div>
    </div>
  );
}
