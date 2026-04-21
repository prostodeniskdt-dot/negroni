'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Recipe } from '@prisma/client';

function joinLines(list: string[]) {
  return list.join('\n');
}

function splitLines(s: string): string[] {
  return s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
}

function joinTags(list: string[]) {
  return list.join(', ');
}

function splitTags(s: string): string[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function EditRecipeClient({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: recipe.slug,
    city: recipe.city,
    lat: String(recipe.lat),
    lng: String(recipe.lng),
    name: recipe.name,
    region: recipe.region,
    author: recipe.author,
    bar: recipe.bar,
    difficulty: recipe.difficulty,
    category: recipe.category,
    barDescription: recipe.barDescription,
    barCity: recipe.barCity,
    tags: joinTags(recipe.tags),
    intro: recipe.intro,
    image: recipe.image,
    method: recipe.method,
    glass: recipe.glass,
    garnish: recipe.garnish,
    ice: recipe.ice,
    prebatchMode: recipe.prebatchMode,
    prebatchText: recipe.prebatchText ?? '',
    flavorBitter: String(recipe.flavorBitter),
    flavorSweet: String(recipe.flavorSweet),
    flavorSour: String(recipe.flavorSour),
    flavorSpicy: String(recipe.flavorSpicy),
    flavorStrong: String(recipe.flavorStrong),
    ingredients: joinLines(recipe.ingredients),
    steps: joinLines(recipe.steps),
    status: recipe.status,
  });

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/recipes/${recipe.id}`, {
        method: 'PUT',
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
          difficulty: form.difficulty.trim(),
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
        setError(j?.error || 'SAVE_FAILED');
        return;
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('Удалить рецепт?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/recipes/${recipe.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'DELETE_FAILED');
        return;
      }
      router.replace('/admin/recipes');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';
  const label = 'block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1';

  return (
    <main className="min-h-screen px-6 py-10 max-w-[1100px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide">
            {recipe.name}
          </h1>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">
            id: {recipe.id}
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`/recipe/${recipe.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
          >
            Открыть на сайте
          </a>
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <section className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['slug', 'city', 'lat', 'lng'] as const).map((k) => (
              <div key={k}>
                <label className={label}>{k}</label>
                <input className={input} value={form[k]} onChange={(e) => onChange(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['name', 'region', 'author', 'bar'] as const).map((k) => (
              <div key={k}>
                <label className={label}>{k}</label>
                <input className={input} value={form[k]} onChange={(e) => onChange(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={label}>difficulty</label>
              <input className={input} value={form.difficulty} onChange={(e) => onChange('difficulty', e.target.value)} />
            </div>
            <div>
              <label className={label}>category</label>
              <input className={input} value={form.category} onChange={(e) => onChange('category', e.target.value)} />
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
              <label className={label}>image</label>
              <input className={input} value={form.image} onChange={(e) => onChange('image', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>intro</label>
            <textarea className={input} rows={3} value={form.intro} onChange={(e) => onChange('intro', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>barCity</label>
              <input className={input} value={form.barCity} onChange={(e) => onChange('barCity', e.target.value)} />
            </div>
            <div>
              <label className={label}>barDescription</label>
              <input className={input} value={form.barDescription} onChange={(e) => onChange('barDescription', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['method', 'glass', 'garnish', 'ice'] as const).map((k) => (
              <div key={k}>
                <label className={label}>{k}</label>
                <input className={input} value={form[k]} onChange={(e) => onChange(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div>
            <label className={label}>tags</label>
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
              <label className={label}>ingredients</label>
              <textarea className={input} rows={10} value={form.ingredients} onChange={(e) => onChange('ingredients', e.target.value)} />
            </div>
            <div>
              <label className={label}>steps</label>
              <textarea className={input} rows={10} value={form.steps} onChange={(e) => onChange('steps', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>prebatch (text)</label>
            <textarea className={input} rows={3} value={form.prebatchText} onChange={(e) => onChange('prebatchText', e.target.value)} />
          </div>
        </section>

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

