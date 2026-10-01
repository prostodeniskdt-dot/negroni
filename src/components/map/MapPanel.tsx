'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight, MapPin } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { MapCity } from '@/lib/map-recipes';

type MapPanelProps = {
  cities: MapCity[];
  selectedCity: MapCity | null;
  selectedRecipeId: string | null;
  onCitySelect: (cityId: string) => void;
  onRecipeSelect: (recipeId: string) => void;
  onBack: () => void;
};

export default function MapPanel({
  cities,
  selectedCity,
  selectedRecipeId,
  onCitySelect,
  onRecipeSelect,
  onBack,
}: MapPanelProps) {
  const { t } = useI18n();
  const totalRecipes = cities.reduce((sum, city) => sum + city.recipes.length, 0);

  return (
    <aside className="map-panel map-panel-desktop" aria-label={t('map.panelLabel')}>
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        {selectedCity ? (
          <>
            <button
              type="button"
              onClick={onBack}
              className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-campari)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-campari)]"
            >
              <ArrowLeft aria-hidden="true" size={15} />
              {t('map.allCities')}
            </button>
            <h1 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
              {selectedCity.name}
            </h1>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {t('map.venueCountLabel')}: {selectedCity.venues.length} · {t('map.recipeCountLabel')}:{' '}
              {selectedCity.recipes.length}
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              {t('map.title')}
            </h1>
            <p className="mt-1 font-prose text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {t('map.desc')}
            </p>
            <p className="mt-3 text-xs font-medium text-[var(--color-text-primary)]">
              {t('map.cityCountLabel')}: {cities.length} · {t('map.recipeCountLabel')}: {totalRecipes}
            </p>
          </>
        )}
      </div>

      <nav
        className="map-panel-scroll min-h-0 flex-1 overflow-y-auto p-3"
        aria-label={selectedCity ? t('map.cityRecipes') : t('map.cities')}
      >
        {selectedCity ? (
          <div className="space-y-2">
            {selectedCity.recipes.map((recipe) => {
              const isActive = selectedRecipeId === recipe.id;
              const venueLabel = recipe.venueName ?? t('map.unknownVenue');

              return (
                <article
                  key={recipe.id}
                  id={`map-recipe-${recipe.id}`}
                  className={`map-recipe-card ${isActive ? 'is-active' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => onRecipeSelect(recipe.id)}
                    className="block w-full px-4 pb-2 pt-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-campari)]"
                    aria-pressed={isActive}
                  >
                    <span className="block font-display text-sm font-semibold text-[var(--color-text-primary)]">
                      {recipe.name}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <MapPin aria-hidden="true" size={12} />
                      {recipe.city}
                    </span>
                  </button>
                  <Link
                    href={`/recipe/${recipe.id}?from=map`}
                    className="mx-4 mb-3 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-2 text-xs font-medium text-[var(--color-campari)] transition-colors hover:text-[var(--color-campari-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-campari)]"
                    aria-label={`${t('map.openVenueRecipe')}: ${venueLabel} — ${recipe.name}`}
                  >
                    <span className="truncate">{venueLabel}</span>
                    <ChevronRight aria-hidden="true" className="shrink-0" size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => onCitySelect(city.id)}
                className="map-city-card group"
              >
                <span>
                  <span className="block font-display text-sm font-semibold text-[var(--color-text-primary)]">
                    {city.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--color-text-muted)]">
                    {t('map.venueCountLabel')}: {city.venues.length} · {t('map.recipeCountLabel')}:{' '}
                    {city.recipes.length}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-campari)]"
                  size={17}
                />
              </button>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}
