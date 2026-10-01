'use client';

import type { ReactNode } from 'react';
import { Building2, MapPin, Martini } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { MapSearchResult } from '@/lib/map-recipes';

type MapSearchResultsProps = {
  results: MapSearchResult[];
  query: string;
  onCitySelect: (cityId: string) => void;
  onVenueSelect: (cityId: string, recipeId: string) => void;
  onRecipeSelect: (recipeId: string) => void;
  unknownVenueLabel: string;
};

function highlightMatch(text: string, query: string): ReactNode {
  const needle = query.trim();
  if (!needle) return text;

  const lower = text.toLocaleLowerCase('ru-RU');
  const index = lower.indexOf(needle.toLocaleLowerCase('ru-RU'));
  if (index < 0) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="map-search-mark">{text.slice(index, index + needle.length)}</mark>
      {text.slice(index + needle.length)}
    </>
  );
}

export default function MapSearchResults({
  results,
  query,
  onCitySelect,
  onVenueSelect,
  onRecipeSelect,
  unknownVenueLabel,
}: MapSearchResultsProps) {
  const { t } = useI18n();

  const cities = results.filter((item) => item.type === 'city');
  const venues = results.filter((item) => item.type === 'venue');
  const recipes = results.filter((item) => item.type === 'recipe');

  if (results.length === 0) {
    return (
      <div className="map-search-empty">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('map.searchEmpty')}</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t('map.searchEmptyHint')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cities.length > 0 && (
        <section>
          <h3 className="map-search-group-title">{t('map.resultCities')}</h3>
          <div className="space-y-1.5">
            {cities.map((item) => (
              <button
                key={`city-${item.city.id}`}
                type="button"
                className="map-search-row"
                onClick={() => onCitySelect(item.city.id)}
              >
                <span className="map-search-icon">
                  <MapPin aria-hidden="true" size={15} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold text-[var(--color-text-primary)]">
                    {highlightMatch(item.city.name, query)}
                  </span>
                  <span className="block text-xs text-[var(--color-text-muted)]">
                    {t('map.recipeCountLabel')}: {item.city.recipes.length}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {venues.length > 0 && (
        <section>
          <h3 className="map-search-group-title">{t('map.resultVenues')}</h3>
          <div className="space-y-1.5">
            {venues.map((item) => {
              const label = item.venue.name ?? unknownVenueLabel;
              const firstRecipe = item.venue.recipes[0];
              return (
                <button
                  key={`venue-${item.venue.id}`}
                  type="button"
                  className="map-search-row"
                  onClick={() => firstRecipe && onVenueSelect(item.city.id, firstRecipe.id)}
                >
                  <span className="map-search-icon">
                    <Building2 aria-hidden="true" size={15} />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-semibold text-[var(--color-text-primary)]">
                      {highlightMatch(label, query)}
                    </span>
                    <span className="block text-xs text-[var(--color-text-muted)]">
                      {item.city.name} · {item.venue.recipes.length} {t('map.recipeCountLabel').toLocaleLowerCase()}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {recipes.length > 0 && (
        <section>
          <h3 className="map-search-group-title">{t('map.resultRecipes')}</h3>
          <div className="space-y-1.5">
            {recipes.map((item) => (
              <button
                key={`recipe-${item.recipe.id}`}
                type="button"
                className="map-search-row"
                onClick={() => onRecipeSelect(item.recipe.id)}
              >
                  <span className="map-search-icon">
                    <Martini aria-hidden="true" size={15} />
                  </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold text-[var(--color-text-primary)]">
                    {highlightMatch(item.recipe.name, query)}
                  </span>
                  <span className="block truncate text-xs text-[var(--color-text-muted)]">
                    {item.recipe.venueName ?? unknownVenueLabel} · {item.city.name}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
