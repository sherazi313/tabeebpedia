import { useEffect } from 'react';

/**
 * Helper to strip HTML tags and decode entities for clean meta description
 */
function cleanText(text, maxLen = 160) {
  if (!text) return '';
  const stripped = String(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (stripped.length <= maxLen) return stripped;
  return stripped.substring(0, maxLen - 3) + '...';
}

function updateMetaTag(attr, key, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateLinkTag(rel, href) {
  if (!href) return;
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export default function SEOHelmet({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  schemaData = null
}) {
  useEffect(() => {
    // 1. Update Document Title
    const baseTitle = 'طبیب پیڈیا';
    if (title) {
      document.title = title.includes(baseTitle) ? title : `${title} | ${baseTitle}`;
    } else {
      document.title = 'طبیب پیڈیا - طب یونانی، قانون مفرد اعضاء اور اطباء ڈائریکٹری';
    }

    // 2. Meta Description
    const metaDesc = cleanText(description, 165) || 'طبیب پیڈیا: پاکستان کی سب سے بڑی اور مستند طب یونانی، جڑی بوٹیاں، قانون مفرد اعضاء اور اطباء و ڈاکٹرز ڈائریکٹری۔';
    updateMetaTag('name', 'description', metaDesc);
    updateMetaTag('name', 'title', document.title);

    // 3. Canonical URL
    const canonical = canonicalUrl || 'https://tabeebpedia.com/';
    updateLinkTag('canonical', canonical);

    // 4. Open Graph Tags (WhatsApp, Facebook)
    const image = ogImage || 'https://tabeebpedia.com/og-banner.png';
    updateMetaTag('property', 'og:title', document.title);
    updateMetaTag('property', 'og:description', metaDesc);
    updateMetaTag('property', 'og:url', canonical);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:site_name', 'طبیب پیڈیا (Tabeeb Pedia)');

    // 5. Twitter Card Tags
    updateMetaTag('name', 'twitter:title', document.title);
    updateMetaTag('name', 'twitter:description', metaDesc);
    updateMetaTag('name', 'twitter:image', image);
    updateMetaTag('name', 'twitter:url', canonical);

    // 6. Schema.org JSON-LD Injection
    const SCRIPT_ID = 'tabeeb-json-ld';
    let scriptTag = document.getElementById(SCRIPT_ID);

    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData, null, 2);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, ogImage, ogType, schemaData]);

  return null;
}
