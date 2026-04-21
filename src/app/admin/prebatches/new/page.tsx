'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function splitLines(s: string): string[] {
  return s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function NewPrebatchPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    ingredients: '',
    steps: '',
    status: 'published',
  });

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/prebatches', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          ingredients: splitLines(form.ingredients),
          steps: splitLines(form.steps),
          status: form.status,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'CREATE_FAILED');
        return;
      }
      const j = await res.json();
      router.replace(`/admin/prebatches/${j.prebatch.id}`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const input = 'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';
  const label = 'block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[900px] mx-auto">
      <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide mb-6">
        Новая заготовка
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
          <div>
            <label className={label}>name</label>
            <input className={input} value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
            <label className={label}>status</label>
            <select className={input} value={form.status} onChange={(e) => onChange('status', e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div>
            <label className={label}>ingredients (one per line)</label>
            <textarea className={input} rows={8} value={form.ingredients} onChange={(e) => onChange('ingredients', e.target.value)} />
          </div>
          <div>
            <label className={label}>steps (one per line)</label>
            <textarea className={input} rows={8} value={form.steps} onChange={(e) => onChange('steps', e.target.value)} />
          </div>
        </div>
        {error && <div className="text-sm text-[var(--color-campari)]">{error}</div>}
        <button
          disabled={submitting}
          className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
        >
          {submitting ? 'Создаём…' : 'Создать'}
        </button>
      </form>
    </main>
  );
}

