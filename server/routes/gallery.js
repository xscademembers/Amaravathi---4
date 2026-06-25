import { Router } from 'express';
import Gallery from '../models/Gallery.js';
import { authMiddleware } from './auth.js';
import { isDbConnected } from '../db.js';
import { fallbackGalleryDocuments } from '../galleryFallback.js';
import {
  downloadGalleryImage,
  galleryDocumentForResponse,
  parseImageDataUrl,
} from '../../shared/galleryStorage.js';

const router = Router();

const PROXY_HOSTS = [
  'googleusercontent.com',
  'ggpht.com',
  'photos.google.com',
  'drive.google.com',
  'lh3.google.com',
];

const PROXY_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

router.get('/proxy', async (req, res) => {
  const raw = req.query.url;
  if (!raw || typeof raw !== 'string') {
    return res.status(400).json({ error: 'url query parameter is required' });
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!PROXY_HOSTS.some((h) => parsed.hostname.includes(h))) {
    return res.status(400).json({ error: 'URL host is not allowed' });
  }

  try {
    const upstream = await fetch(raw, {
      redirect: 'follow',
      headers: {
        'User-Agent': PROXY_USER_AGENT,
        Accept: 'image/*,*/*;q=0.8',
      },
    });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream image request failed' });
    }
    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  if (!isDbConnected()) {
    return res.json(fallbackGalleryDocuments());
  }

  try {
    const images = await Gallery.find().select('-imageData').sort({ order: 1, createdAt: -1 });
    if (images.length === 0) {
      return res.json(fallbackGalleryDocuments());
    }
    res.json(images.map(galleryDocumentForResponse));
  } catch (error) {
    res.json(fallbackGalleryDocuments());
  }
});

router.get('/:id/image', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const image = await Gallery.findById(req.params.id).select('imageData imageContentType');
    if (!image?.imageData?.length) {
      return res.status(404).json({ error: 'Stored image not found' });
    }

    res.setHeader('Content-Type', image.imageContentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(image.imageData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const { imageData, imageUrl, title } = req.body;
    if (!imageData && !imageUrl) {
      return res.status(400).json({ error: 'Upload an image or enter an image URL' });
    }

    const imported = imageData
      ? { ...parseImageDataUrl(imageData), sourceUrl: '' }
      : await downloadGalleryImage(imageUrl.trim());

    const count = await Gallery.countDocuments();
    const image = await Gallery.create({
      imageUrl: '',
      sourceUrl: imported.sourceUrl,
      imageData: imported.buffer,
      imageContentType: imported.contentType,
      title: title || '',
      order: count,
    });
    res.status(201).json(galleryDocumentForResponse(image));
  } catch (error) {
    const status = /image|URL|host|http|redirect/i.test(error.message) ? 422 : 500;
    res.status(status).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
