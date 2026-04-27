'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Prebatch, Recipe } from '@prisma/client';
import { StatusPill } from '@/components/AdminShell';

const DEFAULT_RECIPE_IMAGE = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200';

type PrebatchOption = Pick<Prebatch, 'id' | 'name'>;
type RecipeFormMode = 'create' | 'edit';

type RecipeFormState = {
  slug: string;
  city: string;
  lat: string;
  lng: string;
  name: string;
  region: string;
  author: string;
  bar: string;
  difficulty: string;
  category: string;
  barDescription: string;
  barCity: string;
  tags: string[];
  intro: string;
  image: string;
  method: string;
  glass: string;
  garnish: string;
  ice: string;
  prebatchMode: string;
  prebatchText: string;
  prebatchId: string;
  flavorBitter: string;
  flavorSweet: string;
  flavorSour: string;
  flavorSpicy: string;
  flavorStrong: string;
  ingredients: string[];
  steps: string[];
  authorInstagram: string;
  authorTg: string;
  barLink: string;
  status: string;
};

type StringField = {
  [K in keyof RecipeFormState]: RecipeFormState[K] extends string ? K : never;
}[keyof RecipeFormState];

const fieldClass =
  'w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-campari)]';
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]';

const flavorFields = [
  { key: 'flavorBitter', label: 'Горечь' },
  { key: 'flavorSweet', label: 'Сладость' },
  { key: 'flavorSour', label: 'Кислотность' },
  { key: 'flavorSpicy', label: 'Пряность' },
  { key: 'flavorStrong', label: 'Крепость' },
] as const;

function createInitialState(recipe?: Recipe): RecipeFormState {
  return {
    slug: recipe?.slug ?? '',
    city: recipe?.city ?? '',
    lat: String(recipe?.lat ?? 0),
    lng: String(recipe?.lng ?? 0),
    name: recipe?.name ?? '',
    region: recipe?.region ?? '',
    author: recipe?.author ?? '',
    bar: recipe?.bar ?? '—',
    difficulty: recipe?.difficulty ?? 'easy',
    category: recipe?.category ?? '',
    barDescription: recipe?.barDescription ?? '',
    barCity: recipe?.barCity ?? '',
    tags: recipe?.tags ?? [],
    intro: recipe?.intro ?? '',
    image: recipe?.image ?? DEFAULT_RECIPE_IMAGE,
    method: recipe?.method ?? 'Stir',
    glass: recipe?.glass ?? 'Rocks',
    garnish: recipe?.garnish ?? '',
    ice: recipe?.ice ?? '',
    prebatchMode: recipe?.prebatchMode ?? 'text',
    prebatchText: recipe?.prebatchText ?? '',
    prebatchId: recipe?.prebatchId ?? '',
    flavorBitter: String(recipe?.flavorBitter ?? 0),
    flavorSweet: String(recipe?.flavorSweet ?? 0),
    flavorSour: String(recipe?.flavorSour ?? 0),
    flavorSpicy: String(recipe?.flavorSpicy ?? 0),
    flavorStrong: String(recipe?.flavorStrong ?? 0),
    ingredients: recipe?.ingredients?.length ? recipe.ingredients : [''],
    steps: recipe?.steps?.length ? recipe.steps : [''],
    authorInstagram: recipe?.authorInstagram ?? '',
    authorTg: recipe?.authorTg ?? '',
    barLink: recipe?.barLink ?? '',
    status: recipe?.status ?? 'draft',
  };
}

