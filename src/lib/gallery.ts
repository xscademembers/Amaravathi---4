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
  if (url.startsWith('/')) return url;
  if (needsProxy(url)) {
    return `${API}/api/gallery/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
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
