import connectDB from '../../_lib/db.js';
import { Gallery } from '../../_lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const image = await Gallery.findById(req.query.id).select('imageData imageContentType');
    if (!image?.imageData?.length) {
      return res.status(404).json({ error: 'Stored image not found' });
    }

    res.setHeader('Content-Type', image.imageContentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(image.imageData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
