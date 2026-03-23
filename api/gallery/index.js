import connectDB from '../_lib/db.js';
import { getTokenPayload } from '../_lib/auth.js';
import { Gallery } from '../_lib/models.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json(images);
  }

  if (req.method === 'POST') {
    const payload = getTokenPayload(req);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    const { imageUrl, title } = req.body || {};
    if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

    const count = await Gallery.countDocuments();
    const image = await Gallery.create({ imageUrl, title: title || '', order: count });
    return res.status(201).json(image);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
