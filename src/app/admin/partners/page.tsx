import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminPartnersPage() {
  const [partnersCount, categoriesCount, drinksCount] = await Promise.all([
    prisma.partner.count(),
    prisma.drinkCategory.count(),
    prisma.drink.count(),
  ]);

  return (
    <main className="min-h-screen px-6 pb-10 pt-24 max-w-[1000px] mx-auto">
      <Link
        href="/admin"
        className="mb-4 inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)]"
      >
        ← К панели редакции
      </Link>
      <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide mb-2">
        Партнёры и алкоголь
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Партнёры: {partnersCount} · Категории: {categoriesCount} · Напитки: {drinksCount}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/drinks"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Каталог напитков</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            CRUD по напиткам партнёров.
          </div>
        </Link>

        <Link
          href="/admin/import"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Импорт партнёров</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            Заполнить партнёров/категории/напитки из `src/data/partners.ts`.
          </div>
        </Link>
      </div>
    </main>
  );
}

