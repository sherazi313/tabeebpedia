import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  ChevronLeft, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  BookMarked,
  Sparkles,
  Leaf,
  Calendar,
  Layers,
  Search
} from 'lucide-react';

export default function GlossaryTermView({
  term,
  glossaryList = [],
  articlesList = [],
  onSelectTerm,
  onSelectArticle,
  onBack,
  theme = 'herbal'
}) {
  const isNavy = theme === 'navy';
  const [copied, setCopied] = useState(false);

  // Find related articles that mention this term
  const relatedArticles = useMemo(() => {
    if (!term || !term.term || !Array.isArray(articlesList)) return [];
    const termWord = term.term.trim();
    return articlesList.filter(art => {
      if (!art) return false;
      const title = (art.title || '').toLowerCase();
      const content = (art.content || '').toLowerCase();
      const cats = (art.categories || []).join(' ').toLowerCase();
      const lowerTerm = termWord.toLowerCase();
      return title.includes(lowerTerm) || cats.includes(lowerTerm) || content.includes(lowerTerm);
    }).slice(0, 6);
  }, [term, articlesList]);

  // Find other related glossary terms
  const otherTerms = useMemo(() => {
    if (!term || !Array.isArray(glossaryList)) return [];
    return glossaryList.filter(g => g.id !== term.id && g.term !== term.term).slice(0, 6);
  }, [term, glossaryList]);

  // Copy definition text
  const handleCopy = () => {
    if (!term) return;
    const cleanDef = (term.content || term.shortDefinition || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const text = `📖 طبی اصطلاح: ${term.term}\n\nتشریح: ${cleanDef}\n\nماخذ: فرہنگِ اطباء - طبیب پیڈیا (https://tabeebpedia.com/farhang/${term.slug || ''})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!term) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-12 text-center font-sans">
        <p className="text-lg font-bold">اصطلاح نہیں ملی</p>
        <button onClick={onBack} className={`mt-4 px-4 py-2 ${isNavy ? 'bg-blue-600' : 'bg-emerald-600'} text-white rounded-xl text-xs font-bold cursor-pointer`}>
          واپس جائیں
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16">
      
      {/* Top Breadcrumb & Header Banner */}
      <div className={`relative overflow-hidden ${
        isNavy 
          ? 'bg-gradient-to-br from-slate-100 via-blue-50/50 to-white border-b border-slate-200' 
          : 'bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border-b border-emerald-100'
      } pt-8 pb-10 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Back button & Actions Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all font-simple cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span>فرہنگِ اطباء پر واپس جائیں</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors font-simple cursor-pointer font-bold"
                title="تشریح کاپی کریں"
              >
                {copied ? <Check className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'کاپی ہو گئی' : 'کاپی کریں'}</span>
              </button>
            </div>
          </div>

          {/* Title Header */}
          <div className="text-right space-y-2.5 pt-2">
            <div className={`inline-flex items-center gap-2 ${isNavy ? 'bg-blue-100/80 text-blue-900 border-blue-200' : 'bg-emerald-100/80 text-emerald-900 border-emerald-200'} border px-3 py-1 rounded-full text-xs font-simple font-bold shadow-2xs`}>
              <BookMarked className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-700' : 'text-emerald-700'}`} />
              <span>فرہنگِ اطباء • طبی اصطلاح</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-h1 leading-tight">
              {term.term}
            </h1>

            {term.date && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans justify-end pt-1">
                <span>تاریخِ اندراج: {term.date.split(' ')[0]}</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Term Body Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Main Definition Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-right">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <span className={`text-xs ${isNavy ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'} border px-3 py-1 rounded-xl font-sans font-bold shadow-2xs`}>
              طبی مفہوم و تشریح
            </span>
            <span className="text-base font-bold text-slate-900 font-simple">
              تعریف و خواص
            </span>
          </div>

          <div 
            className="article-rendered-content text-slate-800 text-base sm:text-lg leading-loose font-nastaliq space-y-4"
            dangerouslySetInnerHTML={{ __html: term.content || `<p>${term.shortDefinition}</p>` }}
          />
        </div>

        {/* Related Articles & Herbs that mention this term */}
        {relatedArticles.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-right shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className={`text-xs ${isNavy ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-emerald-50'} px-2.5 py-0.5 rounded-lg font-bold font-sans`}>
                {relatedArticles.length} مضامین
              </span>
              <div className="flex items-center gap-2">
                <Leaf className={`w-5 h-5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                <h3 className="text-base font-bold text-slate-900 font-simple">
                  اس اصطلاح کے حامل متعلقہ مضامین و جڑی بوٹیاں
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {relatedArticles.map(art => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle && onSelectArticle(art)}
                  className={`p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 ${isNavy ? 'hover:border-blue-400/80' : 'hover:border-emerald-400/80'} hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3`}
                >
                  <h4 className={`text-sm font-bold text-slate-800 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} font-h2 line-clamp-2 transition-colors leading-snug`}>
                    {art.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 font-sans">
                    <span className={`font-bold ${isNavy ? 'text-blue-600' : 'text-emerald-600'} font-simple`}>مطالعہ کریں ←</span>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-600">
                      {(art.categories || [])[0] || 'طبی مضمون'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Related Terms */}
        {otherTerms.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-right shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs text-slate-500 font-sans">دیگر اصطلاحات</span>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 font-simple">
                  دیگر اہم طبی اصطلاحات (فرہنگِ اطباء)
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherTerms.map(ot => (
                <button
                  key={ot.id}
                  type="button"
                  onClick={() => onSelectTerm(ot)}
                  className={`p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 ${isNavy ? 'hover:border-blue-400' : 'hover:border-emerald-400'} hover:shadow-sm text-right transition-all group cursor-pointer`}
                >
                  <div className={`text-sm font-bold text-slate-800 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} font-h2 transition-colors`}>
                    {ot.term}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2 mt-1 font-nastaliq leading-relaxed">
                    {ot.shortDefinition || ot.content?.replace(/<[^>]+>/g, ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
