/**
 * Tabeeb Pedia - Dynamic XML Sitemap Generator
 * Website: https://tabeebpedia.com
 * Conforms to Google Search Essentials & Sitemaps.org 0.9 Schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = process.env.TABEEB_SITE_URL || 'https://tabeebpedia.com';

function xmlEscape(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(dateInput) {
  if (!dateInput) {
    return new Date().toISOString().split('T')[0];
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return d.toISOString().split('T')[0];
}

function encodeUrlPath(slugOrId) {
  if (!slugOrId) return '';
  try {
    const decoded = decodeURIComponent(String(slugOrId).trim());
    return encodeURI(decoded);
  } catch (e) {
    return encodeURI(String(slugOrId).trim());
  }
}

export function generateSitemap() {
  console.log('🚀 Starting Tabeeb Pedia Sitemap generation...');
  const today = new Date().toISOString().split('T')[0];

  // 1. Static Core Pages
  const staticUrls = [
    { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/doctors`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/blog`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/herbs`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/qanoon`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/herb-calculator`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/farhang`, lastmod: today, changefreq: 'daily', priority: '0.9' },
  ];

  const allUrls = [...staticUrls];

  // 1b. Dynamic Pages from public/data/pages.json
  const pagesFile = path.join(rootDir, 'public', 'data', 'pages.json');
  let pageCount = 0;
  if (fs.existsSync(pagesFile)) {
    try {
      const pagesData = JSON.parse(fs.readFileSync(pagesFile, 'utf8'));
      if (Array.isArray(pagesData)) {
        pagesData.forEach((p) => {
          if (!p) return;
          const slug = p.slug || p.id;
          if (!slug) return;

          const encodedSlug = encodeUrlPath(slug);
          const pageUrl = `${BASE_URL}/${encodedSlug}`;
          const lastmod = formatDate(p.date || p.modified);

          allUrls.push({
            loc: pageUrl,
            lastmod,
            changefreq: 'monthly',
            priority: p.level === 0 ? '0.8' : (p.level === 1 ? '0.7' : '0.6')
          });
          pageCount++;
        });
      }
    } catch (err) {
      console.error('❌ Error reading pages data for sitemap:', err.message);
    }
  } else {
    // Fallback static pages if pages.json not found
    [
      { loc: `${BASE_URL}/about-us`, lastmod: '2026-09-25', changefreq: 'monthly', priority: '0.6' },
      { loc: `${BASE_URL}/contact`, lastmod: '2026-09-25', changefreq: 'monthly', priority: '0.6' },
      { loc: `${BASE_URL}/privacy-policy`, lastmod: '2026-09-25', changefreq: 'monthly', priority: '0.5' },
      { loc: `${BASE_URL}/disclaimer`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
      { loc: `${BASE_URL}/terms`, lastmod: today, changefreq: 'monthly', priority: '0.5' }
    ].forEach(p => allUrls.push(p));
  }

  // 2. Dynamic Articles from public/data/articles.json
  const articlesFile = path.join(rootDir, 'public', 'data', 'articles.json');
  let articleCount = 0;
  if (fs.existsSync(articlesFile)) {
    try {
      const articlesData = JSON.parse(fs.readFileSync(articlesFile, 'utf8'));
      if (Array.isArray(articlesData)) {
        articlesData.forEach((art) => {
          if (!art) return;
          const slug = art.slug || art.id;
          if (!slug) return;

          const encodedSlug = encodeUrlPath(slug);
          const articleUrl = `${BASE_URL}/${encodedSlug}`;
          const lastmod = formatDate(art.date || art.modified || art.lastModified);

          allUrls.push({
            loc: articleUrl,
            lastmod,
            changefreq: 'weekly',
            priority: '0.8'
          });
          articleCount++;
        });
      }
    } catch (err) {
      console.error('❌ Error reading articles data for sitemap:', err.message);
    }
  } else {
    console.warn('⚠️ articles.json not found in public/data/');
  }

  // 3. Dynamic Doctors from public/data/doctors.json
  const doctorsFile = path.join(rootDir, 'public', 'data', 'doctors.json');
  let doctorCount = 0;
  if (fs.existsSync(doctorsFile)) {
    try {
      const doctorsData = JSON.parse(fs.readFileSync(doctorsFile, 'utf8'));
      if (Array.isArray(doctorsData)) {
        doctorsData.forEach((doc) => {
          if (!doc) return;
          const slug = doc.slug || doc.id;
          if (!slug) return;

          const encodedSlug = encodeUrlPath(slug);
          const doctorUrl = `${BASE_URL}/doctor/${encodedSlug}`;

          allUrls.push({
            loc: doctorUrl,
            lastmod: today,
            changefreq: 'weekly',
            priority: '0.7'
          });
          doctorCount++;
        });
      }
    } catch (err) {
      console.error('❌ Error reading doctors data for sitemap:', err.message);
    }
  } else {
    console.warn('⚠️ doctors.json not found in public/data/');
  }

  // 3b. Dynamic Glossary / فرہنگِ اطباء from public/data/glossary.json
  const glossaryFile = path.join(rootDir, 'public', 'data', 'glossary.json');
  let glossaryCount = 0;
  if (fs.existsSync(glossaryFile)) {
    try {
      const glossaryData = JSON.parse(fs.readFileSync(glossaryFile, 'utf8'));
      if (Array.isArray(glossaryData)) {
        glossaryData.forEach((item) => {
          if (!item) return;
          const slug = item.slug || item.id || encodeURIComponent(item.term || '');
          if (!slug) return;

          const encodedSlug = encodeUrlPath(slug);
          const termUrl = `${BASE_URL}/farhang/${encodedSlug}`;
          const lastmod = formatDate(item.date);

          allUrls.push({
            loc: termUrl,
            lastmod,
            changefreq: 'monthly',
            priority: '0.8'
          });
          glossaryCount++;
        });
      }
    } catch (err) {
      console.error('❌ Error reading glossary data for sitemap:', err.message);
    }
  }

  // 4. Construct Sitemaps XML
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  const xmlEntries = allUrls.map((item) => {
    return `  <url>
    <loc>${xmlEscape(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
  }).join('\n');

  const xmlFooter = '\n</urlset>\n';
  const fullSitemapXml = xmlHeader + xmlEntries + xmlFooter;

  // 5. Write to public/sitemap.xml
  const publicSitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, fullSitemapXml, 'utf8');
  console.log(`✅ Generated public/sitemap.xml with ${allUrls.length} URLs:`);
  console.log(`   - Core static pages: ${staticUrls.length}`);
  console.log(`   - Dynamic pages: ${pageCount}`);
  console.log(`   - Published articles: ${articleCount}`);
  console.log(`   - Doctors & Hakeems: ${doctorCount}`);

  // Also write to dist/sitemap.xml if dist directory exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, fullSitemapXml, 'utf8');
    console.log(`✅ Synced sitemap to dist/sitemap.xml`);
  }

  return { total: allUrls.length, articles: articleCount, doctors: doctorCount };
}

// Auto-run when executed directly
if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.js')) {
  generateSitemap();
}
