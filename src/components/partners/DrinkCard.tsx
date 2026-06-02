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
  const isActive = drink.isActive !== false;
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
          <div className="flex min-h-[220px] items-center justify-center text-sm uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
            {name}
          </div>
        )}
      </div>
      <div className="p-4">
        {drink.isNew && (
          <span className="inline-flex rounded-full border border-[var(--color-campari)] bg-[var(--color-campari)]/15 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-campari)]">
            {lang === 'en' ? 'New' : 'Новинка'}
          </span>
        )}
        <h4 className="font-display font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-campari)] transition-colors">
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
        {!isActive && (
          <p className="mt-4 inline-flex rounded-full border border-[var(--color-border)] px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
            {lang === 'en' ? 'Soon' : 'Скоро'}
          </p>
        )}
      </div>
    </>
  );

  if (href && isActive) {
    return (
      <Link
        href={href}
        className="block w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--color-campari)] transition-all group no-underline"
      >
        {content}
      </Link>
    );
  }

  if (!isActive) {
    return (
      <div className="w-full text-left bg-[var(--color-surface)]/70 border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden group opacity-80">
        {content}
      </div>
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
