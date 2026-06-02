import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import {
  drinkCategories,
  drinks,
  getCategoryBySlug,
  getDrinkByCategoryAndId,
  getPartnerById,
} from '@/data/partners';
import { getRecipesForDrink } from '@/lib/recipe-queries';

export function generateStaticParams() {
  return drinks.flatMap((drink) => {
    const category = drinkCategories.find((item) => item.id === drink.categoryId);
    return category ? [{ category: category.slug, drink: drink.id }] : [];
  });
}

export default async function PartnerDrinkPage({
  params,
}: {
  params: Promise<{ category: string; drink: string }>;
}) {
  const { category: categorySlug, drink: drinkId } = await params;
  const category = getCategoryBySlug(categorySlug);
  const drink = getDrinkByCategoryAndId(categorySlug, drinkId);
  if (!category || !drink) notFound();

  const partner = getPartnerById(drink.partnerId);
  const { recipes: recipeList, isGeneralPartner } = getRecipesForDrink(drink.id);
  const tastingNotes = drink.tastingNotes
    ?.split(',')
    .map((note) => note.trim())
    .filter(Boolean);
  const specItems = [
    ['Категория', category.name],
    ['Крепость', drink.abv],
    ['Объём', drink.volume],
    ['Производитель', drink.producer],
    ['Происхождение', drink.origin],
    ['Партнёр', partner?.name],
  ].filter(([, value]) => Boolean(value));

  return (
    <main className="min-h-screen pt-24">
      <Reveal as="section" className="px-6 py-10 max-w-[1200px] mx-auto">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/partners"
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ← Все категории
          </Link>
          <Link
            href={`/partners/${category.slug}`}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {category.name}
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <span className="text-sm uppercase tracking-[0.24em] text-[var(--color-campari)]">
              {partner?.name ?? 'Партнёрский продукт'}
            </span>
            <h1 className="type-page-title mt-3 text-[clamp(2.5rem,7vw,5.5rem)] text-[var(--color-text-primary)]">
              {drink.name}
            </h1>
            {drink.tagline && (
              <p className="mt-4 text-xl text-[var(--color-text-primary)]">
                {drink.tagline}
              </p>
            )}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)] font-display">
              {drink.description}
            </p>
          </div>

          <aside className={`rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 ${drink.notebookStyle ? 'shadow-[var(--shadow-lg)]' : ''}`}>
            <div className="flex min-h-[360px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg)] p-4">
              {drink.image ? (
                <Image
                  src={drink.image}
                  alt={drink.name}
                  width={720}
                  height={720}
                  className="max-h-[420px] w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
              ) : (
                <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                  {drink.name}
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {specItems.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-primary)]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {drink.buyUrl && (
                <a
                  href={drink.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
                >
                  {drink.buyLabel ?? 'Где купить'}
                </a>
              )}
              {drink.purchaseNote && (
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {drink.purchaseNote}
                </p>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {drink.notebookStyle && (
            <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                {drink.storyTitle ?? 'Описание / легенда'}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] font-display">
                {drink.description}
              </p>
            </section>
          )}

          {drink.notebookStyle && drink.tastingNotes && (
            <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                {drink.tastingTitle ?? 'Дегустация'}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] font-display">
                {drink.tastingNotes}
              </p>
            </section>
          )}

          {partner?.phone && (
            <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                Связаться с партнёром
              </p>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                {partner.phoneLabel ?? partner.name}
              </p>
              <a
                href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`}
                className="mt-4 inline-flex items-center gap-2 font-display text-2xl text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors"
              >
                {partner.phone}
              </a>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Позвоните, чтобы уточнить наличие и заказать алкоголь от партнёра.
              </p>
            </section>
          )}

          {drink.notebookStyle && (
            <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                {drink.companyBlockTitle ?? 'Компания'}
              </p>
              <p className="mt-3 text-base text-[var(--color-text-primary)]">
                {drink.companyName ?? partner?.name}
              </p>
              {drink.companyContacts?.map((line) => (
                <p key={line} className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {line}
                </p>
              ))}
            </section>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl font-bold uppercase text-[var(--color-text-primary)]">
              Вкус и подача
            </h2>
            {tastingNotes && tastingNotes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text-muted)]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
            {drink.serve && (
              <p className="mt-5 text-[var(--color-text-muted)] leading-relaxed">
                {drink.serve}
              </p>
            )}
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl font-bold uppercase text-[var(--color-text-primary)]">
              В каких рецептах встречается
            </h2>
            {recipeList.length > 0 ? (
              <div className="mt-4 space-y-3">
                {recipeList.slice(0, 6).map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/recipe/${entry.id}`}
                    className="block rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-4 transition-colors hover:border-[var(--color-campari)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {entry.recipe.name}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                          {entry.city}
                          {entry.recipe.bar !== '—' && ` • ${entry.recipe.bar}`}
                        </p>
                      </div>
                      {isGeneralPartner(entry) && (
                        <span className="shrink-0 rounded-full bg-[var(--color-campari)]/15 px-2 py-1 text-xs text-[var(--color-campari)]">
                          база
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                Пока рецепты не привязаны. Добавьте ключевые слова или ручные связи в следующем шаге CMS.
              </p>
            )}
          </section>
        </div>
      </Reveal>
    </main>
  );
}
