import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  BookOpen, 
  UserCheck, 
  Sparkles, 
  ArrowLeft, 
  Leaf, 
  Calculator, 
  ExternalLink,
  ChevronLeft,
  Filter,
  Tag
} from 'lucide-react';
import { HERBS_DATA } from '../data/mockData';
import { BOOKS_DATA } from './PdfBooksLibrary';

export default function GlobalSearchModal({
  isOpen,
  onClose,
  articlesList = [],
  pagesList = [],
  glossaryList = [],
  doctorsList = [],
  onSelectArticle,
  onSelectPage,
  onSelectDoctor,
  onSelectGlossaryTerm,
  onNavigateToTab,
  theme = 'navy'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'articles' | 'pages' | 'glossary' | 'doctors'
  const inputRef = useRef(null);

  const isNavy = theme === 'navy';

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
      setFilterType('all');
    }
  }, [isOpen]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform multi-source smart search
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];

    const results = [];

    // 1. Search Articles (مضامین)
    if (filterType === 'all' || filterType === 'articles') {
      articlesList.forEach(art => {
        if (!art || art.status === 'private') return;
        const title = (art.title || '').toLowerCase();
        const content = (art.content || '').toLowerCase();
        const excerpt = (art.excerpt || '').toLowerCase();
        const category = Array.isArray(art.categories) 
          ? art.categories.join(' ').toLowerCase() 
          : (art.category || '').toLowerCase();
        const tags = Array.isArray(art.tags) ? art.tags.join(' ').toLowerCase() : '';

        if (title.includes(query) || excerpt.includes(query) || category.includes(query) || tags.includes(query) || content.includes(query)) {
          // Calculate relevance score
          let score = 0;
          if (title.includes(query)) score += 10;
          if (category.includes(query)) score += 5;
          if (tags.includes(query)) score += 4;
          if (excerpt.includes(query)) score += 2;

          results.push({
            type: 'article',
            typeLabel: 'طبی مضمون',
            id: art.id || art.slug,
            title: art.title,
            subtitle: art.excerpt ? art.excerpt.replace(/<[^>]+>/g, '').slice(0, 110) + '...' : (Array.isArray(art.categories) ? art.categories.join('، ') : art.category),
            category: Array.isArray(art.categories) ? art.categories[0] : art.category,
            badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
            icon: FileText,
            rawItem: art,
            score
          });
        }
      });
    }

    // 2. Search Pages & Books (صفحات و کتب)
    if (filterType === 'all' || filterType === 'pages') {
      // Custom Pages
      pagesList.forEach(page => {
        if (!page) return;
        const title = (page.title || '').toLowerCase();
        const content = (page.content || '').toLowerCase();
        if (title.includes(query) || content.includes(query)) {
          let score = title.includes(query) ? 9 : 3;
          results.push({
            type: 'page',
            typeLabel: 'صفحہ',
            id: page.slug || page.id,
            title: page.title,
            subtitle: page.content ? page.content.replace(/<[^>]+>/g, ' ').slice(0, 110) + '...' : 'جامع ہربل و معلوماتی صفحہ',
            category: 'ویب سائٹ صفحہ',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
            icon: BookOpen,
            rawItem: page,
            score
          });
        }
      });

      // PDF Books
      BOOKS_DATA.forEach(book => {
        if (!book) return;
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();
        const category = (book.category || '').toLowerCase();
        if (title.includes(query) || author.includes(query) || category.includes(query)) {
          results.push({
            type: 'book',
            typeLabel: 'پی ڈی ایف کتاب',
            id: 'pdf-books',
            title: book.title,
            subtitle: `مصنف: ${book.author} | زمرہ: ${book.category} | ${book.language || 'اردو'}`,
            category: 'کتب خانہ',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            icon: BookOpen,
            rawItem: book,
            score: 7
          });
        }
      });
    }

    // 3. Search Glossary (فرہنگ اطباء)
    if (filterType === 'all' || filterType === 'glossary') {
      glossaryList.forEach(term => {
        if (!term) return;
        const termName = (term.term || '').toLowerCase();
        const def = (term.shortDefinition || term.content || '').toLowerCase();
        if (termName.includes(query) || def.includes(query)) {
          let score = termName.includes(query) ? 8 : 2;
          results.push({
            type: 'glossary',
            typeLabel: 'فرہنگِ اطباء',
            id: term.slug || term.term,
            title: term.term,
            subtitle: term.shortDefinition || (term.content ? term.content.replace(/<[^>]+>/g, '').slice(0, 110) + '...' : 'طبی اصطلاح کی تفصیلی وضاحت'),
            category: 'طبی اصطلاح',
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: Sparkles,
            rawItem: term,
            score
          });
        }
      });
    }

    // 4. Search Doctors & Hakims (اطباء و کلینکس)
    if (filterType === 'all' || filterType === 'doctors') {
      doctorsList.forEach(doc => {
        if (!doc) return;
        const name = (doc.name || '').toLowerCase();
        const title = (doc.title || doc.qualifications || '').toLowerCase();
        const city = (doc.cityName || doc.city || '').toLowerCase();
        const specialty = Array.isArray(doc.specialties) ? doc.specialties.join(' ').toLowerCase() : (doc.specialty || '').toLowerCase();
        const address = (doc.address || '').toLowerCase();

        if (name.includes(query) || title.includes(query) || city.includes(query) || specialty.includes(query) || address.includes(query)) {
          let score = name.includes(query) ? 10 : 4;
          results.push({
            type: 'doctor',
            typeLabel: 'حکیم / طبیب',
            id: doc.slug || doc.id,
            title: doc.name,
            subtitle: `${doc.title || 'فاضل الطب والجراحت FTJ'} | ${doc.cityName || 'پاکستان'} | ${doc.timing || 'کلینک دست یاب'}`,
            category: doc.cityName || 'ڈاکٹر',
            badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
            icon: UserCheck,
            rawItem: doc,
            score
          });
        }
      });
    }

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score).slice(0, 25);
  }, [searchTerm, filterType, articlesList, pagesList, glossaryList, doctorsList]);

  if (!isOpen) return null;

  const handleItemClick = (item) => {
    onClose();
    if (item.type === 'article' && onSelectArticle) {
      onSelectArticle(item.rawItem);
    } else if (item.type === 'page' && onSelectPage) {
      onSelectPage(item.rawItem.slug || item.rawItem.id);
    } else if (item.type === 'book' && onSelectPage) {
      onSelectPage('pdf-books');
    } else if (item.type === 'glossary' && onSelectGlossaryTerm) {
      onSelectGlossaryTerm(item.rawItem);
    } else if (item.type === 'doctor' && onSelectDoctor) {
      onSelectDoctor(item.rawItem);
    }
  };

  const trendingSearches = [
    { label: 'قانون مفرد اعضاء', type: 'tab', target: 'qanoon' },
    { label: 'پی ڈی ایف کتب خانہ', type: 'page', target: 'pdf-books' },
    { label: 'نسخہ مزاج کیلکولیٹر', type: 'tab', target: 'herb-calculator' },
    { label: 'نبض شناسی گائیڈ', type: 'tab', target: 'pulse-calculator' },
    { label: 'معدے اور جگر کے امراض', type: 'query', target: 'معدہ' },
    { label: 'لاہور کے اطباء', type: 'query', target: 'لاہور' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 animate-in fade-in duration-150">
      
      {/* Background Click to Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Search Dialog Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col text-right z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="طبی مضمون، نسخہ، کتاب، طبی اصطلاح یا حکیم کا نام تلاش کریں..."
              className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-simple shadow-xs"
              dir="rtl"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 p-1"
                title="تلاش صاف کریں"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
            title="بند کریں (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories / Filter Pills Bar */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-simple font-bold">
          <span className="text-slate-400 text-[11px] shrink-0">فلٹر:</span>
          
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${filterType === 'all' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            تمام نتائج ({searchResults.length})
          </button>

          <button
            onClick={() => setFilterType('articles')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${filterType === 'articles' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            📄 مضامین
          </button>

          <button
            onClick={() => setFilterType('pages')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${filterType === 'pages' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            📚 صفحات و کتب
          </button>

          <button
            onClick={() => setFilterType('glossary')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${filterType === 'glossary' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            ✨ فرہنگِ اطباء
          </button>

          <button
            onClick={() => setFilterType('doctors')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${filterType === 'doctors' ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            🩺 اطباء و کلینکس
          </button>
        </div>

        {/* Results / Default State Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-2">
          
          {/* If Search Query is Typed */}
          {searchTerm.trim() ? (
            searchResults.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-sans pb-1 flex items-center justify-between">
                  <span>تلاش کے نتائج ({searchResults.length})</span>
                  <span className="text-[11px]">کلک کر کے صفحہ کھولیں</span>
                </div>

                {searchResults.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={`${item.type}-${item.id}-${index}`}
                      onClick={() => handleItemClick(item)}
                      className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.badgeColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                              {item.typeLabel}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate font-simple">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 font-sans truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-blue-600 shrink-0 text-xs font-bold font-simple">
                        <span className="hidden sm:inline">دیکھیں</span>
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800 font-simple">
                  کوئی نتیجہ نہیں ملا
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                  "<strong>{searchTerm}</strong>" سے متعلق کوئی مواد دستیاب نہیں ہے۔ براہِ کرم املا چیک کریں یا مختلف لفظ لکھ کر کوشش کریں۔
                </p>
              </div>
            )
          ) : (
            /* Default View: Popular Searches & Quick Links */
            <div className="space-y-5 py-2">
              <div>
                <span className="text-xs font-bold text-slate-400 font-simple block mb-3">
                  🔥 مقبول و فوری تلاش (Trending & Quick Links):
                </span>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((ts, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (ts.type === 'query') {
                          setSearchTerm(ts.target);
                        } else if (ts.type === 'page' && onSelectPage) {
                          onClose();
                          onSelectPage(ts.target);
                        } else if (ts.type === 'tab' && onNavigateToTab) {
                          onClose();
                          onNavigateToTab(ts.target);
                        }
                      }}
                      className="px-3.5 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/90 hover:border-blue-300 rounded-xl text-xs font-bold transition-all shadow-2xs font-simple flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{ts.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Categories */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 font-simple block mb-3">
                  📂 اہم سیکشنز میں تلاش کریں:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-simple">
                  <div
                    onClick={() => { onClose(); onNavigateToTab('blog'); }}
                    className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-300 cursor-pointer transition-all flex items-center gap-2 text-blue-900"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold block">طبی مضامین</span>
                      <span className="text-[10px] text-blue-700/80">{articlesList.length} آرٹیکلز</span>
                    </div>
                  </div>

                  <div
                    onClick={() => { onClose(); onSelectPage('pdf-books'); }}
                    className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-300 cursor-pointer transition-all flex items-center gap-2 text-purple-900"
                  >
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="font-bold block">پی ڈی ایف کتب</span>
                      <span className="text-[10px] text-purple-700/80">{BOOKS_DATA.length} نایاب کتب</span>
                    </div>
                  </div>

                  <div
                    onClick={() => { onClose(); onNavigateToTab('farhang'); }}
                    className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:border-emerald-300 cursor-pointer transition-all flex items-center gap-2 text-emerald-900"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold block">فرہنگِ اطباء</span>
                      <span className="text-[10px] text-emerald-700/80">{glossaryList.length} اصطلاحات</span>
                    </div>
                  </div>

                  <div
                    onClick={() => { onClose(); onNavigateToTab('doctors'); }}
                    className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 hover:border-teal-300 cursor-pointer transition-all flex items-center gap-2 text-teal-900"
                  >
                    <UserCheck className="w-4 h-4 text-teal-600" />
                    <div>
                      <span className="font-bold block">اطباء ڈائریکٹری</span>
                      <span className="text-[10px] text-teal-700/80">{doctorsList.length} معالجین</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Info Bar */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
          <div className="flex items-center gap-3">
            <span>پورے پورٹل میں تلاش: مضامین، صفحات، کتب، فرہنگ اور اطباء</span>
          </div>
          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono text-[10px]">
            ESC دبائیں بند کرنے کے لیے
          </span>
        </div>

      </div>
    </div>
  );
}
