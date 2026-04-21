'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Prebatch } from '@prisma/client';

function joinLines(list: string[]) {
  return list.join('\n');
}

function splitLines(s: string): string[] {
  return s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function EditPrebatchClient({ prebatch }: { prebatch: Prebatch }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: prebatch.name,
    ingredients: joinLines(prebatch.ingredients),
    steps: joinLines(prebatch.steps),
    status: prebatch.status,
  });

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/prebatches/${prebatch.id}`, {
        method: 'PUT',
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
        setError(j?.error || 'SAVE_FAILED');
        return;
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('Удалить заготовку?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/prebatches/${prebatch.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'DELETE_FAILED');
        return;
      }
      router.replace('/admin/prebatches');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';
  const label = 'block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide">
            {prebatch.name}
          </h1>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">id: {prebatch.id}</div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
        >
          Удалить
        </button>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
          <div>
            <label className={label}>name</label>
            <input className={input} value={form.name} onChange={(e) => onChange('name', e.target.value)} />
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
            <label className={label}>ingredients</label>
            <textarea className={input} rows={8} value={form.ingredients} onChange={(e) => onChange('ingredients', e.target.value)} />
          </div>
          <div>
            <label className={label}>steps</label>
            <textarea className={input} rows={8} value={form.steps} onChange={(e) => onChange('steps', e.target.value)} />
          </div>
        </div>
        {error && <div className="text-sm text-[var(--color-campari)]">{error}</div>}
        <button
          disabled={saving}
          className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
        >
          {saving ? 'Сохраняем…' : 'Сохранить'}
        </button>
      </form>
    </main>
  );
}

