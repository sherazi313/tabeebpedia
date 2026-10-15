import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Building Media JSON from WordPress Post.xml and Articles ===');

const xmlPath = path.join(__dirname, '..', 'tabeebpedia.WordPress.2026-09-24 Post.xml');
const articlesJsonPath = path.join(__dirname, '..', 'public', 'data', 'articles.json');
const pagesJsonPath = path.join(__dirname, '..', 'public', 'data', 'pages.json');
const mediaJsonPath = path.join(__dirname, '..', 'public', 'data', 'media.json');

// 1. Load articles and pages
let articles = [];
try {
  articles = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf8'));
} catch (e) {
  console.error('Error reading articles.json:', e.message);
}

let pages = [];
try {
  pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));
} catch (e) {
  console.log('No pages.json found or error reading');
}

const postTitleMap = new Map();
articles.forEach(a => {
  if (a.id) postTitleMap.set(String(a.id), a.title);
  if (a.postId) postTitleMap.set(String(a.postId), a.title);
});
pages.forEach(p => {
  if (p.id) postTitleMap.set(String(p.id), p.title);
  if (p.postId) postTitleMap.set(String(p.postId), p.title);
});

// 2. Parse XML attachments
const mediaList = [];
const seenUrls = new Set();

if (fs.existsSync(xmlPath)) {
  const xml = fs.readFileSync(xmlPath, 'utf8');
  const items = xml.split('<item>').slice(1);

  for (const item of items) {
    const isAttachment = item.includes('<wp:post_type><![CDATA[attachment]]></wp:post_type>') || item.includes('<wp:post_type>attachment</wp:post_type>');
    if (!isAttachment) continue;

    const getTag = (tag) => {
      const cdataMatch = item.match(new RegExp('<' + tag + '><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>'));
      if (cdataMatch) return cdataMatch[1];
      const simpleMatch = item.match(new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>'));
      return simpleMatch ? simpleMatch[1] : '';
    };

    const id = getTag('wp:post_id') || ('wp-' + Math.random().toString(36).substr(2, 8));
    let url = getTag('wp:attachment_url').trim();
    if (!url) continue;

    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    let title = getTag('title').trim();
    const postDate = getTag('wp:post_date') || '2024-09-24';
    const parentId = getTag('wp:post_parent') || '0';

    let attachedTo = null;
    let articleId = null;
    if (parentId && parentId !== '0') {
      if (postTitleMap.has(String(parentId))) {
        attachedTo = postTitleMap.get(String(parentId));
        articleId = parseInt(parentId, 10);
      }
    }

    let filename = '';
    try {
      filename = decodeURIComponent(url.split('/').pop().split('?')[0]);
    } catch {
      filename = url.split('/').pop().split('?')[0];
    }

    mediaList.push({
      id: 'media-' + id,
      url: url,
      name: filename || title || 'image.jpg',
      date: postDate.split(' ')[0].replace(/-/g, '/'),
      attachedTo: attachedTo,
      articleId: articleId
    });
  }
}

// 3. Ensure all article featured images are included and attached
articles.forEach(a => {
  if (!a.featuredImage) return;
  const cleanUrl = a.featuredImage.trim();
  if (!cleanUrl) return;

  if (seenUrls.has(cleanUrl)) {
    // If it was parsed from XML without attachment, attach it to this article
    const existing = mediaList.find(m => m.url === cleanUrl);
    if (existing && !existing.attachedTo) {
      existing.attachedTo = a.title;
      existing.articleId = a.id;
    }
  } else {
    seenUrls.add(cleanUrl);
    let filename = '';
    try {
      filename = decodeURIComponent(cleanUrl.split('/').pop().split('?')[0]);
    } catch {
      filename = cleanUrl.split('/').pop().split('?')[0];
    }

    mediaList.push({
      id: 'media-art-' + a.id,
      url: cleanUrl,
      name: filename || (a.slug + '.jpg'),
      date: a.date ? a.date.replace(/-/g, '/') : '2024/09/24',
      attachedTo: a.title,
      articleId: a.id
    });
  }
});

// 4. Ensure all pages featured images are included
pages.forEach(p => {
  if (!p.featuredImage) return;
  const cleanUrl = p.featuredImage.trim();
  if (!cleanUrl) return;

  if (seenUrls.has(cleanUrl)) {
    const existing = mediaList.find(m => m.url === cleanUrl);
    if (existing && !existing.attachedTo) {
      existing.attachedTo = p.title;
    }
  } else {
    seenUrls.add(cleanUrl);
    let filename = '';
    try {
      filename = decodeURIComponent(cleanUrl.split('/').pop().split('?')[0]);
    } catch {
      filename = cleanUrl.split('/').pop().split('?')[0];
    }

    mediaList.push({
      id: 'media-page-' + p.id,
      url: cleanUrl,
      name: filename || (p.slug + '.png'),
      date: p.date ? p.date.replace(/-/g, '/') : '2024/09/24',
      attachedTo: p.title
    });
  }
});

console.log(`Generated ${mediaList.length} media items.`);
console.log(`Attached: ${mediaList.filter(m => m.attachedTo).length}`);
console.log(`Unattached: ${mediaList.filter(m => !m.attachedTo).length}`);

fs.writeFileSync(mediaJsonPath, JSON.stringify(mediaList, null, 2), 'utf8');
console.log('Saved to', mediaJsonPath);
