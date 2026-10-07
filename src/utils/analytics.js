// Real-Time Visitor & Page View Analytics Engine for Tabeeb Pedia

const VISITOR_ID_KEY = 'tabeeb_vid_v1';
const SESSION_ID_KEY = 'tabeeb_sid_v1';
const LOCAL_ANALYTICS_KEY = 'tabeeb_local_analytics_v1';

// Generate or retrieve persistent visitor ID (UUID)
export const getVisitorId = () => {
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid || typeof vid !== 'string' || vid.length < 8) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch (e) {
    return 'v_' + Math.random().toString(36).substring(2, 10);
  }
};

// Generate or retrieve session ID
export const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch (e) {
    return 's_' + Date.now().toString(36);
  }
};

// Detect device type accurately
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detect browser accurately
export const getBrowserName = () => {
  if (typeof window === 'undefined') return 'Browser';
  const ua = navigator.userAgent || '';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
  return 'Browser';
};

// Local storage fallback data structure for offline or pure Vite dev mode
const getLocalAnalytics = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return {
    totalViews: 0,
    uniqueVisitors: {},
    daily: {},
    pages: {},
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    recentVisits: [],
    lastHeartbeat: Date.now()
  };
};

const saveLocalAnalytics = (data) => {
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {}
};

// Track Page View
export const trackPageView = async ({ path = window.location.pathname, title = document.title } = {}) => {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const device = getDeviceType();
  const browser = getBrowserName();

  const payload = {
    action: 'track',
    visitorId,
    sessionId,
    path: path || '/',
    title: title || 'طبیب پیڈیا',
    device,
    browser,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1280
  };

  // 1. Update local storage analytics store (Immediate instant accurate counting)
  try {
    const local = getLocalAnalytics();
    const today = new Date().toISOString().slice(0, 10);
    local.totalViews = (local.totalViews || 0) + 1;
    local.uniqueVisitors = local.uniqueVisitors || {};
    local.uniqueVisitors[visitorId] = Date.now();

    local.daily = local.daily || {};
    if (!local.daily[today]) {
      local.daily[today] = { views: 0, visitors: {} };
    }
    local.daily[today].views = (local.daily[today].views || 0) + 1;
    local.daily[today].visitors = local.daily[today].visitors || {};
    local.daily[today].visitors[visitorId] = 1;

    local.pages = local.pages || {};
    if (!local.pages[path]) {
      local.pages[path] = { views: 0, title };
    }
    local.pages[path].views = (local.pages[path].views || 0) + 1;
    local.pages[path].title = title || local.pages[path].title;

    local.devices = local.devices || { mobile: 0, desktop: 0, tablet: 0 };
    local.devices[device] = (local.devices[device] || 0) + 1;

    local.recentVisits = local.recentVisits || [];
    local.recentVisits.unshift({
      visitorId: visitorId.slice(0, 8) + '...',
      path,
      title,
      device,
      browser,
      time: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestamp: Date.now()
    });
    if (local.recentVisits.length > 30) local.recentVisits = local.recentVisits.slice(0, 30);
    saveLocalAnalytics(local);
  } catch (e) {
    console.warn('Local analytics save notice:', e);
  }

  // 2. Send to server API endpoint (/api/analytics.php)
  try {
    await fetch('/api/analytics.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // Graceful silent fallback to local analytics
  }
};

// Send Heartbeat for Live Visitors Tracking
export const sendAnalyticsHeartbeat = async () => {
  const visitorId = getVisitorId();
  try {
    await fetch('/api/analytics.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'heartbeat', visitorId })
    });
  } catch (e) {}
};

