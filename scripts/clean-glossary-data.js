import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const files = [
  path.join(rootDir, 'public', 'data', 'glossary.json'),
  path.join(rootDir, 'dist', 'data', 'glossary.json'),
  path.join(rootDir, 'src', 'data', 'glossaryData.json'),
];

function cleanHtmlContent(html, term) {
  if (!html) return '';
  
  let cleaned = html
    // Replace non-breaking spaces
    .replace(/&nbsp;/g, ' ')
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    // Remove inline styles and dir attributes
    .replace(/\s*(?:dir|style|class)="[^"]*"/gi, '')
    // Remove empty tags
    .replace(/<p>\s*<\/p>/gi, '')
    // Clean whitespace inside tags
    .replace(/<\s+/g, '<')
    .replace(/\s+>/g, '>');

  // Clean redundant term h1 headers at start
  const h1Regex = /<h[1-6]>\s*(.*?)\s*<\/h[1-6]>/gi;
  cleaned = cleaned.replace(h1Regex, (match, headingText) => {
    const plainHeading = headingText.replace(/<[^>]+>/g, '').trim().replace(/[:：]/g, '');
    if (plainHeading === term.trim() || plainHeading.includes(term.trim())) {
      return `<h3>${headingText.trim()}</h3>`;
    }
    return `<h3>${headingText.trim()}</h3>`;
  });

  // Clean trailing spaces
  return cleaned.trim();
}

function cleanPlainText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeSlug(slug, term) {
  if (!slug) return term ? term.trim() : '';
  try {
    const decoded = decodeURIComponent(slug).trim();
    return decoded;
  } catch (e) {
    return slug.trim();
  }
}

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    if (Array.isArray(data)) {
      const cleanedData = data.map(item => {
        const decodedSlug = decodeSlug(item.slug, item.term);
        const cleanContent = cleanHtmlContent(item.content || '', item.term);
        const plainDef = cleanPlainText(item.shortDefinition || cleanContent);

        return {
          ...item,
          slug: decodedSlug,
          content: cleanContent,
          shortDefinition: plainDef.length > 250 ? plainDef.slice(0, 247) + '...' : plainDef
        };
      });

      fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2), 'utf8');
      console.log(`✅ Cleaned ${cleanedData.length} items in ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Error cleaning ${filePath}:`, err.message);
  }
});

console.log('🎉 All glossary files cleaned successfully!');
