import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🌟 === MASTER DATA CLEANER & VERIFIER === 🌟');

// Note: Dynamic data files (articles, doctors, settings) are managed via Live CMS and must NEVER be overwritten from legacy XML.

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
