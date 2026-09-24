import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Eye, 
  Tag, 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  Filter, 
  Leaf, 
  ChevronLeft,
  Share2
} from 'lucide-react';
import { CATEGORIES, ARTICLES } from '../data/mockData';

export default function BlogSection({ onSelectArticle, selectedCategory, setSelectedCategory, articlesList }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const allArticles = articlesList || ARTICLES;

  // Filter Articles
  const filteredArticles = allArticles.filter(article => {
    const matchCategory = selectedCategory === 'all' || (article.categoryName || article.category) === selectedCategory;
    const matchTag = !selectedTag || (Array.isArray(article.tags) ? article.tags.includes(selectedTag) : article.tags?.includes(selectedTag));
    const matchSearch = !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(article.tags) ? article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) : article.tags?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchTag && matchSearch;
  });

  const featuredArticle = allArticles[0];
  const remainingArticles = filteredArticles.filter(a => a.id !== (selectedCategory === 'all' && !searchQuery ? featuredArticle?.id : null));

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Blog Header Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1 rounded-full font-sans font-bold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>طب یونانی، نبوی اور قانون مفرد اعضاء کا انسائیکلوپیڈیا</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            جامع طبی مضامین، تحقیقات اور مجرب نسخہ جات
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            مستند طبی مضامین، جڑی بوٹیوں کی سائنسی افادیت اور اطباء کے تصدیق شدہ گھریلو علاج
          </p>
        </div>

        {/* Categories Bar & Search */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs">
            
            {/* Category Pills Slider */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedTag(null);
                  }}
                  className={`shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="مضمون یا جڑی بوٹی تلاش کریں..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Active Tag indicator */}
          {selectedTag && (
            <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl inline-flex">
              <span>ٹیگ: <strong>{selectedTag}</strong></span>
              <button onClick={() => setSelectedTag(null)} className="text-emerald-900 font-bold ml-1">✕</button>
            </div>
          )}
        </div>

        {/* Featured Hero Article (Visible on all filter without search) */}
        {selectedCategory === 'all' && !searchQuery && !selectedTag && featuredArticle && (
          <div 
            onClick={() => onSelectArticle(featuredArticle)}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 relative h-64 lg:h-auto overflow-hidden">
              <img
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>خاص مضمون</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4 text-right">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-sans font-bold">
                  <span>{featuredArticle.categoryName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400 font-normal">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readingTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredArticle.authorImage}
                    alt={featuredArticle.author}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                  />
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 block">{featuredArticle.author}</span>
                    <span className="text-[10px] text-slate-400 font-sans">{featuredArticle.publishedAt}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-800 flex items-center gap-1">
                  <span>مطالعہ کریں</span>
                  <ChevronLeft className="w-4 h-4" />
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingArticles.map(article => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {article.categoryName}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 text-right">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {article.readingTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views} مشاہدات
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(tag);
                        }}
                        className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 px-2 py-0.5 rounded-md transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">{article.author}</span>
                <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-800 flex items-center gap-1">
                  <span>مکمل پڑھیں</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* If no articles match */}
        {filteredArticles.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">کوئی مضمون نہیں ملا</h3>
            <p className="text-xs text-slate-500">براہ کرم سرچ کی ورڈز تبدیل کریں یا دوسری کیٹیگری منتخب کریں۔</p>
          </div>
        )}

      </div>
    </div>
  );
}
