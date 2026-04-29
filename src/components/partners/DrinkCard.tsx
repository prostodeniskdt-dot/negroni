'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import type { Drink } from '@/data/partners';

interface DrinkCardProps {
  drink: Drink;
  onClick?: () => void;
  href?: string;
}

export default function DrinkCard({ drink, onClick, href }: DrinkCardProps) {
  const { lang } = useI18n();
  const name = lang === 'en' ? drink.nameEn : drink.name;
  const tagline = lang === 'en' ? drink.taglineEn : drink.tagline;
  const content = (
    <>
      <div className="relative flex min-h-[240px] items-center justify-center bg-[var(--color-surface-solid)] p-4">
        {drink.image ? (
          <Image
            src={drink.image}
            alt={name}
            width={520}
            height={390}
            className="max-h-[260px] w-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex min-h-[220px] items-center justify-center text-4xl text-[var(--color-text-muted)]">
            🍸
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-[var(--font-display)] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-campari)] transition-colors">
          {name}
        </h4>
        {tagline && (
          <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-2">
            {tagline}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          {drink.abv && <span>{drink.abv}</span>}
          {drink.volume && <span>{drink.volume}</span>}
          {drink.origin && <span>{lang === 'en' ? drink.originEn ?? drink.origin : drink.origin}</span>}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--color-campari)] transition-all group no-underline"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--color-campari)] transition-all group"
    >
      {content}
    </button>
  );
}
