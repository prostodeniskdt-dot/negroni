'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { usePublicRecipes } from '@/hooks/usePublicRecipes';
import MapLeaflet from '@/components/MapLeaflet';
import MapPanel from '@/components/map/MapPanel';
import MobileMapSheet, { type MobileSheetState } from '@/components/map/MobileMapSheet';
import { buildMapCities, findCityByRecipe } from '@/lib/map-recipes';

export default function RecipesPage() {
  const { t } = useI18n();
  const { recipes } = usePublicRecipes();
  const cities = useMemo(() => buildMapCities(recipes), [recipes]);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [viewRequest, setViewRequest] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [sheetState, setSheetState] = useState<MobileSheetState>('collapsed');
  const [sheetHeight, setSheetHeight] = useState(88);
  const selectedCity = cities.find((city) => city.id === selectedCityId) ?? null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focus = params.get('focus');
    if (focus) {
      setSelectedRecipeId(focus);
      setSheetState('half');
    }
  }, []);

  useEffect(() => {
    if (!selectedRecipeId) return;
    const recipeCity = findCityByRecipe(cities, selectedRecipeId);
    if (recipeCity && recipeCity.id !== selectedCityId) {
      setSelectedCityId(recipeCity.id);
      setViewRequest((value) => value + 1);
    }
  }, [cities, selectedCityId, selectedRecipeId]);

  const handleCitySelect = useCallback((cityId: string) => {
    setSelectedCityId(cityId);
    setSelectedRecipeId(null);
    setViewRequest((value) => value + 1);
    setSheetState('half');
  }, []);

  const handleRecipeSelect = useCallback((recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setSheetState('half');
    window.requestAnimationFrame(() => {
      document.getElementById(`map-recipe-${recipeId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedCityId(null);
    setSelectedRecipeId(null);
    setViewRequest((value) => value + 1);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRecipeId(null);
    if (!selectedCityId) return;
    setViewRequest((value) => value + 1);
  }, [selectedCityId]);

  return (
    <section className="map-page relative mt-[var(--header-height)] flex h-[calc(100dvh-var(--header-height))] min-h-0 overflow-hidden">
      <div className="relative min-h-0 min-w-0 flex-1">
        {!mapReady && (
          <div className="absolute inset-0 z-[450] flex items-center justify-center bg-[var(--color-bg)]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-campari)]" />
              <span className="text-sm text-[var(--color-text-muted)]">
                {t('map.loading')}
              </span>
            </div>
          </div>
        )}
        <MapLeaflet
          cities={cities}
          selectedCityId={selectedCityId}
          selectedRecipeId={selectedRecipeId}
          viewRequest={viewRequest}
          bottomPadding={sheetHeight}
          unknownVenueLabel={t('map.unknownVenue')}
          recipesLabel={t('map.recipeCountLabel')}
          onCitySelect={handleCitySelect}
          onRecipeSelect={handleRecipeSelect}
          onReady={() => setMapReady(true)}
        />

        <MobileMapSheet
          cities={cities}
          selectedCity={selectedCity}
          selectedRecipeId={selectedRecipeId}
          sheetState={sheetState}
          onSheetStateChange={setSheetState}
          onCitySelect={handleCitySelect}
          onRecipeSelect={handleRecipeSelect}
          onClearSelection={handleClearSelection}
          onBackToCities={handleBack}
          onHeightChange={setSheetHeight}
        />
      </div>

      <MapPanel
        cities={cities}
        selectedCity={selectedCity}
        selectedRecipeId={selectedRecipeId}
        onCitySelect={handleCitySelect}
        onRecipeSelect={handleRecipeSelect}
        onBack={handleBack}
      />
    </section>
  );
}
