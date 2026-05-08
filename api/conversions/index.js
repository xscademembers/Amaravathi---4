import crypto from 'crypto';

const API_VERSION = 'v21.0';

function hashSHA256(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Meta Pixel not configured' });
  }

  const { eventName, sourceUrl, userAgent, email, phone, eventId, customData } = req.body || {};

  if (!eventName) {
    return res.status(400).json({ error: 'eventName is required' });
  }

  const userData = {};
  if (userAgent) userData.client_user_agent = userAgent;
  if (email) userData.em = [hashSHA256(email)];
  if (phone) userData.ph = [hashSHA256(phone.replace(/\D/g, ''))];

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: sourceUrl,
    user_data: userData,
  };

  if (eventId) event.event_id = eventId;
  if (customData) event.custom_data = customData;

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI error:', result);
      return res.status(response.status).json({ error: 'Meta API error', details: result });
    }

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Meta CAPI request failed:', error.message);
    return res.status(500).json({ error: 'Failed to send event to Meta' });
  }
}
