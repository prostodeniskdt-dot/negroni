'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Search, X } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import MapSearchResults from '@/components/map/MapSearchResults';
import {
  findCityByRecipe,
  getMapFilterOptions,
  searchMapItems,
  type MapCity,
  type MapSearchFilters,
} from '@/lib/map-recipes';

export type MobileSheetState = 'collapsed' | 'half' | 'expanded';

type MobileMapSheetProps = {
  cities: MapCity[];
  selectedCity: MapCity | null;
  selectedRecipeId: string | null;
  sheetState: MobileSheetState;
  onSheetStateChange: (state: MobileSheetState) => void;
  onCitySelect: (cityId: string) => void;
  onRecipeSelect: (recipeId: string) => void;
  onClearSelection: () => void;
  onBackToCities: () => void;
  onHeightChange?: (heightPx: number) => void;
};

const SHEET_HEIGHTS: Record<MobileSheetState, string> = {
  collapsed: '88px',
  half: '46dvh',
  expanded: '78dvh',
};

export default function MobileMapSheet({
  cities,
  selectedCity,
  selectedRecipeId,
  sheetState,
  onSheetStateChange,
  onCitySelect,
  onRecipeSelect,
  onClearSelection,
  onBackToCities,
  onHeightChange,
}: MobileMapSheetProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<MapSearchFilters>({});
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartState = useRef<MobileSheetState>('collapsed');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filterOptions = useMemo(() => getMapFilterOptions(cities), [cities]);
  const results = useMemo(
    () => searchMapItems(cities, query, filters),
    [cities, query, filters]
  );

  const selectedRecipe = selectedRecipeId
    ? selectedCity?.recipes.find((recipe) => recipe.id === selectedRecipeId) ??
      findCityByRecipe(cities, selectedRecipeId)?.recipes.find((recipe) => recipe.id === selectedRecipeId)
    : null;

  const hasActiveFilters = Boolean(filters.cityId || filters.category || filters.difficulty || filters.tag);
  const showDetail = Boolean(selectedRecipe);
  const showCityRecipes = Boolean(selectedCity && !showDetail && !query.trim() && !hasActiveFilters);
  const showBrowse = !showDetail && !showCityRecipes && !query.trim() && !hasActiveFilters;

  useEffect(() => {
    const el = sheetRef.current;
    if (!el || !onHeightChange) return;

    const report = () => onHeightChange(el.getBoundingClientRect().height);
    report();

    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [onHeightChange, sheetState]);

  const cycleSheet = useCallback(
    (direction: 'up' | 'down') => {
      const order: MobileSheetState[] = ['collapsed', 'half', 'expanded'];
      const index = order.indexOf(sheetState);
      if (direction === 'up') {
        onSheetStateChange(order[Math.min(index + 1, order.length - 1)]);
      } else {
        onSheetStateChange(order[Math.max(index - 1, 0)]);
      }
    },
    [onSheetStateChange, sheetState]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      dragStartY.current = event.clientY;
      dragStartState.current = sheetState;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [sheetState]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragStartY.current == null) return;
      const delta = dragStartY.current - event.clientY;
      dragStartY.current = null;

      if (Math.abs(delta) < 40) {
        if (sheetState === 'collapsed') onSheetStateChange('half');
        return;
      }

      if (delta > 0) cycleSheet('up');
      else cycleSheet('down');
    },
    [cycleSheet, onSheetStateChange, sheetState]
  );

  const handleCitySelect = useCallback(
    (cityId: string) => {
      onCitySelect(cityId);
      setQuery('');
      setFilters({});
      onSheetStateChange('half');
    },
    [onCitySelect, onSheetStateChange]
  );

  const handleVenueSelect = useCallback(
    (cityId: string, recipeId: string) => {
      onCitySelect(cityId);
      onRecipeSelect(recipeId);
      setQuery('');
      setFilters({});
      onSheetStateChange('half');
    },
    [onCitySelect, onRecipeSelect, onSheetStateChange]
  );

  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      onRecipeSelect(recipeId);
      setQuery('');
      setFilters({});
      onSheetStateChange('half');
    },
    [onRecipeSelect, onSheetStateChange]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const toggleFilter = useCallback((key: keyof MapSearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
    onSheetStateChange('half');
  }, [onSheetStateChange]);

  return (
    <div
      ref={sheetRef}
      className={`mobile-map-sheet is-${sheetState}`}
      style={{ height: SHEET_HEIGHTS[sheetState] }}
      role="dialog"
      aria-label={t('map.panelLabel')}
    >
      <div
        className="mobile-map-sheet-handle-area"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartY.current = null;
        }}
      >
        <div className="mobile-map-sheet-handle" aria-hidden="true" />
      </div>

      <div className="mobile-map-sheet-search">
        <Search aria-hidden="true" className="mobile-map-sheet-search-icon" size={16} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={t('map.searchPlaceholder')}
          className="mobile-map-sheet-input"
          onFocus={() => {
            if (sheetState === 'collapsed') onSheetStateChange('half');
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            if (sheetState === 'collapsed') onSheetStateChange('half');
          }}
          aria-label={t('map.searchPlaceholder')}
        />
        {(query || hasActiveFilters || selectedRecipe) && (
          <button
            type="button"
            className="mobile-map-sheet-clear"
            onClick={() => {
              setQuery('');
              clearFilters();
              if (selectedRecipe) onClearSelection();
              inputRef.current?.focus();
            }}
            aria-label={t('map.searchClear')}
          >
            <X aria-hidden="true" size={15} />
          </button>
        )}
      </div>

      {sheetState !== 'collapsed' && (
        <div className="mobile-map-sheet-body">
          {showDetail && selectedRecipe ? (
            <article className="mobile-map-detail">
              <button
                type="button"
                className="mobile-map-detail-back"
                onClick={() => {
                  onClearSelection();
                  onSheetStateChange('half');
                }}
              >
                {t('map.backToResults')}
              </button>
              <h2 className="mobile-map-detail-title">{selectedRecipe.name}</h2>
              <p className="mobile-map-detail-meta">
                <MapPin aria-hidden="true" size={13} />
                <span>
                  {selectedRecipe.venueName ?? t('map.unknownVenue')} · {selectedRecipe.city}
                </span>
              </p>
              {selectedRecipe.entry.recipe.category && (
                <p className="mobile-map-detail-category">{selectedRecipe.entry.recipe.category}</p>
              )}
              <Link
                href={`/recipe/${selectedRecipe.id}?from=map`}
                className="mobile-map-detail-link"
              >
                <span>{selectedRecipe.venueName ?? t('map.openVenueRecipe')}</span>
                <ChevronRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ) : (
            <>
              {showBrowse && (
                <div className="mobile-map-chips" aria-label={t('map.filtersLabel')}>
                  {filterOptions.cities.slice(0, 8).map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      className={`mobile-map-chip ${filters.cityId === city.id ? 'is-active' : ''}`}
                      onClick={() => toggleFilter('cityId', city.id)}
                    >
                      {city.name}
                    </button>
                  ))}
                  {filterOptions.categories.slice(0, 6).map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`mobile-map-chip ${filters.category === category ? 'is-active' : ''}`}
                      onClick={() => toggleFilter('category', category)}
                    >
                      {category}
                    </button>
                  ))}
                  {filterOptions.difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      type="button"
                      className={`mobile-map-chip ${filters.difficulty === difficulty ? 'is-active' : ''}`}
                      onClick={() => toggleFilter('difficulty', difficulty)}
                    >
                      {t(`difficulty.${difficulty}`)}
                    </button>
                  ))}
                </div>
              )}

              {(query.trim() || hasActiveFilters) && (
                <MapSearchResults
                  results={results}
                  query={query}
                  onCitySelect={handleCitySelect}
                  onVenueSelect={handleVenueSelect}
                  onRecipeSelect={handleRecipeSelect}
                  unknownVenueLabel={t('map.unknownVenue')}
                />
              )}

              {showCityRecipes && selectedCity && (
                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    className="mobile-map-detail-back"
                    onClick={() => {
                      onBackToCities();
                      onSheetStateChange('half');
                    }}
                  >
                    {t('map.allCities')}
                  </button>
                  <h3 className="map-search-group-title">
                    {selectedCity.name} · {selectedCity.recipes.length} {t('map.recipeCountLabel').toLocaleLowerCase()}
                  </h3>
                  {selectedCity.recipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      className={`map-search-row ${selectedRecipeId === recipe.id ? 'is-active' : ''}`}
                      onClick={() => handleRecipeSelect(recipe.id)}
                    >
                      <span className="map-search-icon">
                        <MapPin aria-hidden="true" size={15} />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-sm font-semibold text-[var(--color-text-primary)]">
                          {recipe.name}
                        </span>
                        <span className="block truncate text-xs text-[var(--color-text-muted)]">
                          {recipe.venueName ?? t('map.unknownVenue')}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {showBrowse && (
                <div className="space-y-1.5 pt-1">
                  <h3 className="map-search-group-title">{t('map.cities')}</h3>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      className="map-search-row"
                      onClick={() => handleCitySelect(city.id)}
                    >
                      <span className="map-search-icon">
                        <MapPin aria-hidden="true" size={15} />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-sm font-semibold text-[var(--color-text-primary)]">
                          {city.name}
                        </span>
                        <span className="block text-xs text-[var(--color-text-muted)]">
                          {t('map.venueCountLabel')}: {city.venues.length} · {t('map.recipeCountLabel')}:{' '}
                          {city.recipes.length}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
