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
  Percent,
  Settings,
  Edit3,
  X
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

// Default Classical Prescriptions Presets for 1-click test
const DEFAULT_SAMPLE_PRESCRIPTIONS = [
  {
    id: 'sample_1',
    title: 'حب صابر (ملین عضلاتی غدی)',
    description: 'معدہ، جگر اور آنتوں کی صفائی کے لیے مشہور و آزمودہ کلاسیکل نسخہ',
    items: [
      { name: 'رائی', category: 'خشک گرم', weight: 40 },
      { name: 'گندھک آملہ سار', category: 'گرم خشک', weight: 30 },
      { name: 'صبر زرد', category: 'خشک سرد', weight: 10 }
    ]
  },
  {
    id: 'sample_2',
    title: 'تریاق تبخیر و معدہ',
    description: 'گیس، تبخیر اور معدے کے نفخ کے ازالے کے لیے متوازن ہربل مرکب',
    items: [
      { name: 'سہاگہ بریاں', category: 'گرم خشک', weight: 10 },
      { name: 'ملٹھی', category: 'تر گرم', weight: 15 },
      { name: 'گوند کیکر', category: 'خشک سرد', weight: 10 }
    ]
  },
  {
    id: 'sample_3',
    title: 'اکسیر جگر (مصفی جگر)',
    description: 'جگر کی سستی دور کرنے اور فاسد مادوں کے اخراج کے لیے',
    items: [
      { name: 'نوشادر', category: 'گرم تر', weight: 30 },
      { name: 'قلمی شورہ', category: 'سرد تر', categoryFallback: 'تر سرد', weight: 20 },
      { name: 'ریوند خطائی', category: 'گرم خشک', weight: 20 }
    ]
  },
  {
    id: 'sample_4',
    title: 'تریاق اعصاب و مقوی دماغ',
    description: 'اعصابی کمزوری اور خشکی و گرمی کے ازالے کے لیے مفید مرکب',
    items: [
      { name: 'اسگند ناگوری', category: 'تر گرم', weight: 25 },
      { name: 'مغز بادام', category: 'تر گرم', weight: 35 },
      { name: 'الائچی خورد', category: 'گرم تر', weight: 10 }
    ]
  }
];

const PRESETS_STORAGE_KEY = 'tabeeb_hec_sample_prescriptions';

