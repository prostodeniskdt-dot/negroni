'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { curations } from '@/data/curations';

export function TeaserCurations() {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const list = curations.slice(0, 3);

  return (
    <section ref={ref} className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2
          className={`font-[var(--font-display)] text-xl font-bold text-[var(--color-text-muted)] uppercase tracking-[0.08em] transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {t('index.curationsTitle')}
        </h2>
        <Link
          href="/curations"
          className={`text-sm text-[var(--color-text-muted)] hover:text-[var(--color-campari-light)] transition-colors ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          {t('index.curationsAll')}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((curation, i) => (
          <Link
            key={curation.id}
            href="/curations"
            className={`block p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] no-underline transition-all hover:border-[var(--color-campari)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg),0_0_24px_rgba(187,10,48,0.15)] relative overflow-hidden group ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${200 + i * 80}ms` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-campari)] opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="text-3xl mb-3 block">{curation.icon}</span>
            <h3 className="font-[var(--font-display)] text-lg font-bold mt-1 mb-1.5 text-[var(--color-text-primary)]">
              {curation.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-normal line-clamp-2">
              {curation.description}
            </p>
            <span className="text-xs text-[var(--color-campari)] mt-2 inline-block">
              {curation.recipeIds.length} {t('collection.recipesCount')}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
