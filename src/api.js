// PERMANENT SECURE DATABASE API FOR LOCAL DEV & HOSTINGER PRODUCTION

export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const token = sessionStorage.getItem('tabeeb_admin_token') || '';
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Admin-Token'] = token;
    }
    const deviceToken = localStorage.getItem('tabeeb_2fa_device_token') || '';
    if (deviceToken) {
      headers['X-Device-Token'] = deviceToken;
    }
  } catch (e) {}
  return headers;
};

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(endpoint, {
      cache: 'no-store',
      ...options
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (error) {
    return null;
  }
};

export const fetchLiveDoctors = async () => {
  let data = await apiFetch(`/api/doctors.php?v=${Date.now()}`);
  if (!data || !Array.isArray(data)) {
    data = await apiFetch(`/data/doctors.json?v=${Date.now()}`);
  }
  return Array.isArray(data) ? data : [];
};

export const saveDoctorsApi = async (doctors) => {
  try {
    let res = await fetch('/api/doctors.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctors)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const fetchLiveArticles = async () => {
  let data = await apiFetch(`/api/articles.php?v=${Date.now()}`);
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = await apiFetch(`/data/articles.json?v=${Date.now()}`);
  }
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = await apiFetch(`/articles_local.json?v=${Date.now()}`);
  }
  return Array.isArray(data) ? data : [];
};

export const saveArticlesApi = async (articles) => {
  try {
    let res = await fetch('/api/articles.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(articles)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const fetchCategoriesApi = async () => {
  let data = await apiFetch(`/api/categories.php?v=${Date.now()}`);
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = await apiFetch(`/data/categories.json?v=${Date.now()}`);
  }
  return Array.isArray(data) ? data : [];
};

export const saveCategoriesApi = async (categories) => {
  try {
    let res = await fetch('/api/categories.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categories)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const fetchLivePages = async () => {
  let data = await apiFetch(`/api/pages.php?v=${Date.now()}`);
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = await apiFetch(`/data/pages.json?v=${Date.now()}`);
  }
  return Array.isArray(data) ? data : [];
};

export const savePagesApi = async (pages) => {
  try {
    let res = await fetch('/api/pages.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pages)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const fetchSettingsApi = async () => {
  let data = await apiFetch(`/api/settings.php?v=${Date.now()}`);
  if (!data || typeof data !== 'object') {
    data = await apiFetch(`/data/settings.json?v=${Date.now()}`);
  }
  return data;
};

export const saveSettingsApi = async (settings) => {
  try {
    let res = await fetch('/api/settings.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const uploadImageApi = async (file) => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        try {
          let res = await fetch('/api/upload.php', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ image: base64Data, filename: file.name || 'image' })
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.url) {
              resolve(data.url);
              return;
            }
          }
        } catch (e) {
          console.warn('Upload API request notice, fallback to Data URL', e);
        }
        // Fallback: return base64 Data URL if server upload fails
        resolve(base64Data);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File reading error:', err);
      resolve(null);
    }
  });
};

export const fetchLiveGlossary = async () => {
  let data = await apiFetch('/api/glossary.php');
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = await apiFetch('/data/glossary.json');
  }
  return Array.isArray(data) ? data : [];
};

export const saveGlossaryApi = async (glossary) => {
  try {
    let res = await fetch('/api/glossary.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(glossary)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

// ==========================================
// ENTERPRISE ADMIN AUTH & 2FA API
// ==========================================

export const loginAdminApi = async ({ username, password, deviceToken }) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const devToken = deviceToken || localStorage.getItem('tabeeb_2fa_device_token') || '';
    if (devToken) {
      headers['X-Device-Token'] = devToken;
    }
    const res = await fetch('/api/auth.php?action=login', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'login',
        username,
        password,
        device_token: devToken
      })
    });
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Login API error:', err);
    return { status: 'error', message: 'سرور سے رابطہ قائم نہیں ہو سکا۔' };
  }
};

export const verify2faApi = async ({ temp_token, code, remember_device }) => {
  try {
    const res = await fetch('/api/auth.php?action=verify_2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_2fa',
        temp_token,
        code,
        remember_device
      })
    });
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Verify 2FA API error:', err);
    return { status: 'error', message: 'سرور سے رابطہ قائم نہیں ہو سکا۔' };
  }
};

export const get2faSetupApi = async () => {
  try {
    const res = await fetch(`/api/auth.php?action=get_2fa_setup&v=${Date.now()}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Get 2FA Setup API error:', err);
    return null;
  }
};

export const changeCredentialsApi = async (payload) => {
  try {
    const res = await fetch('/api/auth.php?action=change_credentials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'change_credentials',
        ...payload
      })
    });
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Change Credentials API error:', err);
    return { status: 'error', message: 'سیٹنگز محفوظ کرنے میں رکاوٹ آئی۔' };
  }
};

export const revokeDevicesApi = async () => {
  try {
    const res = await fetch('/api/auth.php?action=revoke_devices', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action: 'revoke_devices' })
    });
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Revoke Devices API error:', err);
    return { status: 'error', message: 'ڈیوائسز منسوخ نہیں کی جا سکیں۔' };
  }
};

export const forgotPasswordApi = async ({ email }) => {
  try {
    const res = await fetch('/api/auth.php?action=forgot_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'forgot_password',
        email
      })
    });
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Forgot Password API error:', err);
    return { status: 'error', message: 'ری سیٹ کوڈ بھیجنے میں خرابی ہوئی۔' };
  }
};

export const resetPasswordApi = async ({ email, code, new_password }) => {
  try {
    const res = await fetch('/api/auth.php?action=reset_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reset_password',
        email,
        code,
        new_password
      })
    });
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Reset Password API error:', err);
    return { status: 'error', message: 'پاس ورڈ ری سیٹ کرنے میں خرابی ہوئی۔' };
  }
};

export const logoutAdminApi = async () => {
  try {
    await fetch('/api/auth.php?action=logout', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action: 'logout' })
    });
  } catch (e) {}
  try {
    sessionStorage.removeItem('tabeeb_admin_token');
    sessionStorage.removeItem('tabeeb_admin_auth');
  } catch (e) {}
  return true;
};

export { fetchAnalyticsApi, trackPageView, sendAnalyticsHeartbeat } from './utils/analytics';

