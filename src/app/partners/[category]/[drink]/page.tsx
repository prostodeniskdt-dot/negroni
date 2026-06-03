import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import { PublicRecipeImage } from '@/components/PublicRecipeImage';
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
  const { recipes: recipeList } = getRecipesForDrink(drink.id);
  const tastingNotes = drink.tastingNotes
    ?.split(/[,.]/)
    .map((note) => note.trim())
    .filter(Boolean);
  const specItems: Array<[string, string]> = [
    ['Категория', category.name],
    ['Крепость', drink.abv ?? ''],
    ['Объём', drink.volume ?? ''],
    ['Производитель', drink.producer ?? ''],
    ['Происхождение', drink.origin ?? ''],
  ].filter(([, value]) => Boolean(value));

  return (
    <main className="min-h-screen pt-24 overflow-hidden">
      <Reveal as="section" className="px-6 py-10 max-w-[1240px] mx-auto">
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:items-center">
          <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))] p-5 shadow-[var(--shadow-lg)]">
            <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] bg-[radial-gradient(circle_at_50%_35%,rgba(196,165,116,0.22),transparent_42%),radial-gradient(circle_at_50%_80%,rgba(187,10,48,0.12),transparent_48%)]" />
            <div className="relative flex min-h-[520px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg)]/75 p-8">
              {drink.image ? (
                <Image
                  src={drink.image}
                  alt={drink.name}
                  width={840}
                  height={840}
                  className="max-h-[500px] w-full object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority
                />
              ) : (
                <div className="text-center text-sm uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
                  {drink.name}
                </div>
              )}
              <span className="absolute left-5 top-5 rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-bg)]/70 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--color-accent)] backdrop-blur">
                London Dry Gin
              </span>
            </div>
          </div>

          <div className="lg:pl-4">
            <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-campari)]">
              {partner?.name ?? 'Партнёрский продукт'}
            </span>

            <div className="mt-5 flex flex-wrap gap-2">
              {drink.isNew && (
                <span className="rounded-full border border-[var(--color-campari)] bg-[var(--color-campari)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-campari)]">
                  Новинка
                </span>
              )}
              {drink.abv && (
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  {drink.abv}
                </span>
              )}
              {drink.volume && (
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  {drink.volume}
                </span>
              )}
            </div>

            <h1 className="type-page-title mt-5 max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)] text-[var(--color-text-primary)]">
              {drink.name}
            </h1>

            {drink.tagline && (
              <p className="mt-5 max-w-2xl text-xl text-[var(--color-text-primary)]">
                {drink.tagline}
              </p>
            )}

            <p className="mt-6 max-w-2xl font-display text-lg leading-relaxed text-[var(--color-text-muted)]">
              {drink.description}
            </p>

            <div className="mt-8 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {specItems.map(([label, value]) => (
                <div key={label} className="border-b border-[var(--color-border)] pb-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                    {label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {drink.buyUrl && (
                <a
                  href={drink.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
                >
                  {drink.buyLabel ?? 'Где купить'}
                </a>
              )}
              {partner?.phone && (
                <a
                  href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-6 py-3 text-sm uppercase tracking-wider text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
                >
                  {partner.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 lg:grid-cols-[160px_1fr]">
          <div>
            <span className="font-display text-5xl text-[var(--color-accent)]/55">01</span>
            <p className="mt-3 text-xs uppercase tracking-[0.26em] text-[var(--color-text-secondary)]">
              {drink.storyTitle ?? 'Описание / легенда'}
            </p>
          </div>
          <div className="max-w-3xl">
            <p className="font-display text-2xl leading-relaxed text-[var(--color-text-primary)]">
              {drink.description}
            </p>
            {drink.purchaseNote && (
              <p className="mt-5 text-base leading-relaxed text-[var(--color-text-muted)]">
                {drink.purchaseNote}
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
              {drink.tastingTitle ?? 'Дегустация'}
            </span>
            {tastingNotes && tastingNotes.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
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
            {drink.tastingNotes && (
              <p className="mt-5 font-display text-lg leading-relaxed text-[var(--color-text-primary)]">
                {drink.tastingNotes}
              </p>
            )}
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
              Почему для Негрони
            </span>
            {drink.serve && (
              <p className="mt-5 font-display text-2xl leading-relaxed text-[var(--color-text-primary)]">
                {drink.serve}
              </p>
            )}
            <p className="mt-5 text-base leading-relaxed text-[var(--color-text-muted)]">
              Сухой профиль, цитрусовая яркость и можжевеловая база помогают держать баланс между горечью Campari и сладостью красного вермута.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.28em] text-[var(--color-campari)]">
              Рецепты
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold uppercase text-[var(--color-text-primary)] md:text-4xl">
              Рецепты с этим джином
            </h2>
            <p className="mt-3 text-[var(--color-text-muted)]">
              Продукт привязан только к двум проверенным рецептам музея.
            </p>
          </div>

          {recipeList.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {recipeList.slice(0, 2).map((entry) => (
                <Link
                  key={entry.id}
                  href={`/recipe/${entry.id}`}
                  className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-campari)] hover:shadow-[var(--shadow-lg)]"
                >
                  <PublicRecipeImage
                    src={entry.recipe.image}
                    alt={entry.recipe.name}
                    className="aspect-[16/10]"
                    overlay={<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/70 via-transparent to-transparent" />}
                  />
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--color-campari)]/15 px-2 py-1 text-xs uppercase tracking-[0.16em] text-[var(--color-campari)]">
                        {entry.recipe.category}
                      </span>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {entry.city}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-campari)]">
                      {entry.recipe.name}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {entry.recipe.intro}
                    </p>
                    <span className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-campari)]">
                      Открыть рецепт
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--color-text-muted)]">
              Пока рецепты не привязаны.
            </p>
          )}
        </section>

        <section className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(187,10,48,0.10),rgba(255,255,255,0.025))] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.28em] text-[var(--color-campari)]">
                О партнёре
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold uppercase text-[var(--color-text-primary)]">
                {drink.companyName ?? partner?.name}
              </h2>
              {drink.companyContacts?.map((line) => (
                <p key={line} className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)]">
                  {line}
                </p>
              ))}
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/55 p-5">
              {partner?.phoneLabel && (
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                  {partner.phoneLabel}
                </p>
              )}
              {partner?.phone && (
                <a
                  href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`}
                  className="mt-3 block font-display text-2xl text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-light)]"
                >
                  {partner.phone}
                </a>
              )}
              {drink.buyUrl && (
                <a
                  href={drink.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-campari)] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
                >
                  {drink.buyLabel ?? 'Где купить'}
                </a>
              )}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
