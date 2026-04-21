'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { useFavorites } from '@/hooks/useFavorites';
import { recipes, getRecipeById } from '@/data/recipes';

export default function FavoritesPage() {
  const { t } = useI18n();
  const { favorites, remove, clear } = useFavorites();

  const favoriteEntries = favorites
    .map((id) => getRecipeById(id))
    .filter((entry): entry is NonNullable<typeof entry> => !!entry);

  const handleExport = useCallback(() => {
    const lines: string[] = [
      t('favorites.exportHeader'),
      '',
      '---',
      '',
    ];
    favoriteEntries.forEach((entry, i) => {
      lines.push(`${i + 1}. ${entry.recipe.name} (${entry.recipe.region})`);
      lines.push(`   ${entry.recipe.intro}`);
      lines.push(`   ${t('favorites.exportIngredients')}: ${entry.recipe.ingredients.join(', ')}`);
      lines.push('');
    });
    lines.push('---');
    lines.push(t('favorites.exportFooter'));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'negroni-favorites.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [favoriteEntries, t]);

  const handleClear = useCallback(() => {
    if (typeof window !== 'undefined' && window.confirm(t('favorites.removeConfirm'))) {
      clear();
    }
  }, [clear, t]);

  return (
    <>
      {/* Header */}
      <section className="mt-[60px] px-8 py-10">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3rem)] font-bold uppercase tracking-wide mb-2">
              {t('favorites.title')}
            </h1>
            <p className="text-[var(--color-text-muted)] font-[var(--font-serif)]">
              {t('favorites.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={favoriteEntries.length === 0}
              className="px-5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] hover:border-[var(--color-campari)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('favorites.export')}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={favoriteEntries.length === 0}
              className="px-5 py-2.5 bg-[var(--color-campari)] text-[var(--color-on-campari)] rounded-[var(--radius-md)] hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('favorites.clear')}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-8 max-w-[1200px] mx-auto">
        {favoriteEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-6 opacity-70">❤️</span>
            <p className="text-[var(--color-text-muted)] font-[var(--font-serif)] mb-6 max-w-md">
              {t('favorites.empty')}
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-[var(--color-campari-light)] hover:text-[var(--color-accent)] transition-colors font-medium"
            >
              {t('favorites.goToCollection')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteEntries.map((entry) => (
              <div
                key={entry.id}
                className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-[var(--transition-base)] hover:border-[var(--color-campari)] group"
              >
                <Link href={`/recipe/${entry.id}`} className="block">
                  <div
                    className="relative aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url(${entry.recipe.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-campari-darker)] via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="relative p-5">
                    <span className="inline-block text-[0.7rem] text-[var(--color-on-campari)] bg-[var(--color-campari)] px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
                      {entry.recipe.region}
                    </span>
                    <h3 className="font-[var(--font-display)] text-lg font-bold uppercase tracking-wide mb-1.5 group-hover:text-[var(--color-campari-light)] transition-colors">
                      {entry.recipe.name}
                    </h3>
                    <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-snug line-clamp-2">
                      {entry.recipe.intro}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    remove(entry.id);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--color-surface-solid)]/90 border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-campari)] transition-colors"
                  aria-label={t('favorites.remove')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
