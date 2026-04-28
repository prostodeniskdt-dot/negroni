import type { Recipe as DbRecipe } from '@prisma/client';
import {
  recipes as staticRecipes,
  type RecipeEntry,
  type Recipe,
  type Prebatch,
} from '@/data/recipes';

export type PublicRecipeEntry = RecipeEntry;

export function dbRecipeToEntry(recipe: DbRecipe): PublicRecipeEntry {
  const prebatch: string | Prebatch =
    recipe.prebatchMode === 'none'
      ? ''
      : recipe.prebatchText
        ? recipe.prebatchText
        : '';

  return {
    id: recipe.slug,
    city: recipe.city,
    lat: recipe.lat,
    lng: recipe.lng,
    recipe: {
      name: recipe.name,
      region: recipe.region,
      author: recipe.author,
      bar: recipe.bar,
      difficulty: normalizeDifficulty(recipe.difficulty),
      category: recipe.category,
      barDescription: recipe.barDescription,
      barCity: recipe.barCity,
      tags: recipe.tags,
      intro: recipe.intro,
      image: recipe.image,
      method: recipe.method,
      glass: recipe.glass,
      garnish: recipe.garnish,
      ice: recipe.ice,
      prebatch,
      flavorProfile: {
        bitter: recipe.flavorBitter,
        sweet: recipe.flavorSweet,
        sour: recipe.flavorSour,
        spicy: recipe.flavorSpicy,
        strong: recipe.flavorStrong,
      },
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      authorInstagram: recipe.authorInstagram ?? undefined,
      authorTg: recipe.authorTg ?? undefined,
      barLink: recipe.barLink ?? undefined,
    },
  };
}

export function normalizeRecipeEntry(entry: PublicRecipeEntry): PublicRecipeEntry {
  return {
    ...entry,
    recipe: {
      ...entry.recipe,
      image: entry.recipe.image || fallbackRecipeImage,
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

export const fallbackRecipeImage = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200';

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
    result = result.filter((entry) => selected.some((tag) => entry.recipe.tags.some((recipeTag) => recipeTag.toLowerCase() === tag)));
  }

  if (opts.ingredients) {
    const queries = opts.ingredients.trim().toLowerCase().split(/[,;]+/).map((item) => item.trim()).filter(Boolean);
    if (queries.length) {
      result = result.filter((entry) => {
        const ingredients = entry.recipe.ingredients.join(' ').toLowerCase();
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

function normalizeDifficulty(value: string): Recipe['difficulty'] {
  if (value === 'medium' || value === 'hard') return value;
  return 'easy';
}
