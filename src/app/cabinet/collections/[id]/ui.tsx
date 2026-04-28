'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { usePublicRecipes } from '@/hooks/usePublicRecipes';
import { getRecipeByIdFrom } from '@/lib/public-recipes';

type CollectionDetail = { id: string; name: string; slugs: string[]; updatedAt: string };

export default function CollectionDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';
  const { favorites } = useFavorites();
  const { recipes } = usePublicRecipes();

  const [data, setData] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState('');

  const reload = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/me/collections/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j) => {
        setData(j?.collection ?? null);
        setName(j?.collection?.name ?? '');
      })
      .catch(() => setError('LOAD_FAILED'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!id) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onRename = async () => {
    setRenaming(true);
    setError(null);
    try {
      const res = await fetch(`/api/me/collections/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'RENAME_FAILED');
        return;
      }
      reload();
    } finally {
      setRenaming(false);
    }
  };

  const addFromFavorites = async () => {
    setError(null);
    const res = await fetch(`/api/me/collections/${id}/items`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slugs: favorites }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || 'ADD_FAILED');
      return;
    }
    reload();
  };

  const share = async () => {
    setError(null);
    const res = await fetch('/api/me/share-links', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'collection', collectionId: id }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || 'SHARE_FAILED');
      return;
    }
    const j = await res.json().catch(() => ({}));
    const url = j?.url ? `${window.location.origin}${j.url}` : '';
    if (!url) return;
    await navigator.clipboard.writeText(url).catch(() => {});
    alert('Ссылка скопирована в буфер обмена.');
  };

  const pdfExport = () => {
    window.location.href = `/api/export/pdf?kind=collection&id=${encodeURIComponent(id)}`;
  };

  const remove = async (slug: string) => {
    setError(null);
    const res = await fetch(`/api/me/collections/${id}/items`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || 'REMOVE_FAILED');
      return;
    }
    reload();
  };

  const items = useMemo(() => (data?.slugs ?? []).map((slug) => ({ slug, entry: getRecipeByIdFrom(recipes, slug) })), [data?.slugs, recipes]);

  const input = 'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';

  if (loading) {
    return (
      <main className="min-h-screen px-6 pb-10 pt-24 max-w-[1100px] mx-auto">
        <div className="text-sm text-[var(--color-text-muted)]">Загрузка…</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen px-6 pb-10 pt-24 max-w-[1100px] mx-auto">
        <div className="text-sm text-[var(--color-text-muted)]">Подборка не найдена.</div>
        <div className="mt-4">
          <button onClick={() => router.replace('/cabinet/collections')} className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)]">
            Назад
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-10 pt-24 max-w-[1100px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide">
            {data.name}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {data.slugs.length} рецептов · обновлено {new Date(data.updatedAt).toLocaleString('ru-RU')}
          </p>
        </div>
        <Link href="/cabinet/collections" className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors">
          Назад
        </Link>
      </div>

      <section className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
        <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Название</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
          <button
            disabled={renaming || name.trim().length < 1}
            onClick={onRename}
            className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
          >
            {renaming ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={addFromFavorites}
            className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
          >
            Добавить всё из избранного
          </button>
          <button
            onClick={share}
            className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
          >
            Поделиться
          </button>
          <button
            onClick={pdfExport}
            className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
          >
            PDF
          </button>
        </div>
        {error && <div className="text-sm text-[var(--color-campari)]">{error}</div>}
      </section>

      <section className="mt-6">
        {items.length === 0 ? (
          <div className="text-sm text-[var(--color-text-muted)]">Пока нет рецептов в подборке.</div>
        ) : (
          <div className="space-y-3">
            {items.map(({ slug, entry }) => (
              <div key={slug} className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[var(--color-text-primary)]">
                    {entry?.recipe.name ?? slug}
                  </div>
                  {entry && (
                    <div className="text-sm text-[var(--color-text-muted)] mt-1">
                      {entry.recipe.region}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/recipe/${slug}`}
                    target="_blank"
                    className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
                  >
                    Открыть
                  </Link>
                  <button
                    onClick={() => remove(slug)}
                    className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

