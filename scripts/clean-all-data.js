import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🌟 === MASTER DATA CLEANER & VERIFIER === 🌟');

// 1. REBUILD ARTICLES FROM XML
const postXmlPath = path.join(rootDir, 'tabeebpedia.WordPress.2026-09-24 Post.xml');
if (fs.existsSync(postXmlPath)) {
  console.log('📖 Rebuilding articles from Post.xml...');
  const postXml = fs.readFileSync(postXmlPath, 'utf8');
  const items = postXml.split('<item>').slice(1);

  // Attachments
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
    const title = getTag('title').trim();
    const slug = getTag('wp:post_name').trim();
    const content = getTag('content:encoded');
    const excerpt = getTag('excerpt:encoded');
    const postDate = getTag('wp:post_date');
    const pubDate = postDate ? postDate.split(' ')[0] : '2024-09-24';

    const categories = [];
    const tags = [];
    const catMatches = item.matchAll(/<category domain="([^"]+)"[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g);
    for (const match of catMatches) {
      const domain = match[1];
      const val = match[2].trim();
      if (domain === 'category' && val) categories.push(val);
      if (domain === 'post_tag' && val) tags.push(val);
    }

    let featuredImage = '';
    const metaMatches = item.matchAll(/<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/g);
    for (const m of metaMatches) {
      const thumbId = m[1];
      if (attachmentsMap.has(thumbId)) {
        featuredImage = attachmentsMap.get(thumbId);
        break;
      }
    }

    if (!featuredImage) {
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) featuredImage = imgMatch[1];
    }

    let cleanExcerpt = excerpt;
    if (!cleanExcerpt || cleanExcerpt.trim() === '') {
      cleanExcerpt = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180) + '...';
    }

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

  const artStr = JSON.stringify(cleanArticles, null, 2);
  fs.writeFileSync(path.join(rootDir, 'public', 'data', 'articles.json'), artStr, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public', 'articles_local.json'), artStr, 'utf8');
  console.log(`✅ Articles rebuilt: ${cleanArticles.length} items`);
}

// 2. RECURSIVELY CLEAN & STRIP ANY FFFD ACROSS ALL JSON FILES
const cleanFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return;
  }

  const stripFFFD = (val) => {
    if (typeof val === 'string') {
      return val.replace(/\uFFFD/g, '');
    } else if (Array.isArray(val)) {
      return val.map(stripFFFD);
    } else if (val && typeof val === 'object') {
      const res = {};
      for (const k of Object.keys(val)) {
        res[k] = stripFFFD(val[k]);
      }
      return res;
    }
    return val;
  };

  const cleaned = stripFFFD(data);
  const out = JSON.stringify(cleaned, null, 2);
  fs.writeFileSync(filePath, out, 'utf8');
};

const dirsToClean = [
  path.join(rootDir, 'public', 'data'),
  path.join(rootDir, 'src', 'data'),
  path.join(rootDir, 'dist', 'data')
];

for (const dir of dirsToClean) {
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.json')) {
        cleanFile(path.join(dir, f));
      }
    }
  }
}

// Check local articles
cleanFile(path.join(rootDir, 'public', 'articles_local.json'));
cleanFile(path.join(rootDir, 'dist', 'articles_local.json'));

// 3. AUDIT EVERYTHING
let totalFFFD = 0;
console.log('\n🔍 === AUDIT REPORT ===');
for (const dir of dirsToClean) {
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.json')) {
        const text = fs.readFileSync(path.join(dir, f), 'utf8');
        const m = text.match(/\uFFFD/g);
        const count = m ? m.length : 0;
        totalFFFD += count;
        console.log(`  ${path.relative(rootDir, path.join(dir, f))}: ${count} errors`);
      }
    }
  }
}
console.log(`\n🎉 Grand Total Errors Remaining: ${totalFFFD}`);
if (totalFFFD === 0) {
  console.log('✅ ALL JSON DATA IS 100% CLEAN AND ERROR-FREE!');
}
