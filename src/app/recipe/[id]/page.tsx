'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { useFavorites } from '@/hooks/useFavorites';
import Reveal from '@/components/Reveal';
import {
  getRecipeById,
  recipes,
  type Prebatch,
  type RecipeEntry,
} from '@/data/recipes';

const FLAVOR_KEYS = ['bitter', 'sweet', 'sour', 'spicy', 'strong'] as const;

function getRelatedRecipes(
  currentId: string,
  currentRegion: string,
  limit: number = 3
): RecipeEntry[] {
  const sameRegion = recipes.filter(
    (r) => r.id !== currentId && r.recipe.region === currentRegion
  );
  const others = recipes.filter(
    (r) => r.id !== currentId && r.recipe.region !== currentRegion
  );
  const combined = [...sameRegion, ...others];
  return combined.slice(0, limit);
}

export default function RecipePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';
  const { t } = useI18n();
  const { isFavorite, toggle } = useFavorites();
  const [copyFeedback, setCopyFeedback] = useState<'copied' | 'error' | null>(null);

  const entry = useMemo(() => getRecipeById(id), [id]);
  const related = useMemo(
    () => (entry ? getRelatedRecipes(id, entry.recipe.region) : []),
    [entry, id]
  );

  const handleCopyLink = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyFeedback('copied');
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch(() => {
        setCopyFeedback('error');
        setTimeout(() => setCopyFeedback(null), 2000);
      });
  }, []);

  if (!entry) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-[1200px] w-full mx-auto p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] text-center">
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            {t('recipe.notFound')}
          </h1>
          <Link
            href="/collection"
            className="inline-block text-[var(--color-campari)] hover:text-[var(--color-campari-light)] font-semibold transition-colors"
          >
            {t('recipe.backToCollection')}
          </Link>
        </div>
      </main>
    );
  }

  const { recipe } = entry;

  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.intro,
    image: recipe.image,
    author: { '@type': 'Person', name: recipe.author },
    recipeCategory: 'Cocktail',
    recipeCuisine: 'Italian',
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })),
    keywords: recipe.tags.join(', '),
    prepTime: 'PT5M',
    totalTime: 'PT5M',
    recipeYield: '1 serving',
  };

  const isPrebatchObject = typeof recipe.prebatch === 'object';

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <div className="max-w-[1200px] mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] gap-8 lg:gap-10 p-6 md:p-8">
          {/* Left column */}
          <div className="space-y-6">
            <Reveal>
              <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] uppercase tracking-wide">
                {recipe.name}
              </h1>
              <p className="text-[var(--color-text-muted)] text-lg mt-1">
                {recipe.region}
              </p>
              {(recipe.author !== '—' || recipe.bar !== '—') && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[var(--color-text-secondary)]">
                  {recipe.author !== '—' && (
                    <span>
                      {t('recipe.author')}: {recipe.author}
                    </span>
                  )}
                  {recipe.bar !== '—' && (
                    <span>
                      {t('recipe.bar')}: {recipe.bar}
                    </span>
                  )}
                </div>
              )}
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-campari)]/20 text-[var(--color-text-muted)] border border-[var(--color-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]/10 transition-all"
                  aria-label={isFavorite(id) ? t('recipe.removeFavorite') : t('recipe.addFavorite')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isFavorite(id) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-[var(--color-campari)]"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {isFavorite(id) ? t('recipe.inFavorites') : t('recipe.addFavorite')}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]/10 transition-all"
                >
                  {t('recipe.export')}
                </button>
              </div>
            </Reveal>

            <Reveal>
              <p className="font-[var(--font-serif)] text-[var(--color-text-muted)] leading-relaxed">
                {recipe.intro}
              </p>
            </Reveal>

            <Reveal>
              <div className="grid grid-cols-2 gap-3 p-4 bg-[var(--color-bg)]/50 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                <div>
                  <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {t('recipe.techMethod')}
                  </span>
                  <p className="text-[var(--color-text-primary)] font-medium">{recipe.method}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {t('recipe.techGlass')}
                  </span>
                  <p className="text-[var(--color-text-primary)] font-medium">{recipe.glass}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {t('recipe.techGarnish')}
                  </span>
                  <p className="text-[var(--color-text-primary)] font-medium">{recipe.garnish}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {t('recipe.techIce')}
                  </span>
                  <p className="text-[var(--color-text-primary)] font-medium">{recipe.ice}</p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide">
                {t('recipe.ingredients')}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)] font-[var(--font-serif)]">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide">
                {t('recipe.steps')}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-[var(--color-text-muted)] font-[var(--font-serif)]">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </Reveal>

            <Reveal>
              <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide">
                {t('recipe.prebatch')}
              </h3>
              {typeof recipe.prebatch === 'string' ? (
                <p className="font-[var(--font-serif)] text-[var(--color-text-muted)] leading-relaxed">
                  {recipe.prebatch}
                </p>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-semibold text-[var(--color-text-primary)]">
                    {(recipe.prebatch as Prebatch).name}
                  </h4>
                  <div>
                    <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                      {t('recipe.prebatchIngredients')}
                    </span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[var(--color-text-muted)] font-[var(--font-serif)]">
                      {(recipe.prebatch as Prebatch).ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                      {t('recipe.prebatchSteps')}
                    </span>
                    <ol className="list-decimal list-inside mt-1 space-y-1 text-[var(--color-text-muted)] font-[var(--font-serif)]">
                      {(recipe.prebatch as Prebatch).steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </Reveal>
          </div>

          {/* Right column (sidebar) */}
          <div className="space-y-6 order-first lg:order-none">
            <Reveal>
              <div className="relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)]">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </Reveal>

            <Reveal>
              <div className="p-4 bg-[var(--color-bg)]/50 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                <h3 className="font-[var(--font-display)] text-base font-bold text-[var(--color-text-primary)] mb-3 uppercase tracking-wide">
                  {t('recipe.flavor')}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                  {t('flavor.caption')}
                </p>
                <div className="space-y-3">
                  {FLAVOR_KEYS.map((key) => {
                    const val = recipe.flavorProfile?.[key] ?? 0;
                    const pct = Math.round((val / 10) * 100);
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--color-text-muted)]">
                            {t(`flavor.${key}`)}
                          </span>
                          <span className="text-[var(--color-text-secondary)]">{pct}%</span>
                        </div>
                        <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-campari)] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* Bar & Author Profile */}
            {(recipe.bar !== '—' || recipe.author !== '—') && (
              <Reveal>
                <div className="p-4 bg-[var(--color-bg)]/50 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                  <h3 className="font-[var(--font-display)] text-base font-bold text-[var(--color-text-primary)] mb-3 uppercase tracking-wide">
                    {t('recipe.barProfile') || 'Бар и автор'}
                  </h3>
                  {recipe.bar !== '—' && (
                    <div className="mb-2">
                      <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                        {t('recipe.bar')}
                      </span>
                      <p className="text-[var(--color-text-primary)] font-medium">{recipe.bar}</p>
                    </div>
                  )}
                  {recipe.barCity && (
                    <div className="mb-2">
                      <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                        {t('recipe.barCityLabel') || 'Город'}
                      </span>
                      <p className="text-[var(--color-text-primary)] font-medium">{recipe.barCity}</p>
                    </div>
                  )}
                  {recipe.barDescription && (
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-3 font-[var(--font-serif)]">
                      {recipe.barDescription}
                    </p>
                  )}
                  {recipe.author !== '—' && (
                    <div className="mb-2">
                      <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                        {t('recipe.author')}
                      </span>
                      <p className="text-[var(--color-text-primary)] font-medium">{recipe.author}</p>
                    </div>
                  )}
                  {(recipe.authorInstagram || recipe.authorTg || recipe.barLink) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {recipe.authorInstagram && (
                        <a
                          href={recipe.authorInstagram.startsWith('@') ? `https://www.instagram.com/${recipe.authorInstagram.slice(1).replace(/^@/, '')}` : recipe.authorInstagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]/10 transition-all text-sm font-medium"
                        >
                          {t('recipe.linkInstagram')}
                        </a>
                      )}
                      {recipe.authorTg && (
                        <a
                          href={recipe.authorTg.startsWith('@') ? `https://t.me/${recipe.authorTg.slice(1).replace(/^@/, '')}` : recipe.authorTg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]/10 transition-all text-sm font-medium"
                        >
                          {t('recipe.linkTelegram')}
                        </a>
                      )}
                      {recipe.barLink && (
                        <a
                          href={recipe.barLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]/10 transition-all text-sm font-medium"
                        >
                          {t('recipe.linkBar')}
                        </a>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {recipe.difficulty && (
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${
                        recipe.difficulty === 'easy' ? 'border-[var(--color-success)]/40 text-[var(--color-success)]' :
                        recipe.difficulty === 'medium' ? 'border-[var(--color-warning)]/40 text-[var(--color-warning)]' :
                        'border-[var(--color-campari)]/40 text-[var(--color-campari)]'
                      }`}>
                        {recipe.difficulty === 'easy' ? (t('difficulty.easy') || 'Легко') :
                         recipe.difficulty === 'medium' ? (t('difficulty.medium') || 'Средне') :
                         (t('difficulty.hard') || 'Сложно')}
                      </span>
                    )}
                    {recipe.category && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-campari)]/15 text-[var(--color-text-muted)] border border-[var(--color-border)]">
                        {recipe.category}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal>
              <Link
                href={`/recipes?focus=${id}`}
                className="block text-center py-3 px-4 rounded-[var(--radius-sm)] border border-[var(--color-campari)] text-[var(--color-campari)] hover:bg-[var(--color-campari)] hover:text-[var(--color-on-campari)] transition-all font-semibold"
              >
                {t('recipe.showOnMap')}
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Related recipes */}
        <Reveal as="section" className="px-6 md:px-8 pb-8 pt-6 border-t border-[var(--color-border)]">
          <h3 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text-primary)] mb-1 uppercase tracking-wide">
            {t('recipe.related')}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            {t('recipe.relatedSubtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/recipe/${r.id}`}
                className="block p-4 bg-[var(--color-bg)]/30 border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-campari)] hover:-translate-y-0.5 transition-all group"
              >
                <div className="aspect-[4/3] relative rounded overflow-hidden mb-3">
                  <Image
                    src={r.recipe.image}
                    alt={r.recipe.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, 280px"
                  />
                </div>
                <h4 className="font-[var(--font-display)] font-bold text-[var(--color-text-primary)]">
                  {r.recipe.name}
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {r.recipe.region}
                </p>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Share section */}
        <Reveal as="section" className="px-6 md:px-8 pb-8">
          <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide">
            {t('recipe.share')}
          </h3>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]/10 transition-all"
          >
            {copyFeedback === 'copied'
              ? t('recipe.linkCopied')
              : copyFeedback === 'error'
                ? t('recipe.linkCopyFailed')
                : t('recipe.copyLink')}
          </button>
        </Reveal>
      </div>
    </main>
  );
}