export function RecipeForm({
  mode,
  recipe,
  prebatches,
}: {
  mode: RecipeFormMode;
  recipe?: Recipe;
  prebatches: PrebatchOption[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<RecipeFormState>(() => createInitialState(recipe));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const title = mode === 'create' ? 'Новый рецепт' : form.name || recipe?.name || 'Редактирование рецепта';
  const publicHref = form.slug ? `/recipe/${form.slug}` : null;

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const completion = useMemo(() => {
    const required = [
      form.slug,
      form.city,
      form.name,
      form.region,
      form.author,
      form.bar,
      form.category,
      form.barDescription,
      form.barCity,
      form.intro,
      form.image,
      form.method,
      form.glass,
      form.garnish,
      form.ice,
    ];
    const filled = required.filter((value) => value.trim()).length;
    return Math.round((filled / required.length) * 100);
  }, [form]);

  const setField = (field: StringField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
    setNotice(null);
  };

  const setList = (field: 'ingredients' | 'steps' | 'tags', value: string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
    setNotice(null);
  };

  const payload = (statusOverride?: string) => ({
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
    tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
    intro: form.intro.trim(),
    image: form.image.trim() || DEFAULT_RECIPE_IMAGE,
    method: form.method.trim(),
    glass: form.glass.trim(),
    garnish: form.garnish.trim(),
    ice: form.ice.trim(),
    prebatchMode: form.prebatchMode,
    prebatchText: form.prebatchMode === 'text' ? form.prebatchText.trim() : null,
    prebatchId: form.prebatchMode === 'ref' && form.prebatchId ? form.prebatchId : null,
    flavorBitter: Number(form.flavorBitter),
    flavorSweet: Number(form.flavorSweet),
    flavorSour: Number(form.flavorSour),
    flavorSpicy: Number(form.flavorSpicy),
    flavorStrong: Number(form.flavorStrong),
    ingredients: form.ingredients.map((item) => item.trim()).filter(Boolean),
    steps: form.steps.map((item) => item.trim()).filter(Boolean),
    authorInstagram: form.authorInstagram.trim() || null,
    authorTg: form.authorTg.trim() || null,
    barLink: form.barLink.trim() || null,
    status: statusOverride ?? form.status,
  });

  const save = async (statusOverride?: string) => {
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch(mode === 'create' ? '/api/admin/recipes' : `/api/admin/recipes/${recipe?.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload(statusOverride)),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(humanizeError(json?.error));
        return;
      }

      setDirty(false);
      setNotice(statusOverride === 'draft' ? 'Черновик сохранён' : 'Рецепт сохранён');
      if (mode === 'create' && json?.recipe?.id) {
        router.replace(`/admin/recipes/${json.recipe.id}`);
      } else {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteRecipe = async () => {
    if (!recipe) return;
    const confirmed = window.confirm(`Удалить рецепт "${recipe.name}"? Это действие нельзя отменить.`);
    if (!confirmed) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/recipes/${recipe.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(humanizeError(json?.error));
        return;
      }
      router.replace('/admin/recipes');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);
    setNotice(null);
    try {
      const body = new FormData();
      body.set('file', file);
      const res = await fetch('/api/admin/uploads', { method: 'POST', body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.url) {
        setError(humanizeError(json?.error || 'UPLOAD_FAILED'));
        return;
      }
      setField('image', json.url);
      setNotice('Фото загружено. Не забудьте сохранить рецепт.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusPill status={form.status} />
              <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]">
                Заполнено на {completion}%
              </span>
            </div>
            <h2 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Разделы сгруппированы так, как редактор думает о рецепте: содержание, фото, вкус, подача и публикация.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/recipes"
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]"
            >
              К списку
            </Link>
            {publicHref && (
              <a
                href={publicHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]"
              >
                Открыть на сайте
              </a>
            )}
            {mode === 'edit' && (
              <button
                type="button"
                onClick={deleteRecipe}
                disabled={saving}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
              >
                Удалить
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <FormSection title="Основное" description="Название, адрес страницы, статус и базовая классификация.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField label="Название рецепта" value={form.name} onChange={(value) => setField('name', value)} required />
              <TextField label="Slug" value={form.slug} onChange={(value) => setField('slug', value)} required placeholder="moscow-negroni" />
              <SelectField label="Статус" value={form.status} onChange={(value) => setField('status', value)}>
                <option value="draft">Черновик</option>
                <option value="published">Опубликован</option>
                <option value="archived">Архив</option>
              </SelectField>
              <SelectField label="Сложность" value={form.difficulty} onChange={(value) => setField('difficulty', value)}>
                <option value="easy">Легко</option>
                <option value="medium">Средне</option>
                <option value="hard">Сложно</option>
              </SelectField>
              <TextField label="Категория" value={form.category} onChange={(value) => setField('category', value)} required />
              <TagEditor tags={form.tags} onChange={(tags) => setList('tags', tags)} />
            </div>
          </FormSection>

          <FormSection title="Фото" description="Загрузите файл, вставьте URL или сбросьте изображение до стандартного.">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
              <div
                className="aspect-[4/3] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-cover bg-center"
                style={{ backgroundImage: `url(${form.image || DEFAULT_RECIPE_IMAGE})` }}
              />
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadImage(file);
                    event.currentTarget.value = '';
                  }}
                />
                <TextField label="URL изображения" value={form.image} onChange={(value) => setField('image', value)} required />
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files?.[0];
                    if (file) void uploadImage(file);
                  }}
                  className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4 text-sm text-[var(--color-text-muted)]"
                >
                  Перетащите фото сюда или загрузите файл кнопкой ниже.
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-4 py-2 text-sm font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)] disabled:opacity-50"
                  >
                    {uploading ? 'Загружаем...' : 'Загрузить фото'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setField('image', DEFAULT_RECIPE_IMAGE)}
                    className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]"
                  >
                    Удалить фото
                  </button>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="География" description="Данные используются на карте и в карточках коллекции.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <TextField label="Город" value={form.city} onChange={(value) => setField('city', value)} required />
              <TextField label="Регион" value={form.region} onChange={(value) => setField('region', value)} required />
              <TextField label="Широта" value={form.lat} onChange={(value) => setField('lat', value)} />
              <TextField label="Долгота" value={form.lng} onChange={(value) => setField('lng', value)} />
            </div>
          </FormSection>

          <FormSection title="Описание" description="Короткое вступление, которое видит пользователь на странице рецепта.">
            <TextAreaField label="Вступление" value={form.intro} onChange={(value) => setField('intro', value)} rows={5} required />
          </FormSection>

          <FormSection title="Бар и автор" description="Публичный профиль автора, бара и полезные ссылки.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField label="Автор" value={form.author} onChange={(value) => setField('author', value)} required />
              <TextField label="Бар" value={form.bar} onChange={(value) => setField('bar', value)} required />
              <TextField label="Город бара" value={form.barCity} onChange={(value) => setField('barCity', value)} required />
              <TextField label="Сайт бара" value={form.barLink} onChange={(value) => setField('barLink', value)} placeholder="https://..." />
              <TextField label="Instagram автора" value={form.authorInstagram} onChange={(value) => setField('authorInstagram', value)} placeholder="@author или URL" />
              <TextField label="Telegram автора" value={form.authorTg} onChange={(value) => setField('authorTg', value)} placeholder="@author или URL" />
            </div>
            <TextAreaField label="Описание бара" value={form.barDescription} onChange={(value) => setField('barDescription', value)} rows={4} required />
          </FormSection>

          <FormSection title="Состав и шаги" description="Редактируемые списки вместо тяжёлых textarea.">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <EditableList label="Ингредиенты" items={form.ingredients} onChange={(items) => setList('ingredients', items)} addLabel="Добавить ингредиент" />
              <EditableList label="Шаги приготовления" items={form.steps} onChange={(items) => setList('steps', items)} addLabel="Добавить шаг" multiline />
            </div>
          </FormSection>

          <FormSection title="Подача" description="Техника приготовления и детали сервировки.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <TextField label="Метод" value={form.method} onChange={(value) => setField('method', value)} required />
              <TextField label="Бокал" value={form.glass} onChange={(value) => setField('glass', value)} required />
              <TextField label="Гарнир" value={form.garnish} onChange={(value) => setField('garnish', value)} required />
              <TextField label="Лёд" value={form.ice} onChange={(value) => setField('ice', value)} required />
            </div>
          </FormSection>

          <FormSection title="Вкусовой профиль" description="Слайдеры от 0 до 10, которые отображаются на странице рецепта.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {flavorFields.map((field) => (
                <label key={field.key} className="block rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/35 p-4">
                  <span className="flex items-center justify-between text-sm font-semibold text-[var(--color-text-primary)]">
                    {field.label}
                    <span>{form[field.key]}/10</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={form[field.key]}
                    onChange={(event) => setField(field.key, event.target.value)}
                    className="mt-3 w-full accent-[var(--color-campari)]"
                  />
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Prebatch" description="Текстовая заготовка, ссылка на библиотеку или отключенный блок.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField label="Режим" value={form.prebatchMode} onChange={(value) => setField('prebatchMode', value)}>
                <option value="none">Нет</option>
                <option value="text">Текст</option>
                <option value="ref">Из библиотеки</option>
              </SelectField>
              {form.prebatchMode === 'ref' && (
                <SelectField label="Заготовка" value={form.prebatchId} onChange={(value) => setField('prebatchId', value)}>
                  <option value="">Выберите заготовку</option>
                  {prebatches.map((prebatch) => (
                    <option key={prebatch.id} value={prebatch.id}>
                      {prebatch.name}
                    </option>
                  ))}
                </SelectField>
              )}
            </div>
            {form.prebatchMode === 'text' && (
              <TextAreaField label="Текст prebatch" value={form.prebatchText} onChange={(value) => setField('prebatchText', value)} rows={4} />
            )}
          </FormSection>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:h-fit">
          <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-lg font-bold uppercase tracking-wide">Сохранение</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {dirty ? 'Есть несохранённые изменения.' : 'Все последние изменения сохранены или форма ещё не менялась.'}
            </p>
            {error && (
              <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-campari)]/50 bg-[var(--color-campari)]/10 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            {notice && (
              <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-3 py-2 text-sm text-[var(--color-text-primary)]">
                {notice}
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-5 py-3 font-semibold text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)] disabled:opacity-50"
              >
                {saving ? 'Сохраняем...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={() => void save('draft')}
                disabled={saving}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-5 py-3 font-semibold transition-colors hover:border-[var(--color-campari)] disabled:opacity-50"
              >
                Сохранить как черновик
              </button>
              <button
                type="button"
                onClick={() => void save('published')}
                disabled={saving}
                className="rounded-[var(--radius-sm)] border border-[var(--color-campari)] px-5 py-3 font-semibold text-[var(--color-campari)] transition-colors hover:bg-[var(--color-campari)] hover:text-[var(--color-on-campari)] disabled:opacity-50"
              >
                Опубликовать
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
            <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${form.image || DEFAULT_RECIPE_IMAGE})` }} />
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <StatusPill status={form.status} />
                <span className="text-xs text-[var(--color-text-secondary)]">{form.region || 'Регион'}</span>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
                {form.name || 'Название рецепта'}
              </h3>
              <p className="mt-2 line-clamp-4 text-sm text-[var(--color-text-muted)]">
                {form.intro || 'Здесь будет короткое описание рецепта.'}
              </p>
              <div className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
                <div>Автор: {form.author || '—'}</div>
                <div>Бар: {form.bar || '—'}</div>
                <div>Подача: {form.glass || '—'}, {form.ice || '—'}</div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4">
        <h3 className="text-xl font-bold uppercase tracking-wide text-[var(--color-text-primary)]">{title}</h3>
        {description && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}{required ? ' *' : ''}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={fieldClass} />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}{required ? ' *' : ''}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className={fieldClass} />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {children}
      </select>
    </label>
  );
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const tag = draft.trim();
    if (!tag) return;
    onChange(Array.from(new Set([...tags, tag])));
    setDraft('');
  };

  return (
    <div>
      <span className={labelClass}>Теги</span>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder="Добавить тег"
          className={fieldClass}
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-campari)]"
        >
          +
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tags.filter((item) => item !== tag))}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-3 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)]"
          >
            {tag} ×
          </button>
        ))}
      </div>
    </div>
  );
}

