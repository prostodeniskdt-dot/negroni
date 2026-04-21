'use client';

import { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import Reveal from '@/components/Reveal';
import CategoryCard from '@/components/partners/CategoryCard';
import DrinkCard from '@/components/partners/DrinkCard';
import DrinkModal from '@/components/partners/DrinkModal';
import {
  drinkCategories,
  getDrinksByCategory,
  type Drink,
  type DrinkCategory,
} from '@/data/partners';

export default function PartnersPage() {
  const { t, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  const handleCategorySelect = (category: DrinkCategory) => {
    setSelectedCategory(category);
    setSelectedDrink(null);
  };

  const handleDrinkSelect = (drink: Drink) => {
    setSelectedDrink(drink);
  };

  const handleCloseModal = () => {
    setSelectedDrink(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedDrink(null);
  };

  const drinks = selectedCategory ? getDrinksByCategory(selectedCategory.id) : [];

  return (
    <>
      {/* Hero */}
      <Reveal as="section" className="mt-[60px] px-8 py-12 text-center">
        <span className="inline-block text-[var(--color-campari)] text-sm uppercase tracking-widest mb-4">
          {t('partners.heroLabel')}
        </span>
        <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-wide mb-6">
          {t('partners.heroTitle')}
        </h1>
        <p className="max-w-2xl mx-auto text-[var(--color-text-muted)] font-[var(--font-serif)]">
          {t('partners.heroDesc')}
        </p>
      </Reveal>

      {/* Catalog: Categories or Drinks */}
      <Reveal as="section" className="px-6 py-16 max-w-[1200px] mx-auto">
        {!selectedCategory ? (
          <>
            <h2 className="font-[var(--font-display)] text-2xl font-bold uppercase mb-2 text-center">
              {t('partners.catalogTitle')}
            </h2>
            <p className="text-[var(--color-text-muted)] text-center mb-12 max-w-xl mx-auto">
              {t('partners.catalogSubtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {drinkCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  drinkCount={getDrinksByCategory(category.id).length}
                  onClick={() => handleCategorySelect(category)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleBackToCategories}
              className="mb-6 text-[var(--color-campari)] hover:text-[var(--color-campari-light)] font-medium text-sm uppercase tracking-wider transition-colors"
            >
              ← {t('partners.catalogTitle')}
            </button>
            <h2 className="font-[var(--font-display)] text-2xl font-bold uppercase mb-2 text-center">
              {lang === 'en' ? selectedCategory.nameEn : selectedCategory.name}
            </h2>
            <p className="text-[var(--color-text-muted)] text-center mb-12 max-w-xl mx-auto">
              {lang === 'en' ? selectedCategory.descriptionEn : selectedCategory.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {drinks.map((drink) => (
                <DrinkCard
                  key={drink.id}
                  drink={drink}
                  onClick={() => handleDrinkSelect(drink)}
                />
              ))}
            </div>
          </>
        )}
      </Reveal>

      {/* Drink Modal */}
      {selectedDrink && selectedCategory && (
        <DrinkModal
          drink={selectedDrink}
          category={selectedCategory}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
