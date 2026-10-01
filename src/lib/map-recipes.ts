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
