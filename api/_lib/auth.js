import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'amaravathi-admin-secret-2026';

export function getTokenPayload(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
}
