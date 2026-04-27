import Link from 'next/link';
import { prisma } from '@/lib/db';
import { AdminShell } from '@/components/AdminShell';
import { RecipeList } from '@/components/RecipeList';

export const dynamic = 'force-dynamic';

export default async function AdminRecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      region: true,
      city: true,
      author: true,
      bar: true,
      category: true,
      difficulty: true,
      image: true,
      status: true,
      updatedAt: true,
    },
  });

  return (
    <AdminShell
      title="Рецепты"
      description="Управляйте текущими рецептами: ищите, фильтруйте, открывайте карточки на сайте, редактируйте данные и удаляйте устаревшее."
      actions={
        <Link
          href="/admin/recipes/new"
          className="rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-5 py-3 font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
        >
          Новый рецепт
        </Link>
      }
    >
      <RecipeList recipes={recipes} />
    </AdminShell>
  );
}

