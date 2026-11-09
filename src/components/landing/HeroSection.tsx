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
    <section className="relative flex flex-col px-4 pb-6 pt-[calc(var(--header-height)+1rem)] md:px-8 lg:px-10 lg:pt-[calc(var(--header-height)+1.5rem)]">
      <div className="mx-auto grid w-full max-w-[1520px] grid-cols-1 gap-4 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)] xl:gap-6">
        <div className="relative flex min-w-0 flex-col justify-center overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-5 shadow-[var(--shadow-md)] 2xl:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(158,61,79,0.13),transparent_65%)]" aria-hidden="true" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-3 xl:hidden 2xl:mb-4 2xl:flex text-[var(--color-accent)]">
              <span className="h-px w-7 bg-current" aria-hidden="true" />
              <span className="type-label tracking-[var(--letter-spacing-label)]">{t('hero.label')}</span>
            </div>
            <h1 className="w-full max-w-[14rem] xl:max-w-[11rem] 2xl:max-w-[18rem]">
              <BrandLogo tone="red" size="hero" priority />
              <span className="sr-only">{t('logo')}</span>
            </h1>
            <p className="mt-3 font-display text-base leading-[1.4] text-[var(--color-text-muted)] 2xl:mt-4 2xl:text-lg">
              {t('hero.desc')}
            </p>
            <div className="mt-4 flex flex-col gap-2 2xl:mt-5">
              <Link
                href="/recipes"
                className="group inline-flex min-h-9 2xl:min-h-10 items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2 text-xs 2xl:py-2.5 font-semibold uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-accent-contrast)] transition-colors hover:bg-[var(--color-accent-light)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              >
                <span>{t('hero.cta')}</span>
                <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/collection"
                className="inline-flex min-h-9 2xl:min-h-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-accent)]/40 px-4 py-2 text-center text-xs 2xl:py-2.5 font-semibold uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              >
                {t('hero.secondary')}
              </Link>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-3 2xl:mt-4 2xl:pt-4">
              {[
                { value: recipeCount, label: t('hero.statsRecipes') },
                { value: cityCount, label: t('hero.statsCities') },
                { value: 2025, label: t('hero.statsYear') },
              ].map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="type-label text-[0.55rem] leading-tight tracking-[0.06em] text-[var(--color-text-secondary)] 2xl:text-[0.6rem]">{stat.label}</dt>
                  <dd className="mt-1 font-display text-2xl leading-none text-[var(--color-accent)] 2xl:text-3xl">{stat.value}</dd>
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
