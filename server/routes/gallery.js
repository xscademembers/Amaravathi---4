import { Router } from 'express';
import Gallery from '../models/Gallery.js';
import { authMiddleware } from './auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
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
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
