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
    tagline: '',
    taglineEn: '',
    description: '',
    descriptionEn: '',
    producer: '',
    producerEn: '',
    origin: '',
    originEn: '',
    abv: '',
    volume: '',
    tastingNotes: '',
    serve: '',
    serveEn: '',
    buyUrl: '',
    buyLabel: '',
    buyLabelEn: '',
    purchaseNote: '',
    purchaseNoteEn: '',
    recipeHints: '',
    sortOrder: '0',
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
          tagline: form.tagline.trim() || null,
          taglineEn: form.taglineEn.trim() || null,
          description: form.description.trim(),
          descriptionEn: form.descriptionEn.trim(),
          producer: form.producer.trim() || null,
          producerEn: form.producerEn.trim() || null,
          origin: form.origin.trim() || null,
          originEn: form.originEn.trim() || null,
          abv: form.abv.trim() || null,
          volume: form.volume.trim() || null,
          tastingNotes: form.tastingNotes.trim() || null,
          serve: form.serve.trim() || null,
          serveEn: form.serveEn.trim() || null,
          buyUrl: form.buyUrl.trim() || null,
          buyLabel: form.buyLabel.trim() || null,
          buyLabelEn: form.buyLabelEn.trim() || null,
          purchaseNote: form.purchaseNote.trim() || null,
          purchaseNoteEn: form.purchaseNoteEn.trim() || null,
          recipeHints: form.recipeHints.trim() || null,
          sortOrder: Number(form.sortOrder) || 0,
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
    <main className="min-h-screen px-6 pb-10 pt-24 max-w-[900px] mx-auto">
      <h1 className="type-page-title text-2xl mb-6">
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
              <label className={label}>tagline</label>
              <input className={input} value={form.tagline} onChange={(e) => onChange('tagline', e.target.value)} />
            </div>
            <div>
              <label className={label}>taglineEn</label>
              <input className={input} value={form.taglineEn} onChange={(e) => onChange('taglineEn', e.target.value)} />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>producer</label>
              <input className={input} value={form.producer} onChange={(e) => onChange('producer', e.target.value)} />
            </div>
            <div>
              <label className={label}>producerEn</label>
              <input className={input} value={form.producerEn} onChange={(e) => onChange('producerEn', e.target.value)} />
            </div>
            <div>
              <label className={label}>origin</label>
              <input className={input} value={form.origin} onChange={(e) => onChange('origin', e.target.value)} />
            </div>
            <div>
              <label className={label}>originEn</label>
              <input className={input} value={form.originEn} onChange={(e) => onChange('originEn', e.target.value)} />
            </div>
            <div>
              <label className={label}>abv</label>
              <input className={input} value={form.abv} onChange={(e) => onChange('abv', e.target.value)} placeholder="40%" />
            </div>
            <div>
              <label className={label}>volume</label>
              <input className={input} value={form.volume} onChange={(e) => onChange('volume', e.target.value)} placeholder="700 мл" />
            </div>
          </div>
          <div>
            <label className={label}>tasting notes (через запятую)</label>
            <input className={input} value={form.tastingNotes} onChange={(e) => onChange('tastingNotes', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>serve</label>
              <textarea className={input} rows={3} value={form.serve} onChange={(e) => onChange('serve', e.target.value)} />
            </div>
            <div>
              <label className={label}>serveEn</label>
              <textarea className={input} rows={3} value={form.serveEn} onChange={(e) => onChange('serveEn', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>buyUrl</label>
              <input className={input} value={form.buyUrl} onChange={(e) => onChange('buyUrl', e.target.value)} />
            </div>
            <div>
              <label className={label}>buyLabel</label>
              <input className={input} value={form.buyLabel} onChange={(e) => onChange('buyLabel', e.target.value)} />
            </div>
            <div>
              <label className={label}>buyLabelEn</label>
              <input className={input} value={form.buyLabelEn} onChange={(e) => onChange('buyLabelEn', e.target.value)} />
            </div>
            <div>
              <label className={label}>sortOrder</label>
              <input className={input} type="number" value={form.sortOrder} onChange={(e) => onChange('sortOrder', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>purchaseNote</label>
              <textarea className={input} rows={3} value={form.purchaseNote} onChange={(e) => onChange('purchaseNote', e.target.value)} />
            </div>
            <div>
              <label className={label}>purchaseNoteEn</label>
              <textarea className={input} rows={3} value={form.purchaseNoteEn} onChange={(e) => onChange('purchaseNoteEn', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>recipeHints (ID рецептов или подсказки через запятую)</label>
            <input className={input} value={form.recipeHints} onChange={(e) => onChange('recipeHints', e.target.value)} />
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

