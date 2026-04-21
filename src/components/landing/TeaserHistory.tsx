'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/hooks/useI18n';

export function TeaserHistory() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--color-campari)]/5 animate-liquid-wave rounded-full" />
      </div>
      <div className="relative z-10 max-w-4xl">
        <span
          className={`inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-[var(--color-campari)] mb-4 transition-all duration-700 ${
            visible ? 'opacity-100' : 'opacity-0 -translate-x-4'
          }`}
        >
          {t('index.historyLabel')}
        </span>
        <h2
          className={`font-[var(--font-display)] text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 transition-all duration-700 delay-75 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {t('index.historyTitle')}
        </h2>
        <p
          className={`text-[var(--color-text-muted)] text-lg leading-relaxed max-w-2xl mb-6 transition-all duration-700 delay-150 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {t('index.historyBody')}
        </p>
        <Link
          href="/history"
          className={`inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-[var(--color-campari)] hover:underline transition-all duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '250ms' }}
        >
          {t('index.historyLink')}
        </Link>
        <div
          className={`mt-8 border-4 border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-md)] transition-all duration-1000 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Image
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800"
            alt="Негрони"
            width={800}
            height={500}
            className="w-full block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
