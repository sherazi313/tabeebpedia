// PERMANENT SECURE DATABASE API FOR LOCAL DEV & HOSTINGER PRODUCTION

export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const token = sessionStorage.getItem('tabeeb_admin_token') || '';
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Admin-Token'] = token;
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

export { fetchAnalyticsApi, trackPageView, sendAnalyticsHeartbeat } from './utils/analytics';
