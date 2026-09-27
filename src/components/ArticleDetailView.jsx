import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Clock, 
  Eye, 
  Share2, 
  Printer, 
  Bookmark, 
  MessageCircle, 
  Stethoscope, 
  Leaf, 
  User, 
  Calendar,
  CheckCircle,
  Copy,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Search,
  Folder,
  FolderOpen,
  Tag,
  ExternalLink,
  BookOpen,
  Phone
} from 'lucide-react';
import { ARTICLES, DOCTORS } from '../data/mockData';
import { injectGlossaryTooltips } from '../utils/glossaryParser';

export default function ArticleDetailView({ 
  article, 
  articlesList, 
  pagesList = [],
  categoriesList = [],
  glossaryList = [],
  onBack, 
  onSelectArticle, 
  onSelectDoctor, 
  onSelectCategory, 
  onSelectTag, 
  onSelectPage,
  onSelectGlossaryTerm,
  siteSettings 
}) {
  const [fontSize, setFontSize] = useState(() => {
    try {
      return localStorage.getItem('tabeeb_reading_font_size') || 'normal';
    } catch(e) {
      return 'normal';
    }
  }); // 'small', 'normal', 'large'
  const [copied, setCopied] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const handleSetFontSize = (size) => {
    setFontSize(size);
    try {
      localStorage.setItem('tabeeb_reading_font_size', size);
    } catch(e) {}
  };

  // Sync to latest updated version from articlesList if edited in Admin CMS
  const currentArticle = (articlesList && articlesList.find(a => a.id === article?.id || a.slug === article?.slug)) || article;

  if (!currentArticle) return null;

  // Find related doctors for this disease/topic
  const currentCategories = Array.isArray(currentArticle.categories) && currentArticle.categories.length > 0 
    ? currentArticle.categories 
    : [currentArticle.categoryName || currentArticle.category].filter(Boolean);

  const relatedDoctors = useMemo(() => {
    let matches = (DOCTORS || []).filter(doc => {
      if (!doc) return false;
      if (currentArticle.relatedDiseases && currentArticle.relatedDiseases.some(d => doc.specialties && doc.specialties.includes(d))) return true;
      if (currentCategories && currentCategories.some(cat => doc.specialties && doc.specialties.some(s => s.includes(cat) || cat.includes(s)))) return true;
      return false;
    });
    if (matches.length === 0) {
      matches = (DOCTORS || []).slice(0, 4);
    }
    return matches.slice(0, 2);
  }, [currentArticle, currentCategories]);

  // Related articles in same category
  const allArticles = articlesList || ARTICLES;

  const relatedArticles = allArticles.filter(a => {
    if (a.id === currentArticle.id) return false;
    if (a.category && currentArticle.category && a.category === currentArticle.category) return true;
    const aCats = Array.isArray(a.categories) ? a.categories : [a.categoryName || a.category].filter(Boolean);
    return aCats.some(c => currentCategories.includes(c));
  }).slice(0, 3);

  // Recent Articles for Sidebar
  const recentArticles = allArticles.filter(a => a.id !== currentArticle.id).slice(0, 4);

  // Extract top categories with post counts
  const categoryCounts = {};
  allArticles.forEach(a => {
    const cats = Array.isArray(a.categories) ? a.categories : [a.category, a.categoryName].filter(Boolean);
    cats.forEach(c => {
      if (c && typeof c === 'string') {
        categoryCounts[c] = (categoryCounts[c] || 0) + 1;
      }
    });
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  // Extract top tags
  const tagCounts = {};
  allArticles.forEach(a => {
    const tList = Array.isArray(a.tags) ? a.tags : (typeof a.tags === 'string' ? a.tags.split(',') : []);
    tList.forEach(t => {
      const trimmed = typeof t === 'string' ? t.trim() : '';
      if (trimmed) tagCounts[trimmed] = (tagCounts[trimmed] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(e => e[0]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSidebarSearchSubmit = (e) => {
    e.preventDefault();
    if (!sidebarSearch.trim()) return;
    if (onSelectTag) {
      onSelectTag(sidebarSearch.trim());
    }
  };

  // Comprehensive list of all unique categories from articles & database for the dropdown
  const allCategoriesList = useMemo(() => {
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

    (categoriesList || []).forEach(cat => {
      const name = typeof cat === 'string' ? cat : cat?.name;
      if (name && typeof name === 'string') {
        const trimmed = name.trim();
        if (trimmed && !(trimmed in counts)) {
          counts[trimmed] = 0;
        }
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ur'));
  }, [allArticles, categoriesList]);

  // Full pages list for the dropdown
  const allPagesList = pagesList && pagesList.length > 0 ? pagesList : [
    { id: 1, title: 'ہمارے بارے میں (About Us)', slug: 'about-us' },
    { id: 2, title: 'رابطہ کریں (Contact Us)', slug: 'contact' },
    { id: 3, title: 'پرائیویسی پالیسی (Privacy Policy)', slug: 'privacy-policy' }
  ];

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'article-font-small';
    if (fontSize === 'large') return 'article-font-large';
    return 'article-font-normal';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 no-print border-b border-slate-200 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تمام مضامین پر واپس جائیں</span>
          </button>

          {/* Reading Tools: Font size & Actions */}
          <div className="flex items-center gap-2 text-xs">
            {/* Font Size controls */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-xs font-sans">
              <span className="text-[11px] text-slate-500 font-bold px-2 font-urdu">فونٹ سائز:</span>
              <button
                type="button"
                onClick={() => handleSetFontSize('small')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'small' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
                title="چھوٹا فونٹ سائز (13px)"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleSetFontSize('normal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'normal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
                title="معمول کا فونٹ سائز (16px)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleSetFontSize('large')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'large' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
                title="بڑا فونٹ سائز (21px)"
              >
                A+
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 rounded-xl shadow-xs cursor-pointer"
              title="پرنٹ کریں یا PDF محفوظ کریں"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'کاپی ہو گیا' : 'لنک کاپی'}</span>
            </button>

            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${currentArticle.title} - پڑھیں طبیب پیڈیا پر: ${window.location.href}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">واٹس ایپ پر شیئر</span>
            </a>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ======================================================== */}
          {/* Main Article Content Column (Left/Center in RTL, 8 of 12) */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-8">
            <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 text-right">
              
              {/* Category & Meta */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {Array.isArray(currentArticle.categories) && currentArticle.categories.length > 0 ? (
                    currentArticle.categories.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectCategory && onSelectCategory(cat)}
                        className="bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full font-sans transition-all cursor-pointer shadow-xs border border-emerald-200/80 flex items-center gap-1 group"
                        title={`زمرہ "${cat}" کے تمام مضامین دیکھیں`}
                      >
                        <span>{cat}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-600 transition-opacity">↗</span>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectCategory && onSelectCategory(currentArticle.categoryName || currentArticle.category || 'عام زمرہ')}
                      className="bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full font-sans transition-all cursor-pointer shadow-xs border border-emerald-200/80 flex items-center gap-1 group"
                      title="اس زمرہ کے تمام مضامین دیکھیں"
                    >
                      <span>{currentArticle.categoryName || currentArticle.category || 'عام زمرہ'}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-600 transition-opacity">↗</span>
                    </button>
                  )}
                  <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    مطالعہ کا وقت: {currentArticle.readingTime || '5 منٹ'}
                  </span>
                  <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {currentArticle.views || 1} مشاہدات
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-snug">
                  {currentArticle.title}
                </h1>

                {/* Author Info Card */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <img
                    src={currentArticle.authorImage || "/images/author-photo.jpg"}
                    alt={currentArticle.author || 'طبیب پیڈیا'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200 shadow-sm"
                    onError={(e) => { e.currentTarget.src = "/images/author-photo.jpg"; }}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">تحریر و تحقیق: {currentArticle.author || 'طبیب پیڈیا'}</span>
                    <span className="text-[11px] text-slate-400 font-sans flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      تاریخِ اشاعت: {currentArticle.publishedAt || currentArticle.date || '2024-09-24'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {currentArticle.featuredImage && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[460px] bg-slate-100 flex items-center justify-center">
                  <img
                    src={currentArticle.featuredImage}
                    alt={currentArticle.title}
                    className="w-full h-full object-contain max-h-[460px]"
                  />
                </div>
              )}

              {/* Excerpt Box */}
              {currentArticle.excerpt && (
                <div className="bg-emerald-50/70 border-r-4 border-emerald-600 p-4 rounded-xl text-emerald-950 font-medium text-xs sm:text-sm leading-relaxed">
                  {currentArticle.excerpt}
                </div>
              )}

              {/* Article Rich HTML Content */}
              {(() => {
                const processedContent = injectGlossaryTooltips(currentArticle.content, glossaryList);
                return (
                  <div 
                    className={`prose max-w-none text-slate-800 article-rendered-content ${getFontSizeClass()} space-y-4`}
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                    onClick={(e) => {
                      const linkOrSpan = e.target.closest('a[href*="/farhang/"], [data-glossary-slug]');
                      if (linkOrSpan) {
                        e.preventDefault();
                        const href = linkOrSpan.getAttribute('href') || '';
                        let slug = linkOrSpan.getAttribute('data-glossary-slug');
                        if (!slug && href.includes('/farhang/')) {
                          slug = href.split('/farhang/')[1];
                        }
                        if (slug) {
                          const decodedSlug = decodeURIComponent(slug);
                          const termObj = (glossaryList || []).find(g => 
                            g.slug === decodedSlug || 
                            g.slug === slug || 
                            g.term === decodedSlug || 
                            g.term === slug ||
                            g.id === slug
                          );
                          if (onSelectGlossaryTerm) {
                            onSelectGlossaryTerm(termObj || { slug: decodedSlug, term: linkOrSpan.textContent });
                          }
                        }
                      }
                    }}
                  />
                );
              })()}

              {/* Tags */}
              {currentArticle.tags && (
                <div className="pt-6 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">متعلقہ موضوعات و ٹیگز:</span>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(currentArticle.tags) ? currentArticle.tags : currentArticle.tags.split(',').map(t => t.trim())).map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectTag && onSelectTag(tag)}
                        className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-3 py-1.5 rounded-xl font-medium transition-all active:scale-95 cursor-pointer border border-slate-200/80 hover:border-emerald-300 flex items-center gap-1 group shadow-2xs"
                        title={`ٹیگ "${tag}" کے تمام مضامین دیکھیں`}
                      >
                        <span>#{tag}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-600 transition-opacity">↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor Consultation CTA Box */}
              {relatedDoctors.length > 0 && (
                <div className="no-print my-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white space-y-4 shadow-md">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-sans">
                    <Sparkles className="w-4 h-4" />
                    <span>مستند طبی مشاورت</span>
                  </div>
                  <h3 className="text-xl font-bold">
                    کیا آپ اس بیماری کا علاج اور ذاتی نسخہ چاہتے ہیں؟
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    ہمارے پینل پر موجود تصدیق شدہ نبض شناس اطباء اور ماہرین سے واٹس ایپ یا بالمشافہ رہنمائی حاصل کریں۔
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {relatedDoctors.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => onSelectDoctor && onSelectDoctor(doc)}
                        className="bg-white/10 hover:bg-white/20 border border-white/15 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={doc.image || "/images/default_doctor.webp"} 
                            alt={doc.name} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/default_doctor.webp";
                            }}
                            className="w-10 h-10 rounded-full object-cover border border-white/40 bg-white" 
                          />
                          <div className="text-right">
                            <span className="text-xs font-bold text-white block">{doc.name}</span>
                            <span className="text-[10px] text-emerald-200">{doc.clinicName} • {doc.cityName}</span>
                          </div>
                        </div>
                        <span className="text-xs bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-bold">
                          رابطہ کریں
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
                <span className="font-bold block">⚠️ طبی انتباہ (Medical Disclaimer):</span>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  طبیب پیڈیا پر شائع شدہ مضامین اور گھریلو نسخہ جات صرف عمومی معلومات اور آگاہی کے لیے ہیں۔ کسی بھی دوا یا طریقہ علاج کو شروع کرنے سے پہلے اپنے معالج یا مستند حکیم سے مشورہ ضرور فرمائیں۔
                </p>
              </div>

            </article>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="no-print space-y-4 text-right">
                <h3 className="text-xl font-bold text-slate-900 font-simple">
                  اس موضوع پر مزید مضامین
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedArticles.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        onSelectArticle(rel);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
                    >
                      <img src={rel.featuredImage || siteSettings?.defaultArticleImage || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80"} alt={rel.title} className="w-full h-32 rounded-xl object-cover group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold inline-block">
                        {rel.categoryName || 'طبی مضمون'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-2 leading-snug">{rel.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* Compact Sticky Sidebar (Right in RTL, 4 of 12 cols, max-w-sm) */}
          {/* ======================================================== */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 w-full">
            
            {/* Widget 1: Search Box */}
            {siteSettings?.sidebarShowSearch !== false && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 text-right">
                <h4 className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1.5 font-simple">
                  <span>مضامین و جڑی بوٹیاں تلاش کریں</span>
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                </h4>
                <form onSubmit={handleSidebarSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    placeholder="مضمون، مرض، جڑی بوٹی یا مزاج..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-14 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-right font-simple"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  <button
                    type="submit"
                    className="absolute left-1.5 top-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    تلاش
                  </button>
                </form>
              </div>
            )}

            {/* Widget: Categories Dropdown (تمام کیٹگریز کا ڈراپ ڈاؤن) */}
            {siteSettings?.sidebarShowCategoriesDropdown !== false && allCategoriesList && allCategoriesList.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-sans">
                    {allCategoriesList.length} زمرہ جات
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-simple">
                    <span>تمام کیٹگریز (Categories)</span>
                    <FolderOpen className="w-4 h-4 text-emerald-600" />
                  </h4>
                </div>
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onSelectCategory && onSelectCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-emerald-500 rounded-xl pr-3 pl-8 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer transition-all appearance-none text-right font-simple"
                  >
                    <option value="" disabled>-- کسی کیٹگری کے مضامین دیکھیں ({allCategoriesList.length}) --</option>
                    {allCategoriesList.map((cat) => (
                      <option key={cat.name} value={cat.name} className="py-1">
                        {cat.name} {cat.count > 0 ? `(${cat.count} مضامین)` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Widget: Pages Dropdown (تمام پیجز کا ڈراپ ڈاؤن) */}
            {siteSettings?.sidebarShowPagesDropdown !== false && allPagesList && allPagesList.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full font-sans">
                    {allPagesList.length} صفحات
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-simple">
                    <span>ویب سائٹ کے صفحات (Pages)</span>
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </h4>
                </div>
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onSelectPage && onSelectPage(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-indigo-500 rounded-xl pr-3 pl-8 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer transition-all appearance-none text-right font-simple"
                  >
                    <option value="" disabled>-- کسی صفحہ پر جائیں ({allPagesList.length}) --</option>
                    {allPagesList.map((p) => (
                      <option key={p.id || p.slug} value={p.slug || p.id} className="py-1">
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Widget 2: Custom Advertisement / Image Banner (Configured from Admin) */}
            {siteSettings?.sidebarAdEnabled !== false && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 text-right overflow-hidden group">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md font-sans">
                    اشتہار (Sponsored)
                  </span>
                  <span className="text-slate-400 text-[10px]">طبیب اسپانسرڈ</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                  <img
                    src={siteSettings?.sidebarAdImage || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"}
                    alt={siteSettings?.sidebarAdTitle || "اشتہار"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {siteSettings?.sidebarAdTitle || 'مستند دیسی ادویات و خالص جڑی بوٹیاں'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {siteSettings?.sidebarAdSubtitle || 'خالص جڑی بوٹیاں اور قدرتی شفا کے لیے آن لائن رابطہ اور آرڈر کریں۔'}
                  </p>
                </div>

                <a
                  href={siteSettings?.sidebarAdLink || `https://wa.me/${siteSettings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent('السلام علیکم! مجھے اشتہار کے حوالے سے معلومات درکار ہیں۔')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{siteSettings?.sidebarAdButtonText || 'واٹس ایپ پر رابطہ کریں'}</span>
                </a>
              </div>
            )}

            {/* Widget 3: Popular Categories with Counts */}
            {siteSettings?.sidebarShowCategories !== false && topCategories.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-sans">
                    {topCategories.length} زمرہ جات
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-simple">
                    <span>اہم زمرہ جات (Categories)</span>
                    <Folder className="w-4 h-4 text-emerald-600" />
                  </h4>
                </div>

                <div className="space-y-1 pt-1">
                  {topCategories.map(([catName, count]) => (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => onSelectCategory && onSelectCategory(catName)}
                      className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-xs text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors group cursor-pointer"
                    >
                      <span className="font-mono text-[11px] bg-slate-100 group-hover:bg-emerald-200 text-slate-500 group-hover:text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        {count}
                      </span>
                      <span className="font-bold text-slate-800 group-hover:text-emerald-700">
                        {catName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 4: Recent Posts */}
            {siteSettings?.sidebarShowRecent !== false && recentArticles.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[10px] text-slate-400 font-sans">تازہ مضامین</span>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-simple">
                    <span>حالیہ تحریریں (Recent)</span>
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </h4>
                </div>

                <div className="space-y-3">
                  {recentArticles.map(rec => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        onSelectArticle(rec);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <img
                        src={rec.featuredImage || siteSettings?.defaultArticleImage || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&q=80"}
                        alt={rec.title}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1 min-w-0 text-right">
                        <h5 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-2 leading-snug transition-colors">
                          {rec.title}
                        </h5>
                        <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-sans">
                          <span>{rec.readingTime || '5 منٹ'}</span>
                          <span>•</span>
                          <span>{rec.publishedAt || rec.date || '2024-09-24'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 5: Tags Cloud */}
            {topTags.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 text-right">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-end gap-1.5 font-simple">
                    <span>مقبول ٹیگز (Tags)</span>
                    <Tag className="w-4 h-4 text-emerald-600" />
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {topTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onSelectTag && onSelectTag(tag)}
                      className="text-[11px] bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 6: Quick Consultation CTA */}
            {siteSettings?.sidebarShowConsultation !== false && (
              <div className="bg-gradient-to-br from-emerald-950 to-teal-900 rounded-3xl p-5 text-white space-y-3 text-right shadow-md">
                <div className="flex items-center justify-end gap-2 text-amber-300 text-xs font-bold font-sans">
                  <span>آن لائن رہنمائی</span>
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold leading-snug">
                  طبیب و نباض سے ذاتی طبی مشورہ حاصل کریں
                </h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  اپنے مرض اور مزاج کے مطابق ماہر اطباء سے فوری رہنمائی کے لیے ہمارے پینل سے رجوع کریں۔
                </p>
                <a
                  href={`https://wa.me/${siteSettings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent('السلام علیکم! مجھے طبیب سے آن لائن مشاورت کرنی ہے۔')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold text-center block transition-colors shadow-xs cursor-pointer"
                >
                  فوری رابطہ کریں
                </a>
              </div>
            )}

          </aside>

        </div>

      </div>
    </div>
  );
}
