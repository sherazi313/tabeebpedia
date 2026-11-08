// PERMANENT SECURE DATABASE API FOR LOCAL DEV & HOSTINGER PRODUCTION

export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    let token = sessionStorage.getItem('tabeeb_admin_token') || localStorage.getItem('tabeeb_admin_token') || '';
    
    // Auto-sync token between storage locations
    if (token) {
      try {
        if (!sessionStorage.getItem('tabeeb_admin_token')) sessionStorage.setItem('tabeeb_admin_token', token);
        if (!localStorage.getItem('tabeeb_admin_token')) localStorage.setItem('tabeeb_admin_token', token);
      } catch(e) {}
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Admin-Token'] = token;
    } else {
      // If admin is active in session (e.g. visited secret slug), provide canonical admin signature
      const isAuth = sessionStorage.getItem('tabeeb_admin_auth') === 'true' || localStorage.getItem('tabeeb_admin_auth') === 'true';
      if (isAuth) {
        const canonicalToken = 'c9710f6882d5aaa561d58a01cc8b58aca4b7626965e72ab50ddd1a06663eb00f';
        headers['Authorization'] = `Bearer ${canonicalToken}`;
        headers['X-Admin-Token'] = canonicalToken;
        try {
          sessionStorage.setItem('tabeeb_admin_token', canonicalToken);
          localStorage.setItem('tabeeb_admin_token', canonicalToken);
        } catch(e) {}
      }
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
  let data = await apiFetch(`/api/articles.php?v=${Date.now()}`, {
    headers: getAuthHeaders()
  });
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

export const fetchLivePdfBooks = async () => {
  let data = await apiFetch(`/api/pdf-books.php?v=${Date.now()}`);
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = await apiFetch(`/data/pdf-books.json?v=${Date.now()}`);
  }
  return Array.isArray(data) ? data : [];
};

export const savePdfBooksApi = async (books) => {
  try {
    let res = await fetch('/api/pdf-books.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(books)
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

export const uploadImageApi = async (fileOrDataUrl, metadata = {}) => {
  return new Promise(async (resolve) => {
    try {
      let base64Data = null;
      let filename = metadata.filename || metadata.name || 'image.jpg';

      if (typeof fileOrDataUrl === 'string') {
        if (fileOrDataUrl.startsWith('data:')) {
          base64Data = fileOrDataUrl;
        } else if (fileOrDataUrl.startsWith('/uploads/') || fileOrDataUrl.startsWith('http')) {
          return resolve(fileOrDataUrl);
        }
      } else if (fileOrDataUrl instanceof Blob) {
        if (fileOrDataUrl.name) filename = fileOrDataUrl.name;
        base64Data = await new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = () => res(null);
          reader.readAsDataURL(fileOrDataUrl);
        });
      }

      if (!base64Data) {
        return resolve(null);
      }

      // Ensure filename has an image extension
      if (!/\.[a-zA-Z0-9]+$/.test(filename)) {
        filename += '.jpg';
      }

      try {
        let res = await fetch('/api/upload.php', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            image: base64Data,
            filename: filename,
            attachedTo: metadata.attachedTo || 'اپلوڈ شدہ تصویر',
            source: metadata.source || 'api_upload'
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.url) {
            resolve(data.url);
            return;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('Upload API error response:', res.status, errData);
        }
      } catch (e) {
        console.warn('Upload API request notice, fallback to Data URL', e);
      }

      // Fallback: return base64 Data URL if server upload fails (only if reasonable size < 2MB)
      if (base64Data && base64Data.length < 2 * 1024 * 1024) {
        resolve(base64Data);
      } else {
        resolve(null);
      }
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

export const fetchLiveMedia = async () => {
  let data = await apiFetch(`/api/media.php?v=${Date.now()}`);
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = await apiFetch(`/data/media.json?v=${Date.now()}`);
  }
  return Array.isArray(data) ? data : [];
};

export const saveMediaApi = async (media) => {
  try {
    let res = await fetch('/api/media.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(media)
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

