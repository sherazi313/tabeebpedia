const API_BASE = 'https://himalayan.tabeebpedia.com/api';

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) throw new Error('Network response was not ok');
    let text = await res.text();
    // Remove BOM if present
    text = text.replace(/^\uFEFF/, '');
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const fetchLiveDoctors = () => apiFetch('/doctors.php');

export const fetchLiveArticles = async () => {
  const articles = await apiFetch('/articles.php');
  if (!articles) return [];
  // Map snake_case to camelCase
  return articles.map(art => ({
    ...art,
    category: art.category || art.category_id,
    featuredImage: art.featuredImage || art.featured_image,
    readingTime: art.readingTime || art.reading_time,
    seoTitle: art.seoTitle || art.seo_title,
    seoDescription: art.seoDescription || art.seo_description,
    createdAt: art.createdAt || art.created_at,
    updatedAt: art.updatedAt || art.updated_at
  }));
};
