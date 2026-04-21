'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { recipes } from '@/data/recipes';
import MapLeaflet from '@/components/MapLeaflet';

export default function RecipesPage() {
  const { t } = useI18n();
  const [focusId, setFocusId] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const focus = params.get('focus');
    if (focus) {
      setFocusId(focus);
      setActiveCity(focus);
    }
  }, []);

  const handleCityClick = useCallback((id: string) => {
    setFocusId(id);
    setActiveCity(id);
    if (window.innerWidth < 768) {
      setMobileView('map');
    }
  }, []);

  const handleMapMarkerClick = useCallback((id: string) => {
    setActiveCity(id);
    // Scroll sidebar to active city
    const el = document.getElementById(`sidebar-city-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <section className="mt-[60px] h-[calc(100vh-60px)] flex flex-col md:flex-row">
      {/* Mobile toggle */}
      <div className="flex md:hidden border-b border-[var(--color-border)] bg-[var(--color-surface-solid)]">
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            mobileView === 'map'
              ? 'text-[var(--color-campari)] border-b-2 border-[var(--color-campari)]'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          {t('map.tabMap') || 'Карта'}
        </button>
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            mobileView === 'list'
              ? 'text-[var(--color-campari)] border-b-2 border-[var(--color-campari)]'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          {t('map.tabList') || 'Список'}
        </button>
      </div>

      {/* Map */}
      <div className={`flex-1 min-w-0 relative ${mobileView === 'list' ? 'hidden md:block' : ''}`}>
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)] z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-campari)] rounded-full animate-spin" />
              <span className="text-sm text-[var(--color-text-muted)]">
                {t('map.loading') || 'Загрузка карты...'}
              </span>
            </div>
          </div>
        )}
        <MapLeaflet
          recipes={recipes}
          focusId={focusId}
          onMarkerClick={handleMapMarkerClick}
          onReady={() => setMapReady(true)}
        />
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-[320px] shrink-0 bg-[var(--color-surface-solid)] border-l border-[var(--color-border)] flex flex-col ${mobileView === 'map' ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h1 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] mb-1">
            {t('map.title')}
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] font-[var(--font-serif)]">
            {t('map.desc')}
          </p>
        </div>
        <div className="px-5 pt-3 pb-2">
          <h2 className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {t('map.cities')} ({recipes.length})
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto space-y-2 px-3 pb-4" aria-label="Города с рецептами">
          {recipes.map((entry) => (
            <button
              key={entry.id}
              id={`sidebar-city-${entry.id}`}
              type="button"
              onClick={() => handleCityClick(entry.id)}
              className={`w-full text-left block px-4 py-3 rounded-[var(--radius-md)] border text-sm transition-all duration-[var(--transition-base)] cursor-pointer ${
                activeCity === entry.id
                  ? 'border-[var(--color-campari)] bg-[var(--color-campari)]/10 text-[var(--color-text-primary)] shadow-[0_0_12px_rgba(187,10,48,0.15)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:-translate-x-1'
              }`}
            >
              <span className="font-medium block">{entry.recipe.name}</span>
              <span className="text-xs text-[var(--color-text-muted)] flex items-center justify-between mt-0.5">
                <span>{entry.city}</span>
                <Link
                  href={`/recipe/${entry.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[var(--color-campari)] hover:text-[var(--color-campari-light)] transition-colors"
                >
                  {t('map.openRecipe')}
                </Link>
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </section>
  );
}
