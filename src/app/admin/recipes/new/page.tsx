'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function splitLines(s: string): string[] {
  return s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
}

function splitTags(s: string): string[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function NewRecipePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: '',
    city: '',
    lat: '0',
    lng: '0',

    name: '',
    region: '',
    author: '',
    bar: '—',
    difficulty: 'easy',
    category: '',
    barDescription: '',
    barCity: '',
    tags: '',
    intro: '',
    image: '',
    method: 'Stir',
    glass: 'Rocks',
    garnish: '',
    ice: '',
    prebatchMode: 'text',
    prebatchText: '',
    flavorBitter: '0',
    flavorSweet: '0',
    flavorSour: '0',
    flavorSpicy: '0',
    flavorStrong: '0',
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
      const res = await fetch('/api/admin/recipes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: form.slug.trim(),
          city: form.city.trim(),
          lat: Number(form.lat),
          lng: Number(form.lng),
          name: form.name.trim(),
          region: form.region.trim(),
          author: form.author.trim(),
          bar: form.bar.trim(),
          difficulty: form.difficulty,
          category: form.category.trim(),
          barDescription: form.barDescription.trim(),
          barCity: form.barCity.trim(),
          tags: splitTags(form.tags),
          intro: form.intro.trim(),
          image: form.image.trim(),
          method: form.method.trim(),
          glass: form.glass.trim(),
          garnish: form.garnish.trim(),
          ice: form.ice.trim(),
          prebatchMode: form.prebatchMode,
          prebatchText: form.prebatchMode === 'text' ? form.prebatchText.trim() : null,
          prebatchId: null,
          flavorBitter: Number(form.flavorBitter),
          flavorSweet: Number(form.flavorSweet),
          flavorSour: Number(form.flavorSour),
          flavorSpicy: Number(form.flavorSpicy),
          flavorStrong: Number(form.flavorStrong),
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
      router.replace(`/admin/recipes/${j.recipe.id}`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const input = 'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';
  const label = 'block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[1100px] mx-auto">
      <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide mb-6">
        Новый рецепт
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={label}>slug</label>
              <input className={input} value={form.slug} onChange={(e) => onChange('slug', e.target.value)} required />
            </div>
            <div>
              <label className={label}>city</label>
              <input className={input} value={form.city} onChange={(e) => onChange('city', e.target.value)} required />
            </div>
            <div>
              <label className={label}>lat</label>
              <input className={input} value={form.lat} onChange={(e) => onChange('lat', e.target.value)} />
            </div>
            <div>
              <label className={label}>lng</label>
              <input className={input} value={form.lng} onChange={(e) => onChange('lng', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>name</label>
              <input className={input} value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
            </div>
            <div>
              <label className={label}>region</label>
              <input className={input} value={form.region} onChange={(e) => onChange('region', e.target.value)} required />
            </div>
            <div>
              <label className={label}>author</label>
              <input className={input} value={form.author} onChange={(e) => onChange('author', e.target.value)} required />
            </div>
            <div>
              <label className={label}>bar</label>
              <input className={input} value={form.bar} onChange={(e) => onChange('bar', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={label}>difficulty</label>
              <select className={input} value={form.difficulty} onChange={(e) => onChange('difficulty', e.target.value)}>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
            <div>
              <label className={label}>category</label>
              <input className={input} value={form.category} onChange={(e) => onChange('category', e.target.value)} required />
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
              <label className={label}>image url</label>
              <input className={input} value={form.image} onChange={(e) => onChange('image', e.target.value)} required />
            </div>
          </div>

          <div>
            <label className={label}>intro</label>
            <textarea className={input} rows={3} value={form.intro} onChange={(e) => onChange('intro', e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>barCity</label>
              <input className={input} value={form.barCity} onChange={(e) => onChange('barCity', e.target.value)} required />
            </div>
            <div>
              <label className={label}>barDescription</label>
              <input className={input} value={form.barDescription} onChange={(e) => onChange('barDescription', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={label}>method</label>
              <input className={input} value={form.method} onChange={(e) => onChange('method', e.target.value)} required />
            </div>
            <div>
              <label className={label}>glass</label>
              <input className={input} value={form.glass} onChange={(e) => onChange('glass', e.target.value)} required />
            </div>
            <div>
              <label className={label}>garnish</label>
              <input className={input} value={form.garnish} onChange={(e) => onChange('garnish', e.target.value)} required />
            </div>
            <div>
              <label className={label}>ice</label>
              <input className={input} value={form.ice} onChange={(e) => onChange('ice', e.target.value)} required />
            </div>
          </div>
          <div>
            <label className={label}>tags (comma-separated)</label>
            <input className={input} value={form.tags} onChange={(e) => onChange('tags', e.target.value)} />
          </div>
        </section>

        <section className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(['flavorBitter', 'flavorSweet', 'flavorSour', 'flavorSpicy', 'flavorStrong'] as const).map((k) => (
              <div key={k}>
                <label className={label}>{k}</label>
                <input className={input} value={form[k]} onChange={(e) => onChange(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>ingredients (one per line)</label>
              <textarea className={input} rows={8} value={form.ingredients} onChange={(e) => onChange('ingredients', e.target.value)} />
            </div>
            <div>
              <label className={label}>steps (one per line)</label>
              <textarea className={input} rows={8} value={form.steps} onChange={(e) => onChange('steps', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>prebatch (text)</label>
            <textarea className={input} rows={3} value={form.prebatchText} onChange={(e) => onChange('prebatchText', e.target.value)} />
          </div>
        </section>

        {error && <div className="text-sm text-[var(--color-campari)]">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
        >
          {submitting ? 'Создаём…' : 'Создать'}
        </button>
      </form>
    </main>
  );
}

