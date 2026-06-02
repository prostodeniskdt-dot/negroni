import { recipes } from '@/data/recipes';

/**
 * Проверка: список id рецептов и их количество.
 * GET /api/recipes — убедитесь, что count и ids соответствуют данным в src/data/recipes.ts
 */
export async function GET() {
  const ids = recipes.map((r) => r.id);
  return Response.json({ count: recipes.length, ids });
}
