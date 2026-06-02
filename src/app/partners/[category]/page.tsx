import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import DrinkCard from '@/components/partners/DrinkCard';
import {
  drinkCategories,
  getCategoryBySlug,
  getDrinksByCategory,
} from '@/data/partners';

export function generateStaticParams() {
  return drinkCategories.map((category) => ({ category: category.slug }));
}

export default async function PartnerCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const drinks = getDrinksByCategory(category.id);

  return (
    <main className="min-h-screen pt-24">
      <Reveal as="section" className="px-6 py-10 max-w-[1200px] mx-auto">
        <Link
          href="/partners"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          ← Все категории
        </Link>

        <div className="mt-8 max-w-3xl">
          <span className="text-sm uppercase tracking-[0.24em] text-[var(--color-campari)]">
            Каталог партнёров
          </span>
          <h1 className="type-page-title mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-[var(--color-text-primary)]">
            {category.name}
          </h1>
          <p className="type-prose mt-5 text-lg text-[var(--color-text-muted)]">
            {category.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drinks.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              href={drink.isActive === false ? undefined : `/partners/${category.slug}/${drink.id}`}
            />
          ))}
        </div>
      </Reveal>
    </main>
  );
}
