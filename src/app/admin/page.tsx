import Link from 'next/link';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen px-6 py-10 max-w-[1000px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl font-bold uppercase tracking-wide">
            Редактор
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {session ? `Вы вошли как ${session.email} (${session.role})` : ''}
          </p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors">
            Выйти
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/recipes"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Рецепты</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            Создание и публикация рецептов Негрони.
          </div>
        </Link>
        <Link
          href="/admin/prebatches"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Заготовки</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            Библиотека заготовок (prebatch).
          </div>
        </Link>
        <Link
          href="/admin/partners"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Партнёры</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            Партнёры, категории и каталог алкоголя.
          </div>
        </Link>
        <Link
          href="/admin/import"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Импорт</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            Перенос данных из `src/data/*.ts` в PostgreSQL.
          </div>
        </Link>
      </div>
    </main>
  );
}

