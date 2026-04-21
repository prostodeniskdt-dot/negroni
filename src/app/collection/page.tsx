'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { useFavorites } from '@/hooks/useFavorites';
import Reveal from '@/components/Reveal';
import {
  recipes,
  getAllRegions,
  getAllTags,
  getAllCategories,
  getAllDifficulties,
  filterRecipes,
  type RecipeEntry,
} from '@/data/recipes';

const FLAVOR_KEYS = ['bitter', 'sweet', 'sour', 'spicy', 'strong'] as const;

const DEFAULT_FLAVOR_RANGE: [number, number] = [0, 10];

function getUniqueCitiesCount(entries: RecipeEntry[]): number {
  const cities = new Set(entries.map((r) => r.city));
  return cities.size;
}

export default function CollectionPage() {
  const { t } = useI18n();
  const { isFavorite, toggle } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [flavorFilters, setFlavorFilters] = useState<
    Record<string, [number, number]>
  >({});
  const [flavorOpen, setFlavorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'region' | 'difficulty'>('name');

  const regions = useMemo(() => getAllRegions(), []);
  const tags = useMemo(() => getAllTags(), []);
  const categories = useMemo(() => getAllCategories(), []);
  const difficulties = useMemo(() => getAllDifficulties(), []);

  const filteredResults = useMemo(() => {
    const results = filterRecipes({
      query: searchQuery || undefined,
      region: selectedRegion || undefined,
      tags: activeTags.length > 0 ? activeTags : undefined,
      ingredients: ingredientSearch || undefined,
      category: selectedCategory || undefined,
      difficulty: selectedDifficulty || undefined,
      flavor:
        Object.keys(flavorFilters).length > 0
          ? Object.fromEntries(
              Object.entries(flavorFilters).filter(
                ([, range]) =>
                  range[0] !== DEFAULT_FLAVOR_RANGE[0] ||
                  range[1] !== DEFAULT_FLAVOR_RANGE[1]
              )
            )
          : undefined,
    });

    const difficultyOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.recipe.name.localeCompare(b.recipe.name, 'ru');
        case 'region':
          return a.recipe.region.localeCompare(b.recipe.region, 'ru');
        case 'difficulty':
          return (difficultyOrder[a.recipe.difficulty] ?? 0) - (difficultyOrder[b.recipe.difficulty] ?? 0);
        default:
          return 0;
      }
    });
  }, [
    searchQuery,
    selectedRegion,
    activeTags,
    ingredientSearch,
    flavorFilters,
    selectedCategory,
    selectedDifficulty,
    sortBy,
  ]);

  const uniqueCitiesCount = useMemo(
    () => getUniqueCitiesCount(recipes),
    []
  );

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const updateFlavorRange = (key: string, index: 0 | 1, value: number) => {
    setFlavorFilters((prev) => {
      const current = prev[key] ?? [...DEFAULT_FLAVOR_RANGE];
      const next = [...current] as [number, number];
      next[index] = value;
      if (next[0] > next[1]) next[1 - index] = value;
      return { ...prev, [key]: next };
    });
  };

  const resetFlavorFilters = () => {
    setFlavorFilters({});
  };

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="mt-[60px] min-h-[35vh] flex flex-col justify-center px-8 py-10 relative overflow-hidden noise-overlay">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(187,10,48,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[900px]">
          <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-wide leading-[0.95] mb-3 text-shadow-[0_0_40px_rgba(187,10,48,0.2)]">
            {t('collection.title')}
          </h1>
          <p className="font-[var(--font-serif)] text-[clamp(0.9rem,1.2vw,1.05rem)] text-[var(--color-text-muted)] max-w-[50ch] leading-relaxed mb-4">
            {t('collection.desc')}
          </p>
          <div className="flex flex-wrap gap-6 text-[var(--color-text-muted)]">
            <span className="text-[0.95rem]">
              <span className="font-semibold text-[var(--color-text-primary)]">
                {recipes.length}
              </span>{' '}
              {t('collection.recipesCount')}
            </span>
            <span className="text-[0.95rem]">
              <span className="font-semibold text-[var(--color-text-primary)]">
                {uniqueCitiesCount}
              </span>{' '}
              {t('collection.citiesCount')}
            </span>
          </div>
        </div>
      </section>

      {/* ====== CONTROLS ====== */}
      <Reveal as="section" className="px-6 py-6 max-w-[1200px] mx-auto">
        <div className="space-y-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('collection.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
            />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
            >
              <option value="">{t('collection.allRegions')}</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
            >
              <option value="">{t('collection.allCategories', 'Все категории')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
            >
              <option value="">{t('collection.anyDifficulty', 'Любая сложность')}</option>
              <option value="easy">{t('collection.difficultyEasy', 'Легко')}</option>
              <option value="medium">{t('collection.difficultyMedium', 'Средне')}</option>
              <option value="hard">{t('collection.difficultyHard', 'Сложно')}</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'region' | 'difficulty')}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
            >
              <option value="name">{t('collection.sortByName', 'По названию')}</option>
              <option value="region">{t('collection.sortByRegion', 'По региону')}</option>
              <option value="difficulty">{t('collection.sortByDifficulty', 'По сложности')}</option>
            </select>
          </div>

          <input
            type="text"
            placeholder={t('collection.ingredients')}
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
          />

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-[var(--radius-sm)] transition-all ${
                  activeTags.includes(tag)
                    ? 'bg-[var(--color-campari)] text-[var(--color-on-campari)]'
                    : 'bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setFlavorOpen((v) => !v)}
              className="px-4 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] hover:border-[var(--color-campari)] transition-all flex items-center gap-2"
            >
              {t('collection.flavor')}
              <span className="text-[var(--color-text-muted)]">
                {flavorOpen ? '▲' : '▼'}
              </span>
            </button>
            {flavorOpen && (
              <div className="mt-4 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] space-y-4">
                {FLAVOR_KEYS.map((key) => {
                  const range = flavorFilters[key] ?? [...DEFAULT_FLAVOR_RANGE];
                  return (
                    <div key={key} className="space-y-1">
                      <label className="block text-sm text-[var(--color-text-muted)]">
                        {t(`flavor.${key}`)}: {range[0]}–{range[1]}
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="range"
                          min={0}
                          max={10}
                          value={range[0]}
                          onChange={(e) =>
                            updateFlavorRange(
                              key,
                              0,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="flex-1 h-2 bg-[var(--color-border)] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-campari)]"
                        />
                        <input
                          type="range"
                          min={0}
                          max={10}
                          value={range[1]}
                          onChange={(e) =>
                            updateFlavorRange(
                              key,
                              1,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="flex-1 h-2 bg-[var(--color-border)] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-campari)]"
                        />
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={resetFlavorFilters}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  {t('collection.resetFlavor')}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-[var(--color-text-muted)]">
          {t('collection.found')}: {filteredResults.length}
        </p>
      </Reveal>

      {/* ====== GRID ====== */}
      <Reveal as="section" className="px-6 py-8 max-w-[1200px] mx-auto">
        {filteredResults.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-center py-12 font-[var(--font-serif)]">
            {t('collection.empty')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResults.map((entry) => (
              <Link
                key={entry.id}
                href={`/recipe/${entry.id}`}
                className="block group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-[var(--transition-base)] hover:-translate-y-1 hover:border-[var(--color-campari)] hover:shadow-[var(--shadow-lg),0_0_24px_rgba(187,10,48,0.15)]"
              >
                <div
                  className="card-media aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${entry.recipe.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-campari-darker)] via-transparent to-transparent opacity-60" />
                </div>
                <div className="relative p-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(entry.id);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--color-surface-solid)]/90 border border-[var(--color-border)] flex items-center justify-center text-lg transition-colors hover:border-[var(--color-campari)] hover:bg-[var(--color-campari)]"
                    aria-label={
                      isFavorite(entry.id)
                        ? t('recipe.removeFavorite')
                        : t('recipe.addFavorite')
                    }
                  >
                    {isFavorite(entry.id) ? '❤️' : '🤍'}
                  </button>

                  <span className="inline-block text-[0.7rem] text-[var(--color-on-campari)] bg-[var(--color-campari)] px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
                    {entry.recipe.region}
                  </span>

                  <h3 className="font-[var(--font-display)] text-[1.15rem] font-bold uppercase tracking-wide mb-1.5 group-hover:text-[var(--color-campari-light)] transition-colors">
                    {entry.recipe.name}
                  </h3>

                  <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-snug line-clamp-2 mb-3">
                    {entry.recipe.intro}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {entry.recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.7rem] px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Reveal>
    </>
  );
}
