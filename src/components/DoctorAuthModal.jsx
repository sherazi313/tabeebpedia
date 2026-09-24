import React, { useState, useEffect } from 'react';
import { 
  X, 
  Stethoscope, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  LogIn,
  UserPlus,
  Clock,
  AlertCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import { CITIES, SPECIALTIES, TREATMENT_TYPES, DOCTORS } from '../data/mockData';
import CityCombobox from './CityCombobox';

export default function DoctorAuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  onRegisterDoctor,
  doctorsList = DOCTORS, 
  citiesList = CITIES,
  onAddCity,
  initialMode = 'login',
  theme
}) {
  const [authMode, setAuthMode] = useState(initialMode || 'login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login Form State
  const [forgotForm, setForgotForm] = useState({ identifier: '' });
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [loginForm, setLoginForm] = useState({
    identifier: 'tariq.hakeem@tabeebpedia.com', // email or whatsapp
    password: 'password123'
  });

  // Signup Form & Flow State
  const [signupStep, setSignupStep] = useState('form'); // 'form' | 'submitted'
  const [registeredDoctorData, setRegisteredDoctorData] = useState(null);

  // Custom Specialty input & notice state
  const [customSpecialtyInput, setCustomSpecialtyInput] = useState('');
  const [specialtyNotice, setSpecialtyNotice] = useState('');

  // Signup Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    title: 'ماہر نباض و معالج طب یونانی',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    phone: '',
    city: 'lahore',
    cityName: 'لاہور',
    treatmentType: 'طب یونانی',
    qualifications: 'فاضل طب والجراحت (FTJ)',
    councilRegNo: '',
    clinicName: '',
    address: '',
    timing: 'روزانہ: شام 4:00 تا رات 9:00 (اتوار چھٹی)',
    fee: 500,
    experience: 5,
    specialties: ['امراض معدہ، گیس و تبخیر'],
    about: 'طب یونانی اور ہربل طریقہ علاج کے ذریعے مریضوں کی خدمت۔',
    agreedToTerms: true
  });

  const safeDoctors = (doctorsList && Array.isArray(doctorsList) && doctorsList.length > 0) ? doctorsList : DOCTORS;

  // Sync mode and reset errors whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode || 'login');
      setSignupStep('form');
      setErrorMessage('');
      setSuccessMessage('');
      setRegisteredDoctorData(null);
    }
  }, [isOpen, initialMode]);

  // Handle Doctor Login
  
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const identifier = forgotForm.identifier.trim();
    if (!identifier) {
      setErrorMessage('براہ کرم اپنا ای میل یا واٹس ایپ نمبر درج کریں۔');
      return;
    }
    
    // Save request to localStorage so AdminCMS can read it
    try {
      const existingReqs = JSON.parse(localStorage.getItem('tabeeb_password_requests') || '[]');
      existingReqs.push({
        id: Date.now().toString(),
        identifier,
        date: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('tabeeb_password_requests', JSON.stringify(existingReqs));
    } catch(err) {}

    setForgotSubmitted(true);
  };


  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const identifier = loginForm.identifier.trim().toLowerCase();
    const password = loginForm.password.trim();

    if (!identifier || !password) {
      setErrorMessage('براہ کرم ای میل/واٹس ایپ اور پاس ورڈ درج کریں');
      return;
    }

    // Find doctor by email, whatsapp, or slug
    const foundDoctor = safeDoctors.find(doc => {
      if (!doc) return false;
      const matchEmail = doc.email && doc.email.toLowerCase() === identifier;
      const matchPhone = (doc.whatsapp && doc.whatsapp.includes(identifier)) || (doc.phone && doc.phone.includes(identifier));
      const matchSlug = doc.slug && doc.slug.toLowerCase() === identifier;
      return matchEmail || matchPhone || matchSlug;
    });

    if (foundDoctor) {
      if (!foundDoctor.password || foundDoctor.password === password) {
        setSuccessMessage('لاگ ان کامیاب! ڈیش بورڈ کھولا جا رہا ہے...');
        setTimeout(() => {
          onLoginSuccess(foundDoctor);
          onClose();
        }, 500);
      } else {
        setErrorMessage('پاس ورڈ درست نہیں ہے۔ براہ کرم دوبارہ کوشش کریں');
      }
    } else {
      setErrorMessage('یہ اکاؤنٹ موجود نہیں ہے۔ نیا اکاؤنٹ رجسٹر کریں۔');
    }
  };

  

  // Submit Doctor Registration directly (Sent to Admin for Review & Approval)
  const handleDirectRegistration = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupForm.name.trim()) {
      setErrorMessage('براہ کرم اپنا پورا نام درج کریں');
      return;
    }
    if (!signupForm.email.trim() || !signupForm.email.includes('@')) {
      setErrorMessage('براہ کرم درست ای میل ایڈریس درج کریں');
      return;
    }
    if (!signupForm.clinicName.trim()) {
      setErrorMessage('براہ کرم مطب / کلینک کا نام درج کریں');
      return;
    }
    if (!signupForm.password || signupForm.password.length < 6) {
      setErrorMessage('پاس ورڈ کم از کم 6 ہندسوں یا حروف پر مشتمل ہونا چاہیے');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage('پاس ورڈز میں مطابقت نہیں ہے');
      return;
    }

    let finalCityName = signupForm.cityName || '';
    let finalCityId = signupForm.city || '';

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

    const cleanSlug = signupForm.name.trim().toLowerCase().replace(/[\s\-_]+/g, '-').replace(/[^\w\u0600-\u06FF\-]+/g, '');

    const newDoctor = {
      id: Date.now(),
      name: signupForm.name.trim(),
      slug: cleanSlug || `tabeeb-${Date.now()}`,
      email: signupForm.email.trim(),
      password: signupForm.password || 'password123',
      title: signupForm.title.trim() || 'ماہر نباض و معالج طب یونانی',
      qualifications: signupForm.qualifications.trim() || 'فاضل طب والجراحت (FTJ)',
      councilRegNo: signupForm.councilRegNo.trim() || 'NCT-' + Math.floor(10000 + Math.random() * 90000),
      experience: Number(signupForm.experience) || 5,
      rating: 5.0,
      reviewsCount: 0,
      city: finalCityId || 'lahore',
      cityName: finalCityName || 'لاہور',
      specialties: signupForm.specialties.length > 0 ? signupForm.specialties : ['امراض معدہ، گیس و تبخیر'],
      treatmentType: signupForm.treatmentType || 'طب یونانی',
      clinicName: signupForm.clinicName.trim(),
      address: signupForm.address.trim() || `${finalCityName}، پاکستان`,
      timing: signupForm.timing.trim() || 'روزانہ: شام 4:00 تا رات 9:00',
      fee: Number(signupForm.fee) || 500,
      phone: signupForm.phone.trim() || signupForm.whatsapp.trim() || '03001234567',
      whatsapp: signupForm.whatsapp.trim().replace(/[^0-9]/g, '') || signupForm.phone.trim().replace(/[^0-9]/g, '') || '923001234567',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      isVerified: false,
      emailVerified: false,
      isApproved: false, // ⚠️ Pending Admin Approval
      status: 'pending', // ⚠️ 'pending' | 'active'
      isFeatured: false,
      appliedDate: new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' }),
      about: signupForm.about.trim() || 'طب یونانی اور ہربل طریقہ علاج کے ذریعے مریضوں کی خدمت۔',
      services: ['مفت آن لائن رہنمائی', 'نبض شناسی و مزاج تشخیص', 'قدرتی ہربل نسخہ جات'],
      education: [
        { degree: signupForm.qualifications || 'فاضل طب والجراحت', institute: 'نیشنل کونسل فار طب منظور شدہ ادارہ' }
      ]
    };

    try {
      const saved = localStorage.getItem('tabeeb_doctors_data_v1');
      const current = (saved && saved !== 'undefined') ? JSON.parse(saved) : (doctorsList || DOCTORS);
      const updated = [newDoctor, ...current.filter(d => d.id !== newDoctor.id && d.email !== newDoctor.email)];
      localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updated));
    } catch (e) {}

    if (onRegisterDoctor) {
      onRegisterDoctor(newDoctor);
    }

    setRegisteredDoctorData(newDoctor);
    setSignupStep('submitted');
  };

  const handleFinishAndOpenDashboard = () => {
    if (registeredDoctorData) {
      onLoginSuccess(registeredDoctorData, true);
      onClose();
    }
  };

  const toggleSpecialtySelection = (specName) => {
    setSpecialtyNotice('');
    setSignupForm(prev => {
      const exists = prev.specialties.includes(specName);
      if (exists) {
        return { ...prev, specialties: prev.specialties.filter(s => s !== specName) };
      } else {
        if (prev.specialties.length >= 3) {
          setSpecialtyNotice('آپ ایک وقت میں زیادہ سے زیادہ 3 امراض ہی منتخب کر سکتے ہیں۔');
          return prev;
        }
        return { ...prev, specialties: [...prev.specialties, specName] };
      }
    });
  };

  const handleAddCustomSpecialty = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSpecialtyInput.trim();
    if (!trimmed) return;
    setSpecialtyNotice('');

    if (signupForm.specialties.length >= 3) {
      setSpecialtyNotice('زیادہ سے زیادہ 3 امراض منتخب ہو سکتے ہیں۔ نیا مرض شامل کرنے کے لیے پہلے کسی ایک کو ہٹائیں۔');
      return;
    }

    if (signupForm.specialties.includes(trimmed)) {
      setSpecialtyNotice('یہ مرض پہلے ہی فہرست میں منتخب ہے۔');
      return;
    }

    setSignupForm(prev => ({
      ...prev,
      specialties: [...prev.specialties, trimmed]
    }));
    setCustomSpecialtyInput('');
  };

  const handleRemoveSpecialty = (specToRemove) => {
    setSpecialtyNotice('');
    setSignupForm(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specToRemove)
    }));
  };

  const isNavy = theme === 'navy';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-right animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative my-8">
        
        {/* Header Ribbon */}
        <div className={`p-6 ${isNavy ? 'bg-gradient-to-r from-[#0b1d3a] via-[#0f2952] to-[#1e3a8a]' : 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900'} text-white relative`}>
          
          <button
            onClick={onClose}
            className="absolute top-5 left-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans">
                <ShieldCheck className="w-3 h-3" />
                <span>پورٹل برائے مستند اطباء و حکماء</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-h2 text-white mt-1">
                {authMode === 'login' ? 'طبیب لاگ ان (Doctor Portal)' : 'بطور طبیب شمولیت و رجسٹریشن'}
              </h2>
            </div>
          </div>

          {/* Mode Switch Tabs (hidden if in submitted step) */}
          {signupStep !== 'submitted' && (
            <div className="flex items-center gap-2 mt-6 bg-black/25 p-1 rounded-2xl border border-white/10 text-xs font-simple font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>لاگ ان کریں (Sign In)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep('form');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>نئی رجسٹریشن (Register)</span>
              </button>
            </div>
          )}

        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="m-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="m-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: LOGIN FORM */}
        {/* ========================================================= */}
        {authMode === 'login' && (
          <div className="p-6 sm:p-8 space-y-6">
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                  ای میل ایڈریس یا واٹس ایپ نمبر:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    placeholder="مثال: tariq.hakeem@tabeebpedia.com یا 03001234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                  پاس ورڈ (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="اپنا پاس ورڈ درج کریں"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-10 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>مجھے لاگ ان رکھیں</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-blue-600 hover:underline"
                >
                  پاس ورڈ بھول گئے؟
                </button>
              </div>

              <button
                type="submit"
                className={`w-full ${isNavy ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800' : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'} text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md font-h2 active:scale-98`}
              >
                ڈیش بورڈ میں داخل ہوں (Login)
              </button>
            </form>

            

          </div>
        )}

        
        {/* ========================================================= */}
        {/* FORGOT PASSWORD FLOW */}
        {/* ========================================================= */}
        {authMode === 'forgot' && (
          <div className="p-6">
            {!forgotSubmitted ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 font-simple text-lg">پاسورڈ بھول گئے؟</h3>
                  <p className="text-xs text-slate-500 mt-2 font-simple leading-relaxed">اپنا رجسٹرڈ ای میل یا واٹس ایپ نمبر درج کریں۔ ایڈمن کو پاسورڈ ری سیٹ کی درخواست بھیجی جائے گی۔</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-xs font-simple">ای میل یا واٹس ایپ نمبر *</label>
                  <div className="relative">
                    <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={forgotForm.identifier}
                      onChange={(e) => setForgotForm({ ...forgotForm, identifier: e.target.value })}
                      placeholder="e.g. 03001234567 یا email@domain.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-2 items-start animate-in fade-in duration-300">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-700 font-bold font-simple">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 text-sm font-simple mt-4"
                >
                  <Send className="w-4 h-4" />
                  درخواست بھیجیں
                </button>
                
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                    className="text-xs text-slate-500 hover:text-slate-700 font-bold font-simple inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    واپس لاگ ان پر جائیں
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 font-simple">درخواست بھیج دی گئی!</h3>
                <p className="text-xs text-slate-600 mb-6 font-simple leading-relaxed">
                  آپ کے پاسورڈ کی درخواست ایڈمن کو موصول ہو گئی ہے۔ براہ کرم انتظار کریں، ایڈمن جلد آپ سے رابطہ کرے گا یا آپ کو نیا پاسورڈ فراہم کر دے گا۔
                </p>
                <button
                  onClick={() => { setAuthMode('login'); setForgotSubmitted(false); }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors font-simple"
                >
                  لاگ ان پیج پر واپس جائیں
                </button>
              </div>
            )}
          </div>
        )}


        {/* ========================================================= */}
        {/* TAB 2: DIRECT DOCTOR REGISTRATION FORM */}
        {/* ========================================================= */}
        {authMode === 'signup' && signupStep === 'form' && (
          <form onSubmit={handleDirectRegistration} className="p-6 sm:p-8 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  پورا نام (مع القاب): *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder="مثال: حکیم محمد احمد صدیقی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-simple font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  طبیب کا عنوان / ٹائٹل:
                </label>
                <input
                  type="text"
                  value={signupForm.title}
                  onChange={(e) => setSignupForm({ ...signupForm, title: e.target.value })}
                  placeholder="مثال: ماہر نباض، معالج قانون مفرد اعضاء"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-simple"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  ای میل ایڈریس (Email Address): *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="doctor@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  واٹس ایپ / رابطہ نمبر: *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={signupForm.whatsapp}
                    onChange={(e) => setSignupForm({ ...signupForm, whatsapp: e.target.value })}
                    placeholder="03001234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  پاس ورڈ (کم از کم 6 ہندسے): *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  پاس ورڈ کی تصدیق: *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* City Selection Combobox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  شہر کا انتخاب یا نیا شامل کریں: *
                </label>
                <CityCombobox
                  cities={citiesList || CITIES}
                  selectedCityId={signupForm.city}
                  onSelectCity={(cityId, cityName) => {
                    setSignupForm({ ...signupForm, city: cityId, cityName: cityName });
                  }}
                  onAddNewCity={(cityName) => {
                    if (onAddCity) {
                      const newC = onAddCity(cityName);
                      if (newC) {
                        setSignupForm({ ...signupForm, city: newC.id, cityName: newC.name });
                      }
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  طریقہ علاج (System of Medicine): *
                </label>
                <select
                  value={signupForm.treatmentType}
                  onChange={(e) => setSignupForm({ ...signupForm, treatmentType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-simple font-bold"
                >
                  {TREATMENT_TYPES.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  مطب / کلینک کا نام: *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signupForm.clinicName}
                    onChange={(e) => setSignupForm({ ...signupForm, clinicName: e.target.value })}
                    placeholder="مثال: الشفاء مطب و ہربل ریسرچ سینٹر"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-simple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  کونسل رجسٹریشن نمبر / لائسنس:
                </label>
                <input
                  type="text"
                  value={signupForm.councilRegNo}
                  onChange={(e) => setSignupForm({ ...signupForm, councilRegNo: e.target.value })}
                  placeholder="مثال: NCT-48920 (اختیاری)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  طبی قابلیت / ڈگری:
                </label>
                <input
                  type="text"
                  value={signupForm.qualifications}
                  onChange={(e) => setSignupForm({ ...signupForm, qualifications: e.target.value })}
                  placeholder="FTJ, BEMS, وغیرہ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-simple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  طبی تجربہ (سال):
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={signupForm.experience}
                  onChange={(e) => setSignupForm({ ...signupForm, experience: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-simple">
                  فیس (روپے):
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={signupForm.fee}
                  onChange={(e) => setSignupForm({ ...signupForm, fee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>

            {/* Specialties Picker (Max 3) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 font-simple flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>خاص مہارت و امراض (زیادہ سے زیادہ 3 امراض منتخب کریں):</span>
                </label>
                <span className="text-[11px] font-sans font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {signupForm.specialties.length} / 3 منتخب
                </span>
              </div>

              {specialtyNotice && (
                <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-xl font-bold">
                  ⚠️ {specialtyNotice}
                </div>
              )}

              {/* Selected Chips */}
              {signupForm.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {signupForm.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(spec)}
                        className="hover:bg-blue-700 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-32 overflow-y-auto">
                {SPECIALTIES.filter(s => s.id !== 'all').map(spec => {
                  const isSelected = signupForm.specialties.includes(spec.name);
                  const isMaxReached = signupForm.specialties.length >= 3 && !isSelected;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      disabled={isMaxReached}
                      onClick={() => toggleSpecialtySelection(spec.name)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : isMaxReached
                            ? 'bg-white text-slate-400 border border-slate-100 opacity-50 cursor-not-allowed'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <span>{spec.name}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Custom Disease Input */}
              <div className="pt-1 flex items-center gap-2">
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
                  placeholder="کوئی دوسرا مرض خود لکھیں (مثال: درد شقیقہ)..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSpecialty}
                  disabled={!customSpecialtyInput.trim() || signupForm.specialties.length >= 3}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0"
                >
                  + شامل کریں
                </button>
              </div>

            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={signupForm.agreedToTerms}
                  onChange={(e) => setSignupForm({ ...signupForm, agreedToTerms: e.target.checked })}
                  className="rounded text-blue-600 mt-0.5"
                />
                <span>
                  میں اقرار کرتا ہوں کہ میں ایک مستند طبیب / پریکٹیشنر ہوں اور فراہم کردہ تمام معلومات درست ہیں۔
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full ${isNavy ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800' : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'} text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md font-h2 active:scale-98 flex items-center justify-center gap-2`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>رجسٹریشن مکمل کریں اور درخواست جمع کریں</span>
            </button>

          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 2 - CONFIRMATION: APPLICATION SUBMITTED SCREEN */}
        {/* ========================================================= */}
        {authMode === 'signup' && signupStep === 'submitted' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs px-3 py-1 rounded-full font-bold font-simple">
                <Clock className="w-3.5 h-3.5" />
                <span>درخواست زیرِ جائزہ (Pending Admin Approval)</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-h2">
                رجسٹریشن کی درخواست کامیابی سے موصول ہو گئی!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                محترم <strong className="text-slate-900">{registeredDoctorData?.name}</strong>! آپ کا طبیب اکاؤنٹ تیار کر لیا گیا ہے اور رجسٹریشن درخواست ایڈمن پینل کو ارسال کر دی گئی ہے۔
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 text-right space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 font-simple">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>ایڈمن پینل منظوری کا نوٹس:</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-simple">
                ایڈمن کے جائزے اور منظوری (Approval) کے بعد آپ کا پروفائل خود بخود ویب سائٹ اور ڈاکٹر ڈائریکٹری پر لائیو (پبلش) ہو جائے گا۔ اس دوران آپ اپنے ڈیش بورڈ میں مطب کی ترتیبات دیکھ سکتے ہیں۔
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 font-simple">
              <button
                type="button"
                onClick={handleFinishAndOpenDashboard}
                className={`flex-1 ${isNavy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs font-bold py-3.5 rounded-2xl transition-all shadow-md`}
              >
                طبیب ڈیش بورڈ کھولیں (Open Dashboard)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3.5 rounded-2xl transition-all"
              >
                ویب سائٹ پر واپس جائیں (Close)
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
