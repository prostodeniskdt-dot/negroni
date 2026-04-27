import Link from 'next/link';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CabinetPage() {
  const session = await getSession();
  const isAdmin = session?.role === 'admin';
  const isEditor = session?.role === 'editor' || isAdmin;

  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-[1180px]">
      <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-campari)]">
            Личный кабинет
          </div>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl font-bold uppercase tracking-wide md:text-4xl">
            Добро пожаловать
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {session ? `Вы вошли как ${session.email}. Роль: ${session.role}.` : 'Вы не авторизованы.'}
          </p>
        </div>
          {isEditor && (
            <Link
              href="/admin/recipes"
              className="inline-flex rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-5 py-3 font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
            >
              Открыть редакцию рецептов
            </Link>
          )}
        </div>
      </section>

      {isEditor && (
        <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--color-campari)]/40 bg-[var(--color-campari)]/10 p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
                Редакция сайта
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Быстрый доступ к рецептам, публикации и рабочим разделам админки.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Link className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]" href="/admin/recipes">
                Все рецепты
              </Link>
              <Link className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]" href="/admin/recipes/new">
                Добавить рецепт
              </Link>
              {isAdmin && (
                <Link className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]" href="/admin/metrics">
                  Метрика
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isEditor && (
          <Link
            href="/admin"
            className="block p-5 rounded-[var(--radius-lg)] border border-[var(--color-campari)] bg-[var(--color-surface)] hover:border-[var(--color-campari-light)] transition-colors"
          >
            <div className="font-semibold text-[var(--color-text-primary)]">Панель редакции</div>
            <div className="text-sm text-[var(--color-text-muted)] mt-1">
              Рецепты, партнёры, алкоголь, заготовки и метрика.
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
      </div>
    </main>
  );
}

