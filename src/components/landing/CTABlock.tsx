'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

export function CTABlock() {
  const { t } = useI18n();

  return (
    <section className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="type-section-title text-2xl md:text-3xl font-light text-[var(--color-text-primary)] mb-4">
          {t('map.title')}
        </h2>
        <p className="text-lg text-[var(--color-text-muted)] mb-8">
          {t('map.desc')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/recipes"
            className="px-8 py-4 bg-[var(--color-accent)] text-[var(--color-accent-contrast)] text-sm tracking-[var(--letter-spacing-label)] uppercase font-light transition-all hover:shadow-[0_0_40px_rgba(196,165,116,0.2)]"
          >
            {t('hero.cta')}
          </Link>
          <Link
            href="/collection"
            className="px-8 py-4 border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm tracking-[var(--letter-spacing-label)] uppercase font-light hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
          >
            {t('hero.secondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
