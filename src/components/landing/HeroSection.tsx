'use client';

import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { usePublicRecipes } from '@/hooks/usePublicRecipes';
import { getCollectionStats } from '@/lib/public-recipes';
import BrandLogo from '@/components/BrandLogo';
import { HeroVideo } from './HeroVideo';

export function HeroSection() {
  const { t } = useI18n();
  const { recipes } = usePublicRecipes();
  const { recipeCount, cityCount } = getCollectionStats(recipes);

  return (
    <section className="relative flex min-h-svh flex-col px-4 pb-6 pt-[calc(var(--header-height)+1rem)] md:px-8 lg:px-10 lg:pt-[calc(var(--header-height)+1.5rem)]">
      <div className="mx-auto grid w-full max-w-[1520px] flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)] lg:gap-6">
        <div className="relative flex min-w-0 flex-col justify-center overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-6 shadow-[var(--shadow-md)] md:p-8 xl:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(158,61,79,0.13),transparent_65%)]" aria-hidden="true" />
          <div className="relative">
            <div className="mb-6 flex items-center gap-3 text-[var(--color-accent)]">
              <span className="h-px w-7 bg-current" aria-hidden="true" />
              <span className="type-label tracking-[var(--letter-spacing-label)]">{t('hero.label')}</span>
            </div>
            <h1 className="w-full max-w-[25rem]">
              <BrandLogo tone="red" size="hero" priority />
              <span className="sr-only">{t('logo')}</span>
            </h1>
            <p className="mt-6 max-w-[34ch] font-display text-xl leading-relaxed text-[var(--color-text-muted)] md:text-[1.4rem]">
              {t('hero.desc')}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/recipes"
                className="group inline-flex min-h-13 items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-accent-contrast)] transition-colors hover:bg-[var(--color-accent-light)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              >
                <span>{t('hero.cta')}</span>
                <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/collection"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-accent)]/40 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              >
                {t('hero.secondary')}
              </Link>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-6">
              {[
                { value: recipeCount, label: t('hero.statsRecipes') },
                { value: cityCount, label: t('hero.statsCities') },
                { value: 2025, label: t('hero.statsYear') },
              ].map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="type-label text-[0.6rem] leading-relaxed tracking-[0.08em] text-[var(--color-text-secondary)] xl:text-[0.65rem]">{stat.label}</dt>
                  <dd className="mt-1 font-display text-3xl text-[var(--color-accent)] xl:text-4xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <HeroVideo />
      </div>
      <Link
        href="#collection-teaser"
        className="mx-auto mt-5 inline-flex items-center gap-2 py-1 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
      >
        <span className="type-label tracking-[var(--letter-spacing-wide)]">{t('hero.scrollHint')}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
