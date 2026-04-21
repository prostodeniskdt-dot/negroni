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
    <main className="min-h-screen px-6 py-10 max-w-[1000px] mx-auto">
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

