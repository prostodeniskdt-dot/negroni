'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { usePublicRecipes } from '@/hooks/usePublicRecipes';
import { getFeaturedRecipes, getRecipeCardImage } from '@/lib/public-recipes';
import { PublicRecipeImage } from '@/components/PublicRecipeImage';

export function TeaserCollection() {
  const { t } = useI18n();
  const { recipes } = usePublicRecipes();
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  const featured = getFeaturedRecipes(recipes, 6);

  return (
    <section
      id="collection-teaser"
      className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20"
    >
      <div
        ref={titleRef}
        className={`max-w-4xl mx-auto text-center mb-12 md:mb-16 transition-all duration-1000 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-[var(--color-campari)] mb-4">
          {t('index.collectionTitle')}
        </span>
        <h2 className="type-section-title text-3xl md:text-5xl lg:text-6xl font-normal text-[var(--color-text-primary)] mt-4 leading-tight">
          {t('collection.title')}
        </h2>
        <p className="mt-4 font-display font-medium text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
          {t('collection.desc')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((entry, i) => {
          if (!entry) return null;
          const { id, city, recipe } = entry;
          return (
            <Link
              key={id}
              href={`/recipe/${id}`}
              className={`group relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-all duration-500 hover:border-[var(--color-campari)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg),0_0_24px_rgba(187,10,48,0.15)] ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-campari)] opacity-0 transition-opacity group-hover:opacity-100 z-10" />
              <PublicRecipeImage
                src={getRecipeCardImage(recipe)}
                alt={recipe.name}
                className="aspect-[3/4] rounded-none border-0"
                variant="card"
              />
              <div className="p-6">
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="text-[0.7rem] text-[var(--color-on-campari)] bg-[var(--color-campari)] px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {recipe.tags[0] || recipe.category}
                </span>
                <span className="text-[0.8rem] text-[var(--color-text-muted)]">{city}</span>
              </div>
              <h3 className="font-display text-xl font-bold mt-2 mb-2 text-[var(--color-text-primary)] group-hover:text-[var(--color-campari)] transition-colors">
                {recipe.name}
              </h3>
              <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                {recipe.intro || recipe.barDescription}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--color-campari)]">
                {t('recipe.ingredients')}
              </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/collection"
          className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors duration-300"
        >
          {t('hero.secondary')}
        </Link>
      </div>
    </section>
  );
}
