import { prisma } from '@/lib/db';
import EditRecipeClient from './ui';

export const dynamic = 'force-dynamic';

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-xl mx-auto p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          Not found
        </div>
      </main>
    );
  }
  return <EditRecipeClient recipe={recipe} />;
}

