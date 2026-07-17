'use client';

import { useEffect, useRef, useState } from 'react';
import { REVEAL_OBSERVER_OPTIONS } from '@/components/Reveal';

const REVEAL_FALLBACK_MS = 1000;

export function useReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const reveal = () => setIsVisible(true);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      { ...REVEAL_OBSERVER_OPTIONS, ...options }
    );

    observer.observe(el);
    const fallback = window.setTimeout(reveal, REVEAL_FALLBACK_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [options]);

  return { ref, isVisible };
}
