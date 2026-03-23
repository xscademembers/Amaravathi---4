import { getTokenPayload } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = getTokenPayload(req);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  return res.status(200).json({ valid: true });
}
