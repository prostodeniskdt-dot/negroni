'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`.slice(0, 48);
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const parts = document.cookie.split(';').map((x) => x.trim());
  for (const p of parts) {
    if (p.startsWith(`${name}=`)) return decodeURIComponent(p.slice(name.length + 1));
  }
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const anonymousId = useMemo(() => {
    const existing = getCookie('negroni_aid');
    if (existing) return existing;
    const created = randomId('aid');
    setCookie('negroni_aid', created, 365);
    return created;
  }, []);

  const sessionIdRef = useRef<string>(getCookie('negroni_sid') || randomId('sid'));
  useEffect(() => {
    setCookie('negroni_sid', sessionIdRef.current, 7);
  }, []);

  const enteredAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    enteredAtRef.current = Date.now();

    fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        events: [
          {
            type: 'page_view',
            path: pathname,
            referrer,
            anonymousId,
            sessionId: sessionIdRef.current,
          },
        ],
      }),
    }).catch(() => {});
  }, [pathname, anonymousId]);

  useEffect(() => {
    const sendTime = () => {
      const ms = Date.now() - enteredAtRef.current;
      if (ms < 1000) return;
      fetch('/api/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          events: [
            {
              type: 'time_on_page',
              path: pathname,
              durationMs: Math.min(ms, 1000 * 60 * 60 * 24),
              anonymousId,
              sessionId: sessionIdRef.current,
            },
          ],
        }),
      }).catch(() => {});
    };

    const onVis = () => {
      if (document.visibilityState === 'hidden') sendTime();
    };
    window.addEventListener('beforeunload', sendTime);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('beforeunload', sendTime);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [pathname, anonymousId]);

  return null;
}

