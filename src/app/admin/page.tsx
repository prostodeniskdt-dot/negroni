import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { AdminShell } from '@/components/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const session = await getSession();
  const sections = [
    {
      href: '/admin/recipes',
      title: 'Рецепты',
      desc: 'Полный редактор рецептов: список, фото, статусы, ингредиенты и предпросмотр.',
      action: 'Открыть редактор',
    },
    {
      href: '/admin/recipes/new',
      title: 'Новый рецепт',
      desc: 'Быстро создать карточку, сохранить черновик или сразу опубликовать.',
      action: 'Добавить',
    },
    {
      href: '/admin/prebatches',
      title: 'Заготовки',
      desc: 'Библиотека prebatch для повторного использования в рецептах.',
      action: 'Управлять',
    },
    {
      href: '/admin/partners',
      title: 'Партнёры и напитки',
      desc: 'Каталог партнёров, категорий и алкоголя для сайта.',
      action: 'Перейти',
    },
    {
      href: '/admin/metrics',
      title: 'Метрика',
      desc: 'Статистика действий пользователей: страницы, рецепты, экспорт.',
      action: 'Смотреть',
    },
    {
      href: '/admin/import',
      title: 'Импорт',
      desc: 'Перенос данных из исходных файлов в PostgreSQL.',
      action: 'Импортировать',
    },
  ];

  return (
    <AdminShell
      title="Панель редакции"
      description={session ? `Вы вошли как ${session.email} (${session.role}). Выберите рабочий раздел или начните с рецептов.` : 'Выберите рабочий раздел.'}
      actions={
        <form action="/api/auth/logout" method="post">
          <button className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-campari)]">
            Выйти
          </button>
        </form>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex min-h-[190px] flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--color-campari)]"
          >
            <div>
              <div className="text-xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
                {section.title}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{section.desc}</p>
            </div>
            <span className="mt-6 inline-flex w-fit rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-4 py-2 text-sm font-semibold text-[var(--color-on-campari)] transition-colors group-hover:bg-[var(--color-campari-light)]">
              {section.action}
            </span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}

