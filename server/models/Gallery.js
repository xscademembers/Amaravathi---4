import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, default: '' },
  sourceUrl: { type: String, default: '' },
  imageData: { type: Buffer },
  imageContentType: { type: String, default: '' },
  title: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
