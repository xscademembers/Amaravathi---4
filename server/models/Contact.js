import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: String, default: '' },
  message: { type: String, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
