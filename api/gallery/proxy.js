const PROXY_HOSTS = [
  'googleusercontent.com',
  'ggpht.com',
  'photos.google.com',
  'drive.google.com',
  'lh3.google.com',
];

const PROXY_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const raw = req.query.url;
  if (!raw || typeof raw !== 'string') {
    return res.status(400).json({ error: 'url query parameter is required' });
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!PROXY_HOSTS.some((h) => parsed.hostname.includes(h))) {
    return res.status(400).json({ error: 'URL host is not allowed' });
  }

  try {
    const upstream = await fetch(raw, {
      redirect: 'follow',
      headers: {
        'User-Agent': PROXY_USER_AGENT,
        Accept: 'image/*,*/*;q=0.8',
      },
    });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream image request failed' });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
