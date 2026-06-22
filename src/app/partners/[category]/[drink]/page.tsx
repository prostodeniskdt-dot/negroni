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
  const heroSpecs = [
    drink.abv,
    drink.volume,
    drink.origin,
  ].filter(Boolean);
  const productFacts = [
    { label: 'Технология', value: 'London Dry' },
    { label: 'Дистилляция', value: 'Медный куб и джин-корзина' },
    { label: 'Стиль', value: 'Сухой, цитрусовый, хвойный' },
  ];
  const negroniBenefits = [
    {
      title: 'Сухая структура',
      text: 'Профиль лондонского сухого джина держит коктейль собранным и не даёт сладкому вермуту доминировать.',
    },
    {
      title: 'Цитрусовая ароматика',
      text: 'Цедра лимона и мандарина поддерживает классическое украшение Негрони и усиливает горько-сладкий баланс.',
    },
    {
      title: 'Сибирский терруар',
      text: 'Саган-дайля, каффир-лайм и исландский мох добавляют пряный, минеральный финиш рядом с Кампари.',
    },
  ];
  const classicServe = [
    '30 мл Bartenders United London Dry Gin',
    '30 мл Кампари',
    '30 мл сладкого красного вермута',
    'Апельсиновая цедра',
  ];
  const botanicalHighlights = [
    'Можжевельник и саган-дайля — хвойное ядро',
    'Каффир-лайм — парфюмерная цитрусовая нота',
    'Сычуанский перец — лимонно-древесный акцент',
    'Исландский мох — минеральная глубина',
  ];
  const storyCards = [
    {
      label: 'Идея',
      title: 'Джин как барный инструмент',
      text: 'Проект Bartenders United говорит с барменами на их языке: сухая база, понятная работа в классике и характер, который заметен в коктейле.',
    },
    {
      label: 'Команда',
      title: 'JOIA x DKG',
      text: 'В основе проекта — экспертиза JOIA и опыт креативной команды DKG, работавшей с международными барными и алкогольными проектами.',
    },
    {
      label: 'Девиз',
      title: 'Raise the bar',
      text: 'Не лозунг ради лозунга, а идея поднять стандарт российского премиального джина и поддержать профессиональное сообщество.',
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden pt-24">
      <Reveal as="section" className="mx-auto max-w-[1280px] px-6 py-8">
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

        <div className="relative mt-8 overflow-hidden rounded-[calc(var(--radius-lg)+10px)] border border-[var(--color-border)] bg-[radial-gradient(circle_at_22%_22%,rgba(196,165,116,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.16),transparent_48%,rgba(0,0,0,0.22))]" />
          <div className="relative grid gap-6 p-5 md:p-8 lg:grid-cols-[minmax(300px,0.88fr)_1.12fr] lg:items-center lg:p-10">
            <div className="relative flex min-h-[440px] items-end justify-center overflow-hidden rounded-[var(--radius-lg)] bg-[radial-gradient(circle_at_50%_42%,rgba(196,165,116,0.20),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))]">
              <div className="absolute bottom-8 left-1/2 h-10 w-2/3 -translate-x-1/2 rounded-full bg-black/50 blur-2xl" />
              {drink.image ? (
                <Image
                  src={drink.image}
                  alt={drink.name}
                  width={640}
                  height={1024}
                  className="relative z-10 h-[410px] w-auto object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.62)] md:h-[500px]"
                  sizes="(max-width: 1024px) 80vw, 420px"
                  priority
                  unoptimized
                />
              ) : (
                <div className="text-center text-sm uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
                  {drink.name}
                </div>
              )}
            </div>

            <div className="py-2 lg:pl-4">
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-accent)]">
                Лондонский сухой джин для Негрони
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--color-campari)]">
                {partner?.name ?? 'Партнёрский продукт'}
              </p>

              <h1 className="type-page-title mt-5 max-w-3xl text-[clamp(2.7rem,7vw,6rem)] leading-[0.92] text-[var(--color-text-primary)]">
                {drink.name}
              </h1>

              {drink.tagline && (
                <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-[var(--color-text-primary)]">
                  {drink.tagline}
                </p>
              )}

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
                {drink.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {heroSpecs.map((item) => (
                  <span key={item} className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/55 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {productFacts.map((item) => (
                  <div key={item.label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/45 p-4">
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
                      {item.value}
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
        </div>

        <section className="mt-12">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
              {drink.storyTitle ?? 'История создания'}
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold uppercase text-[var(--color-text-primary)] md:text-4xl">
              Не презентация бренда, а рабочий профиль для бара
            </h2>
            {drink.purchaseNote && (
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
                {drink.purchaseNote}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {storyCards.map((card) => (
              <article key={card.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-campari)]">
                  {card.label}
                </p>
                <h3 className="mt-4 font-display text-2xl text-[var(--color-text-primary)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
              {drink.tastingTitle ?? 'Дегустационные ноты'}
            </span>
            {drink.tastingNotes && (
              <p className="mt-5 font-display text-lg leading-relaxed text-[var(--color-text-primary)]">
                {drink.tastingNotes}
              </p>
            )}
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {botanicalHighlights.map((item) => (
                <div key={item} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/55 px-4 py-3 text-sm text-[var(--color-text-muted)]">
                  {item}
                </div>
              ))}
            </div>
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
            <div className="mt-6 grid gap-3">
              {negroniBenefits.map((benefit) => (
                <div key={benefit.title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/55 p-4">
                  <p className="font-display text-lg text-[var(--color-text-primary)]">
                    {benefit.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(196,165,116,0.12),rgba(255,255,255,0.025))]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="p-6 md:p-8">
              <span className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                Классическая подача
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold uppercase text-[var(--color-text-primary)] md:text-4xl">
                Негрони с Bartenders United
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
                Быстрая барная формула для первого знакомства с джином: равные доли, плотный лёд и широкая апельсиновая цедра.
              </p>
            </div>
            <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/45 p-6 md:p-8 lg:border-l lg:border-t-0">
              <ul className="space-y-3">
                {classicServe.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-campari)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/recipe/classic"
                className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-campari)] transition-colors hover:text-[var(--color-accent)]"
              >
                Открыть полный рецепт
              </Link>
            </div>
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
              {recipeList.slice(0, 2).map((entry, index) => (
                <Link
                  key={entry.id}
                  href={`/recipe/${entry.id}`}
                  className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-campari)] hover:shadow-[var(--shadow-lg)]"
                >
                  <PublicRecipeImage
                    src={entry.recipe.image}
                    alt={entry.recipe.name}
                    className="aspect-[5/4]"
                    variant="card"
                    overlay={<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/60 via-transparent to-transparent" />}
                  />
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[var(--color-border)] px-2 py-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="rounded-full bg-[var(--color-campari)]/15 px-2 py-1 text-xs uppercase tracking-[0.16em] text-[var(--color-campari)]">
                        {entry.id === 'classic' ? 'Классика' : 'Авторская подача'}
                      </span>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {entry.city}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-campari)]">
                      {entry.recipe.name}
                    </h3>
                    {entry.recipe.authorImage && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                        <img
                          src={entry.recipe.authorImage}
                          alt={entry.recipe.author}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--color-border)]"
                          loading="lazy"
                        />
                        <span>{entry.recipe.author}</span>
                      </div>
                    )}
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
