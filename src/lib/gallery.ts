const API = import.meta.env.VITE_API_URL || '';

/** Same paths as server/galleryFallback.js — used when /api/gallery fails */
export const STATIC_GALLERY_FALLBACK = [
  '/DSC05341.jpg',
  '/DSC05343.jpg',
  '/DSC05370.jpg',
  '/wed edit.jpeg',
  '/bday image.jpeg',
  '/religious image.jpeg',
  '/expo.png',
  '/political.jpeg',
  '/college image.jpg',
  '/product-launch-event-.png',
  '/Bday event.jpeg',
];

const PROXY_HOSTS = [
  'googleusercontent.com',
  'ggpht.com',
  'photos.google.com',
  'drive.google.com',
  'lh3.google.com',
];

function needsProxy(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return PROXY_HOSTS.some((h) => host.includes(h));
  } catch {
    return false;
  }
}

/** Use API proxy for Google-hosted URLs so they load on the live site */
export function resolveGalleryImageSrc(url: string): string {
  if (!url) return url;
  if (url.startsWith('/api/')) return `${API}${url}`;
  if (url.startsWith('/')) return url;
  if (needsProxy(url)) {
    return `${API}/api/gallery/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

const MAX_UPLOAD_BYTES = 2_300_000;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected image'));
    reader.readAsDataURL(blob);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Could not prepare the selected image')),
      'image/webp',
      quality,
    );
  });
}

/** Resize and compress uploads so they fit safely within serverless request limits. */
export async function prepareGalleryUpload(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file');
  }

  const bitmap = await createImageBitmap(file);
  let scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  let quality = 0.86;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 7; attempt += 1) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not prepare the selected image');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    blob = await canvasToBlob(canvas, quality);

    if (blob.size <= MAX_UPLOAD_BYTES) break;
    quality = Math.max(0.58, quality - 0.08);
    scale *= 0.85;
  }

  bitmap.close();
  if (!blob || blob.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image is too large. Please choose a smaller file');
  }

  return blobToDataUrl(blob);
}

export function parseGalleryResponse(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'imageUrl' in item) {
        const url = (item as { imageUrl?: string }).imageUrl;
        return typeof url === 'string' ? url : '';
      }
      return '';
    })
    .filter(Boolean)
    .map(resolveGalleryImageSrc);
}

export async function fetchGalleryImages(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/api/gallery`);
    if (res.ok) {
      const data = await res.json();
      const urls = parseGalleryResponse(data);
      if (urls.length > 0) return urls;
    }
  } catch {
    /* use fallback */
  }
  return STATIC_GALLERY_FALLBACK.map(resolveGalleryImageSrc);
}
