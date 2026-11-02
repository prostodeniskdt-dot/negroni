'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, SlidersHorizontal, ChevronDown, X, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import NegroniMark from '@/components/NegroniMark';
import { downloadRecipesPdf } from '@/lib/pdf/download';
import { useFavorites } from '@/hooks/useFavorites';
import { usePublicRecipes } from '@/hooks/usePublicRecipes';
import Reveal from '@/components/Reveal';
import { PublicRecipeImage } from '@/components/PublicRecipeImage';
import RecipeTagsFilter from '@/components/collection/RecipeTagsFilter';
import {
  filterRecipesFrom,
  getAllCitiesFrom,
  getAllTagsFrom,
  getRecipeAuthorImage,
  getRecipeCardImage,
  getRecipeCardLabel,
} from '@/lib/public-recipes';

export default function CollectionPage() {
  const { t } = useI18n();
  const { isFavorite, toggle } = useFavorites();
  const { recipes, source } = usePublicRecipes();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [tagsOpen, setTagsOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  const cities = useMemo(() => getAllCitiesFrom(recipes), [recipes]);
  const tags = useMemo(() => getAllTagsFrom(recipes), [recipes]);

  const filteredResults = useMemo(() => {
    const results = filterRecipesFrom(recipes, {
      query: searchQuery || undefined,
      city: selectedCity || undefined,
      tags: activeTags.length > 0 ? activeTags : undefined,
      ingredients: ingredientSearch || undefined,
    });
    return results.sort((a, b) => a.recipe.name.localeCompare(b.recipe.name, 'ru'));
  }, [searchQuery, selectedCity, activeTags, ingredientSearch, recipes]);

  const hasFilters = Boolean(searchQuery.trim() || selectedCity || ingredientSearch.trim() || activeTags.length);
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setIngredientSearch('');
    setActiveTags([]);
  };

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const exportPdf = (opts: { ids?: string[]; all?: boolean }) => {
    setExporting(true);
    downloadRecipesPdf(opts)
      .catch(() => window.alert(t('recipe.exportFailed')))
      .finally(() => setExporting(false));
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="mt-[60px] min-h-[35vh] flex flex-col justify-center px-8 py-10 relative overflow-hidden noise-overlay">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(187,10,48,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[900px]">
          <h1 className="type-page-title text-[clamp(2rem,5vw,3.5rem)] mb-3 text-shadow-[0_0_40px_rgba(187,10,48,0.2)]">
            {t('collection.title')}
          </h1>
          <p className="type-prose text-[clamp(0.9rem,1.2vw,1.05rem)] text-[var(--color-text-muted)] max-w-[50ch] mb-4">
            {t('collection.desc')}
          </p>
          <div className="flex flex-wrap gap-6 text-[var(--color-text-muted)]">
            <span className="text-[0.95rem]">
              <span className="font-semibold text-[var(--color-text-primary)]">
                {recipes.length}
              </span>{' '}
              {t('collection.recipesCount')}
            </span>
            <span className="text-[0.95rem]">
              <span className="font-semibold text-[var(--color-text-primary)]">
                {cities.length}
              </span>{' '}
              {t('collection.citiesCount')}
            </span>
          </div>
        </div>
      </section>

      {/* ====== CONTROLS ====== */}
      <Reveal as="section" className="px-6 py-6 max-w-[1200px] mx-auto">
        <div className="space-y-4 p-4 md:p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <div role="search" aria-label={t('collection.searchLabel')} className="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.85fr)_minmax(0,1fr)_auto_auto] lg:items-center">
            <label className="relative col-span-2 block min-w-0 lg:col-span-1">
              <span className="sr-only">{t('collection.searchLabel')}</span>
              <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input
                type="search"
                placeholder={t('collection.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full min-w-0 pl-11 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
              />
            </label>
            <label className="relative col-span-2 block min-w-0 sm:col-span-1">
              <span className="sr-only">{t('collection.cityLabel')}</span>
              <MapPin size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-12 w-full min-w-0 appearance-none pl-11 pr-9 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
              >
                <option value="">{t('collection.allCities')}</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            </label>
            <label className="col-span-2 block min-w-0 sm:col-span-1">
              <span className="sr-only">{t('collection.ingredients')}</span>
              <input
                type="search"
                placeholder={t('collection.ingredients')}
                title={t('collection.ingredientsHint')}
                value={ingredientSearch}
                onChange={(e) => setIngredientSearch(e.target.value)}
                className="h-12 w-full min-w-0 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
              />
            </label>
            <button
              type="button"
              aria-expanded={tagsOpen}
              aria-controls="collection-tags"
              onClick={() => setTagsOpen((open) => !open)}
              className={`inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-campari)] ${tagsOpen || activeTags.length ? 'border-[var(--color-campari)] bg-[var(--color-campari)]/10 text-[var(--color-text-primary)]' : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:border-[var(--color-campari)]'}`}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              {t('collection.tags')}
              {activeTags.length > 0 && <span className="rounded-full bg-[var(--color-campari)] px-1.5 text-xs text-[var(--color-on-campari)]">{activeTags.length}</span>}
              <ChevronDown size={14} aria-hidden="true" className={tagsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              title={t('collection.resetFilters')}
              aria-label={t('collection.resetFilters')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-campari)] disabled:opacity-35 disabled:cursor-default disabled:hover:border-[var(--color-border)]"
            >
              <RotateCcw size={17} aria-hidden="true" />
              <span className="lg:sr-only">{t('collection.resetFilters')}</span>
            </button>
          </div>

          {tagsOpen && (
            <div id="collection-tags" className="border-t border-[var(--color-border)] pt-4">
              <RecipeTagsFilter
                recipes={recipes}
                tags={tags}
                activeTags={activeTags}
                onToggleTag={toggleTag}
                onClearTags={() => setActiveTags([])}
                onApplyRecipeSearch={(query) => {
                  setSearchQuery(query);
                  setActiveTags([]);
                }}
              />
            </div>
          )}
          {!tagsOpen && activeTags.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label={t('collection.selectedTags')}>
              {activeTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-label={`${t('collection.removeTag')}: ${tag}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-campari)] px-3 py-1.5 text-sm text-[var(--color-on-campari)]"
                >
                  {tag}<X size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p role="status" aria-live="polite" aria-atomic="true" className="text-[var(--color-text-muted)]">
            {t('collection.found')}: {filteredResults.length}
            {source === 'db' ? ' · данные из редактора' : ''}
          </p>
          <button
            type="button"
            disabled={exporting || filteredResults.length === 0}
            onClick={() => exportPdf({ ids: filteredResults.map((entry) => entry.id) })}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] hover:border-[var(--color-campari)] disabled:opacity-50"
          >
            {exporting ? t('recipe.exporting') : `${t('collection.exportFound')} (${filteredResults.length})`}
          </button>
          {filteredResults.length !== recipes.length && (
            <button
              type="button"
              disabled={exporting}
              onClick={() => exportPdf({ all: true })}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] hover:border-[var(--color-campari)] disabled:opacity-50"
            >
              {t('collection.exportAll')}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectMode((value) => !value);
              setSelectedIds([]);
            }}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] hover:border-[var(--color-campari)]"
          >
            {selectMode ? t('collection.exportCancel') : t('collection.exportPick')}
          </button>
          {selectMode && (
            <button
              type="button"
              disabled={exporting || selectedIds.length === 0}
              onClick={() => exportPdf({ ids: selectedIds })}
              className="px-4 py-2 text-sm bg-[var(--color-campari)] text-[var(--color-on-campari)] rounded-[var(--radius-sm)] disabled:opacity-50"
            >
              {t('collection.exportSelected')} ({selectedIds.length})
            </button>
          )}
        </div>
      </Reveal>

      {/* ====== GRID ======
          eager: длинная сетка не должна зависеть от % высоты в IntersectionObserver */}
      <Reveal as="section" eager className="px-6 py-8 max-w-[1200px] mx-auto">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 font-prose">
            <p className="text-[var(--color-text-muted)]">{t('collection.empty')}</p>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="mt-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm hover:border-[var(--color-campari)]">
                {t('collection.resetFilters')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResults.map((entry) => (
              <Link
                key={entry.id}
                href={`/recipe/${entry.id}`}
                className="block group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(28,28,28,0.82))] transition-all duration-[var(--transition-base)] hover:-translate-y-1 hover:border-[var(--color-campari)] hover:shadow-[var(--shadow-lg),0_0_26px_rgba(187,10,48,0.18)]"
              >
                {selectMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSelected(entry.id);
                    }}
                    className={`absolute top-4 left-4 z-10 w-8 h-8 rounded-full border flex items-center justify-center text-sm ${
                      selectedIds.includes(entry.id)
                        ? 'bg-[var(--color-campari)] border-[var(--color-campari)] text-[var(--color-on-campari)]'
                        : 'bg-[var(--color-surface-solid)]/90 border-[var(--color-border)] text-[var(--color-text-primary)]'
                    }`}
                    aria-label={entry.recipe.name}
                  >
                    {selectedIds.includes(entry.id) ? '✓' : ''}
                  </button>
                )}
                <PublicRecipeImage
                  src={getRecipeCardImage(entry.recipe)}
                  alt={entry.recipe.name}
                  className="card-media aspect-[3/4]"
                  variant="card"
                  overlay={
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-campari-darker)] via-transparent to-transparent opacity-25" />
                  }
                />
                <div className="relative p-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(entry.id);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--color-surface-solid)]/90 border border-[var(--color-border)] flex items-center justify-center transition-colors hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]"
                    aria-label={
                      isFavorite(entry.id)
                        ? t('recipe.removeFavorite')
                        : t('recipe.addFavorite')
                    }
                  >
                    <NegroniMark active={isFavorite(entry.id)} size={20} />
                  </button>

                  {getRecipeCardLabel(entry) && (
                    <span className="inline-block text-[0.7rem] text-[var(--color-on-campari)] bg-[var(--color-campari)] px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
                      {getRecipeCardLabel(entry)}
                    </span>
                  )}

                  <h3 className="font-display text-[1.15rem] font-bold uppercase tracking-wide mb-1.5 group-hover:text-[var(--color-campari-light)] transition-colors">
                    {entry.recipe.name}
                  </h3>

                  {getRecipeAuthorImage(entry.recipe) && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                      <img
                        src={getRecipeAuthorImage(entry.recipe)}
                        alt={entry.recipe.author}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--color-border)]"
                        loading="lazy"
                      />
                      <span>{entry.recipe.author}</span>
                    </div>
                  )}

                  <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-snug line-clamp-2 mb-3">
                    {entry.recipe.intro}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {(entry.recipe.tags ?? []).slice(0, 3).map((tag, index) => (
                      <span
                        key={`${entry.id}-tag-${index}-${tag}`}
                        className="text-[0.7rem] px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Reveal>
    </>
  );
}
