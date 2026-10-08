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
  Key,
  X
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

      if (isChangingPassword) {
        if (!newPassword || newPassword.length < 6) {
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
        adminPassword: (isChangingPassword && newPassword) ? newPassword : (siteSettings?.adminPassword || '5903911a')
      };

      if (setSiteSettings) {
        setSiteSettings(updatedSiteSettings);
      }
      await saveSettingsApi(updatedSiteSettings);

      // 3. Keep LocalStorage Synced
      localStorage.setItem('tabeeb_admin_custom_username', payload.username);
      localStorage.setItem('tabeeb_admin_secret_slug', payload.adminSecretSlug);
      if (isChangingPassword && newPassword) {
        localStorage.setItem('tabeeb_admin_custom_password', newPassword);
      }

      setIsChangingPassword(false);
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
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border border-emerald-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-simple">ایڈمن سیکیورٹی و ملٹی فیکٹر اتھینٹیکیشن (2FA)</h2>
              <span className="text-[11px] bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
                Enterprise Level
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-simple">
              خفیہ ایڈمن URL، ایڈمن یوزر نیم، پاس ورڈ، ای میل OTP اور گوگل اتھینٹیکیٹر کی ترتیبات
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveSecurity}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all font-simple shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'محفوظ ہو رہا ہے...' : 'سیٹنگز محفوظ کریں'}</span>
        </button>
      </div>

      {/* Global Status Message */}
      {statusMsg.text && (
        <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed animate-in fade-in-50 flex items-center gap-2.5 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 1: ADMIN CREDENTIALS & SECRET ADMIN URL              */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 font-simple">ایڈمن لاگ ان و خفیہ یو آر ایل (Credentials & Secret Route)</h3>
            <p className="text-xs text-slate-500">یوزر نیم، نیا پاس ورڈ اور پورٹل تک رسائی کا خفیہ لنک</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Admin Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>ایڈمن یوزر نیم (Admin Username) *</span>
            </label>
            <input
              type="text"
              value={settingsForm?.adminUsername || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, adminUsername: e.target.value })}
              placeholder="sherazi313"
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-mono outline-none text-left transition-all"
              dir="ltr"
              required
            />
          </div>

          {/* Secret URL Slug */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
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
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-mono outline-none text-left transition-all"
              dir="ltr"
              required
            />
          </div>

          {/* Secret URL Live Preview Box */}
          <div className="md:col-span-2 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/90 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-900">🔗 آپ کا فعال خفیہ ایڈمن لاگ ان URL:</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-mono text-blue-700 font-bold break-all dir-ltr text-left select-all bg-white px-3 py-1.5 rounded-lg border border-blue-200 inline-block shadow-2xs">
                  {fullSecretUrl}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                ⚠️ سیکیورٹی نوٹس: پبلک ویب سائٹ سے <code className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-mono text-[10px]">/admin</code> یا <code className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-mono text-[10px]">/login</code> وزٹ کرنے پر عام وزیٹرز کو ہوم پیج پر بھیج دیا جائے گا۔ ایڈمن لاگ ان صرف اوپر والے خفیہ URL سے کھلے گا۔
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border border-slate-200 shadow-2xs"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedUrl ? 'کاپی ہو گیا!' : 'یو آر ایل کاپی کریں'}</span>
            </button>
          </div>

          {/* Password Management Card */}
          <div className="md:col-span-2 bg-slate-50/80 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>ایڈمن پاس ورڈ (Admin Password)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold">محفوظ ہے</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">اگر آپ پاس ورڈ تبدیل نہیں کرنا چاہتے تو کچھ کرنے کی ضرورت نہیں، پرانا پاس ورڈ ہی برقرار رہے گا۔</p>
                </div>
              </div>

              {!isChangingPassword ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-blue-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto shadow-2xs"
                >
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>نیا پاس ورڈ تبدیل کریں</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>منسوخ کریں (کینسل)</span>
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 animate-in fade-in-50 duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple flex items-center gap-1.5">
                    <span>نیا پاس ورڈ (کم از کم 6 حروف) *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="tabeeb_sec_newpass"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="نیا پاس ورڈ درج کریں..."
                      className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-mono outline-none text-left pr-10"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    نئے پاس ورڈ کی تصدیق (Confirm Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="tabeeb_sec_confirmpass"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="نیا پاس ورڈ دوبارہ درج کریں..."
                      className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-mono outline-none text-left pr-10"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Alert / Recovery Emails */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>نوٹیفکیشن و OTP ای میل ایڈریسز (Admin Alert Emails):</span>
            </label>
            <input
              type="text"
              value={settingsForm?.adminRecoveryEmails || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, adminRecoveryEmails: e.target.value })}
              placeholder="sherazi313@gmail.com, nukta313@gmail.com"
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-mono outline-none text-left transition-all"
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
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 font-simple">ملٹی فیکٹر اتھینٹیکیشن موڈ (2FA / MFA Mode)</h3>
            <p className="text-xs text-slate-500">اپنے ایڈمن اکاؤنٹ کی سیکیورٹی کے لیے مطلوبہ 2FA طریقہ منتخب کریں</p>
          </div>
        </div>

        {/* 3 Radio Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Option 1: Disabled */}
          <label 
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              settingsForm?.twoFactorType === 'disabled' || !settingsForm?.twoFactorType
                ? 'bg-blue-50/60 border-2 border-blue-500 shadow-sm ring-2 ring-blue-500/10'
                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
              <span className="text-[11px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-full">
                بنیادی سیکیورٹی
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-simple">1. غیر فعال (Disabled)</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                صرف یوزر نیم اور پاس ورڈ کے ساتھ براہ راست لاگ ان۔ کوئی اضافی تصدیقی کوڈ درکار نہیں ہوگا۔
              </p>
            </div>
          </label>

          {/* Option 2: Email OTP */}
          <label 
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              settingsForm?.twoFactorType === 'email_otp'
                ? 'bg-amber-50/60 border-2 border-amber-500 shadow-sm ring-2 ring-amber-500/10'
                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
              <span className="text-[11px] bg-amber-100 text-amber-800 font-mono font-bold px-2 py-0.5 rounded-full">
                اعلیٰ سیکیورٹی
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-simple flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>2. ای میل کوڈ (Email OTP)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                درست پاس ورڈ درج کرنے پر آپ کی ای میل پر 6 ہندسوں کا تصدیقی OTP کوڈ بھیجا جائے گا۔
              </p>
            </div>
          </label>

          {/* Option 3: Google Authenticator */}
          <label 
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              settingsForm?.twoFactorType === 'totp'
                ? 'bg-emerald-50/60 border-2 border-emerald-500 shadow-sm ring-2 ring-emerald-500/10'
                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded-full">
                زیادہ محفوظ ترین
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-simple flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>3. گوگل اتھینٹیکیٹر (TOTP)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                گوگل یا مائیکروسافٹ اتھینٹیکیٹر ایپ کا وقت پر مبنی کوڈ (RFC 6238)۔ انٹرنیٹ کے بغیر بھی کام کرتا ہے۔
              </p>
            </div>
          </label>

        </div>

        {/* ============================================================ */}
        {/* SUB-PANEL: GOOGLE AUTHENTICATOR SETUP BOX                    */}
        {/* ============================================================ */}
        {settingsForm?.twoFactorType === 'totp' && (
          <div className="mt-6 p-6 bg-slate-50 border border-emerald-300/80 rounded-3xl space-y-6 animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900 font-simple">گوگل اتھینٹیکیٹر سیٹ اپ باکس (TOTP Configuration)</h4>
              </div>
              <button
                type="button"
                onClick={handleGenerateNewTotp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200 shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>نئی کی اور کیو آر جنریٹ کریں</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Code Container */}
              <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center border-2 border-emerald-500/40">
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
                <span className="text-[11px] text-slate-500">اپنے موبائل کیمرا یا ایپ سے اسکین کریں</span>
              </div>

              {/* Instructions & Manual Key */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-simple">
                    مینوئل سیکیورٹی کی (Manual Secret Base32 Key):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={totpSetupData.totpSecret || settingsForm?.totpSecret || ''}
                      className="flex-1 bg-white border border-slate-300 text-emerald-700 font-mono text-sm px-4 py-2.5 rounded-xl text-left tracking-widest outline-none shadow-2xs"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm"
                    >
                      {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedKey ? 'کاپی ہو گئی!' : 'کی کاپی کریں'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2 shadow-2xs">
                  <p className="font-bold text-emerald-800">📱 اتھینٹیکیٹر کنیکٹ کرنے کا طریقہ:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 pr-1">
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
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 font-simple">30 دن تک تصدیق شدہ ڈیوائسز (Trusted Devices)</h3>
              <p className="text-xs text-slate-500">جن ڈیوائسز پر 30 دن کے لیے لاگ ان یاد رکھا گیا ہے ان کی سیکیورٹی</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRevokeDevices}
            disabled={isRevoking}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isRevoking ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4 text-red-500" />}
            <span>تمام ڈیوائسز کی تصدیق ختم کریں (Revoke All)</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          جب آپ 2FA اسکرین پر "اس براؤزر کو 30 دن کے لیے یاد رکھیں" منتخب کرتے ہیں، تو اس ڈیوائس کا منفرد سیکیورٹی ٹوکن محفوظ ہو جاتا ہے۔ اگر آپ کسی اجنبی ڈیوائس پر لاگ ان چھوڑ آئے ہوں تو "تمام ڈیوائسز کی تصدیق ختم کریں" پر کلک کر کے فوری طور پر تمام محفوظ شدہ ٹوکنز کو بیک وقت کالعدم کر سکتے ہیں۔
        </p>
      </div>

    </div>
  );
}
