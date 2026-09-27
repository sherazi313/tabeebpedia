import fs from 'fs';

const xml = fs.readFileSync('tabeebpedia.WordPress.2026-09-27 Pages.xml', 'utf8');

const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
const pages = [];

while ((match = itemRegex.exec(xml)) !== null) {
  const itemStr = match[1];
  const title = (itemStr.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemStr.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const postName = (itemStr.match(/<wp:post_name><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_name>/) || itemStr.match(/<wp:post_name>(.*?)<\/wp:post_name>/) || [])[1] || '';
  const postId = (itemStr.match(/<wp:post_id>(\d+)<\/wp:post_id>/) || [])[1] || '';
  const postParent = (itemStr.match(/<wp:post_parent>(\d+)<\/wp:post_parent>/) || [])[1] || '0';
  const postType = (itemStr.match(/<wp:post_type><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_type>/) || itemStr.match(/<wp:post_type>(.*?)<\/wp:post_type>/) || [])[1] || '';
  const status = (itemStr.match(/<wp:status><!\[CDATA\[([\s\S]*?)\]\]><\/wp:status>/) || itemStr.match(/<wp:status>(.*?)<\/wp:status>/) || [])[1] || '';
  const content = (itemStr.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) || [])[1] || '';

  if (postType === 'page') {
    pages.push({ 
      postId, 
      title: title.trim(), 
      postName, 
      postParent, 
      status,
      contentLength: content.length 
    });
  }
}

console.log('Total pages in XML:', pages.length);
pages.forEach(p => {
  console.log(`ID: ${p.postId.padEnd(5)} | Parent: ${p.postParent.padEnd(5)} | Status: ${p.status.padEnd(8)} | ContentLen: ${String(p.contentLength).padEnd(6)} | Title: "${p.title}" | Slug: "${p.postName}"`);
});
