import connectDB from '../_lib/db.js';
import { getTokenPayload } from '../_lib/auth.js';
import { Contact } from '../_lib/models.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { name, phone, eventType, eventDate, message } = req.body || {};
    if (!name || !phone || !eventType) {
      return res.status(400).json({ error: 'Name, phone, and event type are required' });
    }

    const contact = await Contact.create({ name, phone, eventType, eventDate, message });
    return res.status(201).json({ message: 'Enquiry submitted successfully', id: contact._id });
  }

  if (req.method === 'GET') {
    const payload = getTokenPayload(req);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