export default function HerbEffectivenessCalculator({ 
  articles = [], 
  onSelectArticle, 
  onBack,
  theme = 'herbal',
  siteSettings
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

  // Selected herbs in current recipe (empty by default so user adds their own)
  const [selectedHerbs, setSelectedHerbs] = useState([]);

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

  // Presets loaded from siteSettings or localStorage or defaults
  const presets = useMemo(() => {
    if (siteSettings?.calculatorPresets && Array.isArray(siteSettings.calculatorPresets) && siteSettings.calculatorPresets.length > 0) {
      return siteSettings.calculatorPresets;
    }
    try {
      const saved = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SAMPLE_PRESCRIPTIONS;
  }, [siteSettings]);

  // Load sample prescription
  const handleLoadSample = (sample) => {
    const newItems = (sample.items || []).map((item, idx) => ({
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
    let colorBadge = 'bg-slate-100 text-slate-700 border-slate-300';

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

      // Assign theme color for white/light color scheme
      if (compositeTemperament.includes('گرم') && compositeTemperament.includes('خشک')) {
        colorBadge = 'bg-amber-100 text-amber-800 border-amber-300';
      } else if (compositeTemperament.includes('خشک') && compositeTemperament.includes('سرد')) {
        colorBadge = 'bg-cyan-100 text-cyan-800 border-cyan-300';
      } else if (compositeTemperament.includes('گرم') && compositeTemperament.includes('تر')) {
        colorBadge = 'bg-rose-100 text-rose-800 border-rose-300';
      } else if (compositeTemperament.includes('تر') && compositeTemperament.includes('سرد')) {
        colorBadge = 'bg-blue-100 text-blue-800 border-blue-300';
      } else {
        colorBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Top Banner / Hero */}
      <div className={`relative overflow-hidden ${isNavy ? 'bg-gradient-to-b from-blue-50/80 via-white to-white border-b border-blue-100' : 'bg-gradient-to-b from-emerald-50/80 via-white to-white border-b border-emerald-100'} pt-8 pb-10 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-all font-simple cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>ہوم پیج پر واپس جائیں</span>
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] ${isNavy ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} border px-3 py-1 rounded-full font-bold flex items-center gap-1.5 font-mono shadow-xs`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>HEC Algorithm v1.2</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl text-right">
              <div className={`inline-flex items-center gap-2 ${isNavy ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} border px-3.5 py-1 rounded-full text-xs font-simple`}>
                <FlaskConical className={`w-4 h-4 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                <span>جڑی بوٹیوں و نسخہ جات کا ڈیجیٹل مزاج کیلکولیٹر</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-h1">
                جڑی بوٹیوں کا نسخہ مزاج کیلکولیٹر
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-nastaliq">
                قانون مفرد اعضاء اور طب یونانی کے مستند ریاضیاتی فارمولے کے مطابق کسی بھی نسخے یا جڑی بوٹیوں کے مرکب کا دقیق سائنسی مزاج، حرارت، برودت، یبوست اور رطوبت کا فیصد تناسب معلوم کریں۔
              </p>
            </div>

            {/* Quick Stat or Author pill */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-right space-y-2 shrink-0 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-simple">
                <ShieldCheck className={`w-4 h-4 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                <span>اصول: 70% اول صفت، 30% ثانی صفت</span>
              </div>
              <div className="text-xs text-slate-700 font-mono">
                ڈیٹا بیس: <strong className={isNavy ? 'text-blue-600' : 'text-emerald-600'}>{allAvailableHerbs.length}</strong> مستند مفردات
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                تحقیق و فارمولا: حکیم سید عبدالوہاب شاہ
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Sample Prescriptions Bar (Quick Test) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-simple">
                مشہور کلاسیکل نسخہ جات کے نمونے (ایک کلک سے لوڈ کریں):
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">فوری ٹیسٹ اور مشاہدے کے لیے کلک کریں</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {presets.map((sample, idx) => (
              <button
                key={sample.id || idx}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className={`text-right p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 ${isNavy ? 'hover:border-blue-400' : 'hover:border-emerald-400'} hover:shadow-xs transition-all text-xs group cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className={`font-bold text-slate-800 ${isNavy ? 'group-hover:text-blue-700' : 'group-hover:text-emerald-700'} font-simple transition-colors line-clamp-1`}>
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-nastaliq leading-relaxed">
                    {sample.description || `${sample.items?.length || 0} اجزاء`}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 w-full">
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    {sample.items?.length || 0} اجزاء
                  </span>
                  <span className="group-hover:text-slate-600 transition-colors">
                    لوڈ کریں ←
                  </span>
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
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 ${isNavy ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'} rounded-xl`}>
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-simple">
                      نسخے میں نئی جڑی بوٹی شامل کریں
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      نام لکھ کر سرچ کریں یا کیٹگری اور وزن درج کریں
                    </p>
                  </div>
                </div>

                <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-mono">
                  {selectedHerbs.length} اجزاء
                </span>
              </div>

              <form onSubmit={handleAddHerb} className="space-y-4">
                
                {/* Herb Search & Autocomplete */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-simple text-right">
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
                      className={`w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-2xl pr-10 pl-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${isNavy ? 'focus:border-blue-500' : 'focus:border-emerald-500'} font-h2 text-right transition-colors`}
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {suggestions.map((h) => (
                        <div
                          key={h.id || h.title}
                          onClick={() => handleSelectSuggestion(h)}
                          className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors text-right"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${isNavy ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} border px-2 py-0.5 rounded font-mono`}>
                              {h.category}
                            </span>
                            {h.qanoonCategory && (
                              <span className="text-[10px] text-slate-500 font-simple">
                                ({h.qanoonCategory})
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-slate-900 font-simple">
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
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-simple text-right">
                      مزاج / تاثیر کی کیٹگری (Category) *
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:outline-none ${isNavy ? 'focus:border-blue-500' : 'focus:border-emerald-500'} font-simple cursor-pointer text-right transition-colors`}
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
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <button
                          type="button"
                          onClick={() => setWeightUnit('g')}
                          className={`px-1.5 py-0.2 rounded transition-colors ${weightUnit === 'g' ? (isNavy ? 'bg-blue-600 text-white font-bold' : 'bg-emerald-600 text-white font-bold') : 'hover:text-slate-900'}`}
                        >
                          گرام (g)
                        </button>
                        <span>|</span>
                        <button
                          type="button"
                          onClick={() => setWeightUnit('tola')}
                          className={`px-1.5 py-0.2 rounded transition-colors ${weightUnit === 'tola' ? (isNavy ? 'bg-blue-600 text-white font-bold' : 'bg-emerald-600 text-white font-bold') : 'hover:text-slate-900'}`}
                        >
                          تولہ
                        </button>
                      </div>

                      <label className="text-xs font-bold text-slate-700 font-simple">
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
                        className={`w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-2xl px-4 py-3 ${isNavy ? 'text-blue-700 focus:border-blue-500' : 'text-emerald-700 focus:border-emerald-500'} font-bold text-sm focus:outline-none font-mono text-center transition-colors`}
                      />
                    </div>
                  </div>

                </div>

                {/* Quick Presets for weight */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-simple">فوری وزن:</span>
                    {[5, 10, 20, 50].map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWeight(w)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-mono transition-colors cursor-pointer"
                      >
                        +{w}g
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedWeight(12)}
                      className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-[10px] font-simple transition-colors cursor-pointer"
                      title="1 تولہ = 12 گرام"
                    >
                      1 تولہ
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`flex items-center gap-2 px-6 py-2.5 ${isNavy ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'} active:scale-95 text-white rounded-2xl text-xs font-bold shadow-lg transition-all font-simple cursor-pointer`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>نسخہ میں شامل کریں</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Selected Ingredients List / Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 font-simple">
                    شامل اجزاء و اوزان کی فہرست
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {selectedHerbs.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-xl transition-colors font-simple cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>صاف کریں</span>
                    </button>
                  )}
                  <span className="text-xs text-slate-600 font-mono">
                    کل وزن: <strong className={`${isNavy ? 'text-blue-700' : 'text-emerald-700'} font-bold`}>{calculationResults.totalWeight.toFixed(1)}g</strong>
                  </span>
                </div>
              </div>

              {selectedHerbs.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FlaskConical className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 font-simple">
                    ابھی تک کوئی جڑی بوٹی شامل نہیں کی گئی
                  </p>
                  <p className="text-xs text-slate-500 font-nastaliq max-w-sm mx-auto">
                    اوپر دیے گئے فارم سے جڑی بوٹیاں شامل کریں یا اوپر موجود کسی مشہور نسخے کے بٹن پر کلک کریں۔
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {selectedHerbs.map((herb, idx) => {
                    const eff = CATEGORY_EFFECTIVENESS[herb.category];
                    return (
                      <div 
                        key={herb.id} 
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                      >
                        {/* Herb Info */}
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono text-slate-600 shrink-0">
                            {idx + 1}
                          </span>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 font-h2">
                                {herb.name}
                              </h4>
                              {herb.slug && onSelectArticle && (
                                <button
                                  type="button"
                                  onClick={() => onSelectArticle({ slug: herb.slug, title: herb.name })}
                                  className={`text-slate-400 ${isNavy ? 'hover:text-blue-600' : 'hover:text-emerald-600'} transition-colors cursor-pointer`}
                                  title="جڑی بوٹی کا تفصیلی مضمون دیکھیں"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.2 rounded font-simple">
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
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                            <input
                              type="number"
                              min="0.01"
                              step="any"
                              value={herb.weight}
                              onChange={(e) => handleUpdateWeight(herb.id, e.target.value)}
                              className={`w-14 bg-transparent ${isNavy ? 'text-blue-700' : 'text-emerald-700'} font-bold text-xs text-center outline-none font-mono`}
                            />
                            <span className="text-[11px] text-slate-500 font-mono">g</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveHerb(herb.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
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
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 text-right relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className={`w-5 h-5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                  <h3 className="text-base font-bold text-slate-900 font-simple">
                    مرکب کا حتمی مزاج و تجزیہ
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyPrescription}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
                    title="نسخہ کلپ بورڈ پر کاپی کریں"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
                    title="پرنٹ کریں"
                  >
                    <Printer className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Dominant Result Banner */}
              <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200 rounded-2xl p-5 text-center space-y-2 relative shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                  COMPOSITE TEMPERAMENT
                </span>
                
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-h1 tracking-tight">
                  {calculationResults.compositeTemperament}
                </div>

                <div className="inline-block">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${calculationResults.colorBadge} font-simple`}>
                    قانون مفرد اعضاء: {calculationResults.qanoonTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-nastaliq leading-relaxed pt-1 max-w-sm mx-auto">
                  {calculationResults.organAction}
                </p>
              </div>

              {/* 4 Qualities Breakdown Cards (حرارت، یبوست، برودت، رطوبت) */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans border-b border-slate-100 pb-1.5">
                  چاروں کیفیات کا فی صد تناسب و مقدار
                </h4>

                {/* 1. Warm / حرارت */}
                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-rose-700 font-mono">
                      <span>{calculationResults.warmPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-500">({calculationResults.warmTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-rose-700 font-simple">
                      <span>حرارت (گرم)</span>
                      <Flame className="w-4 h-4 text-rose-600" />
                    </div>
                  </div>
                  <div className="w-full bg-rose-100/70 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.warmPercent)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Dry / یبوست */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 font-mono">
                      <span>{calculationResults.dryPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-500">({calculationResults.dryTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-amber-800 font-simple">
                      <span>یبوست (خشک)</span>
                      <span className="text-amber-600 text-sm">🍂</span>
                    </div>
                  </div>
                  <div className="w-full bg-amber-100/70 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.dryPercent)}%` }}
                    />
                  </div>
                </div>

                {/* 3. Cold / برودت */}
                <div className="bg-cyan-50/50 border border-cyan-100 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-800 font-mono">
                      <span>{calculationResults.coldPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-500">({calculationResults.coldTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-cyan-800 font-simple">
                      <span>برودت (سرد)</span>
                      <Snowflake className="w-4 h-4 text-cyan-600" />
                    </div>
                  </div>
                  <div className="w-full bg-cyan-100/70 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.coldPercent)}%` }}
                    />
                  </div>
                </div>

                {/* 4. Wet / رطوبت */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 font-mono">
                      <span>{calculationResults.wetPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-500">({calculationResults.wetTotal.toFixed(1)}g)</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 font-simple">
                      <span>رطوبت (تر)</span>
                      <Droplets className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="w-full bg-emerald-100/70 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculationResults.wetPercent)}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Total Summary Footer */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 font-mono">
                  {calculationResults.totalWeight.toFixed(1)} گرام ({(calculationResults.totalWeight / 12).toFixed(2)} تولہ)
                </span>
                <span className="text-slate-600 font-simple">مجموعی خالص وزن:</span>
              </div>

            </div>

            {/* Scientific Explanation Info Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-right space-y-2.5 text-xs text-slate-600 leading-relaxed font-nastaliq shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-simple">
                <Info className={`w-4 h-4 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
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