// Compute summary from client-side fallback if server is offline or in development
export const computeLocalSummary = () => {
  const local = getLocalAnalytics();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  
  // Yesterday string
  const yDate = new Date();
  yDate.setDate(yDate.getDate() - 1);
  const yesterday = yDate.toISOString().slice(0, 10);

  const currentMonth = today.slice(0, 7);
  const currentYear = today.slice(0, 4);

  // Today
  const todayViews = local.daily?.[today]?.views || 0;
  const todayVisitors = Object.keys(local.daily?.[today]?.visitors || {}).length;

  // Yesterday
  const yesterdayViews = local.daily?.[yesterday]?.views || 0;
  const yesterdayVisitors = Object.keys(local.daily?.[yesterday]?.visitors || {}).length;

  // This Week (last 7 days)
  let weekViews = 0;
  const weekVisitorsMap = new Set();
  for (let i = 0; i < 7; i++) {
    const dObj = new Date();
    dObj.setDate(dObj.getDate() - i);
    const dStr = dObj.toISOString().slice(0, 10);
    if (local.daily?.[dStr]) {
      weekViews += local.daily[dStr].views || 0;
      Object.keys(local.daily[dStr].visitors || {}).forEach(v => weekVisitorsMap.add(v));
    }
  }
  const weekVisitors = weekVisitorsMap.size;

  // This Month
  let monthViews = 0;
  const monthVisitorsMap = new Set();
  Object.keys(local.daily || {}).forEach(d => {
    if (d.startsWith(currentMonth)) {
      monthViews += local.daily[d].views || 0;
      Object.keys(local.daily[d].visitors || {}).forEach(v => monthVisitorsMap.add(v));
    }
  });
  const monthVisitors = monthVisitorsMap.size;

  // This Year
  let yearViews = 0;
  const yearVisitorsMap = new Set();
  Object.keys(local.daily || {}).forEach(d => {
    if (d.startsWith(currentYear)) {
      yearViews += local.daily[d].views || 0;
      Object.keys(local.daily[d].visitors || {}).forEach(v => yearVisitorsMap.add(v));
    }
  });
  const yearVisitors = yearVisitorsMap.size;

  // Chart data for last 14 days
  const chartDays = [];
  const monthNamesUrdu = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
  for (let i = 13; i >= 0; i--) {
    const dObj = new Date();
    dObj.setDate(dObj.getDate() - i);
    const dStr = dObj.toISOString().slice(0, 10);
    const dayNum = dObj.getDate();
    const mNum = dObj.getMonth();
    const label = `${dayNum} ${monthNamesUrdu[mNum].slice(0, 3)}`;
    const views = local.daily?.[dStr]?.views || 0;
    const vis = Object.keys(local.daily?.[dStr]?.visitors || {}).length;
    chartDays.push({
      date: dStr,
      label,
      views,
      visitors: vis
    });
  }

  // Top Pages
  const topPages = Object.keys(local.pages || {}).map(path => ({
    path,
    title: local.pages[path].title || path,
    views: local.pages[path].views || 0
  })).sort((a, b) => b.views - a.views).slice(0, 10);

  return {
    today: { views: todayViews, visitors: todayVisitors },
    yesterday: { views: yesterdayViews, visitors: yesterdayVisitors },
    thisWeek: { views: weekViews, visitors: weekVisitors },
    thisMonth: { views: monthViews, visitors: monthVisitors },
    thisYear: { views: yearViews, visitors: yearVisitors },
    allTime: { 
      views: Math.max(local.totalViews || 0, yearViews), 
      visitors: Math.max(Object.keys(local.uniqueVisitors || {}).length, yearVisitors) 
    },
    activeNow: 1,
    chartDays,
    topPages,
    devices: local.devices || { mobile: 0, desktop: 0, tablet: 0 },
    recentVisits: local.recentVisits || [],
    lastUpdated: new Date().toLocaleTimeString('ur-PK')
  };
};

// Fetch Analytics from API with local fallback
export const fetchAnalyticsApi = async () => {
  try {
    const res = await fetch(`/api/analytics.php?v=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && data.today) {
        // If server data exists, merge with any local counts if server is fresher
        return data;
      }
    }
  } catch (e) {}

  // Fallback to local computed summary
  return computeLocalSummary();
};
