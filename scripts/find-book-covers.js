import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const xml = fs.readFileSync(path.join(rootDir, 'tabeebpedia.WordPress.2026-09-27 Pages.xml'), 'utf8');
const p = (xml.match(/<wp:post_id>8339<\/wp:post_id>[\s\S]*?<\/item>/) || [])[0] || '';
const imgMatches = p.match(/https?:\/\/[^"'\s<>]+\.(?:png|jpg|jpeg|webp)/gi) || [];

console.log('Images in post 8339:');
console.log(Array.from(new Set(imgMatches)));

// Also let's search across all XML for book cover images
const allBookImgs = xml.match(/https?:\/\/[^"'\s<>]*(?:book|tib-e-pakistani|kulyat|matab|sabir)[^"'\s<>]*(?:png|jpg|jpeg|webp)/gi) || [];
console.log('Book images across all XML:');
console.log(Array.from(new Set(allBookImgs)));
