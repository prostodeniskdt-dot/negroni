import Link from 'next/link';

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const adminNav = [
  { href: '/admin/recipes', label: 'Рецепты', desc: 'Редакция карточек' },
  { href: '/admin/prebatches', label: 'Заготовки', desc: 'Prebatch' },
  { href: '/admin/drinks', label: 'Напитки', desc: 'Каталог партнёров' },
  { href: '/admin/partners', label: 'Партнёры', desc: 'Бренды и категории' },
  { href: '/admin/metrics', label: 'Метрика', desc: 'События' },
];

export function AdminShell({
  title,
  eyebrow = 'Редакция сайта',
  description,
  backHref,
  backLabel = 'Назад',
  actions,
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen px-4 pb-8 pt-24 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-6 lg:flex-row">
        <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-[260px]">
          <Link
            href="/admin"
            className="block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--color-campari)]"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-campari)]">
              Negroni
            </div>
            <div className="mt-1 text-2xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
              Редакция
            </div>
            <div className="mt-2 text-sm text-[var(--color-text-muted)]">
              Управление контентом сайта без технической путаницы.
            </div>
          </Link>

          <nav className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Разделы редакции">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]/35 px-4 py-3 transition-colors hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]/10"
              >
                <span className="block text-sm font-semibold text-[var(--color-text-primary)]">{item.label}</span>
                <span className="block text-xs text-[var(--color-text-secondary)]">{item.desc}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                {backHref && (
                  <Link
                    href={backHref}
                    className="mb-4 inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)]"
                  >
                    ← {backLabel}
                  </Link>
                )}
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-campari)]">
                  {eyebrow}
                </div>
                <h1 className="mt-2 type-page-title text-3xl text-[var(--color-text-primary)] md:text-4xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-2 max-w-3xl text-sm text-[var(--color-text-muted)] md:text-base">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}

export function StatusPill({ status }: { status: string }) {
  const label = status === 'published' ? 'Опубликован' : status === 'draft' ? 'Черновик' : 'Архив';
  const tone =
    status === 'published'
      ? 'border-[var(--color-success)]/40 text-[var(--color-success)] bg-[var(--color-success)]/10'
      : status === 'draft'
        ? 'border-[var(--color-warning)]/40 text-[var(--color-warning)] bg-[var(--color-warning)]/10'
        : 'border-[var(--color-border)] text-[var(--color-text-muted)] bg-[var(--color-bg)]/40';

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}
