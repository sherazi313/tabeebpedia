import { saveMediaApi, fetchLiveMedia } from '../api';

/**
 * Automatically compress an image file if it exceeds 1MB (or custom size)
 * Uses HTML5 Canvas for high performance client-side compression.
 * Preserves aspect ratio, reduces dimensions to maxDimension and quality.
 * 
 * @param {File|Blob} file 
 * @param {Object} options 
 * @returns {Promise<{ dataUrl: string, file: File|Blob, originalSize: number, compressedSize: number, wasCompressed: boolean }>}
 */
export async function compressImage(file, options = {}) {
  const {
    maxDimension = 1280,
    quality = 0.82,
    maxSizeBytes = 1024 * 1024 // 1 MB
  } = options;

  if (!file || !(file instanceof Blob)) {
    throw new Error('فائل فراہم نہیں کی گئی یا غیر درست فارمیٹ ہے۔');
  }

  const originalSize = file.size;
  const isImage = file.type ? file.type.startsWith('image/') : true;
  if (!isImage) {
    throw new Error('براہ کرم درست تصویری فائل منتخب کریں۔');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('تصویر پڑھنے میں خرابی ہوئی۔'));

    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // If file is already smaller than 1MB and not huge, we can still load it to check dimensions
      const img = new Image();
      img.onerror = () => reject(new Error('تصویر کو پروسیس کرنے میں رکاوٹ آئی۔'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        const needsResize = width > maxDimension || height > maxDimension;
        const needsCompression = originalSize >= maxSizeBytes || needsResize;

        // If file is well under 1MB and doesn't exceed dimensions, return as is
        if (!needsCompression) {
          resolve({
            dataUrl,
            file,
            originalSize,
            compressedSize: originalSize,
            wasCompressed: false
          });
          return;
        }

        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl,
            file,
            originalSize,
            compressedSize: originalSize,
            wasCompressed: false
          });
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer webp if supported, else jpeg
        let outputType = 'image/jpeg';
        if (file.type === 'image/webp' || file.type === 'image/png') {
          outputType = 'image/webp';
        }

        let currentQuality = quality;
        let compressedDataUrl = canvas.toDataURL(outputType, currentQuality);

        // Approximate size calculation from base64
        let approxSize = Math.round((compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1)) * 0.75);

        // If still > 1MB, progressively compress further
        if (approxSize > maxSizeBytes && currentQuality > 0.5) {
          currentQuality = 0.65;
          compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          approxSize = Math.round((compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1)) * 0.75);
        }

        if (approxSize > maxSizeBytes && currentQuality > 0.4) {
          currentQuality = 0.45;
          compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          approxSize = Math.round((compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1)) * 0.75);
        }

        resolve({
          dataUrl: compressedDataUrl,
          file,
          originalSize,
          compressedSize: approxSize,
          wasCompressed: true
        });
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Automatically adds an uploaded image to the website's Media Library
 * and syncs with backend and localStorage.
 * 
 * @param {Object} item - { url, name, attachedTo, doctorId }
 */
export async function addMediaItemToLibrary({ url, name, attachedTo = 'طبیب پروفائل', doctorId = null }) {
  if (!url) return;

  const cleanName = name || `doctor-photo-${Date.now()}.jpg`;
  const newMedia = {
    id: 'media-doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    url,
    name: cleanName,
    date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
    attachedTo: attachedTo || 'طبیب پروفائل',
    doctorId: doctorId || null,
    source: 'doctor_upload'
  };

  try {
    const saved = localStorage.getItem('tabeeb_media_library');
    let currentList = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) currentList = parsed;
      } catch (e) {}
    }

    // Check if already in list
    const exists = currentList.some(m => m && m.url === url);
    if (!exists) {
      const updatedList = [newMedia, ...currentList].slice(0, 500);
      localStorage.setItem('tabeeb_media_library', JSON.stringify(updatedList));

      // Attempt to save to backend API
      try {
        saveMediaApi(updatedList);
      } catch (err) {}

      // Fire a custom event so any open Admin CMS or media views refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tabeeb:media-updated', { detail: newMedia }));
      }
    }
  } catch (err) {
    console.warn('Error saving to media library:', err);
  }

  return newMedia;
}
