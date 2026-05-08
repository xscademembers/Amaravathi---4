declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

const API = import.meta.env.VITE_API_URL || '';

function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function trackPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window.fbq === 'function') {
    const eventId = generateEventId();
    window.fbq('track', eventName, params, { eventID: eventId });
    return eventId;
  }
  return null;
}

export async function sendServerEvent({
  eventName,
  eventId,
  phone,
  customData,
}: {
  eventName: string;
  eventId?: string | null;
  phone?: string;
  customData?: Record<string, unknown>;
}) {
  try {
    await fetch(`${API}/api/conversions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        sourceUrl: window.location.href,
        userAgent: navigator.userAgent,
        phone,
        eventId: eventId ?? undefined,
        customData,
      }),
    });
  } catch {
    // fire-and-forget
  }
}

export function trackLead(phone?: string) {
  const eventId = trackPixelEvent('Lead');
  sendServerEvent({ eventName: 'Lead', eventId, phone });
}

export function trackCompleteRegistration(phone?: string) {
  const eventId = trackPixelEvent('CompleteRegistration');
  sendServerEvent({ eventName: 'CompleteRegistration', eventId, phone });
}

export function trackSubmitApplication(phone?: string) {
  const eventId = trackPixelEvent('SubmitApplication');
  sendServerEvent({ eventName: 'SubmitApplication', eventId, phone });
}
