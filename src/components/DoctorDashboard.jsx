import React, { useState, useRef } from 'react';
import { 
  User, 
  Lock, Stethoscope, 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Award, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Save, 
  Eye, 
  LogOut, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Users, 
  TrendingUp, 
  Activity, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Share2,
  Calendar,
  Check,
  ExternalLink,
  ChevronLeft,
  X
} from 'lucide-react';
import { CITIES, SPECIALTIES, TREATMENT_TYPES } from '../data/mockData';
import CityCombobox from './CityCombobox';

export default function DoctorDashboard({ 
  doctor, 
  onUpdateDoctor, 
  onLogout, 
  onBackToWebsite, 
  onViewPublicProfile,
  onOpenArticleEditor,
  articlesList = [],
  citiesList = CITIES,
  onAddCity,
  theme
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'inquiries', 'articles', 'stats'
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const safeCitiesList = (citiesList && Array.isArray(citiesList) && citiesList.length > 0) ? citiesList : CITIES;

  // Profile Form State initialized from logged-in doctor
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    password: doctor?.password || 'password123',
    title: doctor?.title || 'ماہر نباض، موروثی معالج طب یونانی',
    qualifications: doctor?.qualifications || 'فاضل طب والجراحت (FTJ)',
    councilRegNo: doctor?.councilRegNo || 'NCT-78642',
    experience: doctor?.experience || 10,
    fee: doctor?.fee || 500,
    city: doctor?.city || 'lahore',
    cityName: doctor?.cityName || (safeCitiesList.find(c => c && c.id === doctor?.city)?.name) || doctor?.city || 'لاہور',
    treatmentType: doctor?.treatmentType || 'طب یونانی',
    clinicName: doctor?.clinicName || '',
    address: doctor?.address || '',
    timing: doctor?.timing || 'روزانہ: شام 4:00 تا رات 9:00 (اتوار چھٹی)',
    phone: doctor?.phone || '',
    whatsapp: doctor?.whatsapp || '',
    image: doctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: doctor?.about || '',
    specialties: (doctor?.specialties && Array.isArray(doctor.specialties) && doctor.specialties.length > 0) ? doctor.specialties : ['امراض معدہ، گیس و تبخیر'],
    services: (doctor?.services && Array.isArray(doctor.services) && doctor.services.length > 0) ? doctor.services : ['نبض کی 6 اقسام سے مزاج کی تشخیص', 'معدے اور جگر کی اصلاح', 'قدرتی ہربل نسخہ جات'],
  });

  // Services input helper
  const [newServiceInput, setNewServiceInput] = useState('');

  // Sample Patient Leads & Consultation Requests
  const [inquiriesList, setInquiriesList] = useState([
    {
      id: 1,
      patientName: 'محمد عثمان',
      patientCity: 'لاہور',
      phone: '03009876543',
      ailment: 'معدے میں شدید جلن، گیس اور تبخیر کا مسئلہ ہے، کیا کوئی مستقل ہربل علاج ہے؟',
      date: 'آج 02:45 PM',
      status: 'نیا پیغام'
    },
    {
      id: 2,
      patientName: 'عبداللہ طارق',
      patientCity: 'راولپنڈی',
      phone: '03215554321',
      ailment: 'جوڑوں اور پٹھوں میں درد رہتا ہے، نبض کا معائنہ اور قہوہ کا مشورہ درکار ہے۔',
      date: 'کل شام',
      status: 'رابطہ مکمل'
    },
    {
      id: 3,
      patientName: 'فاطمہ بی بی',
      patientCity: 'فیصل آباد',
      phone: '03021112233',
      ailment: 'فیٹی لیور اور یرقان کی رپورٹ آئی ہے، ہربل نسخہ تجویز فرمائیں۔',
      date: '2 دن پہلے',
      status: 'رابطہ مکمل'
    }
  ]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const isNavy = theme === 'navy';

  // Handle Photo Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData(prev => ({ ...prev, image: uploadEvent.target.result }));
        showNotification('پروفائل تصویر کامیابی سے لوڈ ہو گئی');
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom Specialty input & notice state
  const [customSpecialtyInput, setCustomSpecialtyInput] = useState('');
  const [specialtyNotice, setSpecialtyNotice] = useState('');

  // Toggle Specialty (Max 3)
  const toggleSpecialty = (specName) => {
    setSpecialtyNotice('');
    setFormData(prev => {
      const exists = prev.specialties.includes(specName);
      if (exists) {
        return { ...prev, specialties: prev.specialties.filter(s => s !== specName) };
      } else {
        if (prev.specialties.length >= 3) {
          setSpecialtyNotice('آپ ایک وقت میں زیادہ سے زیادہ 3 امراض منتخب کر سکتے ہیں۔');
          return prev;
        }
        return { ...prev, specialties: [...prev.specialties, specName] };
      }
    });
  };

  // Add Custom Specialty / Disease
  const handleAddCustomSpecialty = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSpecialtyInput.trim();
    if (!trimmed) return;
    setSpecialtyNotice('');

    if (formData.specialties.length >= 3) {
      setSpecialtyNotice('زیادہ سے زیادہ 3 امراض منتخب ہو سکتے ہیں۔ نیا مرض شامل کرنے کے لیے پہلے کسی ایک کو ہٹائیں۔');
      return;
    }

    if (formData.specialties.includes(trimmed)) {
      setSpecialtyNotice('یہ مرض پہلے سے منتخب شدہ ہے۔');
      return;
    }

    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, trimmed]
    }));
    setCustomSpecialtyInput('');
  };

  // Remove Specialty
  const handleRemoveSpecialty = (specToRemove) => {
    setSpecialtyNotice('');
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specToRemove)
    }));
  };

  // Add Service tag
  const handleAddService = () => {
    if (!newServiceInput.trim()) return;
    if (!formData.services.includes(newServiceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newServiceInput.trim()]
      }));
    }
    setNewServiceInput('');
  };

  // Remove Service tag
  const handleRemoveService = (serviceToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove)
    }));
  };

  // Save Profile Form
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    
    let finalCityName = formData.cityName || '';
    let finalCityId = formData.city || '';

    if (!finalCityName) {
      const cObj = (citiesList || CITIES).find(c => c.id === finalCityId);
      finalCityName = cObj ? cObj.name : finalCityId || 'لاہور';
    }

    if (finalCityName && onAddCity) {
      const registeredCity = onAddCity(finalCityName);
      if (registeredCity) {
        finalCityId = registeredCity.id;
        finalCityName = registeredCity.name;
      }
    }

    const updatedDoctor = {
      ...doctor,
      ...formData,
      city: finalCityId,
      cityName: finalCityName,
      experience: Number(formData.experience) || 1,
      fee: Number(formData.fee) || 0
    };

    onUpdateDoctor(updatedDoctor);
    showNotification('طبیب پروفائل اور مطب کی تمام ترتیبات کامیابی کے ساتھ محفوظ ہو گئیں!');
  };

  // Filter doctor's own published articles
  const doctorArticles = articlesList.filter(a => 
    (a.author && doctor?.name && a.author.includes(doctor.name.replace('حکیم', '').replace('ڈاکٹر', '').trim())) ||
    (doctor?.id && a.authorId === doctor.id)
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 text-right font-nastaliq pb-16">
      
      {/* Top Bar Banner */}
      <header className={`${isNavy ? 'bg-gradient-to-r from-[#0b1d3a] via-[#0f2952] to-[#1e3a8a]' : 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900'} text-white shadow-lg border-b border-white/10 sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Doctor Info & Welcome */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={formData.image} 
                  alt={formData.name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-md bg-white"
                />
                <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="آن لائن فعال" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold font-h2 text-white">
                    {formData.name || 'محترم حکیم صاحب'}
                  </h1>
                  {doctor?.isApproved !== false && doctor?.status !== 'pending' ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>تصدیق شدہ طبیب (Active)</span>
                    </span>
                  ) : (
                    <span className="bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] px-2.5 py-0.5 rounded-full font-sans font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>زیرِ جائزہ (Pending Approval)</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  {formData.clinicName} • {formData.cityName} ({formData.treatmentType})
                </p>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-2 font-simple text-xs">
              
              <button
                type="button"
                onClick={() => onViewPublicProfile(doctor)}
                className="flex items-center gap-1 px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl border border-white/20 transition-all font-bold shadow-xs"
                title="ڈائریکٹری میں لائیو پروفائل دیکھیں"
              >
                <Eye className="w-4 h-4 text-blue-300" />
                <span>پبلک پروفائل دیکھیں</span>
              </button>

              <button
                type="button"
                onClick={onBackToWebsite}
                className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition-all font-bold shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ویب سائٹ پر جائیں</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition-all font-bold shadow-xs"
                title="ڈیش بورڈ سے لاگ آؤٹ کریں"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">لاگ آؤٹ</span>
              </button>

            </div>

          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto border-t border-white/10 pt-2 pb-0.5 font-simple text-xs scrollbar-none">
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 ${
                activeTab === 'profile'
                  ? 'bg-slate-100 text-slate-900 border-amber-400 shadow-sm'
                  : 'text-slate-300 hover:text-white border-transparent'
              }`}
            >
              <Edit3 className="w-4 h-4 text-blue-400" />
              <span>پروفائل و مطب ترتیبات (Settings)</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 ${
                activeTab === 'inquiries'
                  ? 'bg-slate-100 text-slate-900 border-amber-400 shadow-sm'
                  : 'text-slate-300 hover:text-white border-transparent'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>مریضوں کے پیغامات و مشاورت ({inquiriesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 ${
                activeTab === 'articles'
                  ? 'bg-slate-100 text-slate-900 border-amber-400 shadow-sm'
                  : 'text-slate-300 hover:text-white border-transparent'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>میرے طبی مضامین و نسخہ جات</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 ${
                activeTab === 'stats'
                  ? 'bg-slate-100 text-slate-900 border-amber-400 shadow-sm'
                  : 'text-slate-300 hover:text-white border-transparent'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>کارکردگی و شماریات</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Pending Approval Notice Banner */}
        {(doctor?.isApproved === false || doctor?.status === 'pending') && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-400/80 rounded-3xl p-5 shadow-sm space-y-2 text-right">
            <div className="flex items-center gap-2 text-amber-900 font-bold font-h2 text-sm sm:text-base">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <span>آپ کا طبیب اکاؤنٹ کامیابی سے بن چکا ہے اور اس وقت ایڈمن منظوری (Admin Approval) کا منتظر ہے</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-simple">
              آپ کی ای میل تصدیق مکمل ہو چکی ہے۔ ایڈمن کے جائزے اور منظوری کے بعد آپ کی پروفائل خود بخود ویب سائٹ اور پبلک ڈاکٹر ڈائریکٹری میں لائیو پبلش ہو جائے گی۔ تب تک آپ یہاں سے اپنے کلینک کی ترتیبات، فیس، اور اوقات کار کو اپ ڈیٹ کر سکتے ہیں۔
            </p>
          </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-emerald-500/50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* 4 Quick Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-sans font-bold block">پروفائل مشاہدات</span>
              <span className="text-2xl font-bold text-slate-900 font-sans mt-1 block">
                {doctor.reviewsCount * 14 + 180}
              </span>
              <span className="text-[10px] text-emerald-600 font-sans">↑ 18% اس مہینے</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-sans font-bold block">واٹس ایپ مریض رابطے</span>
              <span className="text-2xl font-bold text-slate-900 font-sans mt-1 block">
                {inquiriesList.length + 12}
              </span>
              <span className="text-[10px] text-emerald-600 font-sans">براہ راست استفسارات</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-sans font-bold block">مریضوں کا اعتماد و ریٹنگ</span>
              <div className="flex items-center gap-1 text-2xl font-bold text-amber-500 font-sans mt-1">
                <span>{doctor.rating || 5.0}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-sans">({doctor.reviewsCount || 45} مصدقہ آراء)</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-sans font-bold block">شائع شدہ مضامین</span>
              <span className="text-2xl font-bold text-slate-900 font-sans mt-1 block">
                {doctorArticles.length || 1}
              </span>
              <span className="text-[10px] text-blue-600 font-sans">طبیب پیڈیا آرٹیکلز</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* TAB 1: PROFILE & CLINIC SETTINGS FORM */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-8">
            
            {/* 1. Doctor Avatar & Main Identity */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-h2">
                    طبیب کی ذاتی معلومات و تصویر
                  </h3>
                  <p className="text-xs text-slate-500">
                    یہ معلومات مریضوں کو ڈائریکٹری اور سرچ نتائج میں نظر آئیں گی۔
                  </p>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm font-simple self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>تبدیلیاں محفوظ کریں</span>
                </button>
              </div>

              {/* Avatar Upload Row */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <img
                  src={formData.image}
                  alt={formData.name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-500 shadow-md bg-white shrink-0"
                />
                <div className="space-y-2 text-center sm:text-right flex-1">
                  <span className="text-xs font-bold text-slate-800 block font-simple">
                    پروفائل تصویر تبدیل کریں
                  </span>
                  <p className="text-[11px] text-slate-500">
                    اپنی واضح، پروفیشنل تصویر یا مطب کا لوگو لگائیں (PNG, JPG, JPEG)
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 font-simple">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>کمپیوٹر / موبائل سے تصویر چنیں</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    طبیب کا نام بمعہ لقب: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    اعزازی ٹائٹل / تخصص:
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: ماہر نباض و موروثی معالج"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    تعلیمی اسناد و ڈگری (Qualifications):
                  </label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="فاضل طب والجراحت (FTJ)، BEMS"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    کونسل رجسٹریشن نمبر:
                  </label>
                  <input
                    type="text"
                    value={formData.councilRegNo}
                    onChange={(e) => setFormData({ ...formData, councilRegNo: e.target.value })}
                    placeholder="NCT-12345"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    طریقہ علاج (Method):
                  </label>
                  <select
                    value={formData.treatmentType}
                    onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    {TREATMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    کلینکل تجربہ (سال):
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    مشورہ فیس (PKR):
                  </label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>

            </div>

            {/* 2. Clinic / Matab & Contact Information */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-h2">
                  مطب، کلینک و رابطہ کی تفصیلات
                </h3>
                <p className="text-xs text-slate-500">
                  واٹس ایپ نمبر کے ذریعے مریض ایک کلک پر آپ سے فوری مشورہ طلب کر سکیں گے۔
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    مطب / کلینک کا نام: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      placeholder="مثال: المحمود ہربل شفا خانہ"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple flex items-center justify-between">
                    <span>شہر (City): <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">ٹائپ کریں یا چنیں</span>
                  </label>
                  <CityCombobox
                    value={formData.city}
                    cityName={formData.cityName}
                    citiesList={citiesList}
                    onAddNewCity={onAddCity}
                    theme={theme}
                    required={true}
                    onChange={({ id, name }) => setFormData(prev => ({ ...prev, city: id, cityName: name }))}
                    placeholder="شہر تلاش کریں یا نیا لکھیں..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    واٹس ایپ نمبر (براہ راست رابطہ): <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="923001234567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    مطب کا مکمل پتہ (Full Address):
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="مثال: اقبال ٹاؤن، مین مارکیٹ، نزد چن ون، لاہور"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    اوقات مطب و تعطیل (Timings & Off Day):
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    <input
                      type="text"
                      value={formData.timing}
                      onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                      placeholder="پیر تا ہفتہ: شام 4:00 تا رات 9:00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Account Password Field */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold font-simple text-sm">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>اکاؤنٹ سیکیورٹی و لاگ ان پاسورڈ (Change Password):</span>
                  </div>
                  <div className="max-w-md">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                      اپنا نیا پاسورڈ درج کریں (Password):
                    </label>
                    <input
                      type="text"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="نیا لاگ ان پاسورڈ درج کریں..."
                      className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans font-bold"
                      dir="ltr"
                    />
                    <p className="text-[10px] text-slate-500 mt-1 font-simple">
                      طبیب ڈیش بورڈ میں دوبارہ لاگ ان کرنے کے لیے یہ پاسورڈ استعمال ہوگا۔
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Specialties & Services */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-h2">
                  خصوصی امراض، تخصصات و خدمات (Specialties & Services)
                </h3>
                <p className="text-xs text-slate-500">
                  ان شعبہ جات کو منتخب کریں جن کے امراض میں آپ کو خصوصی مہارت حاصل ہے۔
                </p>
              </div>

              {/* Specialties Multi-select */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 font-simple">
                    منتخب تخصصات و امراض: <span className="text-[10px] text-slate-400 font-normal">(زیادہ سے زیادہ 3 امراض منتخب کریں)</span>
                  </label>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-sans ${
                    formData.specialties.length === 3 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {formData.specialties.length} / 3 منتخب شدہ
                  </span>
                </div>

                {/* Warning Notice if limit reached */}
                {specialtyNotice && (
                  <div className="text-[11px] bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2 rounded-xl animate-in fade-in">
                    ⚠️ {specialtyNotice}
                  </div>
                )}

                {/* Currently Selected Specialties Chips */}
                {formData.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2.5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                    <span className="text-xs text-slate-500 font-bold self-center ml-1">فعال امراض:</span>
                    {formData.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs animate-in zoom-in-95"
                      >
                        <span>{spec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(spec)}
                          className="hover:bg-blue-700 rounded-full p-0.5 text-white/80 hover:text-white transition-colors"
                          title="ہٹائیں"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Predefined Specialties Buttons */}
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl max-h-40 overflow-y-auto">
                  {SPECIALTIES.filter(s => s.id !== 'all').map((spec) => {
                    const isSelected = formData.specialties.includes(spec.name);
                    const isMaxReached = formData.specialties.length >= 3 && !isSelected;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => toggleSpecialty(spec.name)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : isMaxReached
                              ? 'bg-white text-slate-400 border border-slate-100 opacity-60'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{spec.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Disease / Specialty Write-in Input */}
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        maxLength={35}
                        value={customSpecialtyInput}
                        onChange={(e) => setCustomSpecialtyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSpecialty();
                          }
                        }}
                        placeholder="لسٹ میں مرض نہیں ہے؟ مختصر نام خود لکھیں (زیادہ سے زیادہ 35 حروف)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-3.5 pl-14 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                      <span className="absolute left-3 top-2.5 text-[10px] text-slate-400 font-sans pointer-events-none">
                        {customSpecialtyInput.length}/35
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCustomSpecialty}
                      disabled={!customSpecialtyInput.trim() || formData.specialties.length >= 3}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>شامل کریں</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Custom Services List */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 font-simple">
                  پیش کردہ خدمات و کلینکل سہولیات (Services Offered):
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newServiceInput}
                    onChange={(e) => setNewServiceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                    placeholder="مثال: نبض شناسی، مفت آن لائن واٹس ایپ رہنمائی..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 font-simple"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>شامل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.services || []).map((serv, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1 rounded-xl text-xs font-medium"
                    >
                      <span>✓ {serv}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(serv)}
                        className="text-emerald-700 hover:text-red-600 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* About & Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                  طبیب کا تفصیلی تعارف و فلسفہ علاج (About & Bio):
                </label>
                <textarea
                  rows={4}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="اپنے تجربے، مطب کی تاریخ اور طریقہ علاج کی تفصیل تحریر فرمائیں..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

            </div>

            {/* Bottom Sticky Save Bar */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
              <span className="text-xs text-slate-300 font-simple">
                تبدیلیاں محفوظ کرنے پر ڈائریکٹری میں آپ کا ڈیٹا فوری اپڈیٹ ہو جائے گا۔
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md font-simple active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>تمام ترتیبات محفوظ کریں (Save All)</span>
              </button>
            </div>

          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PATIENT INQUIRIES & CONSULTATION REQUESTS */}
        {/* ========================================================= */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-h2">
                  مریضوں کے پیغامات و آن لائن مشاورت
                </h3>
                <p className="text-xs text-slate-500">
                  طبیب پیڈیا پورٹل کے ذریعے موصول ہونے والی مریضوں کی درخواستیں:
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold font-sans">
                کل درخواستیں: {inquiriesList.length}
              </span>
            </div>

            <div className="space-y-4">
              {inquiriesList.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 font-h2">{inq.patientName}</span>
                      <span className="text-xs text-slate-400 font-sans">({inq.patientCity})</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-sans font-bold">
                        {inq.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans">{inq.date}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>مرض کی تفصیل:</strong> {inq.ailment}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <span className="text-xs text-slate-500 font-sans">فون: {inq.phone}</span>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام علیکم ${inq.patientName}، میں ${formData.name} طبیب پیڈیا سے آپ کے پیغام کے جواب میں رابطہ کر رہا ہوں۔`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs font-simple"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>واٹس ایپ پر فوری جواب دیں</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DOCTOR'S ARTICLES & PUBLICATIONS */}
        {/* ========================================================= */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-h2">
                  طبی تحقیقات، مضامین اور مجرب نسخہ جات
                </h3>
                <p className="text-xs text-slate-500">
                  آپ کے نام سے طبیب پیڈیا بلاگ پر شائع ہونے والے تحقیقی مضامین:
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenArticleEditor}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs font-simple"
              >
                <Plus className="w-4 h-4" />
                <span>نیا طبی مضمون تحریر کریں</span>
              </button>
            </div>

            {doctorArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctorArticles.map((art) => (
                  <div
                    key={art.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden p-4 flex gap-4 bg-slate-50 hover:bg-white transition-all shadow-2xs"
                  >
                    <img src={art.featuredImage} alt={art.title} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold">
                        {art.categoryName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{art.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-sans pt-1">
                        <span>{art.views || 1} مشاہدات</span>
                        <span>•</span>
                        <span>{art.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">ابھی تک کوئی مضمون شائع نہیں کیا گیا</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  اپنے نام سے طبی مضامین لکھ کر ہزاروں مریضوں تک اپنی طبی مہارت پہنچائیں۔
                </p>
                <button
                  type="button"
                  onClick={onOpenArticleEditor}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl font-simple"
                >
                  پہلا مضمون لکھیں
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: STATS & ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-h2 border-b border-slate-100 pb-3">
                طبیب پیڈیا ڈائریکٹری پر ماہانہ رسائی و اثر
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                  <span className="text-xs text-blue-900 font-bold block font-simple">تلاش کے نتائج میں نمائش (Impressions)</span>
                  <span className="text-3xl font-bold text-blue-950 font-sans block">1,840</span>
                  <p className="text-[11px] text-blue-700">جب مریضوں نے آپ کے شہر یا مرض کو سرچ کیا</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                  <span className="text-xs text-emerald-900 font-bold block font-simple">مکمل پروفائل کلکس (Clicks)</span>
                  <span className="text-3xl font-bold text-emerald-950 font-sans block">420</span>
                  <p className="text-[11px] text-emerald-700">مریضوں نے آپ کے مطب کی تفصیلات دیکھیں</p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
                  <span className="text-xs text-amber-900 font-bold block font-simple">واٹس ایپ کال و رابطے</span>
                  <span className="text-3xl font-bold text-amber-950 font-sans block">86</span>
                  <p className="text-[11px] text-amber-700">مریضوں نے براہ راست نسخہ یا وقت لیا</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
