import connectDB from '../../_lib/db.js';
import { getTokenPayload } from '../../_lib/auth.js';
import { Contact } from '../../_lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = getTokenPayload(req);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });

  await connectDB();
  const { id } = req.query;
  const contact = await Contact.findByIdAndUpdate(id, { read: true }, { new: true });
  if (!contact) return res.status(404).json({ error: 'Contact not found' });

  return res.status(200).json(contact);
}
