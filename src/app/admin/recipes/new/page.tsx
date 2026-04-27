import { prisma } from '@/lib/db';
import { AdminShell } from '@/components/AdminShell';
import { RecipeForm } from '@/components/RecipeForm';

export const dynamic = 'force-dynamic';

export default async function NewRecipePage() {
  const prebatches = await prisma.prebatch.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <AdminShell
      title="Новый рецепт"
      description="Создайте карточку рецепта через понятные секции: фото, география, автор, состав, шаги, вкус и публикация."
      backHref="/admin/recipes"
      backLabel="К списку рецептов"
    >
      <RecipeForm mode="create" prebatches={prebatches} />
    </AdminShell>
  );
}

