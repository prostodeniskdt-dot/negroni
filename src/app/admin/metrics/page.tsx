import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminMetricsPage() {
  const session = await getSession();
  requireRole(session, ['admin']);

  const total = await prisma.event.count();
  const last24h = await prisma.event.count({ where: { ts: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });

  const topPages = await prisma.event.groupBy({
    by: ['path'],
    where: { type: 'page_view' },
    _count: { _all: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  const topRecipes = await prisma.event.groupBy({
    by: ['recipeId'],
    where: { type: 'page_view', recipeId: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  const recipeNames = topRecipes.length
    ? await prisma.recipe.findMany({
        where: { id: { in: topRecipes.map((x) => x.recipeId!).filter(Boolean) } },
        select: { id: true, name: true, slug: true },
      })
    : [];
  const recipeById = new Map(recipeNames.map((r) => [r.id, r]));

  return (
    <main className="min-h-screen px-6 pb-10 pt-24 max-w-[1100px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl font-bold uppercase tracking-wide">
            Метрика
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            События: {total} · за 24ч: {last24h}
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
        >
          Назад
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <h2 className="font-[var(--font-display)] text-lg font-bold uppercase tracking-wide mb-4">
            Топ страниц
          </h2>
          <div className="space-y-2">
            {topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between gap-4 text-sm">
                <div className="text-[var(--color-text-primary)] truncate">{p.path}</div>
                <div className="text-[var(--color-text-muted)] tabular-nums">{p._count._all}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <h2 className="font-[var(--font-display)] text-lg font-bold uppercase tracking-wide mb-4">
            Топ рецептов
          </h2>
          <div className="space-y-2">
            {topRecipes.map((r) => {
              const rr = r.recipeId ? recipeById.get(r.recipeId) : null;
              const label = rr ? `${rr.name} (${rr.slug})` : String(r.recipeId);
              return (
                <div key={String(r.recipeId)} className="flex items-center justify-between gap-4 text-sm">
                  <div className="text-[var(--color-text-primary)] truncate">{label}</div>
                  <div className="text-[var(--color-text-muted)] tabular-nums">{r._count._all}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

