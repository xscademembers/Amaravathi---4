declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const API = import.meta.env.VITE_API_URL || '';
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';

let pixelInitPromise: Promise<void> | null = null;

function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/** Load Meta Pixel after page is interactive so heavy images don't block tracking. */
export function initMetaPixel(): Promise<void> {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID') return Promise.resolve();
  if (pixelInitPromise) return pixelInitPromise;

  pixelInitPromise = new Promise((resolve) => {
    const run = () => {
      if (typeof window.fbq === 'function') {
        window.fbq('init', PIXEL_ID);
        window.fbq('track', 'PageView');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.onload = () => {
        if (typeof window.fbq === 'function') {
          window.fbq('init', PIXEL_ID);
          window.fbq('track', 'PageView');
        }
        resolve();
      };
      script.onerror = () => resolve();
      document.head.appendChild(script);

      if (!window.fbq) {
        type FbqStub = {
          (...args: unknown[]): void;
          queue: unknown[];
          loaded: boolean;
          version: string;
          callMethod?: (...args: unknown[]) => void;
        };
        const n = function (...args: unknown[]) {
          if (n.callMethod) n.callMethod(...args);
          else n.queue.push(args);
        } as FbqStub;
        n.queue = [];
        n.loaded = true;
        n.version = '2.0';
        window.fbq = n;
        if (!window._fbq) window._fbq = n;
      }
    };

    if (document.readyState === 'complete') {
      const schedule = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 0));
      schedule(run);
    } else {
      window.addEventListener('load', () => {
        const schedule = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 0));
        schedule(run);
      }, { once: true });
    }
  });

  return pixelInitPromise;
}

export function trackPixelEvent(eventName: string, params?: Record<string, unknown>) {
  const eventId = generateEventId();
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params, { eventID: eventId });
  }
  return eventId;
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

export async function trackLead(phone?: string) {
  await initMetaPixel();
  const eventId = trackPixelEvent('Lead');
  await sendServerEvent({ eventName: 'Lead', eventId, phone });
}

export async function trackCompleteRegistration(phone?: string) {
  await initMetaPixel();
  const eventId = trackPixelEvent('CompleteRegistration');
  await sendServerEvent({ eventName: 'CompleteRegistration', eventId, phone });
}

export async function trackSubmitApplication(phone?: string) {
  await initMetaPixel();
  const eventId = trackPixelEvent('SubmitApplication');
  await sendServerEvent({ eventName: 'SubmitApplication', eventId, phone });
}
