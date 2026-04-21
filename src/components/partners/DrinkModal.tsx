'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/hooks/useI18n';
import { getPartnerById, type Drink, type DrinkCategory } from '@/data/partners';
import { getRecipesForDrink } from '@/lib/recipe-queries';
import { getGeneralPartner } from '@/data/partners';
import type { RecipeEntry } from '@/data/recipes';

interface DrinkModalProps {
  drink: Drink;
  category: DrinkCategory;
  onClose: () => void;
}

function RecipeListItem({
  entry,
  isGeneralPartner,
  generalPartnerName,
  t,
}: {
  entry: RecipeEntry;
  isGeneralPartner: boolean;
  generalPartnerName?: string;
  t: (k: string) => string;
}) {
  return (
    <Link
      href={`/recipe/${entry.id}`}
      className="block p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-campari)] hover:bg-[var(--color-surface-solid)]/50 transition-colors"
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="font-medium text-[var(--color-text-primary)]">
            {entry.recipe.name}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {entry.city}
            {entry.recipe.bar !== '—' && ` • ${entry.recipe.bar}`}
          </p>
        </div>
        {isGeneralPartner && generalPartnerName && (
          <span className="shrink-0 text-xs px-2 py-1 rounded bg-[var(--color-campari)]/15 text-[var(--color-campari)]">
            {t('partners.generalRecipe')}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function DrinkModal({ drink, category, onClose }: DrinkModalProps) {
  const { t, lang } = useI18n();
  const partner = getPartnerById(drink.partnerId);
  const generalPartner = getGeneralPartner();
  const { recipes: recipeList, isGeneralPartner } = getRecipesForDrink(drink.id);

  const drinkName = lang === 'en' ? drink.nameEn : drink.name;
  const drinkDesc = lang === 'en' ? drink.descriptionEn : drink.description;
  const categoryName = lang === 'en' ? category.nameEn : category.name;
  const partnerName = partner ? (lang === 'en' ? partner.nameEn : partner.name) : '';

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drink-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-surface-solid)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label={t('common.close')}
        >
          ×
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Header */}
          <div className="relative h-48 bg-[var(--color-surface)]">
            {drink.image && (
              <Image
                src={drink.image}
                alt={drinkName}
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-12">
              <span className="text-xs uppercase tracking-wider text-[var(--color-campari)]">
                {categoryName}
              </span>
              <h2 id="drink-modal-title" className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {drinkName}
              </h2>
              {partnerName && (
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {partnerName}
                </p>
              )}
            </div>
          </div>

          <div className="p-6">
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              {drinkDesc}
            </p>

            {/* Recipes section */}
            <div className="mt-8">
              <h3 className="font-[var(--font-display)] font-semibold uppercase text-[var(--color-text-primary)] mb-4">
                {t('partners.recipesUsing')}
              </h3>
              {recipeList.length > 0 ? (
                <ul className="space-y-3">
                  {recipeList.map((entry) => (
                    <li key={entry.id}>
                      <RecipeListItem
                        entry={entry}
                        isGeneralPartner={isGeneralPartner(entry)}
                        generalPartnerName={generalPartner ? (lang === 'en' ? generalPartner.nameEn : generalPartner.name) : undefined}
                        t={t}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">
                  {t('partners.noRecipes')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
