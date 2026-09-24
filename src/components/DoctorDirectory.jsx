import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  Filter, 
  ChevronDown, 
  SlidersHorizontal, 
  Building2, 
  CheckCircle2, 
  X,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { CITIES, SPECIALTIES, DOCTORS, TREATMENT_TYPES } from '../data/mockData';

export default function DoctorDirectory({ 
  selectedCity, 
  setSelectedCity, 
  selectedSpecialty, 
  setSelectedSpecialty, 
  onSelectDoctor,
  theme,
  doctorsList,
  citiesList = CITIES,
  onOpenDoctorAuthModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [treatmentFilter, setTreatmentFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [maxFeeFilter, setMaxFeeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const isNavy = theme === 'navy';
  const allDoctors = doctorsList || DOCTORS;

  // Filter Doctors logic
  const filteredDoctors = (allDoctors || []).filter(doctor => {
    if (!doctor) return false;
    // Hide pending/unapproved doctors from the public directory
    if (doctor.isApproved === false || doctor.status === 'pending') return false;

    const selectedCityObj = (citiesList || CITIES).find(c => c && c.id === selectedCity);
    const selectedCityName = selectedCityObj ? selectedCityObj.name : selectedCity;

    const matchCity = selectedCity === 'all' || 
      doctor.city === selectedCity || 
      doctor.cityName === selectedCity ||
      doctor.cityName === selectedCityName ||
      (doctor.city && selectedCityObj && doctor.city === selectedCityObj.id);
    
    // Specialty match
    let matchSpecialty = true;
    if (selectedSpecialty !== 'all') {
      const specObj = SPECIALTIES.find(s => s && s.id === selectedSpecialty);
      if (specObj) {
        matchSpecialty = doctor.specialties && Array.isArray(doctor.specialties) && doctor.specialties.some(s => s && (s.includes(specObj.name) || specObj.name.includes(s)));
      }
    }

    // Treatment match
    const matchTreatment = treatmentFilter === 'all' || 
      (doctor.treatmentType && typeof doctor.treatmentType === 'string' && (
        doctor.treatmentType.includes(treatmentFilter) || 
        treatmentFilter.includes(doctor.treatmentType) ||
        (treatmentFilter.includes('قانون مفرد اعضاء') && (doctor.treatmentType.includes('مفرد اعضاء') || doctor.treatmentType.includes('پاکستانی'))) ||
        (treatmentFilter.includes('طب نبوی') && doctor.treatmentType.includes('نبوی')) ||
        (treatmentFilter.includes('حجامہ') && doctor.treatmentType.includes('حجامہ')) ||
        (treatmentFilter.includes('کائرو پریکٹس') && doctor.treatmentType.includes('کائرو'))
      ));

    // Search query
    const matchSearch = !searchTerm.trim() ||
      (doctor.name && typeof doctor.name === 'string' && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.clinicName && typeof doctor.clinicName === 'string' && doctor.clinicName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.address && typeof doctor.address === 'string' && doctor.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.specialties && Array.isArray(doctor.specialties) && doctor.specialties.some(s => s && typeof s === 'string' && s.toLowerCase().includes(searchTerm.toLowerCase())));

    // Experience
    const matchExperience = experienceFilter === 'all' || 
      (experienceFilter === '10' && Number(doctor.experience) >= 10) ||
      (experienceFilter === '20' && Number(doctor.experience) >= 20);

    // Fee
    const matchFee = maxFeeFilter === 'all' ||
      (maxFeeFilter === '500' && Number(doctor.fee) <= 500) ||
      (maxFeeFilter === '1000' && Number(doctor.fee) <= 1000);

    return matchCity && matchSpecialty && matchTreatment && matchSearch && matchExperience && matchFee;
  }).sort((a, b) => {
    if (sortBy === 'rating') return (b?.rating || 0) - (a?.rating || 0);
    if (sortBy === 'experience') return (b?.experience || 0) - (a?.experience || 0);
    if (sortBy === 'fee-low') return (a?.fee || 0) - (b?.fee || 0);
    return 0;
  });

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedSpecialty('all');
    setTreatmentFilter('all');
    setExperienceFilter('all');
    setMaxFeeFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumbs and Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-sans mb-1">
              <span>ہوم</span>
              <span>/</span>
              <span className={`${isNavy ? 'text-blue-700' : 'text-emerald-700'} font-bold`}>اطباء و حکماء ڈائریکٹری</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 font-heading">
              <Stethoscope className={`w-7 h-7 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
              <span>پاکستان کے مستند اطباء، حکماء اور ہربل ماہرین</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              نبض شناس اطباء، قانون مفرد اعضاء اور طب یونانی کے مستند کلینک سے فوری رابطہ کریں
            </p>
          </div>

          {/* Quick Stats / Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <span className={`${isNavy ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-800'} text-xs font-bold px-3 py-1.5 rounded-xl font-sans`}>
              دستیاب معالجین: {filteredDoctors.length}
            </span>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
            >
              <SlidersHorizontal className={`w-4 h-4 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
              <span>فلٹرز</span>
            </button>
          </div>
        </div>

        {/* Doctor Join / Signup Callout Banner */}
        {onOpenDoctorAuthModal && (
          <div className={`p-6 rounded-3xl ${isNavy ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-blue-800/50' : 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 border-emerald-800/50'} text-white border shadow-md flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="flex items-center gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-h2 text-white">
                  کیا آپ مستند طبیب یا حکیم ہیں؟
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  آج ہی طبیب پیڈیا پر اپنی مطب ڈائریکٹری مفت بنائیں اور ہزاروں مریضوں سے براہ راست واٹس ایپ پر جڑیں۔
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenDoctorAuthModal('signup')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all font-simple shrink-0 active:scale-95"
            >
              بطور طبیب شامل ہوں (Join Portal)
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Doctor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 font-heading">
                <SlidersHorizontal className={`w-4 h-4 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                <span>سرچ اور فلٹرز</span>
              </div>
              <button
                onClick={resetFilters}
                className={`text-xs ${isNavy ? 'text-blue-600 hover:text-blue-800' : 'text-emerald-600 hover:text-emerald-800'} font-bold`}
              >
                سب ختم کریں
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block font-heading">طبیب یا کلینک کا نام</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="نام لکھیں..."
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs ${isNavy ? 'focus:ring-2 focus:ring-blue-500' : 'focus:ring-2 focus:ring-emerald-500'} focus:bg-white focus:outline-none`}
                />
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block font-heading">شہر منتخب کریں</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs ${isNavy ? 'focus:ring-2 focus:ring-blue-500' : 'focus:ring-2 focus:ring-emerald-500'} focus:bg-white focus:outline-none cursor-pointer font-body font-semibold`}
              >
                {(citiesList || CITIES).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block font-heading">تخصص یا بیماری</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs ${isNavy ? 'focus:ring-2 focus:ring-blue-500' : 'focus:ring-2 focus:ring-emerald-500'} focus:bg-white focus:outline-none cursor-pointer font-body font-semibold`}
              >
                {SPECIALTIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Treatment Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block font-heading">طریقہ علاج</label>
              <div className="space-y-1.5 text-xs text-slate-600">
                {[
                  { id: 'all', label: 'تمام طریقہ علاج' },
                  { id: 'طب پاکستانی (قانون مفرد اعضاء)', label: 'طب پاکستانی (قانون مفرد اعضاء)' },
                  { id: 'طب یونانی', label: 'طب یونانی' },
                  { id: 'طب نبوی', label: 'طب نبوی' },
                  { id: 'حجامہ', label: 'حجامہ' },
                  { id: 'کائرو پریکٹس', label: 'کائرو پریکٹس' },
                ].map(t => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                    <input
                      type="radio"
                      name="treatment"
                      checked={treatmentFilter === t.id}
                      onChange={() => setTreatmentFilter(t.id)}
                      className={`${isNavy ? 'text-blue-600 focus:ring-blue-500' : 'text-emerald-600 focus:ring-emerald-500'}`}
                    />
                    <span className="font-medium">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block font-heading">کم از کم تجربہ</label>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer font-body"
              >
                <option value="all">تمام تجربات</option>
                <option value="10">10 سال یا اس سے زیادہ</option>
                <option value="20">20 سال یا اس سے زیادہ</option>
              </select>
            </div>

            {/* Fee Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block font-heading">مشاورت فیس</label>
              <select
                value={maxFeeFilter}
                onChange={(e) => setMaxFeeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer font-body"
              >
                <option value="all">تمام فیسز</option>
                <option value="500">500 روپے یا کم</option>
                <option value="1000">1000 روپے یا کم</option>
              </select>
            </div>

          </div>

          {/* Right Area: Doctor Cards Listing */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Sorting bar */}
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-600 font-sans">
                دستیاب نتائج: <strong className="text-slate-900">{filteredDoctors.length}</strong> اطباء
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">ترتیب دیں:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="rating">اعلی درجہ بندی (Rating)</option>
                  <option value="experience">زیادہ تجربہ</option>
                  <option value="fee-low">کم فیس</option>
                </select>
              </div>
            </div>

            {/* Doctor Card List */}
            {filteredDoctors.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
                <div className={`w-16 h-16 ${isNavy ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'} rounded-full flex items-center justify-center mx-auto`}>
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-heading">آپ کے منتخب کردہ فلٹرز پر کوئی طبیب نہیں ملا</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  براہ کرم شہر، تخصص یا سرچ کی ورڈز تبدیل کر کے دوبارہ کوشش کریں۔
                </p>
                <button
                  onClick={resetFilters}
                  className={`${isNavy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm font-heading`}
                >
                  تمام فلٹرز ختم کریں
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className={`bg-white rounded-3xl border border-slate-200/90 ${isNavy ? 'hover:border-blue-500/40' : 'hover:border-emerald-500/40'} p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 relative group`}
                  >
                    {/* Featured Tag */}
                    {doctor.isFeatured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>نمایاں طبیب</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      
                      {/* Doctor Image & Badges */}
                      <div className="relative shrink-0 mx-auto sm:mx-0">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                        />
                        {doctor.isVerified && (
                          <div 
                            className="absolute -bottom-2 right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-sans font-bold"
                            title="پاکستان ہربل میڈیکل بورڈ سے تصدیق شدہ"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>مصدقہ</span>
                          </div>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 space-y-3 text-right">
                        <div>
                          <h3 
                            onClick={() => onSelectDoctor(doctor)}
                            className={`text-lg sm:text-xl font-bold text-slate-900 ${isNavy ? 'hover:text-blue-700' : 'hover:text-emerald-700'} cursor-pointer transition-colors font-heading`}
                          >
                            {doctor.name}
                          </h3>
                          
                          <p className={`text-xs sm:text-sm ${isNavy ? 'text-blue-800' : 'text-emerald-800'} font-semibold mt-0.5`}>
                            {doctor.title}
                          </p>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                            {doctor.qualifications}
                          </p>
                        </div>

                        {/* Experience, Rating, City Pills */}
                        <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-slate-600">
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span className="font-bold">{doctor.rating}</span>
                            <span className="text-slate-500 text-[11px]">({doctor.reviewsCount} آراء)</span>
                          </div>

                          <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            <Award className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                            <span className="font-medium">{doctor.experience} سالہ تجربہ</span>
                          </div>

                          <div className={`flex items-center gap-1 ${isNavy ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'} px-2 py-0.5 rounded-md`}>
                            <MapPin className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                            <span className="font-medium">{doctor.cityName}</span>
                          </div>
                        </div>

                        {/* Clinic & Timing */}
                        <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                          <div className="flex items-center gap-2">
                            <Building2 className={`w-3.5 h-3.5 ${isNavy ? 'text-blue-600' : 'text-emerald-600'} shrink-0`} />
                            <span className="font-bold text-slate-900">{doctor.clinicName}:</span>
                            <span className="text-slate-600 truncate">{doctor.address}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-slate-500 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{doctor.timing}</span>
                            </div>
                            <div className={`font-sans font-bold ${isNavy ? 'text-blue-900' : 'text-emerald-800'} text-xs`}>
                              مشاورت فیس: {doctor.fee} روپے
                            </div>
                          </div>
                        </div>

                        {/* Specialties Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {doctor.specialties.map((spec, idx) => (
                            <span
                              key={idx}
                              className={`text-[11px] bg-slate-100 ${isNavy ? 'hover:bg-blue-50 hover:text-blue-900' : 'hover:bg-emerald-50 hover:text-emerald-800'} text-slate-700 px-2.5 py-1 rounded-lg transition-colors font-medium`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Action CTA Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
                          <button
                            onClick={() => onSelectDoctor(doctor)}
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all font-heading"
                          >
                            تفصیلات و اوقات دیکھیں
                          </button>

                          <a
                            href={`tel:${doctor.phone}`}
                            className={`flex items-center gap-1.5 text-xs font-bold ${isNavy ? 'text-blue-900 bg-blue-50 hover:bg-blue-100 border-blue-200' : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'} px-3.5 py-2.5 rounded-xl border transition-all font-heading`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>کال کریں</span>
                          </a>

                          <a
                            href={`https://wa.me/${doctor.whatsapp}?text=${encodeURIComponent(`السلام علیکم حکیم صاحب، میں نے طبیب پیڈیا پر آپ کا پروفائل دیکھا اور مشاورت چاہتا ہوں۔`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-1.5 text-xs font-bold text-white ${isNavy ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-700/20' : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-700/20'} px-4 py-2.5 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-98 font-heading`}
                          >
                            <MessageCircle className="w-4 h-4 text-white" />
                            <span>واٹس ایپ پر فوری رابطہ</span>
                          </a>
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 font-heading">فلٹرز</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 font-heading">شہر</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  {(citiesList || CITIES).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 font-heading">تخصص</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className={`flex-1 ${isNavy ? 'bg-blue-600' : 'bg-emerald-600'} text-white font-bold py-2.5 rounded-xl text-xs font-heading`}
              >
                نتائج دیکھیں
              </button>
              <button
                onClick={resetFilters}
                className="px-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-medium"
              >
                ری سیٹ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
