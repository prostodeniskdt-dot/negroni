import Link from 'next/link';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CabinetPage() {
  const session = await getSession();
  const isAdmin = session?.role === 'admin';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[1100px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl font-bold uppercase tracking-wide">
            Кабинет
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {session ? `Вы вошли как ${session.email}` : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isAdmin && (
          <Link
            href="/admin"
            className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-campari)] bg-[var(--color-surface)] hover:border-[var(--color-campari-light)] transition-colors"
          >
            <div className="font-semibold text-[var(--color-text-primary)]">Админ-панель</div>
            <div className="text-sm text-[var(--color-text-muted)] mt-1">
              Редактор рецептов, партнёров, алкоголя и метрики.
            </div>
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/admin/metrics"
            className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
          >
            <div className="font-semibold text-[var(--color-text-primary)]">Метрика</div>
            <div className="text-sm text-[var(--color-text-muted)] mt-1">
              Статистика действий пользователей.
            </div>
          </Link>
        )}
        <Link
          href="/favorites"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Избранное</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            Список сохранённых рецептов.
          </div>
        </Link>
        <Link
          href="/cabinet/collections"
          className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-campari)] transition-colors"
        >
          <div className="font-semibold text-[var(--color-text-primary)]">Подборки</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            Создавайте подборки рецептов и делитесь ими.
          </div>
        </Link>
      </div>
    </main>
  );
}

