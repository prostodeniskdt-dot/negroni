import { recipes } from '@/data/recipes';
import { prisma } from '@/lib/db';

/**
 * Проверка: список id рецептов и их количество.
 * GET /api/recipes — убедитесь, что count и ids соответствуют данным в src/data/recipes.ts
 */
export async function GET() {
  if (process.env.USE_DB === '1') {
    const list = await prisma.recipe.findMany({ select: { slug: true } });
    return Response.json({ count: list.length, ids: list.map((r) => r.slug) });
  }

  const ids = recipes.map((r) => r.id);
  return Response.json({ count: recipes.length, ids });
}
