'use client';

import { useEffect, useState } from 'react';
import { staticPublicRecipes, normalizeRecipeEntry, type PublicRecipeEntry } from '@/lib/public-recipes';

type PublicRecipesState = {
  recipes: PublicRecipeEntry[];
  source: 'static' | 'db' | 'loading';
  loading: boolean;
};

export function usePublicRecipes(): PublicRecipesState {
  const [state, setState] = useState<PublicRecipesState>(() => ({
    recipes: staticPublicRecipes(),
    source: 'loading',
    loading: true,
  }));

  useEffect(() => {
    let cancelled = false;

    fetch('/api/public/recipes')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        if (cancelled) return;
        const list = Array.isArray(json?.recipes) ? json.recipes.map(normalizeRecipeEntry) : staticPublicRecipes();
        setState({
          recipes: list,
          source: json?.source === 'db' ? 'db' : 'static',
          loading: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ recipes: staticPublicRecipes(), source: 'static', loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
