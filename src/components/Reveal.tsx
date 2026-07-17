'use client';

import { type ReactNode, useRef, useEffect, useState } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav';
  id?: string;
  /**
   * Показать сразу без ожидания IntersectionObserver.
   * Нужно для длинных секций (сетка коллекции), где threshold
   * относительно всей высоты блока мог оставлять контент невидимым.
   */
  eager?: boolean;
}

/** Опции IO: любой пиксель во viewport достаточно — не требуем % высоты секции. */
export const REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: '0px 0px 0px 0px',
  threshold: 0,
};

const REVEAL_FALLBACK_MS = 1000;

export default function Reveal({
  children,
  className = '',
  as = 'div',
  id,
  eager = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(eager);

  useEffect(() => {
    if (eager) return;

    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const reveal = () => setIsVisible(true);

    // Уже на экране при маунте (например после гидрации) — показать сразу
    const rect = el.getBoundingClientRect();
    const alreadyInView =
      rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0;
    if (alreadyInView) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        reveal();
        observer.unobserve(el);
      }
    }, REVEAL_OBSERVER_OPTIONS);

    observer.observe(el);

    // Страховка: никогда не оставляем контент навсегда с opacity: 0
    const fallback = window.setTimeout(reveal, REVEAL_FALLBACK_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [eager]);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
