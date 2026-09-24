import React, { useState } from 'react';
import { 
  Stethoscope, 
  BookOpen, 
  Leaf, 
  Cpu, 
  Phone, 
  Search, 
  Menu, 
  X, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles,
  Settings,
  Palette,
  ChevronLeft
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAdmin, 
  onSearchClick, 
  theme, 
  setTheme, 
  siteSettings,
  loggedInDoctor,
  onOpenDoctorPortal,
  onOpenDoctorAuthModal,
  onLogoutDoctor
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'ہوم', icon: Sparkles },
    { id: 'doctors', label: 'اطباء و حکماء ڈائریکٹری', icon: Stethoscope },
    { id: 'blog', label: 'طبی مضامین و ریسرچ', icon: BookOpen },
    { id: 'herbs', label: 'جڑی بوٹیوں کی انسائیکلوپیڈیا', icon: Leaf },
    { id: 'qanoon', label: 'قانون مفرد اعضاء', icon: Cpu },
  ];

  const isNavy = theme === 'navy';
  const brandName = siteSettings?.siteName || 'طبیب پیڈیا';
  const helplinePhone = siteSettings?.helplinePhone || '0300-1234567';
  const whatsappNumber = siteSettings?.whatsappNumber || '923001234567';
  const topbarNotice = siteSettings?.topbarNotice || 'طب یونانی، قانون مفرد اعضاء اور پاکستان کے مستند اطباء کی ڈائریکٹری';
  const tagline = siteSettings?.tagline || 'جامع ہربل و طبی انسائیکلوپیڈیا';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all">
      {/* Top Notification & Helpline Bar */}
      <div className={`${isNavy ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-emerald-950 text-emerald-100 border-emerald-900/50'} text-xs py-2 px-4 border-b transition-colors`}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 ${isNavy ? 'bg-blue-900/60 text-blue-200' : 'bg-emerald-700/60 text-emerald-200'} px-2 py-0.5 rounded-full text-[11px] font-sans`}>
              <ShieldCheck className={`w-3 h-3 ${isNavy ? 'text-blue-400' : 'text-emerald-400'}`} />
              مستند طبیب پلیٹ فارم
            </span>
            <span className="hidden sm:inline text-slate-300">
              {topbarNotice}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-sans mr-auto sm:mr-0">
            {/* Color Scheme Switcher */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
              <Palette className="w-3 h-3 text-amber-300" />
              <button 
                onClick={() => setTheme(isNavy ? 'herbal' : 'navy')}
                className="text-[11px] font-bold text-amber-200 hover:text-white transition-colors"
                title="کلر سکیم تبدیل کریں"
              >
                {isNavy ? 'سکیم: نیوی بلیو' : 'سکیم: ایمرلڈ گرین'}
              </button>
            </div>

            <a 
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className={`flex items-center gap-1 ${isNavy ? 'text-blue-300 hover:text-white' : 'text-emerald-300 hover:text-white'} transition-colors`}
            >
              <Phone className={`w-3 h-3 ${isNavy ? 'text-blue-400' : 'text-emerald-400'}`} />
              <span>ہیلپ لائن: {helplinePhone}</span>
            </a>
            
            <button 
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 ${isNavy ? 'text-blue-300 bg-blue-950/60' : 'text-emerald-300 bg-emerald-900/60'} hover:text-white transition-colors px-2 py-0.5 rounded text-[11px] font-simple font-bold`}
              title="ایڈمن کنٹرول پینل"
            >
              <Settings className="w-3 h-3" />
              <span>ایڈمن پینل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {siteSettings?.logoUrl ? (
              <img src={siteSettings.logoUrl} alt={brandName} className="w-12 h-12 object-contain rounded-2xl bg-white shadow-sm p-1 border border-slate-200" />
            ) : (
              <div className={`w-12 h-12 rounded-2xl ${isNavy ? 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 shadow-blue-900/20' : 'bg-gradient-to-br from-emerald-600 to-teal-800 shadow-emerald-700/20'} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                <Leaf className={`w-7 h-7 ${isNavy ? 'text-blue-200' : 'text-emerald-200'}`} />
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`text-2xl font-bold ${isNavy ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900' : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950'} bg-clip-text text-transparent tracking-tight font-heading`}>
                  {brandName}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans tracking-wide">
                {tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? isNavy 
                        ? 'text-blue-900 bg-blue-50/90 font-bold shadow-xs' 
                        : 'text-emerald-900 bg-emerald-50/90 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-sans bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 ${isNavy ? 'bg-blue-600' : 'bg-emerald-600'} rounded-full`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onSearchClick}
              className={`p-2.5 rounded-xl text-slate-500 ${isNavy ? 'hover:text-blue-700 hover:bg-blue-50' : 'hover:text-emerald-700 hover:bg-emerald-50'} transition-colors`}
              title="سرچ کریں"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Doctor Portal Button / Logged in Doctor Hub */}
            {loggedInDoctor ? (
              <button
                onClick={onOpenDoctorPortal}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-md border border-slate-700 transition-all font-simple group"
                title="طبیب ڈیش بورڈ کھولیں"
              >
                <img 
                  src={loggedInDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'} 
                  alt={loggedInDoctor.name || 'طبیب'} 
                  className="w-7 h-7 rounded-full object-cover border border-emerald-400" 
                />
                <div className="text-right">
                  <span className="block text-white group-hover:text-blue-300 leading-tight truncate max-w-[120px]">{loggedInDoctor.name || 'طبیب'}</span>
                  <span className="text-[10px] text-emerald-400 block font-normal">ڈیش بورڈ فعال</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onOpenDoctorAuthModal('signup')}
                className={`flex items-center gap-2 ${isNavy ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-700/20' : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-700/20'} text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 font-simple`}
              >
                <Stethoscope className="w-4 h-4 text-amber-300" />
                <span>طبیب شمولیت / لاگ ان</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? isNavy
                        ? 'bg-blue-50 text-blue-900 font-bold border-r-4 border-blue-600'
                        : 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-sans">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setTheme(isNavy ? 'herbal' : 'navy')}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 font-bold py-2.5 rounded-xl text-xs"
            >
              <Palette className="w-4 h-4 text-amber-600" />
              <span>کلر سکیم تبدیل کریں: {isNavy ? 'نیوی بلیو' : 'ایمرلڈ گرین'}</span>
            </button>
            {loggedInDoctor ? (
              <button
                onClick={() => {
                  onOpenDoctorPortal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={loggedInDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'} 
                    alt={loggedInDoctor.name || 'طبیب'} 
                    className="w-8 h-8 rounded-full object-cover border border-emerald-400" 
                  />
                  <div className="text-right">
                    <span>{loggedInDoctor.name || 'طبیب'}</span>
                    <span className="text-[10px] text-emerald-400 block font-normal">ڈیش بورڈ کھولیں</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenDoctorAuthModal('signup');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 ${isNavy ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-gradient-to-r from-emerald-600 to-teal-700'} text-white font-bold py-3 rounded-xl shadow-sm text-sm`}
              >
                <Stethoscope className="w-4 h-4 text-amber-300" />
                <span>طبیب شمولیت و رجسٹریشن</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
