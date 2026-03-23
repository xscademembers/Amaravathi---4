import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDate: { type: String, default: '' },
    message: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Gallery =
  mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
export const Contact =
  mongoose.models.Contact || mongoose.model('Contact', contactSchema);
