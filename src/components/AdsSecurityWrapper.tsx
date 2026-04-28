import { useEffect, useMemo, useRef, useState } from 'react';
import { ADS_CONSENT_CHANGED_EVENT, hasAdConsent } from '../lib/adsConsent';

type AdProvider = 'adsense' | 'propeller';
type AdStatus = 'idle' | 'loading' | 'ready' | 'blocked';

type AdFrameMessage = {
  source?: string;
  type?: 'ads-frame-status';
  status?: 'ready' | 'blocked' | 'error';
};

const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true';

const requestIdle = (callback: () => void) => {
  if ('requestIdleCallback' in globalThis) {
    const idle = (globalThis as typeof globalThis & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback;
    idle(callback);
    return;
  }
  globalThis.setTimeout(callback, 0);
};

export function AdsSecurityWrapper() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [inView, setInView] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [status, setStatus] = useState<AdStatus>('idle');
  const [frameSrc, setFrameSrc] = useState('');

  const provider = (import.meta.env.VITE_ADS_PROVIDER ?? 'adsense') as AdProvider;
  const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT_ID ?? '';
  const adsenseSlot = import.meta.env.VITE_ADSENSE_SLOT_ID ?? '';
  const propellerZoneId = import.meta.env.VITE_PROPELLER_ZONE_ID ?? '';
  const frameSandbox =
    import.meta.env.VITE_ADS_IFRAME_SANDBOX ?? 'allow-scripts allow-popups';

  const frameUrl = useMemo(() => {
    if (!ADS_ENABLED) {
      return '';
    }

    const params = new URLSearchParams();
    params.set('provider', provider);

    if (provider === 'adsense') {
      if (!adsenseClient || !adsenseSlot) {
        return '';
      }
      params.set('client', adsenseClient);
      params.set('slot', adsenseSlot);
    }

    if (provider === 'propeller') {
      if (!propellerZoneId) {
        return '';
      }
      params.set('zoneId', propellerZoneId);
    }

    return `/ads/frame.html?${params.toString()}`;
  }, [provider, adsenseClient, adsenseSlot, propellerZoneId]);

  useEffect(() => {
    if (!ADS_ENABLED) {
      return;
    }

    const refreshConsent = () => setConsentGranted(hasAdConsent());
    refreshConsent();

    window.addEventListener('storage', refreshConsent);
    window.addEventListener(ADS_CONSENT_CHANGED_EVENT, refreshConsent);

    return () => {
      window.removeEventListener('storage', refreshConsent);
      window.removeEventListener(ADS_CONSENT_CHANGED_EVENT, refreshConsent);
    };
  }, []);

  useEffect(() => {
    if (!ADS_ENABLED || !consentGranted || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [consentGranted]);

  useEffect(() => {
    if (!ADS_ENABLED || !consentGranted || !inView || !frameUrl) {
      return;
    }

    requestIdle(() => {
      setStatus('loading');
      setFrameSrc(frameUrl);
    });
  }, [consentGranted, inView, frameUrl]);

  useEffect(() => {
    if (!frameSrc || status !== 'loading') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStatus('blocked');
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [frameSrc, status]);

  useEffect(() => {
    if (!frameSrc) {
      return;
    }

    let lastMessageTime = 0;
    const MESSAGE_THROTTLE_MS = 100;

    const onMessage = (event: MessageEvent<AdFrameMessage>) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.source !== frameRef.current?.contentWindow) {
        return;
      }

      if (event.data?.source !== 'receipt-ad-frame' || event.data.type !== 'ads-frame-status') {
        return;
      }

      // Rate limiting: ignore messages arriving faster than threshold (prevent message spam attacks)
      const now = Date.now();
      if (now - lastMessageTime < MESSAGE_THROTTLE_MS) {
        return;
      }
      lastMessageTime = now;

      if (event.data.status === 'ready') {
        setStatus('ready');
      }

      if (event.data.status === 'blocked' || event.data.status === 'error') {
        setStatus('blocked');
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [frameSrc]);

  if (!ADS_ENABLED || !consentGranted || !frameUrl) {
    return null;
  }

  return (
    <div ref={containerRef} className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" aria-live="polite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
      <div className="w-full max-w-[728px] h-[90px] overflow-hidden">
        {status === 'blocked' ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-400 px-4 text-center">
            Publicidade indisponivel.
          </div>
        ) : (
          <iframe
            ref={frameRef}
            title="Publicidade"
            src={frameSrc}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox={frameSandbox}
          />
        )}
      </div>
      </div>
    </div>
  );
}
