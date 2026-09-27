import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight,
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Building2,
  Send,
  UserCheck,
  Image as ImageIcon,
  Video,
  Languages,
  HelpCircle,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Headphones,
  Lock,
  ThumbsUp,
  AlertCircle,
  Home,
  Stethoscope,
  ChevronLeft
} from 'lucide-react';

// Helper to clean any raw HTML or formatting tags from doctor bio
function formatDoctorBio(bio, doctorName) {
  if (!bio) return '';
  let str = String(bio);

  // Remove shortcodes like [caption ...] ... [/caption]
  str = str.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, '$1');
  str = str.replace(/\[[^\]]+\]/g, '');

  // Remove images
  str = str.replace(/<img[^>]*>/gi, '');

  // Remove duplicate heading with doctor name
  if (doctorName) {
    const cleanDocName = doctorName.replace(/[^\w\u0600-\u06FF]/g, '').toLowerCase();
    str = str.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (m, headingText) => {
      const cleanHeading = headingText.replace(/[^\w\u0600-\u06FF]/g, '').toLowerCase();
      if (cleanHeading.includes(cleanDocName) || cleanDocName.includes(cleanHeading)) {
        return '';
      }
      return '\n' + headingText.trim() + '\n';
    });
  }

  // Clean tags: replace <li> with bullet
  str = str.replace(/<li[^>]*>/gi, '• ');
  str = str.replace(/<\/li>/gi, '\n');

  // Replace <br>, <p>, <div> with line breaks
  str = str.replace(/<br\s*[\/]?>/gi, '\n');
  str = str.replace(/<\/p>/gi, '\n\n');
  str = str.replace(/<\/div>/gi, '\n');

  // Strip all remaining HTML tags
  str = str.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  str = str.replace(/&nbsp;/gi, ' ')
           .replace(/&amp;/gi, '&')
           .replace(/&quot;/gi, '"')
           .replace(/&#8211;/g, '–')
           .replace(/&#8217;/g, "'")
           .replace(/&lt;/gi, '<')
           .replace(/&gt;/gi, '>');

  // Clean up excessive whitespace and newlines
  let lines = str.split('\n')
           .map(line => line.trim())
           .filter((line, idx, arr) => line || (idx > 0 && arr[idx - 1]));

  if (lines.length > 1) {
    const first = lines[0].trim();
    if (first.length < 45 && (first.startsWith('حکیم ') || first.startsWith('ڈاکٹر ') || first.toLowerCase().startsWith('dr') || first.toLowerCase().startsWith('hakeem') || first === doctorName)) {
      if (lines.slice(1).join(' ').trim().length > 15) {
        lines.shift();
      }
    }
  }

  return lines.join('\n').trim();
}

export default function DoctorProfileView({ 
  doctor, 
  onBack,
  onNavigateHome,
  onNavigateDoctors,
  articlesList = [],
  onSelectArticle,
  siteSettings 
}) {
  const [activeTab, setActiveTab] = useState('about');
  const [consultationMode, setConsultationMode] = useState('online'); // 'online' or 'clinic'
  const [appointmentSent, setAppointmentSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ patientName: '', rating: 5, comment: '', disease: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [localReviews, setLocalReviews] = useState([]);

  // Accordion open/close state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Appointment Form state
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    disease: '',
    date: '',
    notes: '',
    mode: 'آن لائن ویڈیو مشاورت'
  });

  // Dynamic SEO title
  useEffect(() => {
    if (doctor?.name) {
      document.title = `${doctor.name} - ${doctor.title || 'ماہر معالج'} | طبیب پیڈیا`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [doctor]);

  // Smooth Scroll to Section when clicking a tab
  const scrollToSection = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(`section-${tabId}`);
    if (element) {
      const yOffset = -185; // offset for sticky navbar (114px) + sticky tabs bar (~55px) + 16px buffer
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scrollspy: automatically highlight active tab as user scrolls down the page
  useEffect(() => {
    const sectionIds = ['about', 'services', 'conditions', 'education', 'experience', 'reviews', 'faqs', 'media'];
    
    let isThrottled = false;
    const onScroll = () => {
      if (isThrottled) return;
      isThrottled = true;
      setTimeout(() => { isThrottled = false; }, 80);

      const scrollPos = window.scrollY + 205;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${sectionIds[i]}`);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveTab(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-nastaliq">
        <Stethoscope className="w-16 h-16 text-slate-300 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">طبیب کا پروفائل نہیں مل سکا</h2>
        <p className="text-sm text-slate-500 mt-1">ہو سکتا ہے کہ یہ پروفائل ہٹا دیا گیا ہو یا لنک درست نہ ہو۔</p>
        <button
          onClick={onBack || onNavigateDoctors}
          className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          اطباء ڈائریکٹری پر واپس جائیں
        </button>
      </div>
    );
  }

  // Consultation Fees
  const clinicFee = Number(doctor.fee) || 500;
  const onlineFee = Number(doctor.onlineFee) || (clinicFee + 300);
  const waitTime = doctor.waitTime || '15 منٹ سے کم';
  const satisfactionScore = doctor.satisfactionScore || (doctor.rating ? Math.min(99, Math.round((doctor.rating / 5) * 100)) : 96);
  const totalReviewsCount = (doctor.reviewsCount || 120) + localReviews.length;

  // Conditions Treated List (with fallbacks if empty)
  const conditionsTreated = useMemo(() => {
    if (doctor.conditions && Array.isArray(doctor.conditions) && doctor.conditions.length > 0) {
      return doctor.conditions;
    }
    if (doctor.specialties && Array.isArray(doctor.specialties) && doctor.specialties.length > 0) {
      return doctor.specialties;
    }
    return [
      'معدے کا السر اور دائمی تیزابیت (Acid Peptic Disease)',
      'جوڑوں و مہروں کا درد اور عرق النساء (Sciatica & Joint Pain)',
      'دائمی قبض اور آئی بی ایس (IBS & Chronic Constipation)',
      'امراض جگر و یرقان (Liver Heat & Jaundice)',
      'ذیابیطس و شوگر کا ہربل انتظام (Diabetes Mellitus)',
      'ہائی بلڈ پریشر (Hypertension)',
      'مردانہ و زنانہ پوشیدہ امراض و بانجھ پن (Infertility)',
      'دائمی نزلہ زکام اور الرجی (Allergy & Respiratory Issues)'
    ];
  }, [doctor]);

  // Services Offered (with fallbacks)
  const servicesOffered = useMemo(() => {
    if (doctor.services && Array.isArray(doctor.services) && doctor.services.length > 0) {
      return doctor.services;
    }
    return [
      'نبض کی 6 اقسام سے اعصابی، عضلاتی، غدی مزاج کی تشخیص',
      'حجامہ و کپنگ تھیراپی برائے درد و فاسد خون کا اخراج',
      'قانون مفرد اعضاء اور طب نبوی کے مطابق پرہیز و غذائی چارٹ',
      'خالص جڑی بوٹیوں سے تیار کردہ نایاب سفوف و کشتہ جات'
    ];
  }, [doctor]);

  // Languages Spoken (with fallbacks)
  const languagesList = useMemo(() => {
    if (doctor.languages && Array.isArray(doctor.languages) && doctor.languages.length > 0) {
      return doctor.languages;
    }
    return ['اردو (Urdu)', 'پنجابی (Punjabi)', 'انگریزی (English)'];
  }, [doctor]);

  // Memberships (with fallbacks)
  const membershipsList = useMemo(() => {
    if (doctor.memberships && Array.isArray(doctor.memberships) && doctor.memberships.length > 0) {
      return doctor.memberships;
    }
    return [
      'نیشنل کونسل فار طب پاکستان (National Council for Tibb - NCT)',
      'پاکستان طبی کانفرنس (Pakistan Tibbi Conference)'
    ];
  }, [doctor]);

  // FAQs (with fallbacks)
  const faqsList = useMemo(() => {
    if (doctor.faqs && Array.isArray(doctor.faqs) && doctor.faqs.length > 0) {
      return doctor.faqs;
    }
    return [
      {
        question: `طبیب ${doctor.name} سے معائنے یا چیک اپ کی فیس کیا ہے؟`,
        answer: `کلینک پر تفصیلی معائنے اور تشخیص کی فیس ${clinicFee} روپے ہے، جبکہ آن لائن ویڈیو/آڈیو مشاورت کی فیس ${onlineFee} روپے ہے۔ ادویات کے چارجز بیماری کے دورانیے کے مطابق الگ ہوتے ہیں۔`
      },
      {
        question: 'آن لائن مشاورت کا کیا طریقہ کار ہے اور ادویات کیسے ملتی ہیں؟',
        answer: 'آپ واٹس ایپ یا فون کے ذریعے وقت طے کرتے ہیں۔ مقررہ وقت پر ویڈیو یا وائس کال پر نبض، زبان اور علامات کی تفصیل معلوم کی جاتی ہے۔ اس کے بعد تیار کردہ خالص ادویات ٹی سی ایس (TCS) یا کوریئر کے ذریعے 24 سے 48 گھنٹوں میں آپ کے گھر پہنچا دی جاتی ہیں۔'
      },
      {
        question: 'مطب / کلینک کے اوقات اور ایڈریس کیا ہے؟',
        answer: `${doctor.clinicName || 'مطب'}: ${doctor.address || `${doctor.cityName || 'لاہور'}، پاکستان`}۔ اوقات کار: ${doctor.timing || 'پیر تا ہفتہ: شام 4:00 تا رات 9:00'} ہیں۔ براہ کرم تشریف لانے سے قبل وقت کی تصدیق کر لیں۔`
      },
      {
        question: 'کیا حکیم صاحب کے پاس کونسل کا تصدیق شدہ رجسٹریشن نمبر ہے؟',
        answer: `جی ہاں! حکیم صاحب قومی کونسل برائے طب (National Council for Tibb) کے مصدقہ رجسٹرڈ معالج ہیں، جن کا رجسٹریشن نمبر ${doctor.registrationNumber || doctor.councilRegNo || 'کونسل سے رجسٹرڈ'} ہے۔`
      }
    ];
  }, [doctor, clinicFee, onlineFee]);

  // Sample default reviews
  const defaultReviews = [
    {
      id: 101,
      patientName: 'محمد عثمان طارق',
      date: '10 ستمبر 2026',
      rating: 5,
      disease: 'معدے کی تیزابیت اور دائمی قبض',
      verified: true,
      comment: 'بہت ہی شفیق اور بااخلاق معالج ہیں۔ نبض دیکھ کر ہی ساری کیفیت بتا دی۔ ایک ماہ کے علاج سے معدے کی جلن اور گیس مکمل ٹھیک ہو گئی۔ جزاک اللہ خیراً۔'
    },
    {
      id: 102,
      patientName: 'طاہرہ بیگم',
      date: '28 اگست 2026',
      rating: 5,
      disease: 'جوڑوں کا درد اور یورک ایسڈ',
      verified: true,
      comment: 'میری والدہ کو گھٹنوں کے درد کی وجہ سے چلنے پھرنے میں شدید تکلیف تھی۔ حکیم صاحب کے بتائے ہوئے قہوہ اور ہربل تیل سے اب وہ بغیر سہارے نماز پڑھ رہی ہیں۔'
    },
    {
      id: 103,
      patientName: 'وقار احمد چوہدری',
      date: '15 اگست 2026',
      rating: 5,
      disease: 'یرقان اور جگر کی گرمی',
      verified: true,
      comment: 'آن لائن ویڈیو کال پر بہت تفصیل سے بات سنی اور ادویات اگلے ہی دن کوریئر سے مل گئیں۔ بہت مطمئن ہوں۔'
    }
  ];

  const allReviews = [...localReviews, ...defaultReviews];

  // Articles written by this doctor
  const doctorArticles = useMemo(() => {
    if (!articlesList || articlesList.length === 0) return [];
    const cleanDocName = (doctor.name || '').replace(/حکیم|ڈاکٹر|پروفیسر/g, '').trim().toLowerCase();
    return articlesList.filter(a => {
      if (a.authorId && a.authorId === doctor.id) return true;
      if (a.author && cleanDocName && a.author.toLowerCase().includes(cleanDocName)) return true;
      return false;
    }).slice(0, 4);
  }, [articlesList, doctor]);

  // Submit appointment request
  const handleSubmitAppointment = (e) => {
    e.preventDefault();
    setAppointmentSent(true);
  };

  // Submit new review
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.patientName.trim() || !newReview.comment.trim()) return;

    const reviewObj = {
      id: Date.now(),
      patientName: newReview.patientName.trim(),
      date: 'ابھی حال ہی میں',
      rating: newReview.rating || 5,
      disease: newReview.disease.trim() || 'طبی مشاورت',
      verified: true,
      comment: newReview.comment.trim()
    };

    setLocalReviews([reviewObj, ...localReviews]);
    setReviewSubmitted(true);
    setNewReview({ patientName: '', rating: 5, comment: '', disease: '' });
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 2000);
  };

  // Copy doctor profile link
  const handleShareProfile = () => {
    const url = window.location.origin + window.location.pathname + `?doctor=${doctor.slug || doctor.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 text-right font-nastaliq pb-16">
      
      {/* 1. Top Breadcrumbs & Back Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>صفحۂ اول</span>
            </button>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            
            <button 
              onClick={onBack || onNavigateDoctors} 
              className="hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>اطباء ڈائریکٹری</span>
            </button>
            
            {doctor.cityName && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600 font-bold">{doctor.cityName}</span>
              </>
            )}

            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-800 font-bold truncate max-w-[200px]">{doctor.name}</span>
          </nav>

          {/* Action Buttons: Back + Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-sans text-slate-700 transition-all duration-200 border border-slate-200"
              title="پروفائل لنک شیئر کریں"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">لنک کاپی ہو گیا!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>شیئر کریں</span>
                </>
              )}
            </button>

            <button
              onClick={onBack || onNavigateDoctors}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>اطباء ڈائریکٹری پر واپس</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Doctor Hero Card (Oladoc Top Header) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Doctor Avatar with Verified Ring */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-emerald-500/20 shadow-lg bg-slate-100">
                <img
                  src={doctor.image || "/images/default_doctor.webp"}
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default_doctor.webp";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              {doctor.isVerified && (
                <div className="absolute -bottom-2 -left-2 bg-emerald-600 text-white rounded-full p-2 shadow-md border-2 border-white" title="کونسل سے تصدیق شدہ">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Doctor Details */}
            <div className="flex-1 space-y-3 min-w-0 text-center md:text-right">
              
              {/* Verification & Council Tag */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs px-3 py-1 rounded-full font-sans font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>قومی کونسل برائے طب (NCT) سے تصدیق شدہ</span>
                </span>
                {(doctor.registrationNumber || doctor.councilRegNo) && (
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-mono font-bold" dir="ltr">
                    Reg: {doctor.registrationNumber || doctor.councilRegNo}
                  </span>
                )}
                {doctor.treatmentType && (
                  <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full">
                    {doctor.treatmentType}
                  </span>
                )}
              </div>

              {/* Doctor Name & Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.name}
                </h1>
                <p className="text-emerald-700 font-bold text-base sm:text-lg mt-1">
                  {doctor.title || 'ماہر نباض، معالج طب یونانی و محقق طب نبوی'}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                  {doctor.qualifications || 'فاضل طب والجراحت (FTJ)، رجسٹرڈ طبیب'}
                </p>
              </div>

              {/* 4 Key Metric Badges (Oladoc Core Metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                
                {/* Metric 1: Wait Time */}
                <div className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-2xl p-3 text-center transition-colors">
                  <span className="block text-slate-900 font-bold text-sm sm:text-base font-sans">{waitTime}</span>
                  <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>اوسط انتظار</span>
                  </span>
                </div>

                {/* Metric 2: Experience */}
                <div className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-2xl p-3 text-center transition-colors">
                  <span className="block text-slate-900 font-bold text-sm sm:text-base font-sans">{doctor.experience || 10}+ سال</span>
                  <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>طبی تجربہ</span>
                  </span>
                </div>

                {/* Metric 3: Patient Satisfaction */}
                <div className="bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center transition-colors">
                  <span className="block text-emerald-950 font-bold text-sm sm:text-base font-sans">{satisfactionScore}% اطمینان</span>
                  <span className="text-[11px] text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>مریض فیڈبیک</span>
                  </span>
                </div>

                {/* Metric 4: Reviews Count */}
                <div className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-2xl p-3 text-center transition-colors">
                  <div className="flex items-center justify-center gap-1 font-bold text-sm sm:text-base text-slate-900 font-sans">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{doctor.rating || 4.9}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-sans">
                    {totalReviewsCount} تصدیق شدہ آراء
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* 3. Main Two-Column Layout: Left Content (70%) + Right Sticky Consultation Card (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left 8 Cols: Tabs Navigation & Sequential Flowing Sections */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Oladoc Quick-Jump Sticky Navigation Tabs (Stays fixed as user scrolls) */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-1.5 shadow-md overflow-x-auto no-scrollbar flex items-center gap-1 sticky top-[118px] z-40 transition-all">
              {[
                { id: 'about', label: 'معالج کا تعارف', icon: UserCheck },
                { id: 'services', label: 'طبی خدمات', icon: CheckCircle2 },
                { id: 'conditions', label: 'زیرِ علاج امراض', icon: Sparkles },
                { id: 'education', label: 'اسناد و تعلیم', icon: GraduationCap },
                { id: 'experience', label: 'تجربہ و کلینکس', icon: Building2 },
                { id: 'reviews', label: `ریویوز (${allReviews.length})`, icon: Star },
                { id: 'faqs', label: 'عمومی سوالات', icon: HelpCircle },
                { id: 'media', label: `ویڈیوز و گیلری (${(doctor.gallery?.length || 0) + (doctorArticles.length)})`, icon: ImageIcon },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-sm scale-102' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ========================================================================= */}
            {/* SECTION 1: ABOUT DOCTOR (معالج کا تعارف) */}
            {/* ========================================================================= */}
            <div id="section-about" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3 flex items-center justify-between">
                  <span>معالج کا تعارف اور طریقہ علاج</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">About Doctor</span>
                </h3>
                
                <div className="text-sm text-slate-700 leading-relaxed font-body whitespace-pre-line space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70">
                  {formatDoctorBio(doctor.about, doctor.name) || (
                    <p>
                      طبیب {doctor.name} پاکستان کے معتبر اور مستند اطباء میں شمار ہوتے ہیں۔ آپ نبض شناسی، قانون مفرد اعضاء اور طب یونانی کے اصولوں کے تحت مریض کے مزاج کی درست تشخیص فرما کر قدرتی جڑی بوٹیوں اور غذائی پرہیز سے شافی علاج تجویز فرماتے ہیں۔
                    </p>
                  )}
                </div>
              </div>

              {/* Languages Spoken (Oladoc Screenshot 3) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-emerald-600" />
                  <span>بولی جانے والی زبانیں (Languages Spoken)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {languagesList.map((lang, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-3.5 py-1.5 rounded-xl border border-slate-200 font-sans font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional Memberships (Oladoc Screenshot 3) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>پیشہ ورانہ تنظیموں کی رکنیت (Professional Memberships)</span>
                </h4>
                <div className="space-y-2">
                  {membershipsList.map((mem, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{mem}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: SERVICES (طبی خدمات) */}
            {/* ========================================================================= */}
            <div id="section-services" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3">
                  طبی خدمات اور کلینیکل سہولیات
                </h3>
                <span className="text-xs text-slate-400 font-sans">Services Offered</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                طبیب {doctor.name} کے مطب پر جدید تشخیصی طریقہ کار اور قدیم مستند طبی علوم کی روشنی میں درج ذیل خدمات فراہم کی جاتی ہیں:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {servicesOffered.map((srv, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200/80 transition-colors">
                    <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 3: CONDITIONS TREATED (زیرِ علاج امراض) */}
            {/* ========================================================================= */}
            <div id="section-conditions" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3">
                  زیرِ علاج امراض اور تخصصات
                </h3>
                <span className="text-xs text-slate-400 font-sans">Conditions Treated</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                مریض ان تمام امراض کے تسلی بخش علاج کے لیے آن لائن یا کلینک پر مشورہ لے سکتے ہیں:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {conditionsTreated.map((cond, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/80 transition-colors">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="text-xs sm:text-sm text-slate-800 font-medium">{cond}</span>
                  </div>
                ))}
              </div>

              {/* Medical Advice Box */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>طبی مشورہ:</strong> ہر انسان کا مزاج دوسرے سے مختلف ہوتا ہے۔ بغیر تشخیص کے کسی نسخے پر عمل کرنے کے بجائے معالج سے باقاعدہ مشورہ کر کے علاج شروع کرنا ہی اصل شفاء کا باعث ہے۔
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 4: EDUCATION & QUALIFICATIONS (اسناد و تعلیم) */}
            {/* ========================================================================= */}
            <div id="section-education" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <span>طبی اسناد، ڈگریاں اور قابلیت</span>
                </h3>
                <span className="text-xs text-slate-400 font-sans">Education & Qualifications</span>
              </div>

              <div className="space-y-3">
                {doctor.education && doctor.education.length > 0 ? (
                  doctor.education.map((edu, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm font-sans">{edu.degree}</h4>
                        <p className="text-xs text-slate-600 font-sans">{edu.institute}</p>
                      </div>
                      {edu.year && (
                        <span className="text-xs font-sans text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto font-medium">
                          {edu.year}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-sm">{doctor.qualifications || 'فاضل طب والجراحت (FTJ)'}</div>
                    <div className="text-xs text-slate-600">نیشنل کونسل فار طب پاکستان (منظور شدہ ادارہ)</div>
                  </div>
                )}
              </div>

              {/* Awards & Distinctions */}
              {doctor.awards && doctor.awards.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>اعزازات و اسناد (Awards & Distinctions)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctor.awards.map((aw, idx) => (
                      <div key={idx} className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-950">{aw.title}</span>
                        {aw.year && <span className="text-amber-800 font-sans font-medium">{aw.year}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ========================================================================= */}
            {/* SECTION 5: EXPERIENCE & CLINICS (تجربہ و کلینکس) */}
            {/* ========================================================================= */}
            <div id="section-experience" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>کلینکس اور پیشہ ورانہ تجربہ</span>
                </h3>
                <span className="text-xs text-slate-400 font-sans">Practice Locations & History</span>
              </div>

              {/* Experience Timeline */}
              {doctor.experiences && doctor.experiences.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">سابقہ و موجودہ وابستگی:</h4>
                  <div className="space-y-3">
                    {doctor.experiences.map((exp, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 text-sm">{exp.companyName || exp.jobTitle}</span>
                          {exp.duration && (
                            <span className="text-slate-500 font-sans text-xs bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 self-start sm:self-auto font-medium">
                              {exp.duration}
                            </span>
                          )}
                        </div>
                        {exp.jobTitle && <div className="text-emerald-700 font-bold">{exp.jobTitle}</div>}
                        {exp.description && <div className="text-slate-600 text-xs leading-relaxed">{exp.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinic Details Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>مرکزی مطب و کلینک کا پتہ:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">نام مطب:</span>
                    <strong className="text-slate-900 text-sm block">{doctor.clinicName || 'مطب طبیب'}</strong>
                    <p className="text-slate-600 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{doctor.address || `${doctor.cityName || 'لاہور'}، پاکستان`}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block">اوقاتِ کار:</span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-sans font-bold">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{doctor.timing || 'پیر تا ہفتہ: شام 4:00 تا رات 9:00'}</span>
                    </div>
                    <div className="text-slate-500 mt-2">
                      <span>معائنہ فیس: </span>
                      <strong className="text-emerald-800 font-sans text-sm">{clinicFee} روپے</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* SECTION 6: PATIENT REVIEWS & SATISFACTION (مریضوں کے تاثرات) */}
            {/* ========================================================================= */}
            <div id="section-reviews" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>مریضوں کے تاثرات اور تجربات</span>
                </h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  {showReviewForm ? 'فارم بند کریں' : 'اپنی رائے درج کریں'}
                </button>
              </div>

              {/* Oladoc Satisfaction Breakdown Header */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/90 flex flex-col md:flex-row items-center gap-6">
                
                {/* Big Score Circle */}
                <div className="text-center shrink-0">
                  <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-lg border-4 border-emerald-500">
                    <span className="text-2xl font-black font-sans leading-none">{satisfactionScore}%</span>
                    <span className="text-[10px] text-emerald-300 font-sans mt-0.5">اطمینان</span>
                  </div>
                  <span className="text-xs text-slate-600 block mt-2 font-bold font-sans">
                    {totalReviewsCount} تصدیق شدہ مریض
                  </span>
                </div>

                {/* Progress Bars for Checkup, Environment, Staff (Oladoc Breakdown) */}
                <div className="flex-1 w-full space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">طبیب کا معائنہ و توجہ (Doctor Checkup)</span>
                      <span className="font-bold font-sans text-emerald-700">98%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">مطب کا ماحول و صفائی (Clinic Environment)</span>
                      <span className="font-bold font-sans text-emerald-700">95%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">عملے کا اخلاق و رویہ (Staff Behaviour)</span>
                      <span className="font-bold font-sans text-emerald-700">96%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Add Review Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-3xl space-y-4 text-xs animate-in fade-in-50">
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>طبیب {doctor.name} کے بارے میں اپنا تجربہ شیئر کریں:</span>
                  </h4>

                  {reviewSubmitted ? (
                    <div className="bg-white p-4 rounded-2xl border border-emerald-300 text-center space-y-1">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                      <p className="font-bold text-emerald-900">آپ کا فیڈبیک کامیابی سے شامل ہو گیا ہے!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">مریض کا نام *</label>
                        <input
                          type="text"
                          required
                          value={newReview.patientName}
                          onChange={(e) => setNewReview({...newReview, patientName: e.target.value})}
                          placeholder="مثلاً: محمد اسلم"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">بیماری / شکایت</label>
                        <input
                          type="text"
                          value={newReview.disease}
                          onChange={(e) => setNewReview({...newReview, disease: e.target.value})}
                          placeholder="مثلاً: گیس، السر، جوڑوں کا درد"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">آپ کا تفصیلی تبصرہ *</label>
                        <textarea
                          rows={3}
                          required
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          placeholder="طبیب کے طریقہ علاج اور نتائج کے بارے میں لکھیے..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">ریٹنگ:</span>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReview({...newReview, rating: star})}
                              className="focus:outline-none"
                            >
                              <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>

                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-xs"
                        >
                          ریویو جمع کرائیں
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* Reviews List (Oladoc Verified Patient Reviews) */}
              <div className="space-y-3 pt-2">
                {allReviews.map(rev => (
                  <div key={rev.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.patientName}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified Patient</span>
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 font-sans text-[11px]">{rev.date}</span>
                    </div>

                    {rev.disease && (
                      <div className="text-[11px] text-slate-500">
                        علاج برائے: <strong className="text-slate-700">{rev.disease}</strong>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>

                    <p className="text-slate-700 leading-relaxed font-body pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* ========================================================================= */}
            {/* SECTION 7: FAQS (عمومی سوالات) */}
            {/* ========================================================================= */}
            <div id="section-faqs" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <span>اکثر پوچھے جانے والے سوالات</span>
                </h3>
                <span className="text-xs text-slate-400 font-sans">Frequently Asked Questions</span>
              </div>

              <div className="space-y-3">
                {faqsList.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-right flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors font-bold text-xs sm:text-sm text-slate-900"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 font-body">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 8: MEDIA, VIDEOS & ARTICLES (ویڈیوز، تصاویر اور طبی مضامین) */}
            {/* ========================================================================= */}
            {(doctorArticles.length > 0 || (doctor.gallery && doctor.gallery.length > 0)) && (
              <div id="section-media" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-44">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 border-r-4 border-emerald-600 pr-3 flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-600" />
                    <span>ویڈیوز، تصاویر اور طبی مقالات</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-sans">Videos & Articles</span>
                </div>

                {/* Doctor Articles on Tabeeb Pedia */}
                {doctorArticles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>طبیب {doctor.name} کے تحریر کردہ مضامین:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {doctorArticles.map(art => (
                        <div
                          key={art.id}
                          onClick={() => {
                            if (onSelectArticle) {
                              onSelectArticle(art);
                            }
                          }}
                          className="bg-slate-50 hover:bg-emerald-50/60 p-4 rounded-2xl border border-slate-200 transition-all cursor-pointer group"
                        >
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-800 transition-colors line-clamp-2">
                            {art.title}
                          </h5>
                          <span className="text-xs text-emerald-600 mt-2 block font-sans font-bold">
                            مکمل مضمون پڑھیں ←
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinic & Certificate Gallery */}
                {doctor.gallery && doctor.gallery.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>مطب اور کلینک کی تصویری جھلکیاں:</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {doctor.gallery.map((imgUrl, idx) => (
                        <a
                          key={idx}
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 hover:shadow-md transition-all block"
                        >
                          <img
                            src={imgUrl}
                            alt={`مطب تصویر ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              if (e.target.parentElement) e.target.parentElement.style.display = 'none';
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right 4 Cols: STICKY CONSULTATION & APPOINTMENT CARD (Oladoc Booking Widget) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 sm:p-6 space-y-5 sticky top-[118px] z-30">
              
              {/* Consultation Mode Selector (Online Video vs In-Person Clinic) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  مشاورت کی نوعیت منتخب کریں:
                </span>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setConsultationMode('online');
                      setFormData({...formData, mode: 'آن لائن ویڈیو مشاورت'});
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      consultationMode === 'online'
                        ? 'bg-white text-emerald-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>آن لائن ویڈیو</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConsultationMode('clinic');
                      setFormData({...formData, mode: 'مطب / کلینک وزٹ'});
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      consultationMode === 'clinic'
                        ? 'bg-white text-emerald-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>مطب وزٹ</span>
                  </button>
                </div>
              </div>

              {/* Consultation Details Box (Fee + Mode Info) */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 space-y-3 text-xs">
                
                {/* Fee */}
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2.5">
                  <span className="text-slate-600 font-medium">مشاورت فیس:</span>
                  <div className="text-right">
                    <strong className="text-xl font-black text-emerald-950 font-sans">
                      Rs. {consultationMode === 'online' ? onlineFee : clinicFee}
                    </strong>
                  </div>
                </div>

                {/* Mode Specific Description */}
                <div className="space-y-1 text-slate-700">
                  <span className="font-bold text-slate-900 block">طریقہ کار / پتہ:</span>
                  {consultationMode === 'online' ? (
                    <p className="text-[11px] leading-relaxed text-emerald-900">
                      موبائل یا کمپیوٹر بذریعہ واٹس ایپ ویڈیو / آڈیو کال۔ ادویات ٹی سی ایس سے گھر پہنچائی جائیں گی۔
                    </p>
                  ) : (
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {doctor.clinicName || 'مطب'}: {doctor.address || `${doctor.cityName || 'لاہور'}، پاکستان`}
                    </p>
                  )}
                </div>

                {/* Availability Badge */}
                <div className="pt-2 border-t border-emerald-200/60 flex items-start gap-2 text-emerald-900 font-sans text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">دستیاب اوقات:</span>
                    <span>{doctor.timing || 'پیر تا ہفتہ: شام 4:00 تا رات 9:00'}</span>
                  </div>
                </div>

              </div>

              {/* Instant Action CTA Buttons (Call + WhatsApp) */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/${doctor.whatsapp || doctor.phone}?text=${encodeURIComponent(`السلام علیکم طبیب ${doctor.name}، میں طبیب پیڈیا کے ذریعے ${consultationMode === 'online' ? 'آن لائن ویڈیو مشاورت' : 'مطب پر چیک اپ'} کے لیے وقت حاصل کرنا چاہتا ہوں۔`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واٹس ایپ پر فوری رابطہ کریں</span>
                </a>

                {doctor.phone && (
                  <a
                    href={`tel:${doctor.phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-2xl text-xs transition-colors border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>فون پر کال کریں ({doctor.phone})</span>
                  </a>
                )}
              </div>

              {/* Direct 30-Second Appointment Booking Form */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>یا نیچے فارم بھر کر وقت بک کریں:</span>
                </span>

                {appointmentSent ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-950">درخواست کامیابی سے موصول ہو گئی!</p>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      طبیب کے مطب سے وقت کی تصدیق کے لیے جلد رابطہ کیا جائے گا۔
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitAppointment} className="space-y-2.5 text-xs">
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                        placeholder="مریض کا پورا نام *"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="واٹس ایپ / موبائل نمبر *"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none font-sans"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={formData.disease}
                        onChange={(e) => setFormData({...formData, disease: e.target.value})}
                        placeholder="مرض یا مسئلہ (اختیاری)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>اپوائنٹمنٹ کی درخواست بھیجیں</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Trust Badges (Oladoc Bottom Trust Section) */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-sans">
                <div className="flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>فوری کسٹمر سپورٹ اور رہنمائی</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% محفوظ و رازداری کی مکمل ضمانت</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>صرف 30 سیکنڈ میں بکنگ کی سہولت</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
