import { prisma } from '@/lib/db';
import EditDrinkClient from './ui';

export const dynamic = 'force-dynamic';

export default async function EditDrinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drink = await prisma.drink.findUnique({ where: { id } });
  if (!drink) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-xl mx-auto p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          Not found
        </div>
      </main>
    );
  }
  const partners = await prisma.partner.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
  const categories = await prisma.drinkCategory.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
  return <EditDrinkClient drink={drink} partners={partners} categories={categories} />;
}

