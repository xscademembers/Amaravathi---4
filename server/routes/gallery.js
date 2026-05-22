import { Router } from 'express';
import Gallery from '../models/Gallery.js';
import { authMiddleware } from './auth.js';
import { isDbConnected } from '../db.js';
import { fallbackGalleryDocuments } from '../galleryFallback.js';

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
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    if (images.length === 0) {
      return res.json(fallbackGalleryDocuments());
    }
    res.json(images);
  } catch (error) {
    res.json(fallbackGalleryDocuments());
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const { imageUrl, title } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

    const count = await Gallery.countDocuments();
    const image = await Gallery.create({ imageUrl, title: title || '', order: count });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
