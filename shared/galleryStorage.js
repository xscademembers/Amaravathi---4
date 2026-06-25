import dns from 'node:dns/promises';
import net from 'node:net';

export const MAX_GALLERY_IMAGE_BYTES = 2_500_000;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function isPrivateIp(address) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split('.').map(Number);
    return (
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 0
    );
  }

  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return (
      normalized === '::1' ||
      normalized === '::' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb')
    );
  }

  return true;
}

async function validateRemoteUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Enter a valid image URL');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Image URL must use http or https');
  }
  if (parsed.username || parsed.password) {
    throw new Error('Image URL cannot contain credentials');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.local')) {
    throw new Error('Private image hosts are not allowed');
  }

  const addresses = net.isIP(hostname)
    ? [{ address: hostname }]
    : await dns.lookup(hostname, { all: true });

  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error('Private image hosts are not allowed');
  }

  return parsed;
}

function validateImageType(contentType) {
  const normalized = contentType.split(';')[0].trim().toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(normalized)) {
    throw new Error('URL did not return a supported image');
  }
  return normalized;
}

export function parseImageDataUrl(imageData) {
  if (typeof imageData !== 'string') {
    throw new Error('Invalid uploaded image');
  }

  const match = imageData.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) {
    throw new Error('Invalid uploaded image');
  }

  const contentType = validateImageType(match[1]);
  const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
  if (!buffer.length) {
    throw new Error('Uploaded image is empty');
  }
  if (buffer.length > MAX_GALLERY_IMAGE_BYTES) {
    throw new Error('Image is too large. Keep it below 2.5 MB');
  }

  return { buffer, contentType };
}

export async function downloadGalleryImage(rawUrl) {
  let currentUrl = rawUrl;

  for (let redirectCount = 0; redirectCount <= 4; redirectCount += 1) {
    await validateRemoteUrl(currentUrl);

    const response = await fetch(currentUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
      headers: {
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif,image/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36',
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Image URL redirected without a destination');
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    if (!response.ok) {
      throw new Error(`Image host returned HTTP ${response.status}`);
    }

    const contentType = validateImageType(response.headers.get('content-type') || '');
    const declaredSize = Number(response.headers.get('content-length') || 0);
    if (declaredSize > MAX_GALLERY_IMAGE_BYTES) {
      throw new Error('Image is too large. Keep it below 2.5 MB');
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) throw new Error('Downloaded image is empty');
    if (buffer.length > MAX_GALLERY_IMAGE_BYTES) {
      throw new Error('Image is too large. Keep it below 2.5 MB');
    }

    return { buffer, contentType, sourceUrl: currentUrl };
  }

  throw new Error('Image URL redirected too many times');
}

export function galleryDocumentForResponse(document) {
  const image = typeof document.toObject === 'function' ? document.toObject() : document;
  const { imageData, ...safeImage } = image;
  const stored = Boolean(imageData || image.imageContentType);

  return {
    ...safeImage,
    imageUrl: stored ? `/api/gallery/${image._id}/image` : image.imageUrl,
    stored,
  };
}
