'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import Reveal from '@/components/Reveal';
import { getRecipeById } from '@/data/recipes';

const timelineEvents = [
  { year: '1860', key: '1860', image: null, link: null },
  { year: '1919', key: '1919', image: true, link: '/recipe/classic' },
  { year: '1920', key: '1920', image: null, link: null },
  { year: '1947', key: '1947', image: null, link: null },
  { year: '2000', key: '2000', image: null, link: null },
  { year: '2013', key: '2013', image: null, link: null },
  { year: '2024', key: '2024', image: null, link: null },
  { year: '2025', key: '2025', image: null, link: '/collection' },
] as const;

export default function HistoryPage() {
  const { t, lang } = useI18n();
  const classicRecipe = getRecipeById('classic');

  return (
    <>
      {/* Hero */}
      <section className="mt-[60px] min-h-[35vh] flex flex-col justify-center px-8 py-10 relative overflow-hidden noise-overlay">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(187,10,48,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[900px]">
          <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-wide leading-[0.95] mb-3 text-shadow-[0_0_40px_rgba(187,10,48,0.2)]">
            {t('history.title')}
          </h1>
          <p className="font-[var(--font-serif)] text-[clamp(0.9rem,1.2vw,1.05rem)] text-[var(--color-text-muted)] max-w-[55ch] leading-relaxed">
            {t('history.desc')}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <Reveal as="section" className="px-6 py-12 max-w-[900px] mx-auto relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-campari)]/40 -translate-x-1/2 hidden md:block"
          aria-hidden
        />
        <div className="space-y-12 md:space-y-16">
          {timelineEvents.map((event, idx) => {
            const isLeft = idx % 2 === 0;
            const hasImage = event.image && classicRecipe;
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
                  <span className="inline-block text-[var(--color-accent)] font-[var(--font-display)] font-bold text-xl mb-2">
                    {event.year}
                  </span>
                  <h2 className="font-[var(--font-display)] text-lg font-semibold uppercase tracking-wide mb-2 text-[var(--color-text-primary)]">
                    {t(`history.${event.key}.title`)}
                  </h2>
                  <p className="text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed mb-4">
                    {t(`history.${event.key}.desc`)}
                  </p>
                  {hasImage && (
                    <div className="mb-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
                      <img
                        src={classicRecipe.recipe.image}
                        alt=""
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>
                  )}
                  {hasLink && (
                    <Link
                      href={event.link!}
                      className="inline-flex items-center gap-1 text-[var(--color-campari-light)] hover:text-[var(--color-accent)] transition-colors font-medium text-sm"
                    >
                      {t(`history.${event.key}.link`)}
                    </Link>
                  )}
                </div>
                <div className="absolute left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-campari)] border-2 border-[var(--color-bg)] hidden md:block" />
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      {/* Quote */}
      <Reveal as="section" className="px-6 py-16 max-w-[700px] mx-auto">
        <blockquote className="relative py-8 px-8 md:px-12 border-y border-[var(--color-campari)]/50 border-l-4 border-r-4 border-l-[var(--color-campari)] border-r-[var(--color-campari)] bg-[var(--color-surface)] rounded-[var(--radius-md)]">
          <p className="font-[var(--font-serif)] text-lg md:text-xl italic text-[var(--color-text-primary)] leading-relaxed mb-4">
            {t('history.quote')}
          </p>
          <cite className="block text-[var(--color-text-muted)] text-sm not-italic">
            {t('history.quoteAuthor')}
          </cite>
        </blockquote>
      </Reveal>

      {/* Read also */}
      <Reveal as="section" className="px-6 py-12 max-w-[700px] mx-auto">
        <h3 className="font-[var(--font-display)] text-lg font-bold uppercase tracking-wide mb-4 text-center">
          {lang === 'ru' ? 'Читайте также' : 'Read also'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/collection"
            className="block p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-campari)] transition-all group"
          >
            <h4 className="font-[var(--font-display)] font-bold uppercase text-sm group-hover:text-[var(--color-campari-light)] transition-colors">
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
            <h4 className="font-[var(--font-display)] font-bold uppercase text-sm group-hover:text-[var(--color-campari-light)] transition-colors">
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
