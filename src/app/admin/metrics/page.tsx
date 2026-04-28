import Link from 'next/link';
import type { EventType } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';
import { AdminShell } from '@/components/AdminShell';

export const dynamic = 'force-dynamic';

const eventLabels: Record<EventType, string> = {
  page_view: 'Просмотры страниц',
  time_on_page: 'Время на странице',
  favorite_add: 'Добавили в избранное',
  favorite_remove: 'Убрали из избранного',
  collection_create: 'Создали подборку',
  collection_delete: 'Удалили подборку',
  collection_add: 'Добавили в подборку',
  collection_remove: 'Убрали из подборки',
  share_create: 'Создали ссылку',
  pdf_export: 'PDF-экспорт',
};

const eventColors: Record<EventType, string> = {
  page_view: '#BB0A30',
  time_on_page: '#D91B3E',
  favorite_add: '#f8cf2c',
  favorite_remove: '#8B1538',
  collection_create: '#22c55e',
  collection_delete: '#f59e0b',
  collection_add: '#38bdf8',
  collection_remove: '#a78bfa',
  share_create: '#fb7185',
  pdf_export: '#f97316',
};

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function AdminMetricsPage() {
  const session = await getSession();
  requireRole(session, ['admin']);

  const now = new Date();
  const last24hDate = new Date(now.getTime() - DAY_MS);
  const last7dDate = new Date(now.getTime() - 6 * DAY_MS);
  const last30dDate = new Date(now.getTime() - 29 * DAY_MS);

  const [
    total,
    last24h,
    pageViews,
    favoriteAdds,
    pdfExports,
    shares,
    typeGroups,
    last30Events,
    topPages,
    topRecipes,
    uniqueSessions,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { ts: { gte: last24hDate } } }),
    prisma.event.count({ where: { type: 'page_view' } }),
    prisma.event.count({ where: { type: 'favorite_add' } }),
    prisma.event.count({ where: { type: 'pdf_export' } }),
    prisma.event.count({ where: { type: 'share_create' } }),
    prisma.event.groupBy({
      by: ['type'],
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.event.findMany({
      where: { ts: { gte: last30dDate } },
      select: { ts: true, type: true },
      orderBy: { ts: 'asc' },
    }),
    prisma.event.groupBy({
      by: ['path'],
      where: { type: 'page_view' },
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ['recipeId'],
      where: { type: 'page_view', recipeId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ['sessionId'],
      where: { ts: { gte: last30dDate } },
      _count: { _all: true },
    }),
  ]);

  const last7Days = buildDailySeries(last30Events, 7);
  const last30Days = buildDailySeries(last30Events, 30);
  const maxPageViews = Math.max(1, ...topPages.map((page) => page._count._all));
  const maxRecipeViews = Math.max(1, ...topRecipes.map((recipe) => recipe._count._all));
  const typeTotal = Math.max(1, typeGroups.reduce((sum, item) => sum + item._count._all, 0));

  const recipeNames = topRecipes.length
    ? await prisma.recipe.findMany({
        where: { id: { in: topRecipes.map((x) => x.recipeId!).filter(Boolean) } },
        select: { id: true, name: true, slug: true },
      })
    : [];
  const recipeById = new Map(recipeNames.map((r) => [r.id, r]));

  return (
    <AdminShell
      title="Метрика"
      description="Сводка по событиям, активности пользователей, популярным страницам и рецептам."
      backHref="/admin"
      backLabel="К панели редакции"
      actions={
        <Link
          href="/collection"
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]"
        >
          Открыть сайт
        </Link>
      }
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Всего событий" value={total} hint="за всё время" />
          <MetricCard label="За 24 часа" value={last24h} hint="живая активность" />
          <MetricCard label="Просмотры" value={pageViews} hint="page_view" />
          <MetricCard label="Сессии 30д" value={uniqueSessions.length} hint="уникальные sessionId" />
          <MetricCard label="Избранное" value={favoriteAdds} hint="добавления" />
          <MetricCard label="PDF / Share" value={pdfExports + shares} hint={`${pdfExports} PDF · ${shares} ссылок`} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Активность за 30 дней" subtitle="Линейный график по всем событиям">
            <LineChart data={last30Days} />
          </Panel>

          <Panel title="События по типам" subtitle="Доля каждого типа события">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr] xl:grid-cols-1">
              <DonutChart groups={typeGroups.map((item) => ({
                label: eventLabels[item.type],
                value: item._count._all,
                color: eventColors[item.type],
              }))} total={typeTotal} />
              <div className="space-y-3">
                {typeGroups.map((item) => (
                  <LegendRow
                    key={item.type}
                    color={eventColors[item.type]}
                    label={eventLabels[item.type]}
                    value={item._count._all}
                    percent={Math.round((item._count._all / typeTotal) * 100)}
                  />
                ))}
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel title="Топ страниц" subtitle="Самые посещаемые маршруты">
            <div className="space-y-4">
              {topPages.length ? topPages.map((page) => (
                <BarRow
                  key={page.path}
                  label={page.path}
                  value={page._count._all}
                  percent={Math.round((page._count._all / maxPageViews) * 100)}
                />
              )) : <EmptyState text="Пока нет просмотров страниц." />}
            </div>
          </Panel>

          <Panel title="Топ рецептов" subtitle="Рецепты с наибольшим числом просмотров">
            <div className="space-y-4">
              {topRecipes.length ? topRecipes.map((recipe) => {
                const rr = recipe.recipeId ? recipeById.get(recipe.recipeId) : null;
                const label = rr ? `${rr.name} · ${rr.slug}` : String(recipe.recipeId);
                return (
                  <BarRow
                    key={String(recipe.recipeId)}
                    label={label}
                    value={recipe._count._all}
                    percent={Math.round((recipe._count._all / maxRecipeViews) * 100)}
                  />
                );
              }) : <EmptyState text="Пока нет просмотров рецептов." />}
            </div>
          </Panel>
        </section>

        <Panel title="Последние 7 дней" subtitle="Мини-heatmap активности">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-7">
            {last7Days.map((day) => (
              <div key={day.key} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]/35 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">{day.label}</div>
                <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{day.value}</div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-campari)]"
                    style={{ width: `${Math.min(100, Math.round((day.value / Math.max(1, ...last7Days.map((x) => x.value))) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}

function buildDailySeries(events: { ts: Date }[], days: number) {
  const today = startOfDay(new Date());
  const result = Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getTime() - (days - 1 - index) * DAY_MS);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      value: 0,
    };
  });
  const byKey = new Map(result.map((item) => [item.key, item]));
  events.forEach((event) => {
    const key = startOfDay(event.ts).toISOString().slice(0, 10);
    const item = byKey.get(key);
    if (item) item.value += 1;
  });
  return result;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function MetricCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">{label}</div>
      <div className="mt-2 text-3xl font-bold text-[var(--color-text-primary)] tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-5">
        <h2 className="text-xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">{title}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function LineChart({ data }: { data: { key: string; label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  const width = 720;
  const height = 220;
  const padding = 24;
  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - (item.value / max) * (height - padding * 2);
    return { ...item, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]/35 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full">
        <defs>
          <linearGradient id="metricsLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#BB0A30" />
            <stop offset="100%" stopColor="#f8cf2c" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = padding + line * ((height - padding * 2) / 3);
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />;
        })}
        <path d={path} fill="none" stroke="url(#metricsLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.key}>
            <circle cx={point.x} cy={point.y} r="5" fill="#BB0A30" stroke="#f8cf2c" strokeWidth="2" />
            <text x={point.x} y={height - 4} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.55)">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function DonutChart({ groups, total }: { groups: { label: string; value: number; color: string }[]; total: number }) {
  let offset = 0;
  const gradient = groups.length
    ? groups.map((group) => {
        const start = offset;
        const end = offset + (group.value / total) * 100;
        offset = end;
        return `${group.color} ${start}% ${end}%`;
      }).join(', ')
    : 'rgba(255,255,255,0.08) 0% 100%';

  return (
    <div className="mx-auto flex h-[210px] w-[210px] items-center justify-center rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
      <div className="flex h-[128px] w-[128px] flex-col items-center justify-center rounded-full bg-[var(--color-surface-solid)] text-center">
        <div className="text-3xl font-bold text-[var(--color-text-primary)]">{total}</div>
        <div className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">событий</div>
      </div>
    </div>
  );
}

function LegendRow({ color, label, value, percent }: { color: string; label: string; value: number; percent: number }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="truncate text-[var(--color-text-muted)]">{label}</span>
      </div>
      <div className="shrink-0 text-[var(--color-text-primary)] tabular-nums">{value} · {percent}%</div>
    </div>
  );
}

function BarRow({ label, value, percent }: { label: string; value: number; percent: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-[var(--color-text-primary)]">{label}</span>
        <span className="shrink-0 text-[var(--color-text-muted)] tabular-nums">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-campari)] to-[var(--color-accent)]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/25 p-6 text-center text-sm text-[var(--color-text-muted)]">
      {text}
    </div>
  );
}

