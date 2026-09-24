import React from 'react';
import { 
  Leaf, 
  Phone, 
  MessageCircle,
  Facebook,
  Youtube,
  Instagram,
  Heart
} from 'lucide-react';
import { CITIES, SPECIALTIES } from '../data/mockData';

export default function Footer({ onNavigate, siteSettings }) {
  const brandName = siteSettings?.siteName || 'طبیب پیڈیا';
  const aboutText = siteSettings?.footerAbout || 'پاکستان کا سب سے معتبر ڈیجیٹل ہربل پورٹل۔ ہمارا مقصد طب یونانی، طب نبوی اور قانون مفرد اعضاء کو جدید سائنسی معیار اور سہولت کے ساتھ ہر فرد تک پہنچانا ہے۔';
  const whatsapp = siteSettings?.whatsappNumber || '';
  const helpline = siteSettings?.helplinePhone || '';
  const facebook = siteSettings?.facebookUrl || '';
  const youtube = siteSettings?.youtubeUrl || '';
  const instagram = siteSettings?.instagramUrl || '';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900 text-right no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand + Contact + Social */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              {siteSettings?.logoUrl ? (
                <img src={siteSettings.logoUrl} alt={brandName} className="w-12 h-12 object-contain rounded-2xl bg-white/10 p-1" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                  <Leaf className="w-7 h-7 text-emerald-200" />
                </div>
              )}
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">{brandName}</span>
                <span className="text-[10px] text-emerald-400 block font-sans">{siteSettings?.tagline || 'TabeebPedia.com'}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">{aboutText}</p>

            {/* Contact */}
            <div className="space-y-2 text-xs">
              {helpline && (
                <a href={`tel:${helpline}`} className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors justify-end">
                  <span>{helpline}</span>
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors justify-end">
                  <span>واٹس ایپ پر رابطہ</span>
                  <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                </a>
              )}
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 justify-end pt-1">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-blue-700 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-red-700 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110" title="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-pink-700 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {!facebook && !youtube && !instagram && (
                <span className="text-[10px] text-slate-600 font-simple">سوشل لنکس — ایڈمن سیٹنگز سے شامل کریں</span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold text-sm border-r-2 border-emerald-500 pr-2">اہم لنکس</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">صفحۂ اول</button></li>
              <li><button onClick={() => onNavigate('doctors')} className="hover:text-emerald-400 transition-colors">اطباء و حکماء ڈائریکٹری</button></li>
              <li><button onClick={() => onNavigate('blog')} className="hover:text-emerald-400 transition-colors">طبی مضامین و ریسرچ</button></li>
              <li><button onClick={() => onNavigate('herbs')} className="hover:text-emerald-400 transition-colors">جڑی بوٹیوں کی انسائیکلوپیڈیا</button></li>
              <li><button onClick={() => onNavigate('qanoon')} className="hover:text-emerald-400 transition-colors">قانون مفرد اعضاء گائیڈ</button></li>
            </ul>
          </div>

          {/* Specialties */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold text-sm border-r-2 border-emerald-500 pr-2">علاج و تخصصات</h4>
            <ul className="space-y-2 text-slate-400">
              {SPECIALTIES.slice(1, 6).map(spec => (
                <li key={spec.id}>
                  <button onClick={() => onNavigate('doctors')} className="hover:text-emerald-400 transition-colors">{spec.name}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold text-sm border-r-2 border-emerald-500 pr-2">شہر کے لحاظ سے</h4>
            <ul className="space-y-2 text-slate-400">
              {CITIES.slice(1, 6).map(city => (
                <li key={city.id}>
                  <button onClick={() => onNavigate('doctors')} className="hover:text-emerald-400 transition-colors">اطباء {city.name}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center">
          <strong className="text-slate-300">طبی انتباہ و ڈس کلیمر:</strong> طبیب پیڈیا ویب سائٹ پر فراہم کردہ تمام معلومات، مقالات اور نسخہ جات صرف علمی اور معلوماتی مقاصد کے لیے ہیں۔ یہ کسی مستند معالج یا ڈاکٹر کے باقاعدہ معائنے کا متبادل نہیں ہیں۔
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-sans">
          <p>© {new Date().getFullYear()} TabeebPedia.com — {siteSettings?.copyrightText || 'تمام جملہ حقوق محفوظ ہیں۔'}</p>
          <p className="flex items-center gap-1 text-slate-600">
            <span>محبت سے بنایا گیا</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>پاکستان کے لیے</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
