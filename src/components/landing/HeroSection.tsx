'use client';

import Link from 'next/link';
import { BookOpenText, ChevronDown, MapPinned } from 'lucide-react';
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
    <section className="relative flex flex-col pb-6 pt-[var(--header-height)]">
      <div className="w-full">
        <HeroVideo>
          <div className="hero-overlay">
            <div className="hero-overlay-content">
              <h1 className="hero-overlay-logo">
                <BrandLogo tone="red" size="hero" priority />
                <span className="sr-only">{t('logo')}</span>
              </h1>
              <dl className="hero-overlay-year">
                <dt>{t('hero.foundedCaption')}</dt>
                <dd>2025</dd>
              </dl>
              <p className="hero-overlay-copy">{t('hero.introFormat')}</p>
              <p className="hero-overlay-copy">{t('hero.introTwists')}</p>
              <div className="hero-overlay-actions">
                <Link href="/recipes" className="hero-overlay-button hero-overlay-button-outline">
                  <MapPinned aria-hidden="true" strokeWidth={1.5} />
                  <span>{t('hero.cta')}</span>
                </Link>
                <Link href="/collection" className="hero-overlay-button hero-overlay-button-solid">
                  <BookOpenText aria-hidden="true" strokeWidth={1.5} />
                  <span>{t('hero.collectionLink')}</span>
                </Link>
              </div>
              <dl className="hero-overlay-stats">
                {[
                  { value: recipeCount, label: t('hero.statsRecipes') },
                  { value: cityCount, label: t('hero.statsCities') },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </HeroVideo>
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
