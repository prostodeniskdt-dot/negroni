'use client';

import { useEffect, useRef, useCallback } from 'react';
import type * as LType from 'leaflet';
import type { RecipeEntry } from '@/data/recipes';

import 'leaflet/dist/leaflet.css';

type MapLeafletProps = {
  recipes: RecipeEntry[];
  focusId?: string | null;
  onMarkerClick?: (id: string) => void;
  onReady?: () => void;
};

export default function MapLeaflet({ recipes, focusId, onMarkerClick, onReady }: MapLeafletProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const markersRef = useRef<Record<string, LType.Marker>>({});
  const iconsRef = useRef<{ default: LType.DivIcon | null; active: LType.DivIcon | null }>({ default: null, active: null });

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      const L = (await import('leaflet')) as typeof LType;

      if (!containerRef.current || isCancelled) return;
      if (mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [61, 96],
        zoom: 3.5,
        maxBounds: [
          [35, 15],
          [82, 191],
        ],
        maxBoundsViscosity: 0.8,
      });

      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const yellowMarkerSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>" +
        "<circle cx='14' cy='14' r='12' fill='#f8cf2c' stroke='#0d0d0d' stroke-width='2'/>" +
        '</svg>';

      const activeMarkerSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'>" +
        "<circle cx='17' cy='17' r='14' fill='#BB0A30' stroke='#f8cf2c' stroke-width='3'/>" +
        '</svg>';

      const defaultIcon = L.divIcon({
        html: yellowMarkerSvg,
        className: 'negroni-custom-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const activeIcon = L.divIcon({
        html: activeMarkerSvg,
        className: 'negroni-custom-marker',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      iconsRef.current = { default: defaultIcon, active: activeIcon };

      function escapeHtml(s: string) {
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
      }

      recipes.forEach((r) => {
        if (r.lat == null || r.lng == null) return;

        const marker = L.marker([r.lat, r.lng], { icon: defaultIcon }).addTo(map);
        markersRef.current[r.id] = marker;

        const html =
          `<strong>${escapeHtml(r.city)}</strong><br>` +
          `<em>${escapeHtml(r.recipe.name)}</em><br>` +
          `<button type='button' class='popup-btn'>Открыть рецепт</button>`;

        marker.bindPopup(html);

        marker.on('popupopen', () => {
          marker.setIcon(activeIcon);
          onMarkerClick?.(r.id);
          const popup = marker.getPopup();
          const el = popup?.getElement();
          const btn = el?.querySelector<HTMLButtonElement>('.popup-btn');
          if (btn) {
            btn.onclick = () => {
              window.location.href = `/recipe/${encodeURIComponent(r.id)}?from=map`;
            };
          }
        });

        marker.on('popupclose', () => {
          marker.setIcon(defaultIcon);
        });
      });

      if (focusId && markersRef.current[focusId]) {
        const marker = markersRef.current[focusId];
        const latLng = marker.getLatLng();
        map.setView(latLng, 5, { animate: true });
        marker.openPopup();
      }

      onReady?.();
    }

    void init();

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes]);

  // Handle external focus changes
  useEffect(() => {
    if (!focusId || !mapRef.current || !markersRef.current[focusId]) return;
    const marker = markersRef.current[focusId];
    const map = mapRef.current;
    const latLng = marker.getLatLng();
    map.setView(latLng, 5, { animate: true });
    marker.openPopup();
  }, [focusId]);

  return <div ref={containerRef} className="w-full h-full dark-tiles" />;
}
