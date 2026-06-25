import connectDB from '../_lib/db.js';
import { getTokenPayload } from '../_lib/auth.js';
import { Gallery } from '../_lib/models.js';
import { fallbackGalleryDocuments } from '../_lib/galleryFallback.js';
import {
  downloadGalleryImage,
  galleryDocumentForResponse,
  parseImageDataUrl,
} from '../../shared/galleryStorage.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      const images = await Gallery.find().select('-imageData').sort({ order: 1, createdAt: -1 });
      if (images.length === 0) {
        return res.status(200).json(fallbackGalleryDocuments());
      }
      return res.status(200).json(images.map(galleryDocumentForResponse));
    } catch {
      return res.status(200).json(fallbackGalleryDocuments());
    }
  }

  if (req.method === 'POST') {
    const payload = getTokenPayload(req);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    try {
      await connectDB();
      const { imageData, imageUrl, title } = req.body || {};
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
      return res.status(201).json(galleryDocumentForResponse(image));
    } catch (error) {
      const status = /image|URL|host|http|redirect/i.test(error.message) ? 422 : 500;
      return res.status(status).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
