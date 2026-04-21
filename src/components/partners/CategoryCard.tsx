'use client';

import { useI18n } from '@/hooks/useI18n';
import type { DrinkCategory } from '@/data/partners';

interface CategoryCardProps {
  category: DrinkCategory;
  drinkCount: number;
  onClick: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  gin: '🍸',
  vermouth: '🍷',
  bitter: '🧉',
  liqueur: '🍶',
};

export default function CategoryCard({ category, drinkCount, onClick }: CategoryCardProps) {
  const { lang } = useI18n();
  const name = lang === 'en' ? category.nameEn : category.name;
  const icon = CATEGORY_ICONS[category.id] || '🍾';

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-6 text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-campari)] hover:bg-[var(--color-surface-solid)]/50 transition-all group"
    >
      <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <h3 className="font-[var(--font-display)] font-semibold uppercase text-[var(--color-text-primary)] mb-1">
        {name}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)]">
        {drinkCount} {lang === 'en' ? 'drinks' : 'напитков'}
      </p>
    </button>
  );
}
