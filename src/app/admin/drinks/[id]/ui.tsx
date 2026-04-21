'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Drink } from '@prisma/client';

type Option = { id: string; name: string };

export default function EditDrinkClient({
  drink,
  partners,
  categories,
}: {
  drink: Drink;
  partners: Option[];
  categories: Option[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    partnerId: drink.partnerId,
    categoryId: drink.categoryId,
    name: drink.name,
    nameEn: drink.nameEn,
    image: drink.image ?? '',
    description: drink.description,
    descriptionEn: drink.descriptionEn,
    status: drink.status,
  });

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/drinks/${drink.id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          partnerId: form.partnerId,
          categoryId: form.categoryId,
          name: form.name.trim(),
          nameEn: form.nameEn.trim(),
          image: form.image.trim() || null,
          description: form.description.trim(),
          descriptionEn: form.descriptionEn.trim(),
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
    if (!confirm('Удалить напиток?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/drinks/${drink.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'DELETE_FAILED');
        return;
      }
      router.replace('/admin/drinks');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const input =
    'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';
  const label = 'block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide">
            {drink.name}
          </h1>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">id: {drink.id}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>partner</label>
              <select className={input} value={form.partnerId} onChange={(e) => onChange('partnerId', e.target.value)}>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>category</label>
              <select className={input} value={form.categoryId} onChange={(e) => onChange('categoryId', e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>name</label>
              <input className={input} value={form.name} onChange={(e) => onChange('name', e.target.value)} />
            </div>
            <div>
              <label className={label}>nameEn</label>
              <input className={input} value={form.nameEn} onChange={(e) => onChange('nameEn', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>image url</label>
            <input className={input} value={form.image} onChange={(e) => onChange('image', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>description</label>
              <textarea className={input} rows={4} value={form.description} onChange={(e) => onChange('description', e.target.value)} />
            </div>
            <div>
              <label className={label}>descriptionEn</label>
              <textarea className={input} rows={4} value={form.descriptionEn} onChange={(e) => onChange('descriptionEn', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>status</label>
            <select className={input} value={form.status} onChange={(e) => onChange('status', e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
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

