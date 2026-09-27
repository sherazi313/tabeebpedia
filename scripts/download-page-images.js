import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesDir = path.join(rootDir, 'public', 'images', 'pages');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const distImagesDir = path.join(rootDir, 'dist', 'images', 'pages');
if (!fs.existsSync(distImagesDir)) {
  fs.mkdirSync(distImagesDir, { recursive: true });
}

// Map of image remote URLs to local filenames
const IMAGE_MAP = [
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-Hakeem-in-Sind-صوبہ-سندھ-کے-رجسٹرڈ-حکیموں-کی-لسٹ-300x204.png',
    localFile: 'list-hakeem-sindh.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-Hakeem-of-Gilgit-گلگت-بلتستان-کے-حکیموں-کی-لسٹ-300x205.png',
    localFile: 'list-hakeem-gilgit.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-Hakeem-Kashmir-آزاد-کشمیر-کے-مستند-حکیموں-کی-لسٹ-300x205.png',
    localFile: 'list-hakeem-kashmir.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-of-Certified-Hakims-in-Balochistan-بلوچستان-کے-حکیموں-کی-لسٹ-300x205.png',
    localFile: 'list-hakeem-balochistan.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-of-Certified-Hakeem-in-KHYBER-PUKHTUNKHWAH-خیبر-پختونخواہ-میں-حکیموں-کی-لسٹ-300x205.png',
    localFile: 'list-hakeem-kpk.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/punjab-Hakeem-List-پنجاب-کے-مستند-حکیموں-کی-لسٹ-300x205.png',
    localFile: 'list-hakeem-punjab.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-Hakim-Punjab-West-مغربی-پنجاب-کے-حکیم.png',
    localFile: 'list-hakeem-punjab-west.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-of-Eastern-Punjab-scholars-پنجاب-شرقی-کے-حکیم.png',
    localFile: 'list-hakeem-punjab-east.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-Hakim-Punjab-South-جنوبی-پنجاب-کے-حکیم.png',
    localFile: 'list-hakeem-punjab-south.png'
  },
  {
    remoteUrl: 'https://tabeebpedia.com/wp-content/uploads/2025/03/List-Hakim-Punjab-North-شمالی-پنجاب-کے-حکیم.png',
    localFile: 'list-hakeem-punjab-north.png'
  }
];

async function downloadImages() {
  console.log('🚀 Downloading page images from live server...');

  for (const item of IMAGE_MAP) {
    const destPath = path.join(imagesDir, item.localFile);
    const distDestPath = path.join(distImagesDir, item.localFile);

    try {
      console.log(`📥 Downloading ${item.localFile}...`);
      const res = await fetch(encodeURI(item.remoteUrl));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(destPath, buffer);
      fs.writeFileSync(distDestPath, buffer);
      console.log(`✅ Saved: ${item.localFile} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`❌ Failed to download ${item.localFile}:`, err.message);
    }
  }

  console.log('🎉 All images downloaded and synced to dist!');
}

downloadImages();
