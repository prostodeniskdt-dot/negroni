'use client';

import { useI18n } from '@/hooks/useI18n';
import Reveal from '@/components/Reveal';
import CategoryCard from '@/components/partners/CategoryCard';
import { drinkCategories, getDrinksByCategory } from '@/data/partners';

export default function PartnersPage() {
  const { t } = useI18n();

  return (
    <>
      <Reveal as="section" className="mt-[60px] px-8 py-12 text-center">
        <span className="inline-block text-[var(--color-campari)] text-sm font-semibold uppercase tracking-widest mb-4">
          {t('partners.heroLabel')}
        </span>
        <h1 className="type-page-title text-[clamp(2rem,5vw,3.5rem)] mb-6">
          {t('partners.heroTitle')}
        </h1>
        <p className="type-prose max-w-2xl mx-auto text-[var(--color-text-muted)]">
          {t('partners.heroDesc')}
        </p>
      </Reveal>

      <Reveal as="section" className="px-6 py-16 max-w-[1200px] mx-auto">
        <h2 className="font-display text-2xl font-bold uppercase mb-2 text-center">
          {t('partners.catalogTitle')}
        </h2>
        <p className="text-[var(--color-text-muted)] text-center mb-4 max-w-xl mx-auto">
          {t('partners.catalogSubtitle')}
        </p>
        <p className="text-center text-sm font-medium text-[var(--color-text-secondary)] mb-12">
          {t('partners.catalogNote')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinkCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              drinkCount={getDrinksByCategory(category.id).length}
              href={`/partners/${category.slug}`}
            />
          ))}
        </div>
      </Reveal>
    </>
  );
}
