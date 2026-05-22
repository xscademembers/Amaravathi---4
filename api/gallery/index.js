import connectDB from '../_lib/db.js';
import { getTokenPayload } from '../_lib/auth.js';
import { Gallery } from '../_lib/models.js';
import { fallbackGalleryDocuments } from '../_lib/galleryFallback.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
      if (images.length === 0) {
        return res.status(200).json(fallbackGalleryDocuments());
      }
      return res.status(200).json(images);
    } catch {
      return res.status(200).json(fallbackGalleryDocuments());
    }
  }

  if (req.method === 'POST') {
    const payload = getTokenPayload(req);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    try {
      await connectDB();
      const { imageUrl, title } = req.body || {};
      if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

      const count = await Gallery.countDocuments();
      const image = await Gallery.create({ imageUrl, title: title || '', order: count });
      return res.status(201).json(image);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
