import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  FileText, 
  Share2, 
  Check, 
  Copy,
  ExternalLink,
  BookMarked
} from 'lucide-react';

const URDU_ALPHABETS = [
  'تمام', 'ا', 'آ', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 
  'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 
  'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 
  'و', 'ہ', 'ء', 'ی', 'ے'
];

export default function GlossaryDirectory({ 
  glossaryList = [], 
  onSelectTerm, 
  onBack,
  theme = 'herbal'
}) {
  const isNavy = theme === 'navy';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('تمام');

  // Filter terms by search query and alphabet letter
  const filteredTerms = useMemo(() => {
    return glossaryList.filter(item => {
      if (!item || !item.term) return false;

      // Letter filter
      if (selectedLetter !== 'تمام') {
        const cleanTerm = item.term.trim();
        const firstChar = cleanTerm.charAt(0);
        if (selectedLetter === 'ا' || selectedLetter === 'آ') {
          if (firstChar !== 'ا' && firstChar !== 'آ' && firstChar !== 'أ' && firstChar !== 'إ') return false;
        } else {
          if (firstChar !== selectedLetter) return false;
        }
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const termLower = (item.term || '').toLowerCase();
      const defLower = (item.shortDefinition || item.content || '').toLowerCase();
      return termLower.includes(q) || defLower.includes(q);
    });
  }, [glossaryList, searchQuery, selectedLetter]);

  // Alphabet counts map
  const alphabetCounts = useMemo(() => {
    const counts = { 'تمام': glossaryList.length };
    glossaryList.forEach(item => {
      if (!item || !item.term) return;
      const firstChar = item.term.trim().charAt(0);
      let key = firstChar;
      if (firstChar === 'أ' || firstChar === 'إ') key = 'ا';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [glossaryList]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16">
      
      {/* Hero Banner */}
      <div className={`relative overflow-hidden ${
        isNavy 
          ? 'bg-gradient-to-br from-slate-100 via-blue-50/50 to-white border-b border-slate-200' 
          : 'bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border-b border-emerald-100'
      } pt-8 pb-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Top navigation / breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all font-simple cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span>ہوم پیج پر واپس جائیں</span>
            </button>

            <span className={`text-xs ${isNavy ? 'bg-blue-100/80 text-blue-900 border-blue-200' : 'bg-emerald-100/80 text-emerald-900 border-emerald-200'} border px-3 py-1 rounded-full font-bold font-sans flex items-center gap-1.5 shadow-2xs`}>
              <BookMarked className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-700' : 'text-emerald-700'}`} />
              <span>{glossaryList.length} مستند طبی اصطلاحات</span>
            </span>
          </div>

          {/* Title & Description */}
          <div className="text-right space-y-3 max-w-3xl">
            <div className={`inline-flex items-center gap-2 ${isNavy ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'} border px-3.5 py-1 rounded-full text-xs font-simple font-bold shadow-2xs`}>
              <Sparkles className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
              <span>جامع طبی لغت و انسائیکلوپیڈیا</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-h1 leading-tight">
              فرہنگِ اطباء (Medical Glossary)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-nastaliq">
              طب یونانی، طب نبوی اور قانون مفرد اعضاء کی تمام بنیادی اصطلاحات، تاثیرات، ادویاتی افعال اور طبی خواص کی مستند و علمی فرہنگ۔ مضامین کے مطالعے کے دوران کسی بھی لفظ پر کرسر لا کر اس کا مفہوم جانیں یا یہاں سے براہ راست تلاش کریں۔
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl text-right">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="کسی بھی طبی اصطلاح یا لفظ کا مفہوم تلاش کریں (مثلاً: مفرح، استرخا، مسہل، کاسر ریاح)..."
              className={`w-full bg-white border border-slate-300 focus:border-${isNavy ? 'blue' : 'emerald'}-500 focus:ring-2 focus:ring-${isNavy ? 'blue' : 'emerald'}-500/20 rounded-2xl pr-12 pl-4 py-3.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none shadow-sm transition-all font-h2`}
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-3.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-bold"
              >
                صاف کریں
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Alphabet Filter Pills */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-3 border-b border-slate-100 pb-2.5">
            <span className="font-bold text-slate-900 font-simple">حروفِ تہجی کے اعتبار سے تلاش کریں:</span>
            <span className={`font-sans font-bold ${isNavy ? 'text-blue-700' : 'text-emerald-700'}`}>
              نتیجہ: {filteredTerms.length} اصطلاحات
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5" dir="rtl">
            {URDU_ALPHABETS.map((letter) => {
              const count = alphabetCounts[letter] || 0;
              const isSelected = selectedLetter === letter;
              if (letter !== 'تمام' && count === 0) return null; // Only show letters with terms

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? `${isNavy ? 'bg-blue-600 shadow-blue-900/20' : 'bg-emerald-600 shadow-emerald-900/20'} text-white shadow-md scale-105`
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className="font-h2 text-sm">{letter}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${isSelected ? 'bg-white/25 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms Grid */}
        {filteredTerms.length === 0 ? (
          <div className="p-12 bg-white border border-slate-200 rounded-3xl text-center space-y-3 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 font-simple">
              اس تلاش کے مطابق کوئی اصطلاح نہیں ملی
            </h3>
            <p className="text-xs text-slate-500 font-nastaliq max-w-sm mx-auto">
              تلاش کا لفظ تبدیل کریں یا حروفِ تہجی میں سے "تمام" منتخب کریں۔
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedLetter('تمام'); }}
              className={`text-xs ${isNavy ? 'text-blue-600' : 'text-emerald-600'} hover:underline font-bold font-simple cursor-pointer`}
            >
              تمام فلٹرز ختم کریں
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((item) => (
              <div
                key={item.id || item.term}
                onClick={() => onSelectTerm(item)}
                className={`bg-white hover:bg-slate-50/50 border border-slate-200 ${isNavy ? 'hover:border-blue-400' : 'hover:border-emerald-400'} rounded-3xl p-5 flex flex-col justify-between space-y-3.5 shadow-xs hover:shadow-md transition-all group cursor-pointer text-right`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] text-slate-400 font-sans">
                      #{item.id}
                    </span>
                    <h3 className={`text-lg font-bold text-slate-900 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} transition-colors font-h2`}>
                      {item.term}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 font-nastaliq leading-relaxed line-clamp-3">
                    {item.shortDefinition || item.content?.replace(/<[^>]+>/g, ' ') || 'طبی تعریف دستیاب ہے۔'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <span className={`text-[11px] font-bold ${isNavy ? 'text-blue-600 group-hover:text-blue-700' : 'text-emerald-700 group-hover:text-emerald-800'} flex items-center gap-1 font-simple transition-colors`}>
                    <span>مکمل تشریح پڑھیں</span>
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-sans font-bold">
                    فرہنگِ اطباء
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
