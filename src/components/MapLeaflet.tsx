'use client';

import { useEffect, useRef, useState } from 'react';
import type * as LType from 'leaflet';
import type { MapCity } from '@/lib/map-recipes';

import 'leaflet/dist/leaflet.css';

type MapLeafletProps = {
  cities: MapCity[];
  selectedCityId: string | null;
  selectedRecipeId: string | null;
  viewRequest: number;
  unknownVenueLabel: string;
  recipesLabel: string;
  onCitySelect: (cityId: string) => void;
  onRecipeSelect: (recipeId: string) => void;
  onReady?: () => void;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function MapLeaflet({
  cities,
  selectedCityId,
  selectedRecipeId,
  viewRequest,
  unknownVenueLabel,
  recipesLabel,
  onCitySelect,
  onRecipeSelect,
  onReady,
}: MapLeafletProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const leafletRef = useRef<typeof LType | null>(null);
  const layerRef = useRef<LType.LayerGroup | null>(null);
  const recipeMarkersRef = useRef<Record<string, LType.Marker>>({});
  const callbacksRef = useRef({ onCitySelect, onRecipeSelect, onReady });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    callbacksRef.current = { onCitySelect, onRecipeSelect, onReady };
  }, [onCitySelect, onRecipeSelect, onReady]);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      const L = (await import('leaflet')) as typeof LType;

      if (!containerRef.current || isCancelled) return;
      if (mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [59, 75],
        zoom: 3,
        minZoom: 2,
        worldCopyJump: true,
        zoomControl: true,
      });

      leafletRef.current = L;
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      map.attributionControl.setPosition('topright');
      setIsReady(true);
      callbacksRef.current.onReady?.();

      window.setTimeout(() => map.invalidateSize(), 0);
    }

    void init();

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      leafletRef.current = null;
      layerRef.current = null;
      recipeMarkersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!isReady || !L || !map || !layer) return;

    layer.clearLayers();
    recipeMarkersRef.current = {};

    const selectedCity = cities.find((city) => city.id === selectedCityId);

    if (!selectedCity) {
      cities.forEach((city) => {
        const icon = L.divIcon({
          className: 'map-city-marker-wrapper',
          html: `<div class="map-city-marker"><span>${city.recipes.length}</span></div>`,
          iconSize: [52, 52],
          iconAnchor: [26, 26],
        });
        const marker = L.marker([city.lat, city.lng], {
          icon,
          keyboard: true,
          title: city.name,
        }).addTo(layer);

        marker.bindTooltip(
          `<strong>${escapeHtml(city.name)}</strong><span>${escapeHtml(recipesLabel)}: ${city.recipes.length}</span>`,
          { className: 'map-marker-tooltip', direction: 'top', offset: [0, -22] }
        );
        marker.on('click', () => callbacksRef.current.onCitySelect(city.id));
      });
      return;
    }

    selectedCity.venues.forEach((venue) => {
      const isActive = venue.recipes.some((recipe) => recipe.id === selectedRecipeId);
      const icon = L.divIcon({
        className: 'map-venue-marker-wrapper',
        html: `<div class="map-venue-marker${isActive ? ' is-active' : ''}"><span>${venue.recipes.length}</span></div>`,
        iconSize: isActive ? [44, 44] : [36, 36],
        iconAnchor: isActive ? [22, 22] : [18, 18],
      });
      const venueName = venue.name ?? unknownVenueLabel;
      const marker = L.marker([venue.lat, venue.lng], {
        icon,
        keyboard: true,
        title: venueName,
        zIndexOffset: isActive ? 1000 : 0,
      }).addTo(layer);

      const recipeNames = venue.recipes.map((recipe) => escapeHtml(recipe.name)).join('<br>');
      marker.bindTooltip(
        `<strong>${escapeHtml(venueName)}</strong><span>${recipeNames}</span>`,
        { className: 'map-marker-tooltip', direction: 'top', offset: [0, -16] }
      );

      venue.recipes.forEach((recipe) => {
        recipeMarkersRef.current[recipe.id] = marker;
      });

      marker.on('click', () => {
        const selectedRecipe = venue.recipes.find((recipe) => recipe.id === selectedRecipeId);
        callbacksRef.current.onRecipeSelect(selectedRecipe?.id ?? venue.recipes[0].id);
      });

      if (isActive) marker.openTooltip();
    });
  }, [cities, isReady, recipesLabel, selectedCityId, selectedRecipeId, unknownVenueLabel]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!isReady || !L || !map) return;

    const selectedCity = cities.find((city) => city.id === selectedCityId);

    if (!selectedCity) {
      if (cities.length === 0) return;
      const bounds = L.latLngBounds(cities.map((city) => [city.lat, city.lng] as [number, number]));
      map.fitBounds(bounds, { animate: true, padding: [40, 40], maxZoom: 4 });
      return;
    }

    const points = selectedCity.venues.map((venue) => [venue.lat, venue.lng] as [number, number]);
    const bounds = L.latLngBounds(points);
    const isSinglePoint =
      points.length === 1 ||
      (bounds.getNorth() === bounds.getSouth() && bounds.getEast() === bounds.getWest());

    if (isSinglePoint) {
      map.setView(points[0], 13, { animate: true });
      return;
    }

    const mobilePanelPadding = window.innerWidth < 768 ? Math.min(window.innerHeight * 0.38, 340) : 50;
    map.fitBounds(bounds, {
      animate: true,
      maxZoom: 13,
      paddingTopLeft: [40, 60],
      paddingBottomRight: [40, mobilePanelPadding],
    });
  }, [cities, isReady, selectedCityId, viewRequest]);

  useEffect(() => {
    if (!selectedRecipeId || !mapRef.current) return;
    const marker = recipeMarkersRef.current[selectedRecipeId];
    if (!marker) return;

    const map = mapRef.current;
    const point = marker.getLatLng();
    if (!map.getBounds().pad(-0.15).contains(point)) {
      map.panTo(point, { animate: true });
    }
  }, [selectedRecipeId]);

  return <div ref={containerRef} className="map-leaflet h-full w-full" />;
}
