import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const xmlPath = path.join(rootDir, 'tabeebpedia.WordPress.2026-09-27 Pages.xml');
if (!fs.existsSync(xmlPath)) {
  console.error('❌ Pages XML file not found:', xmlPath);
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// Target IDs in the EXACT ORDER shown in the user's screenshot:
const TARGET_PAGES_META = [
  { id: 6609, parentId: null, level: 0, expectedTitle: 'فہرست حکیم رجسٹرڈ پاکستان' },
  { id: 7355, parentId: 6609, level: 1, expectedTitle: 'Registered Tabibs List NCT' },
  { id: 6662, parentId: 6609, level: 1, expectedTitle: 'بلوچستان کے مستند حکیموں کی فہرست' },
  { id: 6818, parentId: 6609, level: 1, expectedTitle: 'پنجاب کے مستند حکیموں کی فہرست' },
  { id: 6743, parentId: 6818, level: 2, expectedTitle: 'پنجاب جنوبی کے حکیموں کی لسٹ' },
  { id: 6735, parentId: 6818, level: 2, expectedTitle: 'پنجاب شرقی کے حکیموں کی لسٹ' },
  { id: 6742, parentId: 6818, level: 2, expectedTitle: 'پنجاب شمالی کے حکیموں کی لسٹ' },
  { id: 6744, parentId: 6818, level: 2, expectedTitle: 'پنجاب غربی کے حکیموں کی لسٹ' },
  { id: 6669, parentId: 6609, level: 1, expectedTitle: 'خیبرپختونخواہ کے مستند حکیموں کی فہرست' },
  { id: 6654, parentId: 6609, level: 1, expectedTitle: 'فہرست رجسٹرڈ حکیم آزاد کشمیر' },
  { id: 6590, parentId: 6609, level: 1, expectedTitle: 'فہرست رجسٹرڈ حکیم صوبہ سندھ' },
  { id: 6633, parentId: 6609, level: 1, expectedTitle: 'فہرست رجسٹرڈ حکیم گلگت بلتستان' }
];

const targetIdSet = new Set(TARGET_PAGES_META.map(m => String(m.id)));

const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
const extractedMap = new Map();

while ((match = itemRegex.exec(xml)) !== null) {
  const itemStr = match[1];
  const postId = (itemStr.match(/<wp:post_id>(\d+)<\/wp:post_id>/) || [])[1];
  if (postId && targetIdSet.has(postId)) {
    const title = (itemStr.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemStr.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    const postName = (itemStr.match(/<wp:post_name><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_name>/) || itemStr.match(/<wp:post_name>(.*?)<\/wp:post_name>/) || [])[1] || '';
    const postDate = (itemStr.match(/<wp:post_date><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_date>/) || itemStr.match(/<wp:post_date>(.*?)<\/wp:post_date>/) || [])[1] || '';
    const postDateGmt = (itemStr.match(/<wp:post_date_gmt><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_date_gmt>/) || [])[1] || '';
    let content = (itemStr.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) || [])[1] || '';

    // Clean WordPress internal URL links inside content:
    // e.g. https://tabeebpedia.com/registered-hakims-pakistan/punjab/eastern-punjab/ -> /eastern-punjab
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/registered-hakims-pakistan\/[^\/]+\/([^\/"'\s]+)\/?/gi, '/$1');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/registered-hakims-pakistan\/([^\/"'\s]+)\/?/gi, '/$1');
    content = content.replace(/https?:\/\/(?:www\.)?tabeebpedia\.com\/([^\/"'\s]+)\/?/gi, '/$1');

    extractedMap.set(postId, {
      postId: parseInt(postId, 10),
      rawTitle: title.trim(),
      slug: postName.trim(),
      date: (postDate || postDateGmt || '2026-09-27').split(' ')[0],
      content
    });
  }
}

console.log(`Found ${extractedMap.size} of ${TARGET_PAGES_META.length} target pages.`);

TARGET_PAGES_META.forEach(meta => {
  const item = extractedMap.get(String(meta.id));
  if (item) {
    console.log(`[Level ${meta.level}] ID: ${item.postId} | Slug: ${item.slug} | Title: "${item.rawTitle}" | ContentLen: ${item.content.length}`);
  } else {
    console.error(`❌ MISSING ID: ${meta.id} (${meta.expectedTitle})`);
  }
});
