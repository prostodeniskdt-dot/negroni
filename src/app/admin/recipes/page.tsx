import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminRecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, slug: true, name: true, region: true, status: true, updatedAt: true },
  });

  return (
    <main className="min-h-screen px-6 py-10 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide">
            Рецепты
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {recipes.length} шт.
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors"
        >
          Новый рецепт
        </Link>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
          <div>Slug</div>
          <div>Название</div>
          <div>Статус</div>
          <div>Обновлено</div>
        </div>
        {recipes.map((r) => (
          <Link
            key={r.id}
            href={`/admin/recipes/${r.id}`}
            className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 px-4 py-3 border-b border-[var(--color-border)] hover:bg-[var(--color-bg)]/40 transition-colors"
          >
            <div className="text-sm text-[var(--color-text-muted)]">{r.slug}</div>
            <div className="text-sm text-[var(--color-text-primary)] font-medium">{r.name}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{r.status}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{new Date(r.updatedAt).toLocaleString('ru-RU')}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}

