'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import type { DrinkCategory } from '@/data/partners';

interface CategoryCardProps {
  category: DrinkCategory;
  drinkCount: number;
  onClick?: () => void;
  href?: string;
}

export default function CategoryCard({ category, drinkCount, onClick, href }: CategoryCardProps) {
  const { lang } = useI18n();
  const name = lang === 'en' ? category.nameEn : category.name;
  const content = (
    <>
      <span className="block w-8 h-px bg-[var(--color-accent)] mb-4 group-hover:w-12 transition-all duration-300" />
      <h3 className="font-display font-semibold uppercase text-[var(--color-text-primary)] mb-1">
        {name}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)]">
        {drinkCount} {lang === 'en' ? 'drinks' : 'напитков'}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block w-full p-6 text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-campari)] hover:bg-[var(--color-surface-solid)]/50 transition-all group no-underline"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-6 text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-campari)] hover:bg-[var(--color-surface-solid)]/50 transition-all group"
    >
      {content}
    </button>
  );
}
