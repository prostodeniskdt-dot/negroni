'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

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
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const syncingRef = useRef(false);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((j) => setIsAuthed(Boolean(j?.session)))
      .catch(() => setIsAuthed(false));
  }, []);

  useEffect(() => {
    if (isAuthed !== true) return;
    if (syncingRef.current) return;
    syncingRef.current = true;

    const local = readFavorites();

    fetch('/api/me/favorites')
      .then((r) => (r.ok ? r.json() : null))
      .then((remote) => {
        const remoteSlugs: string[] = Array.isArray(remote?.slugs) ? remote.slugs : [];
        const merged = Array.from(new Set([...local, ...remoteSlugs])).filter(Boolean);
        return fetch('/api/me/favorites', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slugs: merged, mode: 'merge' }),
        });
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((res) => {
        const slugs: string[] = Array.isArray(res?.slugs) ? res.slugs : local;
        writeFavorites(slugs);
        setFavorites(slugs);
      })
      .catch(() => {
        // If remote sync fails (DB temporarily unavailable), keep local behavior.
      });
  }, [isAuthed]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const idx = prev.indexOf(id);
      const next = idx === -1 ? [...prev, id] : prev.filter((x) => x !== id);
      writeFavorites(next);
      if (isAuthed) {
        fetch('/api/me/favorites', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slugs: next, mode: 'replace' }),
        }).catch(() => {});
      }
      return next;
    });
  }, [isAuthed]);

  const add = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeFavorites(next);
      if (isAuthed) {
        fetch('/api/me/favorites', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slugs: next, mode: 'replace' }),
        }).catch(() => {});
      }
      return next;
    });
  }, [isAuthed]);

  const remove = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((x) => x !== id);
      writeFavorites(next);
      if (isAuthed) {
        fetch('/api/me/favorites', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slugs: next, mode: 'replace' }),
        }).catch(() => {});
      }
      return next;
    });
  }, [isAuthed]);

  const clear = useCallback(() => {
    writeFavorites([]);
    setFavorites([]);
    if (isAuthed) {
      fetch('/api/me/favorites', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slugs: [], mode: 'replace' }),
      }).catch(() => {});
    }
  }, [isAuthed]);

  return { favorites, isFavorite, toggle, add, remove, clear, count: favorites.length };
}
