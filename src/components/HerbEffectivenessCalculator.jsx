import React, { useState, useMemo, useRef } from 'react';
import { 
  Calculator, 
  Scale, 
  Sparkles, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  Flame, 
  Droplets, 
  Snowflake, 
  Search, 
  Share2, 
  FileText,
  FlaskConical,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import HERBS_BASE_DATA from '../data/herbsCalculatorData.json';

// Category effectiveness mapping from plugin (70% first quality, 30% second quality)
export const CATEGORY_EFFECTIVENESS = {
  'خشک گرم': { warm: 30, dry: 70, cold: 0, wet: 0, qanoon: 'عضلاتی غدی', organ: 'قلب و عضلات میں تحریک، جگر میں تحلیل، اعصاب میں تسکین' },
  'گرم خشک': { warm: 70, dry: 30, cold: 0, wet: 0, qanoon: 'غدی عضلاتی', organ: 'جگر و غدد میں تحریک، اعصاب میں تحلیل، قلب میں تسکین' },
  'گرم تر':   { warm: 70, dry: 0, cold: 0, wet: 30, qanoon: 'غدی اعصابی', organ: 'جگر و غدد میں تحریک، قلب میں تحلیل، اعصاب میں تسکین' },
  'تر گرم':   { warm: 30, dry: 0, cold: 0, wet: 70, qanoon: 'اعصابی غدی', organ: 'دماغ و اعصاب میں تحریک، قلب میں تحلیل، جگر میں تسکین' },
  'تر سرد':   { warm: 0, dry: 0, cold: 30, wet: 70, qanoon: 'اعصابی عضلاتی', organ: 'دماغ و اعصاب میں تحریک، جگر میں تحلیل، قلب میں تسکین' },
  'خشک سرد': { warm: 0, dry: 70, cold: 30, wet: 0, qanoon: 'عضلاتی اعصابی', organ: 'قلب و عضلات میں تحریک، اعصاب میں تحلیل، جگر میں تسکین' }
};

export const ALLOWED_CATEGORIES = Object.keys(CATEGORY_EFFECTIVENESS);

// Classical Prescriptions Presets for 1-click test
const SAMPLE_PRESCRIPTIONS = [
  {
    title: 'حب صابر (ملین عضلاتی غدی)',
    description: 'معدہ، جگر اور آنتوں کی صفائی کے لیے مشہور و آزمودہ کلاسیکل نسخہ',
    items: [
      { name: 'رائی', category: 'خشک گرم', weight: 40 },
      { name: 'گندھک آملہ سار', category: 'گرم خشک', weight: 30 },
      { name: 'صبر زرد', category: 'خشک سرد', weight: 10 }
    ]
  },
  {
    title: 'تریاق تبخیر و معدہ',
    description: 'گیس، تبخیر اور معدے کے نفخ کے ازالے کے لیے متوازن ہربل مرکب',
    items: [
      { name: 'سہاگہ بریاں', category: 'گرم خشک', weight: 10 },
      { name: 'ملٹھی', category: 'تر گرم', weight: 15 },
      { name: 'گوند کیکر', category: 'خشک سرد', weight: 10 }
    ]
  },
  {
    title: 'اکسیر جگر (مصفی جگر)',
    description: 'جگر کی سستی دور کرنے اور فاسد مادوں کے اخراج کے لیے',
    items: [
      { name: 'نوشادر', category: 'گرم تر', weight: 30 },
      { name: 'قلمی شورہ', category: 'سرد تر', categoryFallback: 'تر سرد', weight: 20 },
      { name: 'ریوند خطائی', category: 'گرم خشک', weight: 20 }
    ]
  },
  {
    title: 'تریاق اعصاب و مقوی دماغ',
    description: 'اعصابی کمزوری اور خشکی و گرمی کے ازالے کے لیے مفید مرکب',
    items: [
      { name: 'اسگند ناگوری', category: 'تر گرم', weight: 25 },
      { name: 'مغز بادام', category: 'تر گرم', weight: 35 },
      { name: 'الائچی خورد', category: 'گرم تر', weight: 10 }
    ]
  }
];

export default function HerbEffectivenessCalculator({ 
  articles = [], 
  onSelectArticle, 
  onBack,
  theme = 'herbal'
}) {
  const isNavy = theme === 'navy';

  // Merge articles from props to ensure 100% updated database
  const allAvailableHerbs = useMemo(() => {
    const list = [...HERBS_BASE_DATA];
    const existingTitles = new Set(list.map(h => (h.title || '').trim().toLowerCase()));

    if (Array.isArray(articles)) {
      articles.forEach(art => {
        if (!art || !art.title) return;
        const cleanTitle = art.title.trim().toLowerCase();
        if (!existingTitles.has(cleanTitle) && art.categories) {
          const matched = art.categories.find(c => ALLOWED_CATEGORIES.includes(c));
          if (matched) {
            const qanoon = art.categories.find(c => ['عضلاتی اعصابی', 'عضلاتی غدی', 'غدی عضلاتی', 'غدی اعصابی', 'اعصابی غدی', 'اعصابی عضلاتی'].includes(c));
            list.push({
              id: art.id,
              title: art.title,
              slug: art.slug,
              category: matched,
              qanoonCategory: qanoon || '',
              degree: ''
            });
            existingTitles.add(cleanTitle);
          }
        }
      });
    }
    return list;
  }, [articles]);

  // Calculator Form State
  const [herbSearch, setHerbSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('گرم خشک');
  const [selectedWeight, setSelectedWeight] = useState(10);
  const [weightUnit, setWeightUnit] = useState('g'); // 'g' (گرام) or 'tola' (تولہ) or 'parts' (حصے)
  const [selectedHerbSlug, setSelectedHerbSlug] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  // Selected herbs in current recipe
  const [selectedHerbs, setSelectedHerbs] = useState([
    { id: '1', name: 'سہاگہ بریاں', category: 'گرم خشک', weight: 20, slug: '' },
    { id: '2', name: 'ملٹھی', category: 'تر گرم', weight: 30, slug: '' },
    { id: '3', name: 'گوند کیکر', category: 'خشک سرد', weight: 15, slug: '' }
  ]);

  // Autocomplete Suggestions
  const suggestions = useMemo(() => {
    if (!herbSearch.trim()) return [];
    const query = herbSearch.trim().toLowerCase();
    return allAvailableHerbs.filter(h => 
      (h.title || '').toLowerCase().includes(query)
    ).slice(0, 8);
  }, [herbSearch, allAvailableHerbs]);

  // Handle selecting suggestion
  const handleSelectSuggestion = (herb) => {
    setHerbSearch(herb.title);
    if (herb.category && CATEGORY_EFFECTIVENESS[herb.category]) {
      setSelectedCategory(herb.category);
    }
    setSelectedHerbSlug(herb.slug || '');
    setShowSuggestions(false);
  };

  // Add Herb to current formula
  const handleAddHerb = (e) => {
    if (e) e.preventDefault();
    if (!herbSearch.trim()) {
      alert('براہ کرم جڑی بوٹی کا نام درج کریں یا منتخب کریں');
      return;
    }
    const weightNum = parseFloat(selectedWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('براہ کرم درست وزن درج کریں');
      return;
    }

    const newHerb = {
      id: Date.now().toString(),
      name: herbSearch.trim(),
      category: selectedCategory,
      weight: weightNum,
      slug: selectedHerbSlug
    };

    setSelectedHerbs(prev => [...prev, newHerb]);
    setHerbSearch('');
    setSelectedHerbSlug('');
    setShowSuggestions(false);
  };

  // Quick weight presets (+5g, +10g, +20g, 1 تولہ)
  const handleAddWeightPreset = (amount) => {
    setSelectedWeight(prev => Math.max(1, Number((Number(prev || 0) + amount).toFixed(1))));
  };

  // Remove herb
  const handleRemoveHerb = (id) => {
    setSelectedHerbs(prev => prev.filter(h => h.id !== id));
  };

  // Update herb weight inline
  const handleUpdateWeight = (id, newWeight) => {
    const val = parseFloat(newWeight);
    if (isNaN(val) || val <= 0) return;
    setSelectedHerbs(prev => prev.map(h => h.id === id ? { ...h, weight: val } : h));
  };

  // Clear all
  const handleClearAll = () => {
    if (selectedHerbs.length > 0 && window.confirm('کیا آپ تمام منتخب جڑی بوٹیاں ختم کر کے نیا نسخہ شروع کرنا چاہتے ہیں؟')) {
      setSelectedHerbs([]);
    }
  };

  // Load sample prescription
  const handleLoadSample = (sample) => {
    const newItems = sample.items.map((item, idx) => ({
      id: `${Date.now()}_${idx}`,
      name: item.name,
      category: item.categoryFallback || item.category,
      weight: item.weight,
      slug: ''
    }));
    setSelectedHerbs(newItems);
  };

  // Calculations Engine (Based on HEC formula)
  const calculationResults = useMemo(() => {
    let warmTotal = 0;
    let dryTotal = 0;
    let coldTotal = 0;
    let wetTotal = 0;
    let totalWeight = 0;

    selectedHerbs.forEach(herb => {
      const eff = CATEGORY_EFFECTIVENESS[herb.category] || { warm: 0, dry: 0, cold: 0, wet: 0 };
      const w = herb.weight || 0;
      totalWeight += w;

      warmTotal += (eff.warm * w) / 100;
      dryTotal += (eff.dry * w) / 100;
      coldTotal += (eff.cold * w) / 100;
      wetTotal += (eff.wet * w) / 100;
    });

    const grandTotal = warmTotal + dryTotal + coldTotal + wetTotal;

    const warmPercent = grandTotal > 0 ? (warmTotal / grandTotal) * 100 : 0;
    const dryPercent = grandTotal > 0 ? (dryTotal / grandTotal) * 100 : 0;
    const coldPercent = grandTotal > 0 ? (coldTotal / grandTotal) * 100 : 0;
    const wetPercent = grandTotal > 0 ? (wetTotal / grandTotal) * 100 : 0;

    // Determine Composite Dominant Temperament (حتمی مرکب مزاج)
    let dominantThermal = warmPercent >= coldPercent ? 'گرم' : 'سرد';
    let thermalStrength = Math.abs(warmPercent - coldPercent);

    let dominantMoisture = dryPercent >= wetPercent ? 'خشک' : 'تر';
    let moistureStrength = Math.abs(dryPercent - wetPercent);

    let compositeTemperament = 'معتدل';
    let qanoonTitle = 'معتدل طبی مزاج';
    let organAction = 'جسم کے تمام اعضاء میں اعتدال و توازن';
    let colorBadge = 'bg-slate-700 text-slate-100';

    if (grandTotal > 0) {
      // Order by which axis is stronger
      let primary = '';
      let secondary = '';

      if (thermalStrength >= moistureStrength) {
        primary = dominantThermal;
        secondary = dominantMoisture;
      } else {
        primary = dominantMoisture;
        secondary = dominantThermal;
      }

      compositeTemperament = `${primary} ${secondary}`;

      if (CATEGORY_EFFECTIVENESS[compositeTemperament]) {
        qanoonTitle = CATEGORY_EFFECTIVENESS[compositeTemperament].qanoon;
        organAction = CATEGORY_EFFECTIVENESS[compositeTemperament].organ;
      } else {
        // Reverse fallback
        const rev = `${secondary} ${primary}`;
        if (CATEGORY_EFFECTIVENESS[rev]) {
          qanoonTitle = CATEGORY_EFFECTIVENESS[rev].qanoon;
          organAction = CATEGORY_EFFECTIVENESS[rev].organ;
        }
      }

      // Assign theme color
      if (compositeTemperament.includes('گرم') && compositeTemperament.includes('خشک')) {
        colorBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      } else if (compositeTemperament.includes('خشک') && compositeTemperament.includes('سرد')) {
        colorBadge = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      } else if (compositeTemperament.includes('گرم') && compositeTemperament.includes('تر')) {
        colorBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      } else if (compositeTemperament.includes('تر') && compositeTemperament.includes('سرد')) {
        colorBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      } else {
        colorBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      }
    }

    return {
      totalWeight,
      warmTotal,
      dryTotal,
      coldTotal,
      wetTotal,
      grandTotal,
      warmPercent,
      dryPercent,
      coldPercent,
      wetPercent,
      compositeTemperament,
      qanoonTitle,
      organAction,
      colorBadge
    };
  }, [selectedHerbs]);

  // Copy prescription to clipboard
  const handleCopyPrescription = () => {
    if (selectedHerbs.length === 0) return;
    let text = `🌿 نسخہ و مزاج تجزیہ رپورٹ (طبیب پیڈیا HEC)\n`;
    text += `------------------------------------\n`;
    selectedHerbs.forEach((h, i) => {
      text += `${i + 1}. ${h.name} - ${h.weight} گرام (${h.category})\n`;
    });
    text += `------------------------------------\n`;
    text += `کل وزن: ${calculationResults.totalWeight.toFixed(1)} گرام\n`;
    text += `غالب مرکب مزاج: ${calculationResults.compositeTemperament} (${calculationResults.qanoonTitle})\n\n`;
    text += `کیفیات کا تناسب:\n`;
    text += `🔥 حرارت (گرم): ${calculationResults.warmPercent.toFixed(1)}% (${calculationResults.warmTotal.toFixed(1)}g)\n`;
    text += `🍂 یبوست (خشک): ${calculationResults.dryPercent.toFixed(1)}% (${calculationResults.dryTotal.toFixed(1)}g)\n`;
    text += `❄️ برودت (سرد): ${calculationResults.coldPercent.toFixed(1)}% (${calculationResults.coldTotal.toFixed(1)}g)\n`;
    text += `💧 رطوبت (تر): ${calculationResults.wetPercent.toFixed(1)}% (${calculationResults.wetTotal.toFixed(1)}g)\n`;
    text += `\nعضوی اثرات: ${calculationResults.organAction}\n`;
    text += `ماخذ: طبیب پیڈیا جڑی بوٹی مزاج کیلکولیٹر (https://tabeebpedia.com)\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Print Prescription
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      
      {/* Top Banner / Hero */}
      <div className={`relative overflow-hidden ${isNavy ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800' : 'bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 border-b border-emerald-900/40'} pt-8 pb-10 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-all font-simple cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>ہوم پیج پر واپس جائیں</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>HEC Algorithm v1.2</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl text-right">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-xs font-simple text-amber-300">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span>جڑی بوٹیوں و نسخہ جات کا ڈیجیٹل مزاج کیلکولیٹر</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-h1">
                ??? ?????? ?? ???? ???? ?????????
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-nastaliq">
                قانون مفرد اعضاء اور طب یونانی کے مستند ریاضیاتی فارمولے کے مطابق کسی بھی نسخے یا جڑی بوٹیوں کے مرکب کا دقیق سائنسی مزاج، حرارت، برودت، یبوست اور رطوبت کا فیصد تناسب معلوم کریں۔
              </p>
            </div>

            {/* Quick Stat or Author pill */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 text-right space-y-2 shrink-0 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-simple">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>اصول: 70% اول صفت، 30% ثانی صفت</span>
              </div>
              <div className="text-xs text-slate-300 font-mono">
                ڈیٹا بیس: <strong className="text-emerald-400">{allAvailableHerbs.length}</strong> مستند مفردات
              </div>
              <div className="text-[11px] text-slate-500 font-sans">
                تحقیق و فارمولا: حکیم سید عبدالوہاب شاہ
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Sample Prescriptions Bar (Quick Test) */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 mb-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white font-simple">
                مشہور کلاسیکل نسخہ جات کے نمونے (ایک کلک سے لوڈ کریں):
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">فوری ٹیسٹ اور مشاہدے کے لیے کلک کریں</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_PRESCRIPTIONS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="text-right p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs group cursor-pointer"
              >
                <div className="font-bold text-slate-200 group-hover:text-emerald-400 font-simple transition-colors">
                  {sample.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sample.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Layout: Form (Left) & Results (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: Input Form & Ingredients Table (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Add Herb Form Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-simple">
                      نسخے میں نئی جڑی بوٹی شامل کریں
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      نام لکھ کر سرچ کریں یا کیٹگری اور وزن درج کریں
                    </p>
                  </div>
                </div>

                <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg font-mono">
                  {selectedHerbs.length} اجزاء
                </span>
              </div>

              <form onSubmit={handleAddHerb} className="space-y-4">
                
                {/* Herb Search & Autocomplete */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-simple text-right">
                    جڑی بوٹی کا نام (Search / Type Herb Name) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={herbSearch}
                      onChange={(e) => {
                        setHerbSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="مثلاً: سنامکی، ملٹھی، زنجبیل، رائی، سہاگہ، دارچینی..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-h2 text-right"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full right-0 left-0 mt-1 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 max-h-64 overflow-y-auto">
                      {suggestions.map((h) => (
                        <div
                          key={h.id || h.title}
                          onClick={() => handleSelectSuggestion(h)}
                          className="p-3 hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors text-right"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                              {h.category}
                            </span>
                            {h.qanoonCategory && (
                              <span className="text-[10px] text-slate-400 font-simple">
                                ({h.qanoonCategory})
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-white font-simple">
                            {h.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Temperament Category & Weight in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Category Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 font-simple text-right">
                      مزاج / تاثیر کی کیٹگری (Category) *
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-simple cursor-pointer text-right"
                    >
                      <option value="خشک گرم">خشک گرم (عضلاتی غدی - 70% خشک، 30% گرم)</option>
                      <option value="گرم خشک">گرم خشک (غدی عضلاتی - 70% گرم، 30% خشک)</option>
                      <option value="گرم تر">گرم تر (غدی اعصابی - 70% گرم، 30% تر)</option>
                      <option value="تر گرم">تر گرم (اعصابی غدی - 70% تر، 30% گرم)</option>
                      <option value="تر سرد">تر سرد (اعصابی عضلاتی - 70% تر، 30% سرد)</option>
                      <option value="خشک سرد">خشک سرد (عضلاتی اعصابی - 70% خشک، 30% سرد)</option>
                    </select>
                  </div>

                  {/* Weight Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <button
                          type="button"
                          onClick={() => setWeightUnit('g')}
                          className={`px-1.5 py-0.2 rounded ${weightUnit === 'g' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-white'}`}
                        >
                          گرام (g)
                        </button>
                        <span>|</span>
                        <button
                          type="button"
                          onClick={() => setWeightUnit('tola')}
                          className={`px-1.5 py-0.2 rounded ${weightUnit === 'tola' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-white'}`}
                        >
                          تولہ
                        </button>
                      </div>

                      <label className="text-xs font-bold text-slate-300 font-simple">
                        وزن مقدار ({weightUnit === 'tola' ? 'تولہ' : 'گرام'}) *
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        value={selectedWeight}
                        onChange={(e) => setSelectedWeight(e.target.value)}
                        placeholder="10"
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500 font-mono text-center"
                      />
                    </div>
                  </div>

                </div>

                {/* Quick Presets for weight */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-simple">فوری وزن:</span>
                    {[5, 10, 20, 50].map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWeight(w)}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-[10px] font-mono transition-colors"
                      >
                        +{w}g
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedWeight(12)}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 rounded-lg text-[10px] font-simple transition-colors"
                      title="1 تولہ = 12 گرام"
                    >
                      1 تولہ
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all font-simple cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>نسخہ میں شامل کریں</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Selected Ingredients List / Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white font-simple">
                    شامل اجزاء و اوزان کی فہرست
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {selectedHerbs.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 border border-red-900/50 px-2.5 py-1 rounded-xl transition-colors font-simple cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>صاف کریں</span>
                    </button>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    کل وزن: <strong className="text-emerald-400 font-bold">{calculationResults.totalWeight.toFixed(1)}g</strong>
                  </span>
                </div>
              </div>

              {selectedHerbs.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <FlaskConical className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-sm font-bold text-slate-400 font-simple">
                    ابھی تک کوئی جڑی بوٹی شامل نہیں کی گئی
                  </p>
                  <p className="text-xs text-slate-500 font-nastaliq max-w-sm mx-auto">
                    اوپر دیے گئے فارم سے جڑی بوٹیاں شامل کریں یا اوپر موجود کسی مشہور نسخے کے بٹن پر کلک کریں۔
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {selectedHerbs.map((herb, idx) => {
                    const eff = CATEGORY_EFFECTIVENESS[herb.category];
                    return (
                      <div 
                        key={herb.id} 
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 px-2 rounded-xl transition-colors"
                      >
                        {/* Herb Info */}
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">
                            {idx + 1}
                          </span>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white font-h2">
                                {herb.name}
                              </h4>
                              {herb.slug && onSelectArticle && (
                                <button
                                  type="button"
                                  onClick={() => onSelectArticle({ slug: herb.slug, title: herb.name })}
                                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                                  title="جڑی بوٹی کا تفصیلی مضمون دیکھیں"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded font-simple">
                                {herb.category}
                              </span>
                              {eff?.qanoon && (
                                <span className="text-[10px] text-slate-500 font-simple">
                                  ({eff.qanoon})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Weight & Remove Action */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1">
                            <input
                              type="number"
                              min="0.01"
                              step="any"
                              value={herb.weight}
                              onChange={(e) => handleUpdateWeight(herb.id, e.target.value)}
                              className="w-14 bg-transparent text-emerald-400 font-bold text-xs text-center outline-none font-mono"
                            />
                            <span className="text-[11px] text-slate-400 font-mono">g</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveHerb(herb.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            title="حذف کریں"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Column 2: Calculated Live Results & Analytics (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Result Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-right relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white font-simple">
                    مرکب کا حتمی مزاج و تجزیہ
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyPrescription}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs border border-slate-800 transition-colors"
                    title="نسخہ کلپ بورڈ پر کاپی کریں"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs border border-slate-800 transition-colors"
                    title="پرنٹ کریں"
                  >
                    <Printer className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>

              {/* Dominant Result Banner */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-2 relative shadow-inner">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                  COMPOSITE TEMPERAMENT
                </span>
                
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-h1 tracking-tight">
                  {calculationResults.compositeTemperament}
                </div>

                <div className="inline-block">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${calculationResults.colorBadge} font-simple`}>
                    قانون مفرد اعضاء: {calculationResults.qanoonTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-nastaliq leading-relaxed pt-1 max-w-sm mx-auto">
                  {calculationResults.organAction}
                </p>
              </div>

              {/* 4 Qualities Breakdown Cards (حرارت، یبوست، برودت، رطوبت) */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-800/80 pb-1.5">
                  چاروں کیفیات کا فی صد تناسب و مقدار
                </h4>

                {/* 1. Warm / حرارت */}
                <div className="bg-slate-900/80 border border-rose-950/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300 font-mono">
                      <span>{calculationResults.warmPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-400">({calculationResults.warmTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-rose-400 font-simple">
                      <span>حرارت (گرم)</span>
                      <Flame className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.warmPercent)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Dry / یبوست */}
                <div className="bg-slate-900/80 border border-amber-950/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 font-mono">
                      <span>{calculationResults.dryPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-400">({calculationResults.dryTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-amber-400 font-simple">
                      <span>یبوست (خشک)</span>
                      <span className="text-amber-400 text-sm">🍂</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.dryPercent)}%` }}
                    />
                  </div>
                </div>

                {/* 3. Cold / برودت */}
                <div className="bg-slate-900/80 border border-cyan-950/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-300 font-mono">
                      <span>{calculationResults.coldPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-400">({calculationResults.coldTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-cyan-400 font-simple">
                      <span>برودت (سرد)</span>
                      <Snowflake className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.coldPercent)}%` }}
                    />
                  </div>
                </div>

                {/* 4. Wet / رطوبت */}
                <div className="bg-slate-900/80 border border-emerald-950/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300 font-mono">
                      <span>{calculationResults.wetPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-400">({calculationResults.wetTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-simple">
                      <span>رطوبت (تر)</span>
                      <Droplets className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.wetPercent)}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Total Summary Footer */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">
                  {calculationResults.totalWeight.toFixed(1)} گرام ({(calculationResults.totalWeight / 12).toFixed(2)} تولہ)
                </span>
                <span className="text-slate-400 font-simple">مجموعی خالص وزن:</span>
              </div>

            </div>

            {/* Scientific Explanation Info Box */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 text-right space-y-2.5 text-xs text-slate-400 leading-relaxed font-nastaliq">
              <div className="flex items-center gap-2 text-white font-bold font-simple">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>HEC الگورتھم کس طرح کام کرتا ہے؟</span>
              </div>
              <p>
                قانون مفرد اعضاء میں ہر مفرد دوا یا غذا دو صفات کا مجموعہ ہوتی ہے۔ اس نظام میں پہلے مفرد کو <strong>70 فیصد</strong> اور دوسرے ثانی مفرد کو <strong>30 فیصد</strong> تاثیر دی جاتی ہے (مثلاً گرم خشک میں 70% حرارت اور 30% خشکی)۔ پھر ہر دوا کے وزن کے تناسب سے مجموعی نسخے کی خالص حرارت، برودت، یبوست اور رطوبت کا عین ریاضیاتی میزان نکالا جاتا ہے۔
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