function EditableList({
  label,
  items,
  onChange,
  addLabel,
  multiline,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  multiline?: boolean;
}) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };
  const removeItem = (index: number) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    onChange(next.length ? next : ['']);
  };
  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]/25 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-semibold uppercase tracking-wide text-[var(--color-text-primary)]">{label}</h4>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--color-campari)]"
        >
          {addLabel}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
            {multiline ? (
              <textarea value={item} onChange={(event) => updateItem(index, event.target.value)} rows={3} className={fieldClass} />
            ) : (
              <input value={item} onChange={(event) => updateItem(index, event.target.value)} className={fieldClass} />
            )}
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => moveItem(index, -1)} className="rounded border border-[var(--color-border)] px-2 py-1 text-xs hover:border-[var(--color-campari)]">
                ↑
              </button>
              <button type="button" onClick={() => moveItem(index, 1)} className="rounded border border-[var(--color-border)] px-2 py-1 text-xs hover:border-[var(--color-campari)]">
                ↓
              </button>
              <button type="button" onClick={() => removeItem(index)} className="rounded border border-[var(--color-border)] px-2 py-1 text-xs hover:border-[var(--color-campari)]">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function humanizeError(error: string) {
  if (error === 'INVALID_BODY') return 'Проверьте обязательные поля и числовые значения.';
  if (error === 'FORBIDDEN') return 'Недостаточно прав для этого действия.';
  if (error === 'UNAUTHENTICATED') return 'Нужно войти заново.';
  if (error === 'FILE_TOO_LARGE') return 'Файл слишком большой. Максимум 5 МБ.';
  if (error === 'UNSUPPORTED_FILE_TYPE') return 'Поддерживаются только PNG, JPEG, WebP и GIF.';
  return error || 'Что-то пошло не так.';
}
