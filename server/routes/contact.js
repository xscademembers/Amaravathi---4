import { Router } from 'express';
import Contact from '../models/Contact.js';
import { authMiddleware } from './auth.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone, eventType, eventDate, message } = req.body;
    if (!name || !phone || !eventType) {
      return res.status(400).json({ error: 'Name, phone, and event type are required' });
    }

    const contact = await Contact.create({ name, phone, eventType, eventDate, message });
    res.status(201).json({ message: 'Enquiry submitted successfully', id: contact._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
