'use client';

import Image from 'next/image';
import { useI18n } from '@/hooks/useI18n';
import type { Drink } from '@/data/partners';

interface DrinkCardProps {
  drink: Drink;
  onClick: () => void;
}

export default function DrinkCard({ drink, onClick }: DrinkCardProps) {
  const { lang } = useI18n();
  const name = lang === 'en' ? drink.nameEn : drink.name;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--color-campari)] transition-all group"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-surface-solid)]">
        {drink.image ? (
          <Image
            src={drink.image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl text-[var(--color-text-muted)]">
            🍸
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-[var(--font-display)] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-campari)] transition-colors">
          {name}
        </h4>
      </div>
    </button>
  );
}
