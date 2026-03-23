import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
