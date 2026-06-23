'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { usePublicRecipes } from '@/hooks/usePublicRecipes';
import Reveal from '@/components/Reveal';
import { PublicRecipeImage } from '@/components/PublicRecipeImage';
import { getRecipeByIdFrom, getRecipeCardImage } from '@/lib/public-recipes';

const HISTORY_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;

const timelineEvents = [
  {
    year: '1806',
    key: '1806',
    link: null,
  },
  {
    year: '1860',
    key: '1860',
    link: null,
  },
  {
    year: '1868',
    key: '1868',
    link: null,
  },
  {
    year: '1919',
    key: '1919',
    link: '/recipe/classic',
  },
  {
    year: '1920',
    key: '1920',
    link: null,
  },
  {
    year: '1943',
    key: '1943',
    link: null,
  },
  {
    year: '1960',
    key: '1960',
    link: null,
  },
  {
    year: '2003',
    key: '2003',
    link: null,
  },
  {
    year: '2013',
    key: '2013',
    link: null,
  },
  {
    year: '2024',
    key: '2024',
    link: null,
  },
  {
    year: '2024',
    key: '2024',
    link: '/collection',
  },
] as const;

function HistoryHoverPopover({
  imageKey,
  alt,
  year,
  title,
  lang,
  priority,
  align,
}: {
  imageKey: string;
  alt: string;
  year: string;
  title: string;
  lang: string;
  priority: boolean;
  align: 'left' | 'right';
}) {
  const [extIdx, setExtIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  if (broken) return null;

  const src = `/images/history/${imageKey}${HISTORY_IMAGE_EXTENSIONS[extIdx]}`;

  return (
    <div
      className={`hidden md:block absolute top-6 ${
        align === 'left' ? '-left-6 -translate-x-full' : '-right-6 translate-x-full'
      } w-[280px] lg:w-[320px] pointer-events-none z-30 opacity-0 scale-[0.98] translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0`}
      aria-hidden
    >
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-solid)] shadow-[var(--shadow-lg)]">
        <div className="relative aspect-[4/3]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="320px"
            className="object-cover"
            priority={priority}
            onError={() => {
              if (extIdx < HISTORY_IMAGE_EXTENSIONS.length - 1) {
                setExtIdx((i) => i + 1);
                return;
              }
              setBroken(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-transparent to-transparent" />
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--color-accent)] font-semibold">
              {year}
            </span>
            <span className="text-[0.7rem] text-[var(--color-text-secondary)]">
              {lang === 'ru' ? 'Наведи' : 'Hover'}
            </span>
          </div>
          <div className="mt-1 text-sm text-[var(--color-text-primary)] font-display uppercase tracking-wide line-clamp-2">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { t, lang } = useI18n();
  const { recipes } = usePublicRecipes();
  const classicRecipe = getRecipeByIdFrom(recipes, 'classic');

  return (
    <>
      {/* Hero */}
      <section className="mt-[60px] min-h-[35vh] flex flex-col justify-center px-8 py-10 relative overflow-hidden noise-overlay">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(187,10,48,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[900px]">
          <h1 className="type-page-title text-[clamp(2rem,5vw,3.5rem)] mb-3 text-shadow-[0_0_40px_rgba(187,10,48,0.2)]">
            {t('history.title')}
          </h1>
          <p className="type-prose text-[clamp(0.9rem,1.2vw,1.05rem)] text-[var(--color-text-muted)] max-w-[55ch]">
            {t('history.desc')}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <Reveal as="section" className="px-6 py-12 max-w-[900px] mx-auto relative">
        {/* Ambient backdrop for depth */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[min(980px,95vw)] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(248,207,44,0.07)_0%,transparent_60%)] blur-2xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,rgba(187,10,48,0.6),transparent)] -translate-x-1/2 hidden md:block"
          aria-hidden
        />
        <div className="space-y-12 md:space-y-16">
          {timelineEvents.map((event, idx) => {
            const isLeft = idx % 2 === 0;
            const hasImage = classicRecipe && event.key === '1919';
            const hasLink = event.link;
            return (
              <Reveal
                key={event.key}
                as="div"
                className={`relative flex flex-col md:flex-row items-start gap-6 ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-full md:w-[calc(50%-2rem)] ${
                    isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                  }`}
                >
                  <div
                    className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] overflow-hidden transition-all hover:-translate-y-0.5 hover:border-[var(--color-campari)]/45 hover:shadow-[var(--shadow-md)] focus-within:-translate-y-0.5 focus-within:border-[var(--color-campari)]/45 focus-within:shadow-[var(--shadow-md)]"
                    tabIndex={0}
                  >
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity pointer-events-none ${
                        hasImage ? 'group-hover:opacity-100' : ''
                      }`}
                      aria-hidden
                    />
                    {/* Accent strip */}
                    <div
                      className={`absolute top-0 h-full w-[3px] bg-[linear-gradient(to_bottom,rgba(187,10,48,0.0),rgba(187,10,48,0.9),rgba(248,207,44,0.75),rgba(187,10,48,0.0))] ${
                        isLeft ? 'right-0' : 'left-0'
                      }`}
                      aria-hidden
                    />
                    {/* Soft corner glow */}
                    <div
                      className={`absolute -top-20 ${
                        isLeft ? '-left-16' : '-right-16'
                      } w-72 h-72 bg-[radial-gradient(circle,rgba(187,10,48,0.22)_0%,transparent_60%)] blur-2xl pointer-events-none`}
                      aria-hidden
                    />

                    <div className="p-6 md:p-7">
                      <div
                        className={`flex items-baseline gap-3 ${
                          isLeft ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        <span className="inline-flex items-center justify-center h-7 px-3 rounded-full bg-[var(--color-bg)]/30 border border-[var(--color-border)] text-[var(--color-accent)] font-display font-bold text-sm tracking-wide">
                          {event.year}
                        </span>
                        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-[var(--color-text-primary)]">
                          {t(`history.${event.key}.title`)}
                        </h2>
                      </div>

                      <p className="mt-3 text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed">
                        {t(`history.${event.key}.desc`)}
                      </p>

                      {/* Hover image popover (desktop) */}
                      <HistoryHoverPopover
                        imageKey={event.key}
                        alt={t(`history.${event.key}.title`)}
                        year={event.year}
                        title={t(`history.${event.key}.title`)}
                        lang={lang}
                        priority={idx < 2}
                        align={isLeft ? 'left' : 'right'}
                      />

                      {hasImage && (
                        <PublicRecipeImage
                          src={getRecipeCardImage(classicRecipe.recipe)}
                          alt={classicRecipe.recipe.name}
                          className="mt-5 aspect-[3/4] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                          overlay={
                            <div
                              className={`absolute inset-0 bg-gradient-to-t from-[var(--color-campari-darker)] via-transparent to-transparent opacity-45`}
                            />
                          }
                        />
                      )}

                      {hasLink && (
                        <div className={`mt-5 ${isLeft ? 'md:text-right' : ''}`}>
                          <Link
                            href={event.link!}
                            className="inline-flex items-center gap-1 text-[var(--color-campari-light)] hover:text-[var(--color-accent)] transition-colors font-medium text-sm"
                          >
                            {t(`history.${event.key}.link`)}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline marker */}
                <div
                  className="absolute left-1/2 top-8 -translate-x-1/2 hidden md:block"
                  aria-hidden
                >
                  <div className="w-4 h-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]" />
                  <div className="absolute inset-0 rounded-full bg-[var(--color-campari)] opacity-80 animate-pulse-glow" />
                  <div className="absolute inset-0 rounded-full border border-[var(--color-accent)]/40 scale-[1.85]" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      {/* Family Tree */}
      <Reveal as="section" className="px-6 py-10 max-w-[1050px] mx-auto">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <span className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.26em] uppercase text-[var(--color-accent)]">
              Negroni Family Tree
            </span>
            <h2 className="mt-2 font-display text-2xl md:text-3xl uppercase tracking-wide text-[var(--color-text-primary)]">
              Вариации Негрони
            </h2>
            <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
              От Americano и Milano Torino до Coffee Negroni и Rosita — ветви одного семейства, где каждая версия развивает базовую формулу по-своему.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Americano',
              'Milano Torino',
              'Negroni',
              'Sbagliato',
              'Boulevardier',
              'Coffee Negroni',
              'Kingston Negroni',
              'Rosita',
              'Cardinale',
              'Old Pal',
            ].map((name, index) => (
              <Reveal
                as="div"
                key={name}
                className="group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/45 p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--color-campari)]/55 hover:shadow-[0_0_22px_rgba(158,61,79,0.2)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-campari)] to-transparent opacity-30 group-hover:opacity-100 transition-opacity"
                  style={{ transitionDelay: `${index * 40}ms` }}
                  aria-hidden
                />
                <span className="block text-[0.72rem] tracking-[0.2em] uppercase text-[var(--color-text-secondary)]">
                  Ветвь {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-lg uppercase tracking-wide text-[var(--color-text-primary)] group-hover:text-[var(--color-campari-light)] transition-colors">
                  {name}
                </h3>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Quote */}
      <Reveal as="section" className="px-6 py-16 max-w-[700px] mx-auto">
        <blockquote className="relative py-8 px-8 md:px-12 border-y border-[var(--color-campari)]/50 border-l-4 border-r-4 border-l-[var(--color-campari)] border-r-[var(--color-campari)] bg-[var(--color-surface)] rounded-[var(--radius-md)]">
          <p className="font-prose text-lg md:text-xl italic text-[var(--color-text-primary)] leading-relaxed mb-4">
            {t('history.quote')}
          </p>
          <cite className="block text-[var(--color-text-muted)] text-sm not-italic">
            {t('history.quoteAuthor')}
          </cite>
        </blockquote>
      </Reveal>

      {/* Read also */}
      <Reveal as="section" className="px-6 py-12 max-w-[700px] mx-auto">
        <h3 className="font-display text-lg font-bold uppercase tracking-wide mb-4 text-center">
          {lang === 'ru' ? 'Читайте также' : 'Read also'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/collection"
            className="block p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-campari)] transition-all group"
          >
            <h4 className="font-display font-bold uppercase text-sm group-hover:text-[var(--color-campari-light)] transition-colors">
              {t('collection.title')}
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {t('collection.desc')}
            </p>
          </Link>
          <Link
            href="/recipes"
            className="block p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-campari)] transition-all group"
          >
            <h4 className="font-display font-bold uppercase text-sm group-hover:text-[var(--color-campari-light)] transition-colors">
              {t('map.title')}
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {t('map.desc')}
            </p>
          </Link>
        </div>
      </Reveal>
    </>
  );
}
