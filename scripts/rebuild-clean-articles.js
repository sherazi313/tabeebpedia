import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Cleaning and Rebuilding Articles Purely from XML ===');

const xmlPath = path.join(__dirname, '..', 'tabeebpedia.WordPress.2026-09-24 Post.xml');
const articlesJsonPath = path.join(__dirname, '..', 'public', 'data', 'articles.json');
const articlesLocalPath = path.join(__dirname, '..', 'public', 'articles_local.json');

const xml = fs.readFileSync(xmlPath, 'utf8');

const items = xml.split('<item>').slice(1);

// 1. Build attachment map
const attachmentsMap = new Map();
for (const item of items) {
  const getTag = (tag) => {
    const cdataMatch = item.match(new RegExp('<' + tag + '><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>'));
    if (cdataMatch) return cdataMatch[1];
    const simpleMatch = item.match(new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>'));
    return simpleMatch ? simpleMatch[1] : '';
  };

  const postType = getTag('wp:post_type');
  const postId = getTag('wp:post_id');
  const attachmentUrl = getTag('wp:attachment_url');

  if (postType === 'attachment' && postId && attachmentUrl) {
    attachmentsMap.set(postId, attachmentUrl);
  }
}
console.log(`Found ${attachmentsMap.size} attachments.`);

// 2. Parse XML posts
const cleanArticles = [];
let idCounter = 1;

for (const item of items) {
  const getTag = (tag) => {
    const cdataMatch = item.match(new RegExp('<' + tag + '><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>'));
    if (cdataMatch) return cdataMatch[1];
    const simpleMatch = item.match(new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>'));
    return simpleMatch ? simpleMatch[1] : '';
  };

  const postType = getTag('wp:post_type');
  const status = getTag('wp:status');
  if (postType !== 'post' || (status !== 'publish' && status !== 'inherit')) continue;

  const postId = parseInt(getTag('wp:post_id'), 10);
  let title = getTag('title').trim();
  let slug = getTag('wp:post_name').trim();
  let content = getTag('content:encoded');
  let excerpt = getTag('excerpt:encoded');
  const postDate = getTag('wp:post_date');
  const pubDate = postDate ? postDate.split(' ')[0] : '2024-09-24';

  // Categories & Tags
  const categories = [];
  const tags = [];
  const catMatches = item.matchAll(/<category domain="([^"]+)"[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g);
  for (const match of catMatches) {
    const domain = match[1];
    const val = match[2].trim();
    if (domain === 'category' && val) categories.push(val);
    if (domain === 'post_tag' && val) tags.push(val);
  }

  // Thumbnail
  let featuredImage = '';
  const metaMatches = item.matchAll(/<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/g);
  for (const m of metaMatches) {
    const thumbId = m[1];
    if (attachmentsMap.has(thumbId)) {
      featuredImage = attachmentsMap.get(thumbId);
      break;
    }
  }

  // If no featured image in meta, check first image in content
  if (!featuredImage) {
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) {
      featuredImage = imgMatch[1];
    }
  }

  // Excerpt
  let cleanExcerpt = excerpt;
  if (!cleanExcerpt || cleanExcerpt.trim() === '') {
    cleanExcerpt = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180) + '...';
  }

  // Reading time
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const mainCategory = categories[0] || '( آ )';

  cleanArticles.push({
    id: idCounter++,
    wpId: postId,
    title,
    slug: slug || encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-')),
    category: mainCategory,
    categoryName: mainCategory,
    content,
    excerpt: cleanExcerpt,
    featuredImage: featuredImage || '/images/default_doctor.webp',
    author: 'حکیم سید عبدالوہاب شاہ',
    authorImage: '/images/author-photo.jpg',
    status: 'published',
    readingTime: `${readingTimeMinutes} منٹ`,
    categories: categories.length > 0 ? categories : [mainCategory],
    tags,
    publishedAt: pubDate,
    date: pubDate
  });
}

// Clean any accidental \uFFFD from all strings
for (const art of cleanArticles) {
  for (const k of Object.keys(art)) {
    if (typeof art[k] === 'string') {
      art[k] = art[k].replace(/\uFFFD/g, '');
    } else if (Array.isArray(art[k])) {
      art[k] = art[k].map(item => typeof item === 'string' ? item.replace(/\uFFFD/g, '') : item);
    }
  }
}

const outStr = JSON.stringify(cleanArticles, null, 2);
const fffdMatches = outStr.match(/\uFFFD/g);
console.log(`Rebuilt clean articles count: ${cleanArticles.length}`);
console.log(`FFFD count in new articles JSON: ${fffdMatches ? fffdMatches.length : 0}`);

fs.writeFileSync(articlesJsonPath, outStr, 'utf8');
fs.writeFileSync(articlesLocalPath, outStr, 'utf8');

// Also write to dist/
const distArticlesPath = path.join(__dirname, '..', 'dist', 'data', 'articles.json');
const distArticlesLocalPath = path.join(__dirname, '..', 'dist', 'articles_local.json');
if (fs.existsSync(path.dirname(distArticlesPath))) {
  fs.writeFileSync(distArticlesPath, outStr, 'utf8');
}
if (fs.existsSync(path.dirname(distArticlesLocalPath))) {
  fs.writeFileSync(distArticlesLocalPath, outStr, 'utf8');
}

console.log('✅ Successfully wrote clean articles to public/data/articles.json and dist/');
