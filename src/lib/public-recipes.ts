import {
  recipes as staticRecipes,
  type Recipe,
  type RecipeEntry,
} from '@/data/recipes';

export type PublicRecipeEntry = RecipeEntry;

export const fallbackRecipeImage = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200';

/**
 * Кодирует сегменты пути к файлу в /public, чтобы &, пробелы, акценты и ’ не ломали URL.
 * Внешние URL и data: не трогает. Повторный вызов безопасен (сначала decode сегмента).
 */
export function encodePublicAssetPath(path: string): string {
  const value = path.trim();
  if (!value) return value;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const hashIndex = value.indexOf('#');
  const queryIndex = value.indexOf('?');
  let pathPart = value;
  let suffix = '';
  const cutAt = [hashIndex, queryIndex].filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (cutAt !== undefined) {
    pathPart = value.slice(0, cutAt);
    suffix = value.slice(cutAt);
  }

  return (
    pathPart
      .split('/')
      .map((segment) => {
        if (!segment) return '';
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join('/') + suffix
  );
}

/** Фото коктейля на странице рецепта — только из public/images/recipes/ */
export function getRecipePageImage(recipe: Recipe): string {
  return encodePublicAssetPath(recipe.image || fallbackRecipeImage);
}

/** Превью для карточек в коллекции и подборках — только из public/images/cards/ */
export function getRecipeCardImage(recipe: Recipe): string {
  return encodePublicAssetPath(recipe.cardImage || fallbackRecipeImage);
}

/** Фото автора — с безопасным URL-кодированием */
export function getRecipeAuthorImage(recipe: Recipe): string | undefined {
  if (!recipe.authorImage) return undefined;
  return encodePublicAssetPath(recipe.authorImage);
}

/** Город для подписи на карточке — без «Россия». */
function getRecipeCardCity(entry: RecipeEntry): string | null {
  const city = entry.city?.trim();
  if (city && !/^россия$/i.test(city)) {
    return city;
  }

  const region = entry.recipe.region?.trim() ?? '';
  const withoutRussia = region.replace(/,\s*Россия\s*$/i, '').trim();
  if (withoutRussia && !/^россия$/i.test(withoutRussia)) {
    return withoutRussia;
  }

  return null;
}

/** Подпись на карточке рецепта: «Город, Бар» (без «Россия»). */
export function getRecipeCardLabel(entry: RecipeEntry): string | null {
  const bar = entry.recipe.bar?.trim();
  const hasBar = Boolean(bar && bar !== '—');
  const city = getRecipeCardCity(entry);

  if (city && hasBar) return `${city}, ${bar}`;
  if (hasBar) return bar!;
  if (city) return city;
  return null;
}

export function normalizeRecipeEntry(entry: PublicRecipeEntry): PublicRecipeEntry {
  return {
    ...entry,
    recipe: {
      ...entry.recipe,
      image: entry.recipe.image || fallbackRecipeImage,
      cardImage: entry.recipe.cardImage,
      tags: entry.recipe.tags ?? [],
      ingredients: entry.recipe.ingredients ?? [],
      steps: entry.recipe.steps ?? [],
      flavorProfile: entry.recipe.flavorProfile ?? {
        bitter: 0,
        sweet: 0,
        sour: 0,
        spicy: 0,
        strong: 0,
      },
    },
  };
}

export function getRecipeByIdFrom(entries: PublicRecipeEntry[], id: string): PublicRecipeEntry | undefined {
  return entries.find((entry) => entry.id === id);
}

export function getAllRegionsFrom(entries: PublicRecipeEntry[]): string[] {
  return Array.from(new Set(entries.map((entry) => entry.recipe.region).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'ru'));
}

export function getAllTagsFrom(entries: PublicRecipeEntry[]): string[] {
  const set = new Map<string, string>();
  entries.forEach((entry) => {
    entry.recipe.tags.forEach((tag) => set.set(tag.toLowerCase(), tag));
  });
  return Array.from(set.keys()).sort().map((key) => set.get(key)!);
}

export function getAllCategoriesFrom(entries: PublicRecipeEntry[]): string[] {
  return Array.from(new Set(entries.map((entry) => entry.recipe.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'ru'));
}

export function filterRecipesFrom(entries: PublicRecipeEntry[], opts: {
  query?: string;
  region?: string;
  tags?: string[];
  flavor?: Record<string, [number, number]>;
  ingredients?: string;
  category?: string;
  difficulty?: string;
}): PublicRecipeEntry[] {
  let result = [...entries];

  if (opts.query) {
    const q = opts.query.trim().toLowerCase();
    if (q) {
      result = result.filter((entry) => {
        const text = [
          entry.recipe.name,
          entry.city,
          entry.recipe.region,
          entry.recipe.intro,
          entry.recipe.author,
          entry.recipe.bar,
        ].join(' ').toLowerCase();
        return text.includes(q);
      });
    }
  }

  if (opts.region) result = result.filter((entry) => entry.recipe.region === opts.region);
  if (opts.category) result = result.filter((entry) => entry.recipe.category === opts.category);
  if (opts.difficulty) result = result.filter((entry) => entry.recipe.difficulty === opts.difficulty);

  if (opts.tags?.length) {
    const selected = opts.tags.map((tag) => tag.toLowerCase());
    result = result.filter((entry) =>
      selected.some((tag) =>
        (entry.recipe.tags ?? []).some((recipeTag) => recipeTag.toLowerCase() === tag)
      )
    );
  }

  if (opts.ingredients) {
    const queries = opts.ingredients.trim().toLowerCase().split(/[,;]+/).map((item) => item.trim()).filter(Boolean);
    if (queries.length) {
      result = result.filter((entry) => {
        const ingredients = (entry.recipe.ingredients ?? []).join(' ').toLowerCase();
        return queries.every((query) => ingredients.includes(query));
      });
    }
  }

  if (opts.flavor) {
    const keys = Object.keys(opts.flavor);
    if (keys.length) {
      result = result.filter((entry) => keys.every((key) => {
        const range = opts.flavor?.[key];
        if (!Array.isArray(range)) return true;
        const value = (entry.recipe.flavorProfile as unknown as Record<string, number>)[key] ?? 0;
        return value >= range[0] && value <= range[1];
      }));
    }
  }

  return result;
}

export function staticPublicRecipes(): PublicRecipeEntry[] {
  return staticRecipes.map(normalizeRecipeEntry);
}

export function getCollectionStats(entries: PublicRecipeEntry[]) {
  return {
    recipeCount: entries.length,
    cityCount: new Set(entries.map((entry) => entry.city)).size,
  };
}

const HOMEPAGE_FEATURED_IDS = [
  'classic',
  'yaroslavl',
  'paradox',
  'santi-negroni',
  'bacio-russo',
  'lao',
] as const;

export function getFeaturedRecipes(
  entries: PublicRecipeEntry[],
  limit = 6
): PublicRecipeEntry[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const featured: PublicRecipeEntry[] = [];

  for (const id of HOMEPAGE_FEATURED_IDS) {
    const entry = byId.get(id);
    if (entry) featured.push(entry);
  }

  for (const entry of entries) {
    if (featured.length >= limit) break;
    if (!featured.some((item) => item.id === entry.id)) {
      featured.push(entry);
    }
  }

  return featured.slice(0, limit);
}
