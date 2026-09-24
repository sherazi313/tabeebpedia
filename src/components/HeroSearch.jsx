import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Stethoscope, 
  Sparkles, 
  ArrowLeft, 
  Leaf, 
  BookOpen, 
  ShieldCheck, 
  ChevronDown, 
  User,
  HeartPulse,
  Flame,
  Activity,
  Droplets,
  Clock
} from 'lucide-react';
import { CITIES, SPECIALTIES, DOCTORS, ARTICLES, HERBS_DATA } from '../data/mockData';

export default function HeroSearch({ 
  onSelectDoctor, 
  onSelectArticle, 
  onSelectSpecialty, 
  onSelectCity, 
  onNavigateToDirectory, 
  theme, 
  articlesList,
  doctorsList,
  citiesList = CITIES,
  onOpenDoctorAuthModal
}) {
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  const isNavy = theme === 'navy';
  const allArticles = articlesList || ARTICLES;
  const allDoctors = doctorsList || DOCTORS;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered live results
  const filteredDoctors = (allDoctors || []).filter(doc => {
    if (!doc) return false;
    if (doc.isApproved === false || doc.status === 'pending') return false;
    const matchCity = selectedCity === 'all' || doc.city === selectedCity;
    const matchQuery = !searchQuery.trim() || 
      (doc.name && typeof doc.name === 'string' && doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.specialties && Array.isArray(doc.specialties) && doc.specialties.some(s => s && typeof s === 'string' && s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (doc.treatmentType && typeof doc.treatmentType === 'string' && doc.treatmentType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCity && matchQuery;
  }).slice(0, 3);

  const filteredArticles = (allArticles || []).filter(art => {
    if (!art) return false;
    return !searchQuery.trim() ||
      (art.title && typeof art.title === 'string' && art.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(art.tags) ? art.tags.some(t => t && typeof t === 'string' && t.toLowerCase().includes(searchQuery.toLowerCase())) : (art.tags && typeof art.tags === 'string' && art.tags.toLowerCase().includes(searchQuery.toLowerCase())));
  }).slice(0, 3);

  const filteredHerbs = (HERBS_DATA || []).filter(herb => {
    if (!herb) return false;
    return !searchQuery.trim() ||
      (herb.name && typeof herb.name === 'string' && herb.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (herb.botanicalName && typeof herb.botanicalName === 'string' && herb.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()));
  }).slice(0, 2);

  const hasQuery = searchQuery.trim().length > 0;
  const hasAnyResult = filteredDoctors.length > 0 || filteredArticles.length > 0 || filteredHerbs.length > 0;

  const quickPills = [
    { id: 'digestive', label: 'معدے کا السر و گیس', icon: Flame },
    { id: 'joints', label: 'جوڑوں کا درد و عرق النساء', icon: Activity },
    { id: 'liver', label: 'جگر، یرقان و گرمی', icon: HeartPulse },
    { id: 'mens-health', label: 'مردانہ کمزوری و بانجھ پن', icon: User },
    { id: 'womens-health', label: 'خواتین کے امراض و PCOS', icon: Sparkles },
    { id: 'diabetes', label: 'شوگر و بلڈ پریشر', icon: Droplets },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedCity !== 'all') {
      onSelectCity(selectedCity);
    }
    onNavigateToDirectory();
  };

  return (
    <div className={`relative overflow-hidden ${isNavy ? 'bg-gradient-to-b from-[#0b1d3a] via-[#0f2952] to-[#071326]' : 'bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950'} text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500`}>
      {/* Decorative background effects */}
      <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full ${isNavy ? 'bg-blue-600/20' : 'bg-emerald-600/20'} blur-3xl pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full ${isNavy ? 'bg-indigo-500/20' : 'bg-teal-500/20'} blur-3xl pointer-events-none`} />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        
        {/* Top Trust Pill */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs text-white/90 font-sans shadow-inner">
          <ShieldCheck className={`w-4 h-4 ${isNavy ? 'text-blue-300' : 'text-emerald-400'}`} />
          <span>پاکستان کا پہلا اور سب سے بڑا ہربل و طب یونانی پورٹل</span>
        </div>

        {/* Main Heading - Crisp Tajawal/Cairo */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-snug text-white">
            مستند اطباء اور حکماء سے <br className="hidden sm:inline" />
            <span className={`bg-gradient-to-r ${isNavy ? 'from-blue-300 via-sky-200 to-teal-200' : 'from-emerald-300 via-teal-200 to-amber-200'} bg-clip-text text-transparent`}>
              مفت آن لائن رہنمائی و فوری رابطہ
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-200/90 max-w-3xl mx-auto leading-relaxed">
            طب یونانی، قانون مفرد اعضاء، ہربل علاج اور مستند سائنسی و طبی مضامین کا مستند ڈیجیٹل خزانہ
          </p>
        </div>

        {/* Marham / Oladoc Style Dual Search Bar */}
        <div ref={searchContainerRef} className="relative max-w-4xl mx-auto text-slate-800">
          <form 
            onSubmit={handleSearchSubmit}
            className={`bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/30 border-2 ${isNavy ? 'border-blue-500/30' : 'border-emerald-500/30'} flex flex-col md:flex-row items-stretch gap-2`}
          >
            {/* City Selector */}
            <div className="relative flex items-center min-w-[200px] border-b md:border-b-0 md:border-l border-slate-200 px-3 py-2 bg-slate-50/70 rounded-xl md:rounded-r-2xl">
              <MapPin className={`w-5 h-5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'} shrink-0 ml-2`} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent border-0 text-slate-700 font-semibold text-sm focus:ring-0 focus:outline-none cursor-pointer pr-1"
              >
                {(citiesList || CITIES).map(city => (
                  <option key={city.id} value={city.id} className="text-slate-800">
                    {city.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Keyword Input */}
            <div className="relative flex-1 flex items-center px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="حکیم کا نام، بیماری (معدہ، جوڑوں کا درد)، جڑی بوٹی یا مضمون تلاش کریں..."
                className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 text-sm focus:ring-0 focus:outline-none font-body"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 font-sans"
                >
                  صاف کریں
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className={`${isNavy ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-700/30' : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-700/30'} text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 font-heading`}
            >
              <Search className="w-4 h-4" />
              <span>تلاش کریں</span>
            </button>
          </form>

          {/* Live Auto-Complete Dropdown */}
          {showResults && hasQuery && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-right z-50 animate-in fade-in-50 duration-200">
              
              {!hasAnyResult ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="font-bold">کوئی نتیجہ نہیں ملا</p>
                  <p className="text-xs text-slate-400 mt-1">برائے مہربانی دیگر الفاظ یا بیماری کا نام لکھ کر تلاش کریں۔</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                  
                  {/* Doctors Category in Results */}
                  {filteredDoctors.length > 0 && (
                    <div className="p-3">
                      <div className={`flex items-center gap-2 text-xs font-bold ${isNavy ? 'text-blue-900' : 'text-emerald-800'} mb-2 px-2 font-heading`}>
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>اطباء و ڈاکٹرز ({filteredDoctors.length})</span>
                      </div>
                      <div className="space-y-1">
                        {filteredDoctors.map(doc => (
                          <div
                            key={doc.id}
                            onClick={() => {
                              onSelectDoctor(doc);
                              setShowResults(false);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl ${isNavy ? 'hover:bg-blue-50' : 'hover:bg-emerald-50'} cursor-pointer transition-colors`}
                          >
                            <div className="flex items-center gap-3">
                              <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                              <div className="text-right">
                                <h4 className="text-sm font-bold text-slate-900 font-heading">{doc.name}</h4>
                                <p className="text-xs text-slate-500">{doc.clinicName} • {doc.cityName}</p>
                              </div>
                            </div>
                            <span className={`text-xs ${isNavy ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-800'} px-2 py-0.5 rounded font-sans font-bold`}>
                              پروفائل
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Articles Category in Results */}
                  {filteredArticles.length > 0 && (
                    <div className="p-3">
                      <div className={`flex items-center gap-2 text-xs font-bold ${isNavy ? 'text-indigo-900' : 'text-teal-800'} mb-2 px-2 font-heading`}>
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>طبی مضامین ({filteredArticles.length})</span>
                      </div>
                      <div className="space-y-1">
                        {filteredArticles.map(art => (
                          <div
                            key={art.id}
                            onClick={() => {
                              onSelectArticle(art);
                              setShowResults(false);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img src={art.featuredImage} alt={art.title} className="w-10 h-10 rounded-lg object-cover" />
                              <div className="text-right">
                                <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 font-heading">{art.title}</h4>
                                <p className="text-xs text-slate-400">{art.categoryName} • وقت: {art.readingTime}</p>
                              </div>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Herbs in Results */}
                  {filteredHerbs.length > 0 && (
                    <div className="p-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-2 px-2 font-heading">
                        <Leaf className="w-3.5 h-3.5" />
                        <span>جڑی بوٹی</span>
                      </div>
                      <div className="space-y-1">
                        {filteredHerbs.map(herb => (
                          <div
                            key={herb.id}
                            onClick={() => {
                              onNavigateToDirectory();
                              setShowResults(false);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img src={herb.image} alt={herb.name} className="w-10 h-10 rounded-lg object-cover" />
                              <div className="text-right">
                                <h4 className="text-sm font-bold text-slate-800 font-heading">{herb.name}</h4>
                                <p className="text-xs text-slate-500 font-sans">{herb.botanicalName} • مزاج: {herb.mizaj}</p>
                              </div>
                            </div>
                            <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-sans font-bold">
                              جڑی بوٹی
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* View all search button */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className={`text-xs font-bold ${isNavy ? 'text-blue-700 hover:text-blue-900' : 'text-emerald-700 hover:text-emerald-900'} font-heading`}
                >
                  تمام نتائج ڈائریکٹری میں دیکھیں →
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Popular Disease Quick Filter Pills */}
        <div className="space-y-2">
          <p className="text-xs text-slate-300 font-sans">
            عام امراض اور فوری تخصص کے تحت تلاش کریں:
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {quickPills.map(pill => {
              const Icon = pill.icon;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    onSelectSpecialty(pill.id);
                    onNavigateToDirectory();
                  }}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-full backdrop-blur-sm transition-all hover:scale-105 active:scale-95 font-heading"
                >
                  <Icon className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-300' : 'text-emerald-300'}`} />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctor Join Callout in Hero */}
        {onOpenDoctorAuthModal && (
          <div 
            onClick={() => onOpenDoctorAuthModal('signup')}
            className="inline-flex items-center gap-2 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 hover:text-white px-4 py-2 rounded-2xl text-xs font-simple transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>کیا آپ طبیب یا حکیم ہیں؟ <strong>یہاں کلک کر کے اپنی مطب ڈائریکٹری مفت بنائیں ←</strong></span>
          </div>
        )}

        {/* Bottom Highlights & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 max-w-4xl mx-auto text-right">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className="text-2xl sm:text-3xl font-bold font-sans text-amber-300">
              {allDoctors.filter(d => d && d.isApproved !== false && d.status !== 'pending').length || allDoctors.length}
            </div>
            <div className="text-xs text-slate-200 mt-1">مصدقہ اطباء و حکماء</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className={`text-2xl sm:text-3xl font-bold font-sans ${isNavy ? 'text-blue-300' : 'text-emerald-300'}`}>
              {allArticles.length}
            </div>
            <div className="text-xs text-slate-200 mt-1">مستند طبی مضامین</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className="text-2xl sm:text-3xl font-bold font-sans text-teal-300">100%</div>
            <div className="text-xs text-slate-200 mt-1">مفت طبی رہنمائی</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className={`text-2xl sm:text-3xl font-bold font-sans ${isNavy ? 'text-blue-300' : 'text-emerald-300'}`}>24/7</div>
            <div className="text-xs text-slate-200 mt-1">واٹس ایپ کنیکٹ</div>
          </div>
        </div>

      </div>
    </div>
  );
}
