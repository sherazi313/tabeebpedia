import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  Smartphone, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  X,
  ShieldAlert
} from 'lucide-react';
import { loginAdminApi, verify2faApi, forgotPasswordApi, resetPasswordApi } from '../api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, siteSettings }) {
  const [mode, setMode] = useState('credentials'); // 'credentials' | '2fa' | 'forgot'
  const [forgotStep, setForgotStep] = useState(1); // 1: send code, 2: enter code & set new pass

  // Credentials Mode State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2FA Mode State
  const [tempToken, setTempToken] = useState('');
  const [twoFactorType, setTwoFactorType] = useState('totp'); // 'totp' | 'email_otp'
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);

  // Forgot Password Mode State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devOtpCode, setDevOtpCode] = useState('');

  // Reset modal state on opening
  useEffect(() => {
    if (isOpen) {
      setMode('credentials');
      setForgotStep(1);
      setUsername('');
      setPassword('');
      setTwoFactorCode('');
      setTempToken('');
      setDevOtpCode('');
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Safe Close Handler: Always cleans browser URL to '/'
  const handleSafeClose = () => {
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', '/');
      } catch (e) {}
    }
    if (onClose) onClose();
  };

  // 1. Submit Credentials Handler
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      setErrorMsg('براہ کرم ایڈمن یوزر نیم اور پاس ورڈ دونوں درج کریں۔');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await loginAdminApi({ username: u, password: p });

      if (res && res.status === '2fa_required') {
        setTempToken(res.temp_token || '');
        setTwoFactorType(res.twoFactorType || 'totp');
        setDevOtpCode(res.dev_code || '');
        setTwoFactorCode('');
        setMode('2fa');
      } else if (res && (res.status === 'success' || res.token)) {
        // Direct Login (2FA disabled or trusted device)
        if (res.token) {
          sessionStorage.setItem('tabeeb_admin_token', res.token);
          sessionStorage.setItem('tabeeb_admin_auth', 'true');
        }
        if (onLoginSuccess) {
          onLoginSuccess(res);
        }
      } else {
        setErrorMsg(res?.message || 'یوزر نیم یا پاسورڈ غلط ہے۔ دوبارہ کوشش کریں۔');
      }
    } catch (err) {
      setErrorMsg('سرور سے رابطہ قائم نہیں ہو سکا۔ انٹرنیٹ کنکشن چیک کریں۔');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit 2FA Verification Handler
  const handleVerify2faSubmit = async (e) => {
    e.preventDefault();
    const code = twoFactorCode.trim();

    if (!code || code.length < 6) {
      setErrorMsg('براہ کرم مکمل 6 ہندسوں کا تصدیقی کوڈ درج کریں۔');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await verify2faApi({
        temp_token: tempToken,
        code,
        remember_device: rememberDevice
      });

      if (res && (res.status === 'success' || res.token)) {
        if (res.token) {
          sessionStorage.setItem('tabeeb_admin_token', res.token);
          sessionStorage.setItem('tabeeb_admin_auth', 'true');
        }
        if (res.device_token) {
          localStorage.setItem('tabeeb_2fa_device_token', res.device_token);
        }
        if (onLoginSuccess) {
          onLoginSuccess(res);
        }
      } else {
        setErrorMsg(res?.message || 'تصدیقی کوڈ غلط ہے یا میعاد ختم ہو چکی ہے۔');
      }
    } catch (err) {
      setErrorMsg('2FA تصدیق میں خرابی واقع ہوئی۔');
    } finally {
      setLoading(false);
    }
  };

  // 3. Request Password Reset Code Handler
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    const em = forgotEmail.trim();

    if (!em || !em.includes('@')) {
      setErrorMsg('درست ایڈمن ای میل ایڈریس درج کریں۔');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await forgotPasswordApi({ email: em });
      if (res && res.status === 'success') {
        if (res.dev_code) setDevOtpCode(res.dev_code);
        setSuccessMsg(res.message || '6 ہندسوں کا کوڈ آپ کی ای میل پر بھیج دیا گیا ہے۔');
        setForgotStep(2);
      } else {
        setErrorMsg(res?.message || 'یہ ای میل ایڈمن ریکارڈ میں موجود نہیں ہے۔');
      }
    } catch (err) {
      setErrorMsg('کوڈ بھیجنے میں خرابی ہوئی، دوبارہ کوشش کریں۔');
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit New Password Handler
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    const c = resetCode.trim();
    const np = newPassword.trim();
    const cp = confirmPassword.trim();

    if (!c || c.length < 6) {
      setErrorMsg('براہ کرم 6 ہندسوں کا تصدیقی کوڈ درج کریں۔');
      return;
    }
    if (!np || np.length < 6) {
      setErrorMsg('نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔');
      return;
    }
    if (np !== cp) {
      setErrorMsg('دونوں پاس ورڈز ایک جیسے نہیں ہیں!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await resetPasswordApi({
        email: forgotEmail.trim(),
        code: c,
        new_password: np
      });

      if (res && res.status === 'success') {
        setSuccessMsg('پاس ورڈ کامیابی سے تبدیل ہو گیا! اب آپ لاگ ان کر سکتے ہیں۔');
        setTimeout(() => {
          setMode('credentials');
          setPassword('');
          setErrorMsg('');
        }, 1800);
      } else {
        setErrorMsg(res?.message || 'ری سیٹ کوڈ غلط ہے یا میعاد ختم ہو چکی ہے۔');
      }
    } catch (err) {
      setErrorMsg('پاس ورڈ تبدیل کرنے میں خرابی ہوئی۔');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-right overflow-hidden transition-all"
        dir="rtl"
      >
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={handleSafeClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          title="بند کریں"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================ */}
        {/* MODE 1: CREDENTIALS (USERNAME + PASSWORD)                   */}
        {/* ============================================================ */}
        {mode === 'credentials' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-900/30 border border-blue-400/20">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-simple">ایڈمن پورٹل لاگ ان</h2>
              <p className="text-xs text-slate-400 font-simple">
                محفوظ و تصدیق شدہ ایڈمنسٹریٹر کے لیے
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-red-300 font-bold leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300 font-bold leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>ایڈمن یوزر نیم یا ای میل:</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                  placeholder="یوزر نیم یا ای میل درج کریں..."
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-left font-mono"
                  dir="ltr"
                  autoFocus
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 font-simple flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>پاسورڈ (Password):</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                      setForgotStep(1);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold hover:underline font-simple transition-colors"
                  >
                    پاس ورڈ بھول گئے؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                    placeholder="پاسورڈ درج کریں..."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-left font-mono pr-11"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 font-simple cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>{loading ? 'تصدیق ہو رہی ہے...' : 'ایڈمن لاگ ان'}</span>
              </button>

              <button
                type="button"
                onClick={handleSafeClose}
                className="w-full text-slate-500 hover:text-slate-300 text-xs font-simple py-1.5 transition-colors cursor-pointer text-center"
              >
                ویب سائٹ پر واپس جائیں
              </button>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: MULTI-FACTOR AUTHENTICATION (TOTP / EMAIL OTP)       */}
        {/* ============================================================ */}
        {mode === '2fa' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30 border border-emerald-400/20">
                {twoFactorType === 'totp' ? (
                  <Smartphone className="w-8 h-8 text-white" />
                ) : (
                  <Mail className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-simple">
                {twoFactorType === 'totp'
                  ? 'گوگل اتھینٹیکیٹر تصدیق'
                  : 'ای میل تصدیقی کوڈ (OTP)'}
              </h2>
              <p className="text-xs text-slate-400 font-simple leading-relaxed max-w-xs mx-auto">
                {twoFactorType === 'totp'
                  ? 'اپنے موبائل میں گوگل اتھینٹیکیٹر ایپ کھولیں اور 6 ہندسوں کا سیکیورٹی کوڈ درج کریں'
                  : 'آپ کی رجسٹرڈ ایڈمن ای میل پر 6 ہندسوں کا کوڈ بھیجا گیا ہے۔ کوڈ درج کریں'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-red-300 font-bold leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {devOtpCode && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <div className="text-xs text-emerald-300 font-bold font-simple">
                  🛡️ لوکل ڈویلپمنٹ او ٹی پی (Localhost Dev OTP):
                </div>
                <div className="font-mono text-2xl font-black text-amber-300 tracking-[0.3em] bg-slate-950/80 py-2 rounded-xl border border-emerald-500/30">
                  {devOtpCode}
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorCode(devOtpCode)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl font-simple font-bold transition-all cursor-pointer shadow-md shadow-emerald-900/30"
                >
                  یہ کوڈ خودکار درج کریں
                </button>
              </div>
            )}

            <form onSubmit={handleVerify2faSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple text-center">
                  6 ہندسوں کا سیکیورٹی کوڈ درج کریں:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '');
                    setTwoFactorCode(clean);
                    setErrorMsg('');
                  }}
                  placeholder="000000"
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded-2xl px-4 py-3.5 text-white text-2xl font-mono text-center tracking-[0.5em] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                  dir="ltr"
                  autoFocus
                  required
                />
              </div>

              {/* 30-Day Trusted Device Checkbox */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
                <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300 font-simple select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-600 cursor-pointer"
                  />
                  <span>اس براؤزر کو 30 دن کے لیے یاد رکھیں (Remember for 30 days)</span>
                </label>
                <p className="text-[10px] text-slate-500 mt-1 pr-7">
                  اس آپشن سے آپ کو اگلے 30 دن تک اس ڈیوائس پر بار بار 2FA کوڈ درج نہیں کرنا پڑے گا۔
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || twoFactorCode.length < 6}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 font-simple cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? 'کوڈ کی تصدیق ہو رہی ہے...' : 'تصدیق کریں اور داخل ہوں'}</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('credentials');
                    setErrorMsg('');
                  }}
                  className="text-slate-400 hover:text-white font-simple flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>واپس لاگ ان فارم پر جائیں</span>
                </button>
                <button
                  type="button"
                  onClick={handleSafeClose}
                  className="text-slate-500 hover:text-slate-300 font-simple transition-colors cursor-pointer"
                >
                  ویب سائٹ پر جائیں
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 3: FORGOT PASSWORD RECOVERY                             */}
        {/* ============================================================ */}
        {mode === 'forgot' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 via-orange-600 to-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-900/30 border border-amber-400/20">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-simple">ایڈمن پاس ورڈ ری سیٹ</h2>
              <p className="text-xs text-slate-400 font-simple">
                {forgotStep === 1
                  ? 'رجسٹرڈ ایڈمن ای میل پر 6 ہندسوں کا تصدیقی کوڈ حاصل کریں'
                  : 'موصولہ کوڈ درج کریں اور نیا پاس ورڈ سیٹ کریں'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-red-300 font-bold leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300 font-bold leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Step 1: Send Reset Code */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendResetCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>ایڈمن ای میل ایڈریس درج کریں:</span>
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => { setForgotEmail(e.target.value); setErrorMsg(''); }}
                    placeholder="sherazi313@gmail.com"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-left font-mono"
                    dir="ltr"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-600/20 font-simple cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{loading ? 'کوڈ بھیجا جا رہا ہے...' : 'ری سیٹ کوڈ بھیجیں'}</span>
                </button>
              </form>
            )}

            {/* Step 2: Enter Code & New Password */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                {devOtpCode && (
                  <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-center space-y-2">
                    <div className="text-xs text-amber-300 font-bold font-simple">
                      🛡️ لوکل ڈویلپمنٹ ری سیٹ کوڈ (Localhost Dev Code):
                    </div>
                    <div className="font-mono text-2xl font-black text-amber-300 tracking-[0.3em] bg-slate-950/80 py-2 rounded-xl border border-amber-500/30">
                      {devOtpCode}
                    </div>
                    <button
                      type="button"
                      onClick={() => setResetCode(devOtpCode)}
                      className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-xl font-simple font-bold transition-all cursor-pointer shadow-md shadow-amber-900/30"
                    >
                      یہ کوڈ خودکار درج کریں
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple text-center">
                    ای میل پر موصول شدہ 6 ہندسوں کا کوڈ:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => {
                      setResetCode(e.target.value.replace(/[^0-9]/g, ''));
                      setErrorMsg('');
                    }}
                    placeholder="000000"
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-3 text-white text-xl font-mono text-center tracking-widest focus:outline-none focus:border-amber-500"
                    dir="ltr"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>نیا پاسورڈ (کم از کم 6 حروف):</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
                      placeholder="نیا پاس ورڈ درج کریں..."
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 text-left font-mono pr-11"
                      dir="ltr"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple">
                    نئے پاسورڈ کی تصدیق:
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                    placeholder="نیا پاس ورڈ دوبارہ درج کریں..."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 text-left font-mono"
                    dir="ltr"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg font-simple cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{loading ? 'پاس ورڈ محفوظ ہو رہا ہے...' : 'نیا پاس ورڈ سیٹ کریں'}</span>
                </button>
              </form>
            )}

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('credentials');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-slate-400 hover:text-white font-simple flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>واپس لاگ ان فارم پر جائیں</span>
              </button>
              <button
                type="button"
                onClick={handleSafeClose}
                className="text-slate-500 hover:text-slate-300 font-simple transition-colors cursor-pointer"
              >
                ویب سائٹ پر جائیں
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
