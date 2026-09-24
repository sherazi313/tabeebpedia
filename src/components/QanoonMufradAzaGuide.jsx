import React, { useState } from 'react';
import { 
  Cpu, 
  HeartPulse, 
  Activity, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Apple,
  Pill,
  Sparkles
} from 'lucide-react';
import { QANOON_MUFRAD_SYSTEM } from '../data/mockData';

export default function QanoonMufradAzaGuide() {
  const [selectedMizajId, setSelectedMizajId] = useState(QANOON_MUFRAD_SYSTEM[0].id);

  const activeSystem = QANOON_MUFRAD_SYSTEM.find(s => s.id === selectedMizajId) || QANOON_MUFRAD_SYSTEM[0];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 text-right">
        
        {/* Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1 rounded-full font-sans font-bold">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>نظریۂ صابر ملتانی رحمۃ اللہ علیہ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            قانون مفرد اعضاء و تشخیص نبض گائیڈ
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            انسانی جسم کے تین بنیادی اعضاء رئیسہ (دل، دماغ، جگر) اور 6 بنیادی تحریکات و مزاج کا آسان اور سائنسی فہم
          </p>
        </div>

        {/* 6 Mizaj Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {QANOON_MUFRAD_SYSTEM.map((sys) => {
            const isSelected = selectedMizajId === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => setSelectedMizajId(sys.id)}
                className={`p-3 rounded-2xl text-center transition-all border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-md font-bold scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold truncate">{sys.name}</div>
                <div className={`text-[11px] mt-1 truncate ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {sys.organ}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Mizaj Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full font-sans">
                تحریک نمبر: {QANOON_MUFRAD_SYSTEM.findIndex(s => s.id === activeSystem.id) + 1}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 pt-2">
                {activeSystem.name}
              </h2>
              <p className="text-sm text-emerald-800 font-medium">
                متاثرہ بافت و عضو: <strong>{activeSystem.organ}</strong> | اصل کیفیت: <strong>{activeSystem.mizaj}</strong>
              </p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-xs font-sans">
              نبض شناسی کے ذریعے اس کیفیت میں نبض انگلیوں پر چوڑی، سست یا تیز حرکت کرتی ہے۔
            </div>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Symptoms */}
            <div className="bg-red-50/60 border border-red-200/80 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-base">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>علامات و نقائص</span>
              </div>
              <p className="text-xs sm:text-sm text-red-950 leading-relaxed">
                {activeSystem.symptoms}
              </p>
            </div>

            {/* 2. Diet & Foods */}
            <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
                <Apple className="w-5 h-5 text-amber-600" />
                <span>مفید غذائیں و پرہیز</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                {activeSystem.diet}
              </p>
            </div>

            {/* 3. Herbal Prescriptions */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span>اصولِ علاج و ادویہ</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                {activeSystem.medicines}
              </p>
            </div>

          </div>

          {/* Educational Note */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>قانونِ شفا:</strong> قانون مفرد اعضاء میں 'علاج بالمثل' کے بجائے 'علاج بالضد' کا اصول اپنایا جاتا ہے۔ جس عضو میں تحریک اور سوزش ہو، اس کے مدمقابل عضو کو متحرک کر کے تسکین و شفا حاصل کی جاتی ہے۔
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
