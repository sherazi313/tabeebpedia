import React, { useState } from 'react';
import { 
  X, 
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
  UserCheck
} from 'lucide-react';

export default function DoctorProfileModal({ doctor, onClose }) {
  const [appointmentSent, setAppointmentSent] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    disease: '',
    date: '',
    notes: ''
  });

  if (!doctor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointmentSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-right pt-2">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white/20 shadow-md"
            />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">{doctor.name}</h2>
                {doctor.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs px-2.5 py-0.5 rounded-full font-sans">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مصدقہ طبیب</span>
                  </span>
                )}
              </div>
              <p className="text-emerald-100 text-sm font-medium">{doctor.title}</p>
              <p className="text-xs text-emerald-200/80 font-sans">{doctor.qualifications}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-sans text-emerald-100">
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{doctor.rating} ({doctor.reviewsCount} تصدیق شدہ آراء)</span>
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Award className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{doctor.experience} سالہ طبی تجربہ</span>
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{doctor.cityName}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-right">
          
          {/* Quick Action Floating Bar */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs text-emerald-800 font-bold block">فوری آن لائن رہنمائی:</span>
              <span className="text-xs text-slate-600">براہ راست واٹس ایپ یا فون کے ذریعے طبیب سے رابطہ کریں</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${doctor.phone}`}
                className="flex items-center gap-1.5 bg-white text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>کال کریں</span>
              </a>
              <a
                href={`https://wa.me/${doctor.whatsapp}?text=${encodeURIComponent(`السلام علیکم ${doctor.name}، میں طبیب پیڈیا کے ذریعے آپ سے رابطہ کر رہا ہوں۔`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واٹس ایپ چیٹ</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Details, Bio, Education */}
            <div className="md:col-span-2 space-y-6">
              
              {/* About Section */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  معالج کا تعارف اور طریقہ علاج
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {doctor.about}
                </p>
              </div>

              {/* Services Offered */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  خصوصی طبی خدمات (Services)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {doctor.services?.map((srv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Qualifications */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>طبی اسناد و تعلیم</span>
                </h3>
                <div className="space-y-2 pt-1">
                  {doctor.education?.map((edu, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="font-bold text-slate-800 font-sans">{edu.degree}</div>
                      <div className="text-slate-500 mt-0.5">{edu.institute}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 1 Column: Clinic Info & Appointment Card */}
            <div className="space-y-4">
              
              {/* Clinic Info Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>مطب / کلینک کی معلومات</span>
                </h4>
                
                <div className="space-y-2 text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800 block">{doctor.clinicName}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{doctor.address}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="font-bold text-slate-700 mb-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>اوقاتِ کار:</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-sans">{doctor.timing}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between font-sans">
                    <span className="text-slate-500">مشاورت فیس:</span>
                    <span className="font-bold text-emerald-800 text-sm">{doctor.fee} روپے</span>
                  </div>
                </div>
              </div>

              {/* Direct Appointment Request Form */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>مطب پر وقت (Appointment) حاصل کریں</span>
                </h4>

                {appointmentSent ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-900">آپ کی درخواست موصول ہو گئی ہے!</p>
                    <p className="text-[11px] text-emerald-700">کلینک کا عملہ جلد آپ سے رابطہ کر کے وقت کی تصدیق کرے گا۔</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block mb-1">مریض کا نام</label>
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                        placeholder="نام لکھیں..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block mb-1">واٹس ایپ / فون نمبر</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="0300-1234567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block mb-1">بیماری / مسئلہ</label>
                      <input
                        type="text"
                        value={formData.disease}
                        onChange={(e) => setFormData({...formData, disease: e.target.value})}
                        placeholder="مثلاً: معدے کی جلن، جوڑوں کا درد"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>درخواست بھیجیں</span>
                    </button>
                  </form>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
