import { prisma } from '@/lib/db';
import { AdminShell } from '@/components/AdminShell';
import { RecipeForm } from '@/components/RecipeForm';

export const dynamic = 'force-dynamic';

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [recipe, prebatches] = await Promise.all([
    prisma.recipe.findUnique({ where: { id } }),
    prisma.prebatch.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  if (!recipe) {
    return (
      <main className="min-h-screen px-6 pb-10 pt-24">
        <div className="max-w-xl mx-auto p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          Not found
        </div>
      </main>
    );
  }

  return (
    <AdminShell
      title={recipe.name}
      description="Редактируйте рецепт без технической путаницы: фото, контент, вкус, prebatch и публикация собраны по рабочим секциям."
      backHref="/admin/recipes"
      backLabel="К списку рецептов"
    >
      <RecipeForm mode="edit" recipe={recipe} prebatches={prebatches} />
    </AdminShell>
  );
}

