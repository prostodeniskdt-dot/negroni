'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusPill } from '@/components/AdminShell';

export type RecipeListItem = {
  id: string;
  slug: string;
  name: string;
  region: string;
  city: string;
  author: string;
  bar: string;
  category: string;
  difficulty: string;
  image: string;
  status: string;
  updatedAt: string | Date;
};

const statusLabels: Record<string, string> = {
  all: 'Все статусы',
  published: 'Опубликованы',
  draft: 'Черновики',
  archived: 'Архив',
};

const difficultyLabels: Record<string, string> = {
  all: 'Любая сложность',
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
};

export function RecipeList({
  recipes,
  canImport = false,
  sourceRecipeCount = 0,
}: {
  recipes: RecipeListItem[];
  canImport?: boolean;
  sourceRecipeCount?: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [region, setRegion] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RecipeListItem | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regions = useMemo(
    () => Array.from(new Set(recipes.map((recipe) => recipe.region).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'ru')),
    [recipes]
  );

  const counts = useMemo(() => {
    const byStatus = recipes.reduce<Record<string, number>>((acc, recipe) => {
      acc[recipe.status] = (acc[recipe.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      total: recipes.length,
      published: byStatus.published ?? 0,
      draft: byStatus.draft ?? 0,
      archived: byStatus.archived ?? 0,
    };
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesQuery =
        !normalizedQuery ||
        [recipe.name, recipe.slug, recipe.region, recipe.city, recipe.author, recipe.bar, recipe.category]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = status === 'all' || recipe.status === status;
      const matchesDifficulty = difficulty === 'all' || recipe.difficulty === difficulty;
      const matchesRegion = region === 'all' || recipe.region === region;
      return matchesQuery && matchesStatus && matchesDifficulty && matchesRegion;
    });
  }, [difficulty, query, recipes, region, status]);

  const importSourceRecipes = async () => {
    setImporting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/import/seed', { method: 'POST' });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json?.error === 'FORBIDDEN' ? 'Импорт доступен только администратору' : json?.error || 'Не удалось импортировать рецепты');
        return;
      }
      router.refresh();
    } finally {
      setImporting(false);
    }
  };

  const deleteRecipe = async (recipe: RecipeListItem) => {
    setDeletingId(recipe.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/recipes/${recipe.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json?.error || 'Не удалось удалить рецепт');
        return;
      }
      setPendingDelete(null);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Всего" value={counts.total} />
        <StatCard label="Опубликовано" value={counts.published} />
        <StatCard label="Черновики" value={counts.draft} />
        <StatCard label="Архив" value={counts.archived} />
      </section>

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
              Поиск
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название, slug, город, бар, автор..."
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-campari)]"
            />
          </label>
          <SelectFilter label="Статус" value={status} onChange={setStatus} options={statusLabels} />
          <SelectFilter label="Сложность" value={difficulty} onChange={setDifficulty} options={difficultyLabels} />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
              Регион
            </span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-campari)]"
            >
              <option value="all">Все регионы</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-campari)]/50 bg-[var(--color-campari)]/10 px-4 py-3 text-sm text-[var(--color-text-primary)]">
          {error}
        </div>
      )}

      {recipes.length === 0 ? (
        <section className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-campari)]/50 bg-[var(--color-surface)] p-8 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-campari)]">
              База рецептов пуста
            </div>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
              Существующие рецепты ещё не импортированы
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              На публичной части сайта могут использоваться исходные данные из `src/data/recipes.ts`, а редактор работает с базой данных.
              Импорт перенесёт {sourceRecipeCount || 'текущие'} рецептов в редактор.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {canImport && (
                <button
                  type="button"
                  onClick={() => void importSourceRecipes()}
                  disabled={importing}
                  className="rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-5 py-3 font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)] disabled:opacity-50"
                >
                  {importing ? 'Импортируем...' : 'Импортировать существующие рецепты'}
                </button>
              )}
              <Link
                href="/admin/import"
                className="inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border)] px-5 py-3 font-semibold transition-colors hover:border-[var(--color-campari)]"
              >
                Открыть раздел импорта
              </Link>
              <Link
                href="/admin/recipes/new"
                className="inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border)] px-5 py-3 font-semibold transition-colors hover:border-[var(--color-campari)]"
              >
                Создать вручную
              </Link>
            </div>
            {!canImport && (
              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                Если вы редактор, попросите администратора выполнить импорт.
              </p>
            )}
          </div>
        </section>
      ) : filteredRecipes.length === 0 ? (
        <section className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
            Рецепты не найдены
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
            Измените фильтры или создайте новый рецепт, если коллекция ещё не заполнена.
          </p>
          <Link
            href="/admin/recipes/new"
            className="mt-5 inline-flex rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-5 py-3 font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
          >
            Создать рецепт
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredRecipes.map((recipe) => (
            <article
              key={recipe.id}
              className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--color-campari)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                <Link
                  href={`/admin/recipes/${recipe.id}`}
                  className="min-h-[180px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${recipe.image})` }}
                  aria-label={`Редактировать ${recipe.name}`}
                />
                <div className="flex min-w-0 flex-col gap-4 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/recipes/${recipe.id}`}
                        className="block truncate text-xl font-bold uppercase tracking-wide text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-campari)]"
                      >
                        {recipe.name}
                      </Link>
                      <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {recipe.region} · {recipe.city} · {recipe.slug}
                      </div>
                    </div>
                    <StatusPill status={recipe.status} />
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-[var(--color-text-muted)] sm:grid-cols-2">
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Автор:</span> {recipe.author || '—'}
                    </div>
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Бар:</span> {recipe.bar || '—'}
                    </div>
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Категория:</span> {recipe.category || '—'}
                    </div>
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Обновлено:</span>{' '}
                      {new Date(recipe.updatedAt).toLocaleString('ru-RU')}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    <Link
                      href={`/admin/recipes/${recipe.id}`}
                      className="rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-4 py-2 text-sm font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
                    >
                      Редактировать
                    </Link>
                    <a
                      href={`/recipe/${recipe.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]"
                    >
                      Открыть на сайте
                    </a>
                    <button
                      type="button"
                      disabled={deletingId === recipe.id}
                      onClick={() => setPendingDelete(recipe)}
                      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
                    >
                      {deletingId === recipe.id ? 'Удаляем...' : 'Удалить'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-6 shadow-[var(--shadow-lg)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-campari)]">
              Опасное действие
            </div>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
              Удалить рецепт?
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Рецепт “{pendingDelete.name}” будет удалён из редактора и связанных коллекций. Это действие нельзя отменить.
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={deletingId === pendingDelete.id}
                onClick={() => void deleteRecipe(pendingDelete)}
                className="rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-4 py-2 text-sm font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)] disabled:opacity-50"
              >
                {deletingId === pendingDelete.id ? 'Удаляем...' : 'Удалить навсегда'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">{label}</div>
      <div className="mt-1 text-3xl font-bold text-[var(--color-text-primary)]">{value}</div>
    </div>
  );
}

function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-campari)]"
      >
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
