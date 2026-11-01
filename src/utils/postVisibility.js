// Utility for WordPress-style Post Visibility and Scheduling lifecycle

/**
 * Checks whether an article is publicly live/published for regular visitors.
 * - 'published': Live immediately (unless scheduledAt is set in the future).
 * - 'scheduled': Live only once Date.now() >= scheduledAt.
 * - 'draft': Never visible to public.
 * - 'private': Never visible to public (only logged-in admin).
 * - 'trash': Never visible.
 */
export const isArticlePubliclyVisible = (article) => {
  if (!article) return false;
  
  const status = article.status || 'published';
  if (status === 'draft' || status === 'trash' || status === 'private') {
    return false;
  }

  if (status === 'scheduled') {
    if (!article.scheduledAt) return false;
    const scheduledTime = new Date(article.scheduledAt).getTime();
    if (isNaN(scheduledTime)) return false;
    return Date.now() >= scheduledTime;
  }

  if (status === 'published' || status === 'publish') {
    // If a post has scheduledAt set in the future, keep it hidden until that time
    if (article.scheduledAt) {
      const scheduledTime = new Date(article.scheduledAt).getTime();
      if (!isNaN(scheduledTime) && Date.now() < scheduledTime) {
        return false;
      }
    }
    return true;
  }

  return false;
};

/**
 * Checks if current user (with optional admin flag) can view the article.
 */
export const isArticleAccessible = (article, isAdmin = false) => {
  if (!article) return false;
  if (isAdmin) return true;
  return isArticlePubliclyVisible(article);
};

/**
 * Checks if the admin is currently logged in via localStorage/sessionStorage.
 */
export const checkIsAdminLoggedIn = () => {
  try {
    const isAuth = sessionStorage.getItem('tabeeb_admin_auth') === 'true' || 
                   localStorage.getItem('tabeeb_admin_auth') === 'true' ||
                   !!(sessionStorage.getItem('tabeeb_admin_token') || localStorage.getItem('tabeeb_admin_token'));
    return Boolean(isAuth);
  } catch (e) {
    return false;
  }
};

/**
 * Get readable status information for display badges.
 */
export const getArticleStatusMeta = (article) => {
  if (!article) {
    return { key: 'draft', label: 'ڈرافٹ (Draft)', color: 'amber' };
  }
  
  const status = article.status || 'published';
  
  if (status === 'draft') {
    return { 
      key: 'draft', 
      label: 'ڈرافٹ (Draft)', 
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeClass: 'text-amber-700 bg-amber-50 border-amber-200' 
    };
  }

  if (status === 'private') {
    return { 
      key: 'private', 
      label: 'پرائیویٹ (Private)', 
      bg: 'bg-slate-100 text-slate-800 border-slate-300',
      badgeClass: 'text-slate-700 bg-slate-100 border-slate-300' 
    };
  }

  if (status === 'scheduled') {
    const scheduledTime = article.scheduledAt ? new Date(article.scheduledAt).getTime() : null;
    const isPast = scheduledTime && !isNaN(scheduledTime) && Date.now() >= scheduledTime;
    
    if (isPast) {
      return { 
        key: 'published', 
        label: 'شائع شدہ (خودکار پبلش)', 
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        isAutoPublished: true
      };
    }

    return { 
      key: 'scheduled', 
      label: 'شیڈول شدہ (Scheduled)', 
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      badgeClass: 'text-blue-700 bg-blue-50 border-blue-200',
      scheduledAt: article.scheduledAt 
    };
  }

  return { 
    key: 'published', 
    label: 'شائع شدہ (Live)', 
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' 
  };
};

/**
 * Helper to format date-time for <input type="datetime-local" />
 * Format: YYYY-MM-DDTHH:mm
 */
export const formatForDateTimeInput = (dateObj) => {
  const d = dateObj ? new Date(dateObj) : new Date();
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Helper to format scheduled date into readable Urdu/English
 */
export const formatScheduledDateUrdu = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  try {
    return d.toLocaleDateString('ur-PK', options);
  } catch (e) {
    return d.toLocaleString();
  }
};
