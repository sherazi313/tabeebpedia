import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Link as LinkIcon, 
  Mail, 
  Smartphone, 
  Copy, 
  Check, 
  RefreshCw, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Trash2,
  ExternalLink,
  Key
} from 'lucide-react';
import { 
  get2faSetupApi, 
  changeCredentialsApi, 
  revokeDevicesApi, 
  saveSettingsApi 
} from '../api';

export default function AdminSecurityTab({
  settingsForm,
  setSettingsForm,
  siteSettings,
  setSiteSettings,
  showNotification
}) {
  // TOTP & 2FA State
  const [totpSetupData, setTotpSetupData] = useState({ totpSecret: '', otpAuthUrl: '', qr_url: '' });
  const [isTotpLoading, setIsTotpLoading] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Password & Security Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status States
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // CRITICAL: Fetch TOTP Setup
  // If isInitialMount === true: sync settings from DB
  // If isInitialMount === false: ONLY populate QR code and totpSecret.
  // NEVER overwrite prev.twoFactorType, adminUsername, or adminSecretSlug back to DB values!
  const handleFetchTotpSetup = async (isInitialMount = false) => {
    setIsTotpLoading(true);
    try {
      const data = await get2faSetupApi();
      if (data && data.status === 'success') {
        setTotpSetupData({
          totpSecret: data.totpSecret || '',
          otpAuthUrl: data.otpAuthUrl || '',
          qr_url: data.qr_url || ''
        });
        setQrError(false);

        if (isInitialMount) {
          setSettingsForm(prev => ({
            ...prev,
            adminUsername: data.adminUsername || prev.adminUsername || 'sherazi313',
            adminSecretSlug: data.adminSecretSlug || prev.adminSecretSlug || 'tabeeb-7860',
            twoFactorType: data.twoFactorType || prev.twoFactorType || 'disabled',
            totpSecret: data.totpSecret || prev.totpSecret || '',
            adminEmails: data.adminEmails || prev.adminEmails || ['sherazi313@gmail.com', 'nukta313@gmail.com'],
            adminRecoveryEmails: Array.isArray(data.adminEmails) 
              ? data.adminEmails.join(', ') 
              : (prev.adminRecoveryEmails || 'sherazi313@gmail.com, nukta313@gmail.com')
          }));
        } else {
          // Dynamic call: only update totpSecret so draft radio selection DOES NOT snap back!
          setSettingsForm(prev => ({
            ...prev,
            totpSecret: data.totpSecret || prev.totpSecret
          }));
        }
      }
    } catch (err) {
      console.warn('TOTP setup fetch notice:', err);
    } finally {
      setIsTotpLoading(false);
    }
  };

  // Sync on initial mount
  useEffect(() => {
    handleFetchTotpSetup(true);
  }, []);

  // Generate New Key & QR
  const handleGenerateNewTotp = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let newSec = '';
    for (let i = 0; i < 16; i++) {
      newSec += chars[Math.floor(Math.random() * chars.length)];
    }
    const adminUser = settingsForm?.adminUsername || 'admin';
    const otpAuthUrl = `otpauth://totp/TabeebPedia:${encodeURIComponent(adminUser)}?secret=${newSec}&issuer=TabeebPedia&period=30&digits=6`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(otpAuthUrl)}`;

    setTotpSetupData({ totpSecret: newSec, otpAuthUrl, qr_url: qrUrl });
    setQrError(false);
    setSettingsForm(prev => ({ ...prev, totpSecret: newSec }));
    if (showNotification) showNotification('نئی TOTP سیکیورٹی کی اور کیو آر کوڈ جنریٹ کر دیا گیا!');
  };

  // Copy Key to Clipboard
  const handleCopyKey = () => {
    const keyToCopy = totpSetupData.totpSecret || settingsForm?.totpSecret;
    if (keyToCopy) {
      navigator.clipboard.writeText(keyToCopy);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
      if (showNotification) showNotification('سیکیورٹی کی کلپ بورڈ پر کاپی ہو گئی!');
    }
  };

  // Copy Secret URL
  const currentSlug = settingsForm?.adminSecretSlug || 'tabeeb-7860';
  const fullSecretUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${currentSlug}`
    : `https://tabeebpedia.com/${currentSlug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullSecretUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
    if (showNotification) showNotification('خفیہ ایڈمن لاگ ان URL کاپی ہو گیا!');
  };

  // Revoke All Trusted Devices
  const handleRevokeDevices = async () => {
    if (!window.confirm('کیا آپ واقعی تمام تصدیق شدہ براؤزرز اور ڈیوائسز منسوخ کرنا چاہتے ہیں؟\nاس سے اگلے لاگ ان پر تمام ڈیوائسز پر 2FA لازمی ہوگا۔')) {
      return;
    }
    setIsRevoking(true);
    try {
      const res = await revokeDevicesApi();
      if (res && res.status === 'success') {
        localStorage.removeItem('tabeeb_2fa_device_token');
        setStatusMsg({ type: 'success', text: res.message || 'تمام ڈیوائسز کی تصدیق کامیابی سے منسوخ کر دی گئی!' });
        if (showNotification) showNotification('تمام ٹرسٹڈ ڈیوائسز منسوخ کر دی گئیں!');
      } else {
        setStatusMsg({ type: 'error', text: res?.message || 'ڈیوائسز منسوخ کرنے میں رکاوٹ آئی۔' });
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'سرور سے رابطہ قائم نہیں ہو سکا۔' });
    } finally {
      setIsRevoking(false);
    }
  };

  // Save All Security Settings
  const handleSaveSecurity = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const u = (settingsForm?.adminUsername || 'sherazi313').trim();
      const slug = (settingsForm?.adminSecretSlug || 'tabeeb-7860').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

      if (!u) {
        setStatusMsg({ type: 'error', text: 'ایڈمن یوزر نیم درج کرنا لازمی ہے۔' });
        setIsSaving(false);
        return;
      }
      if (!slug) {
        setStatusMsg({ type: 'error', text: 'خفیہ ایڈمن URL سلگ درج کرنا لازمی ہے۔' });
        setIsSaving(false);
        return;
      }

      const payload = {
        username: u,
        adminSecretSlug: slug,
        twoFactorType: settingsForm?.twoFactorType || 'disabled',
        totpSecret: settingsForm?.totpSecret || totpSetupData.totpSecret || '',
        adminEmails: settingsForm?.adminRecoveryEmails || settingsForm?.adminEmails
      };

      if (newPassword) {
        if (newPassword.length < 6) {
          setStatusMsg({ type: 'error', text: 'نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔' });
          setIsSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setStatusMsg({ type: 'error', text: 'نیا پاس ورڈ اور تصدیقی پاس ورڈ ایک جیسے نہیں ہیں۔' });
          setIsSaving(false);
          return;
        }
        payload.newPassword = newPassword;
      }

      // 1. Call Backend API
      const res = await changeCredentialsApi(payload);

      // 2. Persist in Site Settings
      const updatedSiteSettings = {
        ...(siteSettings || {}),
        ...settingsForm,
        ...payload,
        adminPassword: newPassword || siteSettings?.adminPassword || '5903911a'
      };

      if (setSiteSettings) {
        setSiteSettings(updatedSiteSettings);
      }
      await saveSettingsApi(updatedSiteSettings);

      // 3. Keep LocalStorage Synced
      localStorage.setItem('tabeeb_admin_custom_username', payload.username);
      localStorage.setItem('tabeeb_admin_secret_slug', payload.adminSecretSlug);
      if (newPassword) {
        localStorage.setItem('tabeeb_admin_custom_password', newPassword);
      }

      setNewPassword('');
      setConfirmPassword('');
      setStatusMsg({ type: 'success', text: res?.message || 'ایڈمن سیکیورٹی و 2FA کی ترتیبات کامیابی سے محفوظ ہو گئیں!' });
      if (showNotification) showNotification('ایڈمن سیکیورٹی اور 2FA سیٹنگز محفوظ ہو گئیں!');
    } catch (err) {
      console.error('Save security settings error:', err);
      setStatusMsg({ type: 'error', text: 'سیٹنگز محفوظ کرنے میں خرابی پیش آئی۔' });
    } finally {
      setIsSaving(false);
    }
  };

  // Fallback QR Image URL
  const activeQrCodeUrl = qrError 
    ? `https://quickchart.io/qr?size=220&text=${encodeURIComponent(totpSetupData.otpAuthUrl || '')}`
    : (totpSetupData.qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(totpSetupData.otpAuthUrl || '')}`);

  return (
    <div className="space-y-6 text-right animate-in fade-in-50" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/30 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-simple">ایڈمن سیکیورٹی و ملٹی فیکٹر اتھینٹیکیشن (2FA)</h2>
              <span className="text-[11px] bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full font-mono">
                Enterprise Level
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-simple">
              خفیہ ایڈمن URL، ایڈمن یوزر نیم، پاس ورڈ، ای میل OTP اور گوگل اتھینٹیکیٹر کی ترتیبات
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveSecurity}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all font-simple shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'محفوظ ہو رہا ہے...' : 'سیٹنگز محفوظ کریں'}</span>
        </button>
      </div>

      {/* Global Status Message */}
      {statusMsg.text && (
        <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed animate-in fade-in-50 flex items-center gap-2.5 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
            : 'bg-red-950/60 border-red-500/50 text-red-300'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 1: ADMIN CREDENTIALS & SECRET ADMIN URL              */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-simple">ایڈمن لاگ ان و خفیہ یو آر ایل (Credentials & Secret Route)</h3>
            <p className="text-xs text-slate-400">یوزر نیم، نیا پاس ورڈ اور پورٹل تک رسائی کا خفیہ لنک</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Admin Username */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>ایڈمن یوزر نیم (Admin Username) *</span>
            </label>
            <input
              type="text"
              value={settingsForm?.adminUsername || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, adminUsername: e.target.value })}
              placeholder="sherazi313"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-blue-500 outline-none text-left"
              dir="ltr"
              required
            />
          </div>

          {/* Secret URL Slug */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>خفیہ ایڈمن URL سلگ (Secret URL Slug) *</span>
            </label>
            <input
              type="text"
              value={settingsForm?.adminSecretSlug || 'tabeeb-7860'}
              onChange={(e) => {
                const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                setSettingsForm({ ...settingsForm, adminSecretSlug: clean });
              }}
              placeholder="tabeeb-7860"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-blue-500 outline-none text-left"
              dir="ltr"
              required
            />
          </div>

          {/* Secret URL Live Preview Box */}
          <div className="md:col-span-2 bg-slate-950 border border-blue-900/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-400">🔗 آپ کا فعال خفیہ ایڈمن لاگ ان URL:</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-emerald-400 font-bold break-all dir-ltr text-left">
                {fullSecretUrl}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                ⚠️ سیکیورٹی نوٹس: پبلک ویب سائٹ سے <code className="text-red-400 bg-slate-900 px-1.5 py-0.5 rounded">/admin</code> یا <code className="text-red-400 bg-slate-900 px-1.5 py-0.5 rounded">/login</code> وزٹ کرنے پر عام وزیٹرز کو ہوم پیج پر بھیج دیا جائے گا۔ ایڈمن لاگ ان صرف اوپر والے خفیہ URL سے کھلے گا۔
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border border-slate-700"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'کاپی ہو گیا!' : 'یو آر ایل کاپی کریں'}</span>
            </button>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span>نیا پاس ورڈ (خالی چھوڑنے پر پرانا پاس ورڈ برقرار رہے گا):</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="نیا پاس ورڈ درج کریں (اختیاری)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-blue-500 outline-none text-left pr-10"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple">
              نئے پاس ورڈ کی تصدیق:
            </label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="نیا پاس ورڈ دوبارہ درج کریں..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-blue-500 outline-none text-left"
              dir="ltr"
            />
          </div>

          {/* Admin Alert / Recovery Emails */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>نوٹیفکیشن و OTP ای میل ایڈریسز (Admin Alert Emails):</span>
            </label>
            <input
              type="text"
              value={settingsForm?.adminRecoveryEmails || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, adminRecoveryEmails: e.target.value })}
              placeholder="sherazi313@gmail.com, nukta313@gmail.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-blue-500 outline-none text-left"
              dir="ltr"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              ای میل OTP کوڈز اور پاس ورڈ ریکوری کی درخواستیں ان ای میل ایڈریسز پر ارسال کی جائیں گی۔
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: MULTI-FACTOR AUTHENTICATION (2FA) MODE SELECTION  */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-simple">ملٹی فیکٹر اتھینٹیکیشن موڈ (2FA / MFA Mode)</h3>
            <p className="text-xs text-slate-400">اپنے ایڈمن اکاؤنٹ کی سیکیورٹی کے لیے مطلوبہ 2FA طریقہ منتخب کریں</p>
          </div>
        </div>

        {/* 3 Radio Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Option 1: Disabled */}
          <label 
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              settingsForm?.twoFactorType === 'disabled' || !settingsForm?.twoFactorType
                ? 'bg-slate-950 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <input
                type="radio"
                name="twoFactorType"
                value="disabled"
                checked={settingsForm?.twoFactorType === 'disabled' || !settingsForm?.twoFactorType}
                onChange={() => setSettingsForm(prev => ({ ...prev, twoFactorType: 'disabled' }))}
                className="w-4 h-4 text-blue-600 mt-1 cursor-pointer"
              />
              <span className="text-[11px] bg-slate-800 text-slate-400 font-mono font-bold px-2 py-0.5 rounded-full">
                بنیادی سیکیورٹی
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-simple">1. غیر فعال (Disabled)</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                صرف یوزر نیم اور پاس ورڈ کے ساتھ براہ راست لاگ ان۔ کوئی اضافی تصدیقی کوڈ درکار نہیں ہوگا۔
              </p>
            </div>
          </label>

          {/* Option 2: Email OTP */}
          <label 
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              settingsForm?.twoFactorType === 'email_otp'
                ? 'bg-slate-950 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <input
                type="radio"
                name="twoFactorType"
                value="email_otp"
                checked={settingsForm?.twoFactorType === 'email_otp'}
                onChange={() => setSettingsForm(prev => ({ ...prev, twoFactorType: 'email_otp' }))}
                className="w-4 h-4 text-amber-500 mt-1 cursor-pointer"
              />
              <span className="text-[11px] bg-amber-950 border border-amber-800 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full">
                اعلیٰ سیکیورٹی
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-simple flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>2. ای میل کوڈ (Email OTP)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                درست پاس ورڈ درج کرنے پر آپ کی ای میل پر 6 ہندسوں کا تصدیقی OTP کوڈ بھیجا جائے گا۔
              </p>
            </div>
          </label>

          {/* Option 3: Google Authenticator */}
          <label 
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              settingsForm?.twoFactorType === 'totp'
                ? 'bg-slate-950 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <input
                type="radio"
                name="twoFactorType"
                value="totp"
                checked={settingsForm?.twoFactorType === 'totp'}
                onChange={() => {
                  // CRITICAL UI RULE: update draft state, then fetch QR without overriding draft values
                  setSettingsForm(prev => ({ ...prev, twoFactorType: 'totp' }));
                  handleFetchTotpSetup(false);
                }}
                className="w-4 h-4 text-emerald-500 mt-1 cursor-pointer"
              />
              <span className="text-[11px] bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">
                زیادہ محفوظ ترین
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-simple flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>3. گوگل اتھینٹیکیٹر (TOTP)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                گوگل یا مائیکروسافٹ اتھینٹیکیٹر ایپ کا وقت پر مبنی کوڈ (RFC 6238)۔ انٹرنیٹ کے بغیر بھی کام کرتا ہے۔
              </p>
            </div>
          </label>

        </div>

        {/* ============================================================ */}
        {/* SUB-PANEL: GOOGLE AUTHENTICATOR SETUP BOX                    */}
        {/* ============================================================ */}
        {settingsForm?.twoFactorType === 'totp' && (
          <div className="mt-6 p-6 bg-slate-950 border border-emerald-500/30 rounded-3xl space-y-6 animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white font-simple">گوگل اتھینٹیکیٹر سیٹ اپ باکس (TOTP Configuration)</h4>
              </div>
              <button
                type="button"
                onClick={handleGenerateNewTotp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>نئی کی اور کیو آر جنریٹ کریں</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Code Container */}
              <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-4 border-emerald-500/40">
                  {isTotpLoading ? (
                    <Loader2 className="w-8 h-8 text-slate-700 animate-spin" />
                  ) : (
                    <img
                      src={activeQrCodeUrl}
                      alt="Google Authenticator QR Code"
                      onError={() => setQrError(true)}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <span className="text-[11px] text-slate-400">اپنے موبائل کیمرا یا ایپ سے اسکین کریں</span>
              </div>

              {/* Instructions & Manual Key */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-simple">
                    مینوئل سیکیورٹی کی (Manual Secret Base32 Key):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={totpSetupData.totpSecret || settingsForm?.totpSecret || ''}
                      className="flex-1 bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-sm px-4 py-2.5 rounded-xl text-left tracking-widest outline-none"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer shadow-md"
                    >
                      {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedKey ? 'کاپی ہو گئی!' : 'کی کاپی کریں'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                  <p className="font-bold text-emerald-400">📱 اتھینٹیکیٹر کنیکٹ کرنے کا طریقہ:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 pr-1">
                    <li>اپنے موبائل میں <strong>Google Authenticator</strong> یا <strong>Microsoft Authenticator</strong> ایپ کھولیں۔</li>
                    <li>پلس (+) کا نشان دبا کر <strong>"Scan a QR code"</strong> منتخب کریں۔</li>
                    <li>یہ کیو آر کوڈ اسکین کریں، یا مینوئل کی داخل کریں۔</li>
                    <li>سیٹنگز محفوظ کرنے کے بعد لاگ ان کے وقت ایپ میں ظاہر ہونے والا 6 ہندسوں کا کوڈ درج کریں۔</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* SECTION 3: 30-DAY TRUSTED DEVICES MANAGEMENT                 */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-simple">30 دن تک تصدیق شدہ ڈیوائسز (Trusted Devices)</h3>
              <p className="text-xs text-slate-400">جن ڈیوائسز پر 30 دن کے لیے لاگ ان یاد رکھا گیا ہے ان کی سیکیورٹی</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRevokeDevices}
            disabled={isRevoking}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isRevoking ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <Trash2 className="w-4 h-4 text-red-400" />}
            <span>تمام ڈیوائسز کی تصدیق ختم کریں (Revoke All)</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          جب آپ 2FA اسکرین پر "اس براؤزر کو 30 دن کے لیے یاد رکھیں" منتخب کرتے ہیں، تو اس ڈیوائس کا منفرد سیکیورٹی ٹوکن محفوظ ہو جاتا ہے۔ اگر آپ کسی اجنبی ڈیوائس پر لاگ ان چھوڑ آئے ہوں تو "تمام ڈیوائسز کی تصدیق ختم کریں" پر کلک کر کے فوری طور پر تمام محفوظ شدہ ٹوکنز کو بیک وقت کالعدم کر سکتے ہیں۔
        </p>
      </div>

    </div>
  );
}
