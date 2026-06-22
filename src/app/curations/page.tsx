'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { usePublicRecipes } from '@/hooks/usePublicRecipes';
import Reveal from '@/components/Reveal';
import { PublicRecipeImage } from '@/components/PublicRecipeImage';
import { curations } from '@/data/curations';
import { getRecipeByIdFrom } from '@/lib/public-recipes';

export default function CurationsPage() {
  const { t, lang } = useI18n();
  const { recipes } = usePublicRecipes();

  return (
    <>
      {/* Hero */}
      <section className="mt-[60px] min-h-[30vh] flex flex-col justify-center px-8 py-10 relative overflow-hidden noise-overlay">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(187,10,48,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[900px]">
          <h1 className="type-page-title text-[clamp(2rem,5vw,3.5rem)] mb-3 text-shadow-[0_0_40px_rgba(187,10,48,0.2)]">
            {lang === 'ru' ? 'Подборки' : 'Curated Collections'}
          </h1>
          <p className="type-prose text-[clamp(0.9rem,1.2vw,1.05rem)] text-[var(--color-text-muted)] max-w-[55ch]">
            {lang === 'ru'
              ? 'Тематические коллекции рецептов Негрони — для разного настроения, сезона и повода.'
              : 'Themed Negroni recipe collections — for every mood, season and occasion.'}
          </p>
        </div>
      </section>

      {/* Curations list */}
      <section className="px-6 py-10 max-w-[1200px] mx-auto space-y-10">
        {curations.map((curation, idx) => {
          const curationRecipes = curation.recipeIds
            .map((id) => getRecipeByIdFrom(recipes, id))
            .filter(Boolean);

          return (
            <Reveal key={curation.id} as="section">
              <div className="p-6 md:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] transition-all hover:border-[var(--color-campari)]/50">
                <div className="flex items-start gap-4 mb-5">
                  <span className="text-4xl shrink-0">{curation.icon}</span>
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold uppercase tracking-wide mb-2">
                      {lang === 'ru' ? curation.title : curation.titleEn}
                    </h2>
                    <p className="font-prose text-[var(--color-text-muted)] leading-relaxed max-w-[60ch]">
                      {lang === 'ru' ? curation.description : curation.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {curationRecipes.map((entry) => {
                    if (!entry) return null;
                    return (
                      <Link
                        key={entry.id}
                        href={`/recipe/${entry.id}`}
                        className="block group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(18,18,18,0.75))] transition-all hover:-translate-y-1 hover:border-[var(--color-campari)] hover:shadow-[var(--shadow-md)]"
                      >
                        <PublicRecipeImage
                          src={entry.recipe.image}
                          alt={entry.recipe.name}
                          className="aspect-[5/4]"
                          variant="card"
                          overlay={<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-campari-darker)] via-transparent to-transparent opacity-40" />}
                        />
                        <div className="p-4">
                          <span className="inline-block text-[0.65rem] text-[var(--color-on-campari)] bg-[var(--color-campari)] px-2 py-0.5 rounded-full uppercase tracking-wide mb-1.5">
                            {entry.recipe.region}
                          </span>
                          <h3 className="font-display text-sm font-bold uppercase tracking-wide group-hover:text-[var(--color-campari-light)] transition-colors">
                            {entry.recipe.name}
                          </h3>
                          {entry.recipe.authorImage && (
                            <div className="mt-2 flex items-center gap-2 text-[0.7rem] text-[var(--color-text-secondary)]">
                              <img
                                src={entry.recipe.authorImage}
                                alt={entry.recipe.author}
                                className="h-7 w-7 rounded-full object-cover ring-1 ring-[var(--color-border)]"
                                loading="lazy"
                              />
                              <span>{entry.recipe.author}</span>
                            </div>
                          )}
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                            {entry.recipe.intro}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
