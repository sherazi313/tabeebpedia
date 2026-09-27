import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

export function generateOgBanner(outputPath) {
  const width = 1200;
  const height = 630;

  // Raw image data: height scanlines, each (1 filter byte + width * 3 RGB bytes)
  const rowLength = 1 + width * 3;
  const rawBuffer = Buffer.alloc(height * rowLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawBuffer[rowOffset] = 0; // Filter type: None

    const vFactor = y / height;

    for (let x = 0; x < width; x++) {
      const hFactor = x / width;
      const pixelOffset = rowOffset + 1 + x * 3;

      // Base Background Gradient: Deep Midnight Navy (#08101e) to Rich Forest Emerald (#064e3b)
      let r = Math.round(8 + (6 - 8) * vFactor + (2 - 8) * hFactor);
      let g = Math.round(16 + (78 - 16) * vFactor + (45 - 16) * hFactor);
      let b = Math.round(30 + (59 - 30) * vFactor + (20 - 30) * hFactor);

      // Top glowing ambient line (emerald highlight)
      if (y < 6) {
        r = 16; g = 185; b = 129;
      }

      // Decorative outer border
      if (x < 16 || x >= width - 16 || y < 16 || y >= height - 16) {
        if (x < 18 || x >= width - 18 || y < 18 || y >= height - 18) {
          r = Math.min(255, r + 25);
          g = Math.min(255, g + 65);
          b = Math.min(255, b + 50);
        }
      }

      // Central Emblem Badge Circle (center at x=600, y=240, radius=130)
      const dx = x - 600;
      const dy = y - 230;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= 130) {
        // Outer gold / emerald ring
        if (dist >= 122) {
          r = 251; g = 191; b = 36; // Amber gold
        } else if (dist >= 118) {
          r = 16; g = 185; b = 129; // Mint
        } else {
          // Inside emblem circle (radial glow)
          const ringFactor = 1 - (dist / 118);
          r = Math.round(5 + 15 * ringFactor);
          g = Math.round(150 * ringFactor + 40);
          b = Math.round(100 * ringFactor + 50);

          // Stylized central leaf icon inside badge
          // Check if inside leaf formula:
          const lx = dx / 90;
          const ly = dy / 90;
          if (ly > -0.8 && ly < 0.8 && Math.abs(lx) < (1 - ly * ly) * 0.7) {
            // Leaf body
            r = Math.round(167 + 50 * ringFactor);
            g = Math.round(243);
            b = Math.round(208 + 20 * ringFactor);

            // Stem line
            if (Math.abs(lx) < 0.05) {
              r = 255; g = 255; b = 255;
            }
          }
        }
      } else if (dist <= 180) {
        // Ambient glow around badge
        const glow = (180 - dist) / 50;
        g = Math.min(255, Math.round(g + 50 * glow));
        b = Math.min(255, Math.round(b + 30 * glow));
      }

      // Lower Card Banner Accent at y = 440..580
      if (y >= 440 && y <= 560 && x >= 150 && x <= 1050) {
        const cardAlpha = 0.25;
        r = Math.round(r * (1 - cardAlpha) + 15 * cardAlpha);
        g = Math.round(g * (1 - cardAlpha) + 40 * cardAlpha);
        b = Math.round(b * (1 - cardAlpha) + 70 * cardAlpha);

        // Accent top border of card
        if (y === 440) {
          r = 52; g = 211; b = 153;
        }
      }

      rawBuffer[pixelOffset] = Math.max(0, Math.min(255, r));
      rawBuffer[pixelOffset + 1] = Math.max(0, Math.min(255, g));
      rawBuffer[pixelOffset + 2] = Math.max(0, Math.min(255, b));
    }
  }

  // Compress scanlines with zlib
  const compressedData = zlib.deflateSync(rawBuffer, { level: 9 });

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 2; // Color type: 2 (RGB)
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter: None
  ihdrData[12] = 0; // Interlace: None
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  // Assemble full PNG
  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`✅ Generated Open Graph Banner: ${outputPath} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
}

const outPublic = path.join(rootDir, 'public', 'og-banner.png');
generateOgBanner(outPublic);

const outDist = path.join(rootDir, 'dist');
if (fs.existsSync(outDist)) {
  generateOgBanner(path.join(outDist, 'og-banner.png'));
}
