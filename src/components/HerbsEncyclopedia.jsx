import React, { useState } from 'react';
import { 
  Leaf, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  Heart, 
  CheckCircle2, 
  Flame, 
  Snowflake, 
  Sun,
  Droplets
} from 'lucide-react';
import { HERBS_DATA } from '../data/mockData';

export default function HerbsEncyclopedia({ onSelectArticleByHerb }) {
  const [search, setSearch] = useState('');
  const [selectedMizaj, setSelectedMizaj] = useState('all');
  const [activeHerb, setActiveHerb] = useState(null);

  const filteredHerbs = HERBS_DATA.filter(herb => {
    const matchSearch = !search.trim() ||
      herb.name.toLowerCase().includes(search.toLowerCase()) ||
      herb.botanicalName.toLowerCase().includes(search.toLowerCase()) ||
      herb.category.toLowerCase().includes(search.toLowerCase());

    const matchMizaj = selectedMizaj === 'all' || herb.mizaj.includes(selectedMizaj);

    return matchSearch && matchMizaj;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 text-right">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1 rounded-full font-sans font-bold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>نباتاتی خزانہ و طبی جڑی بوٹیاں</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            جڑی بوٹیوں کی جامع انسائیکلوپیڈیا (Herbal Encyclopedia)
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            قرآنی نباتات، طب نبوی اور طب یونانی کی نادر و نایاب جڑی بوٹیوں کے مزاج، خواص، فوائد اور درست مقدارِ خوراک
          </p>
        </div>

        {/* Search & Mizaj Filters */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Mizaj Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 ml-2">مزاج کے لحاظ سے:</span>
            {[
              { id: 'all', label: 'تمام مزاج' },
              { id: 'گرم', label: 'گرم مزاج ادویہ', icon: Flame },
              { id: 'سرد', label: 'سرد مزاج ادویہ', icon: Snowflake },
              { id: 'خشک', label: 'خشک ادویہ' },
              { id: 'تر', label: 'تر ادویہ', icon: Droplets },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMizaj(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedMizaj === m.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جڑی بوٹی یا نباتاتی نام لکھیں..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

        </div>

        {/* Herbs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHerbs.map(herb => (
            <div
              key={herb.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={herb.image}
                    alt={herb.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-emerald-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    مزاج: {herb.mizaj}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {herb.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans italic mt-0.5">
                      {herb.botanicalName}
                    </p>
                  </div>

                  <p className="text-xs text-emerald-800 font-medium bg-emerald-50/80 p-2 rounded-xl">
                    {herb.category}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {herb.shortDesc}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 block">بنیادی فوائد:</span>
                    {herb.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Dosage Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">مقدارِ خوراک:</span>
                <span className="font-bold text-emerald-800 font-sans">{herb.dose}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
