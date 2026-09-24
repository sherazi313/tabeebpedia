import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { ARTICLES, DOCTORS } from '../data/mockData';

export default function ArticleDetailView({ article, articlesList, onBack, onSelectArticle, onSelectDoctor }) {
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'
  const [copied, setCopied] = useState(false);

  // Sync to latest updated version from articlesList if edited in Admin CMS
  const currentArticle = (articlesList && articlesList.find(a => a.id === article?.id || a.slug === article?.slug)) || article;

  if (!currentArticle) return null;

  // Find related doctors for this disease/topic
  const relatedDoctors = DOCTORS.filter(doc => {
    if (!currentArticle.relatedDiseases) return false;
    return currentArticle.relatedDiseases.some(d => doc.specialties.includes(d));
  }).slice(0, 2);

  // Related articles in same category
  const allArticles = articlesList || ARTICLES;
  const relatedArticles = allArticles.filter(a => a.id !== currentArticle.id && a.category === currentArticle.category).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'text-xs leading-loose';
    if (fontSize === 'large') return 'text-base sm:text-lg leading-loose';
    return 'text-sm leading-loose';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 no-print border-b border-slate-200 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تمام مضامین پر واپس جائیں</span>
          </button>

          {/* Reading Tools: Font size & Actions */}
          <div className="flex items-center gap-2 text-xs">
            {/* Font Size controls */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-xs font-sans">
              <span className="text-[11px] text-slate-400 px-2 font-urdu">فونٹ سائز:</span>
              <button
                onClick={() => setFontSize('small')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'small' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'normal' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'large' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                A+
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 rounded-xl shadow-xs"
              title="پرنٹ کریں یا PDF محفوظ کریں"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-xl shadow-xs"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'کاپی ہو گیا' : 'لنک کاپی'}</span>
            </button>

            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${currentArticle.title} - پڑھیں طبیب پیڈیا پر: ${window.location.href}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">واٹس ایپ پر شیئر</span>
            </a>
          </div>
        </div>

        {/* Main Article Card */}
        <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 text-right">
          
          {/* Category & Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full font-sans">
                {currentArticle.categoryName}
              </span>
              <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                مطالعہ کا وقت: {currentArticle.readingTime}
              </span>
              <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {currentArticle.views || 1} مشاہدات
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-snug">
              {currentArticle.title}
            </h1>

            {/* Author Profile bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src={currentArticle.authorImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'}
                alt={currentArticle.author}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-200"
              />
              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-slate-800 block">تحریر و تحقیق: {currentArticle.author}</span>
                <span className="text-[11px] text-slate-400 font-sans flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  تاریخ اشاعت: {currentArticle.publishedAt || 'آج'}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {currentArticle.featuredImage && (
            <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-xs max-h-[450px]">
              <img
                src={currentArticle.featuredImage}
                alt={currentArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Excerpt Callout */}
          {currentArticle.excerpt && (
            <div className="p-5 rounded-2xl bg-slate-50 border-r-4 border-emerald-600 text-slate-700 italic text-base leading-relaxed">
              "{currentArticle.excerpt}"
            </div>
          )}

          {/* Article Rich HTML Content */}
          <div 
            className={`prose max-w-none text-slate-800 article-rendered-content ${getFontSizeClass()} space-y-4`}
            dangerouslySetInnerHTML={{ __html: currentArticle.content }}
          />

          {/* Tags */}
          {currentArticle.tags && (
            <div className="pt-6 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">متعلقہ موضوعات و ٹیگز:</span>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(currentArticle.tags) ? currentArticle.tags : currentArticle.tags.split(',').map(t => t.trim())).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Consultation CTA Box */}
          {relatedDoctors.length > 0 && (
            <div className="no-print my-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white space-y-4">
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
                    onClick={() => onSelectDoctor(doc)}
                    className="bg-white/10 hover:bg-white/20 border border-white/15 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-white/40" />
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
            <h3 className="text-xl font-bold text-slate-900">
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
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2"
                >
                  <img src={rel.featuredImage} alt={rel.title} className="w-full h-32 rounded-xl object-cover" />
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold">
                    {rel.categoryName}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2">{rel.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
