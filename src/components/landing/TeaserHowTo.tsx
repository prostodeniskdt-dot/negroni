'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

const STEPS = [
  { step: '01', icon: '🗺️', key: 'howto.step1' },
  { step: '02', icon: '📋', key: 'howto.step2' },
  { step: '03', icon: '❤️', key: 'howto.step3' },
] as const;

export function TeaserHowTo() {
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
    <section ref={ref} className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
      <div
        className={`text-center mb-12 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text-muted)] uppercase tracking-[0.08em]">
          {t('howto.title')}
        </h2>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((item, i) => (
          <div
            key={item.step}
            className={`text-center p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-all duration-500 hover:border-[var(--color-campari)]/50 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${150 + i * 100}ms` }}
          >
            <span className="text-3xl mb-3 block">{item.icon}</span>
            <span className="text-[var(--color-campari)] font-[var(--font-display)] font-bold text-sm block mb-2">
              {item.step}
            </span>
            <p className="text-sm text-[var(--color-text-muted)] font-[var(--font-serif)] leading-relaxed">
              {t(item.key)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
