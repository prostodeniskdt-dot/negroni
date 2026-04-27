'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type CollectionSummary = { id: string; name: string; itemsCount: number; updatedAt: string };

export default function CollectionsClient() {
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    setLoading(true);
    setError(null);
    fetch('/api/me/collections')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j) => setCollections(Array.isArray(j?.collections) ? j.collections : []))
      .catch(() => setError('LOAD_FAILED'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const onCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/me/collections', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'CREATE_FAILED');
        return;
      }
      setName('');
      reload();
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Удалить подборку?')) return;
    setError(null);
    const res = await fetch(`/api/me/collections/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || 'DELETE_FAILED');
      return;
    }
    reload();
  };

  const sorted = useMemo(
    () => [...collections].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [collections]
  );

  const input = 'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[1100px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide">
            Подборки
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Соберите несколько рецептов в один документ или ссылку.
          </p>
        </div>
        <Link href="/cabinet" className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors">
          Назад
        </Link>
      </div>

      <section className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-col sm:flex-row gap-3">
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Название подборки" />
          <button
            disabled={creating || name.trim().length < 1}
            onClick={onCreate}
            className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
          >
            {creating ? 'Создаём…' : 'Создать'}
          </button>
        </div>
      </section>

      {error && <div className="mt-4 text-sm text-[var(--color-campari)]">{error}</div>}

      <section className="mt-6">
        {loading ? (
          <div className="text-sm text-[var(--color-text-muted)]">Загрузка…</div>
        ) : sorted.length === 0 ? (
          <div className="text-sm text-[var(--color-text-muted)]">Пока нет подборок.</div>
        ) : (
          <div className="space-y-3">
            {sorted.map((c) => (
              <div key={c.id} className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[var(--color-text-primary)]">{c.name}</div>
                  <div className="text-sm text-[var(--color-text-muted)] mt-1">
                    {c.itemsCount} рецептов · обновлено {new Date(c.updatedAt).toLocaleString('ru-RU')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/cabinet/collections/${c.id}`}
                    className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
                  >
                    Открыть
                  </Link>
                  <button
                    onClick={() => onDelete(c.id)}
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

