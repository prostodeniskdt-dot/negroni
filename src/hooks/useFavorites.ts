'use client';

import { useState, useCallback, useEffect } from 'react';

const FAV_KEY = 'negroni-favorites';

function readFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAV_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeFavorites(list: string[]) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  } catch { /* no-op */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const idx = prev.indexOf(id);
      const next = idx === -1 ? [...prev, id] : prev.filter((x) => x !== id);
      writeFavorites(next);
      return next;
    });
  }, []);

  const add = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeFavorites(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((x) => x !== id);
      writeFavorites(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    writeFavorites([]);
    setFavorites([]);
  }, []);

  return { favorites, isFavorite, toggle, add, remove, clear, count: favorites.length };
}
