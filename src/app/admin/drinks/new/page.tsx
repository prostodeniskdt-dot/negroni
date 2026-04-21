'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Option = { id: string; name: string };

export default function NewDrinkPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partners, setPartners] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);

  const [form, setForm] = useState({
    id: '',
    categoryId: '',
    partnerId: '',
    name: '',
    nameEn: '',
    image: '',
    description: '',
    descriptionEn: '',
    status: 'published',
  });

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/meta/partners').then((r) => r.json()),
      fetch('/api/admin/meta/drink-categories').then((r) => r.json()),
    ])
      .then(([p, c]) => {
        setPartners(p.partners || []);
        setCategories(c.categories || []);
        if (!form.partnerId && p.partners?.[0]?.id) onChange('partnerId', p.partners[0].id);
        if (!form.categoryId && c.categories?.[0]?.id) onChange('categoryId', c.categories[0].id);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/drinks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: form.id.trim(),
          categoryId: form.categoryId,
          partnerId: form.partnerId,
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
        setError(j?.error || 'CREATE_FAILED');
        return;
      }
      const j = await res.json();
      router.replace(`/admin/drinks/${j.drink.id}`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';
  const label = 'block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[900px] mx-auto">
      <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide mb-6">
        Новый напиток
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
          <div>
            <label className={label}>id</label>
            <input className={input} value={form.id} onChange={(e) => onChange('id', e.target.value)} required />
          </div>
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
              <input className={input} value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
            </div>
            <div>
              <label className={label}>nameEn</label>
              <input className={input} value={form.nameEn} onChange={(e) => onChange('nameEn', e.target.value)} required />
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
          disabled={submitting}
          className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
        >
          {submitting ? 'Создаём…' : 'Создать'}
        </button>
      </form>
    </main>
  );
}

