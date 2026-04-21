/**
 * Утилиты для выборки рецептов по напиткам, категориям и генеральному партнёру.
 * Логика: если бар и бренд не указаны — рецепт считается общим от генерального партнёра.
 */

import { recipes, type RecipeEntry } from '@/data/recipes';
import { getDrinkById } from '@/data/partners';

// Ключевые слова для поиска по ингредиентам (RU/EN)
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  gin: ['джин', 'gin'],
  vermouth: ['вермут', 'vermouth', 'вермута', 'вермута', 'красного вермута', 'белого вермута'],
  bitter: ['кампари', 'campari', 'биттер', 'bitter', 'биттера', 'настойк'],
  liqueur: ['ликёр', 'ликёра', 'liqueur', 'ликер', 'ликер'],
};

/**
 * Рецепты, где используется напиток из указанной категории.
 * Поиск по ключевым словам в ингредиентах.
 */
export function getRecipesByCategory(categoryId: string): RecipeEntry[] {
  const keywords = CATEGORY_KEYWORDS[categoryId];
  if (!keywords) return [];

  return recipes.filter((entry) => {
    const text = entry.recipe.ingredients.join(' ').toLowerCase();
    return keywords.some((kw) => text.includes(kw.toLowerCase()));
  });
}

/**
 * Рецепты, где используется конкретный напиток.
 * Для MVP: если напиток имеет categoryId, ищем по категории.
 * В будущем: по ingredientReferences.drinkId.
 */
export function getRecipesByDrink(drinkId: string): RecipeEntry[] {
  const drink = getDrinkById(drinkId);
  if (!drink) return [];
  return getRecipesByCategory(drink.categoryId);
}

/**
 * Общие рецепты от генерального партнёра.
 * Условие: bar === '—' и нет указания конкретного бара.
 */
export function getGeneralPartnerRecipes(): RecipeEntry[] {
  return recipes.filter((entry) => entry.recipe.bar === '—');
}

/**
 * Рецепты для карточки напитка: по категории + пометка «общий» для bar === '—'.
 */
export function getRecipesForDrink(drinkId: string, generalPartnerName?: string): {
  recipes: RecipeEntry[];
  isGeneralPartner: (entry: RecipeEntry) => boolean;
} {
  const list = getRecipesByDrink(drinkId);
  const isGeneralPartner = (entry: RecipeEntry) => entry.recipe.bar === '—';
  return { recipes: list, isGeneralPartner };
}
