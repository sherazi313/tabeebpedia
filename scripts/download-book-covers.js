import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const booksDir = path.join(rootDir, 'public', 'images', 'books');
if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

const distBooksDir = path.join(rootDir, 'dist', 'images', 'books');
if (!fs.existsSync(distBooksDir)) {
  fs.mkdirSync(distBooksDir, { recursive: true });
}

const COVERS = [
  {
    slug: 'tib-e-pakistani-urdu',
    url: 'https://archive.org/services/img/tib-e-pakistani-book-english', // same book cover in Urdu edition
    filename: 'tib-e-pakistani-urdu.jpg'
  },
  {
    slug: 'dawa-shakal-jaribotian',
    url: 'https://archive.org/services/img/ways-to-store-medicines-safely',
    filename: 'dawa-shakal-jaribotian.jpg'
  },
  {
    slug: 'tib-e-pakistani-english',
    url: 'https://archive.org/services/img/tib-e-pakistani-book-english',
    filename: 'tib-e-pakistani-english.jpg'
  },
  {
    slug: 'tib-e-pakistani-hindi',
    url: 'https://archive.org/services/img/tib-e-pakistani-book-hindi',
    filename: 'tib-e-pakistani-hindi.jpg'
  },
  {
    slug: 'tib-e-pakistani-arabic',
    url: 'https://archive.org/services/img/tib-e-pakistani-arabic',
    filename: 'tib-e-pakistani-arabic.jpg'
  },
  {
    slug: 'tib-e-pakistani-persian',
    url: 'https://archive.org/services/img/tib-e-pakistani-book-persian',
    filename: 'tib-e-pakistani-persian.jpg'
  },
  {
    slug: 'tib-e-pakistani-chinese',
    url: 'https://archive.org/services/img/tib-e-pakistani-book-1',
    filename: 'tib-e-pakistani-chinese.jpg'
  },
  {
    slug: 'kulyat-sabir-multani-1',
    url: 'https://archive.org/services/img/kulyat-tahqeeqat-sabir-multani-part-1',
    filename: 'kulyat-sabir-multani-1.jpg'
  },
  {
    slug: 'kulyat-sabir-multani-2',
    url: 'https://archive.org/services/img/kulyat-tahqeeqat-sabir-multani-part-2',
    filename: 'kulyat-sabir-multani-2.jpg'
  },
  {
    slug: 'chheh-nabz-kul-amraz',
    url: 'https://archive.org/services/img/20210212_20210212_0729',
    filename: 'chheh-nabz-kul-amraz.jpg'
  },
  {
    slug: 'dawaon-ko-mehfooz-rakhna',
    url: 'https://archive.org/services/img/ways-to-store-medicines-safely',
    filename: 'dawaon-ko-mehfooz-rakhna.jpg'
  },
  {
    slug: 'keto-diet',
    url: 'https://archive.org/services/img/20250305_20250305_1457',
    filename: 'keto-diet.jpg'
  },
  {
    slug: 'jabi-pharmacopoeia',
    url: 'https://archive.org/services/img/jabiformacopia',
    filename: 'jabi-pharmacopoeia.jpg'
  },
  {
    slug: 'lab-test-guide',
    url: 'https://archive.org/services/img/laboratory-test-guide-urdu-dr-muhammad-mustansir',
    filename: 'lab-test-guide.jpg'
  },
  {
    slug: 'lab-tests-paramedics',
    url: 'https://archive.org/services/img/laboratory-tests-for-paramedics',
    filename: 'lab-tests-paramedics.jpg'
  },
  {
    slug: 'pharmacopoeia-qanoon',
    url: 'https://archive.org/services/img/FarmacopiaQanoonMufradAzaHakimSabirMultani',
    filename: 'pharmacopoeia-qanoon.jpg'
  },
  {
    slug: 'color-therapy',
    url: 'https://archive.org/services/img/color-therapy',
    filename: 'color-therapy.jpg'
  },
  {
    slug: 'blood-group-diet',
    url: 'https://archive.org/services/img/20230801_20230801_0039',
    filename: 'blood-group-diet.jpg'
  },
  {
    slug: 'mubadiyat-e-tibb',
    url: 'https://archive.org/services/img/mubadiyat-e-tibb',
    filename: 'mubadiyat-e-tibb.jpg'
  },
  {
    slug: 'mera-matab',
    url: 'https://archive.org/services/img/mera-matab',
    filename: 'mera-matab.jpg'
  },
  {
    slug: 'msds-matab',
    url: 'https://archive.org/services/img/msds-matab-ed-2-180221-rp.cdr',
    filename: 'msds-matab.jpg'
  }
];

async function run() {
  console.log('🚀 Downloading book covers from archive.org...');
  for (const c of COVERS) {
    const dest = path.join(booksDir, c.filename);
    const distDest = path.join(distBooksDir, c.filename);
    try {
      const res = await fetch(c.url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        fs.writeFileSync(distDest, buf);
        console.log(`✅ Saved cover: ${c.filename} (${buf.length} bytes)`);
      } else {
        console.warn(`⚠️ Failed ${c.filename}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ Error ${c.filename}:`, e.message);
    }
  }
  console.log('🎉 Done downloading covers!');
}

run();
