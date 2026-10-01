import type { PublicRecipeEntry } from '@/lib/public-recipes';

export const UNKNOWN_VENUE_KEY = '__unknown_venue__';

export type MapRecipe = {
  id: string;
  name: string;
  city: string;
  venueName: string | null;
  lat: number;
  lng: number;
  entry: PublicRecipeEntry;
};

export type MapVenue = {
  id: string;
  name: string | null;
  lat: number;
  lng: number;
  recipes: MapRecipe[];
};

export type MapCity = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  venues: MapVenue[];
  recipes: MapRecipe[];
  bounds: [[number, number], [number, number]];
};

function normalizeKey(value: string): string {
  return value.trim().toLocaleLowerCase('ru-RU').replace(/\s+/g, ' ');
}

function getVenueName(entry: PublicRecipeEntry): string | null {
  const name = entry.recipe.bar?.trim();
  return name && name !== '—' ? name : null;
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildMapCities(entries: PublicRecipeEntry[]): MapCity[] {
  const cityGroups = new Map<string, PublicRecipeEntry[]>();

  entries.forEach((entry) => {
    if (!Number.isFinite(entry.lat) || !Number.isFinite(entry.lng)) return;

    const cityName = entry.city.trim();
    const key = normalizeKey(cityName);
    const group = cityGroups.get(key) ?? [];
    group.push(entry);
    cityGroups.set(key, group);
  });

  return Array.from(cityGroups.entries())
    .map(([cityId, cityEntries]): MapCity => {
      const recipeItems = cityEntries.map((entry): MapRecipe => ({
        id: entry.id,
        name: entry.recipe.name,
        city: entry.city.trim(),
        venueName: getVenueName(entry),
        lat: entry.lat,
        lng: entry.lng,
        entry,
      }));

      const venueGroups = new Map<string, MapRecipe[]>();
      recipeItems.forEach((recipe) => {
        // Unknown venues must stay separate: they are recipes, not one fictional bar.
        const venueKey = recipe.venueName
          ? normalizeKey(recipe.venueName)
          : `${UNKNOWN_VENUE_KEY}:${recipe.id}`;
        const group = venueGroups.get(venueKey) ?? [];
        group.push(recipe);
        venueGroups.set(venueKey, group);
      });

      const venues = Array.from(venueGroups.entries())
        .map(([venueId, recipes]): MapVenue => ({
          id: `${cityId}:${venueId}`,
          name: recipes[0].venueName,
          lat: average(recipes.map((recipe) => recipe.lat)),
          lng: average(recipes.map((recipe) => recipe.lng)),
          recipes: [...recipes].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
        }))
        .sort((a, b) => {
          if (!a.name) return 1;
          if (!b.name) return -1;
          return a.name.localeCompare(b.name, 'ru');
        });

      const lats = recipeItems.map((recipe) => recipe.lat);
      const lngs = recipeItems.map((recipe) => recipe.lng);

      return {
        id: cityId,
        name: cityEntries[0].city.trim(),
        lat: average(lats),
        lng: average(lngs),
        venues,
        recipes: [...recipeItems].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
        bounds: [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

export function findCityByRecipe(cities: MapCity[], recipeId: string | null): MapCity | undefined {
  if (!recipeId) return undefined;
  return cities.find((city) => city.recipes.some((recipe) => recipe.id === recipeId));
}

export function findVenueByRecipe(cities: MapCity[], recipeId: string | null): MapVenue | undefined {
  if (!recipeId) return undefined;
  for (const city of cities) {
    const venue = city.venues.find((item) => item.recipes.some((recipe) => recipe.id === recipeId));
    if (venue) return venue;
  }
  return undefined;
}

export type MapSearchResult =
  | { type: 'city'; city: MapCity }
  | { type: 'venue'; city: MapCity; venue: MapVenue }
  | { type: 'recipe'; city: MapCity; recipe: MapRecipe };

export type MapSearchFilters = {
  cityId?: string | null;
  category?: string | null;
  difficulty?: string | null;
  tag?: string | null;
};

function recipeMatchesFilters(recipe: MapRecipe, filters: MapSearchFilters): boolean {
  if (filters.category && recipe.entry.recipe.category !== filters.category) return false;
  if (filters.difficulty && recipe.entry.recipe.difficulty !== filters.difficulty) return false;
  if (filters.tag) {
    const needle = normalizeKey(filters.tag);
    const hasTag = (recipe.entry.recipe.tags ?? []).some((tag) => normalizeKey(tag) === needle);
    if (!hasTag) return false;
  }
  return true;
}

function textMatches(haystack: string | null | undefined, needle: string): boolean {
  if (!haystack) return false;
  return normalizeKey(haystack).includes(needle);
}

export function searchMapItems(
  cities: MapCity[],
  query: string,
  filters: MapSearchFilters = {}
): MapSearchResult[] {
  const needle = normalizeKey(query);
  const hasQuery = needle.length > 0;
  const hasFilters = Boolean(filters.cityId || filters.category || filters.difficulty || filters.tag);
  const results: MapSearchResult[] = [];

  const scopedCities = filters.cityId
    ? cities.filter((city) => city.id === filters.cityId)
    : cities;

  for (const city of scopedCities) {
    const cityRecipes = city.recipes.filter((recipe) => recipeMatchesFilters(recipe, filters));
    if (cityRecipes.length === 0 && hasFilters) continue;

    const cityMatchesQuery = !hasQuery || textMatches(city.name, needle);
    if (cityMatchesQuery && !hasFilters) {
      results.push({ type: 'city', city });
    } else if (cityMatchesQuery && hasFilters && cityRecipes.length > 0) {
      results.push({ type: 'city', city: { ...city, recipes: cityRecipes } });
    }

    for (const venue of city.venues) {
      const venueRecipes = venue.recipes.filter((recipe) => recipeMatchesFilters(recipe, filters));
      if (hasFilters && venueRecipes.length === 0) continue;

      const venueMatchesQuery =
        !hasQuery ||
        textMatches(venue.name, needle) ||
        venueRecipes.some((recipe) => textMatches(recipe.name, needle));

      if (venueMatchesQuery && (hasQuery || hasFilters)) {
        results.push({
          type: 'venue',
          city,
          venue: hasFilters ? { ...venue, recipes: venueRecipes } : venue,
        });
      }
    }

    for (const recipe of cityRecipes) {
      const recipeMatchesQuery =
        !hasQuery ||
        textMatches(recipe.name, needle) ||
        textMatches(recipe.venueName, needle) ||
        textMatches(recipe.city, needle) ||
        textMatches(recipe.entry.recipe.category, needle) ||
        (recipe.entry.recipe.tags ?? []).some((tag) => textMatches(tag, needle));

      if (recipeMatchesQuery && (hasQuery || hasFilters)) {
        results.push({ type: 'recipe', city, recipe });
      }
    }
  }

  if (!hasQuery && !hasFilters) {
    return cities.map((city) => ({ type: 'city' as const, city }));
  }

  return results;
}

export function getMapFilterOptions(cities: MapCity[]) {
  const categories = new Set<string>();
  const difficulties = new Set<string>();
  const tags = new Set<string>();

  cities.forEach((city) => {
    city.recipes.forEach((recipe) => {
      if (recipe.entry.recipe.category) categories.add(recipe.entry.recipe.category);
      if (recipe.entry.recipe.difficulty) difficulties.add(recipe.entry.recipe.difficulty);
      (recipe.entry.recipe.tags ?? []).forEach((tag) => tags.add(tag));
    });
  });

  return {
    cities: cities.map((city) => ({ id: city.id, name: city.name })),
    categories: Array.from(categories).sort((a, b) => a.localeCompare(b, 'ru')),
    difficulties: Array.from(difficulties),
    tags: Array.from(tags).sort((a, b) => a.localeCompare(b, 'ru')).slice(0, 24),
  };
}
