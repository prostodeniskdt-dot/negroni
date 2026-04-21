'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

/* TODO: заменить action на реальный endpoint подписки (сейчас заглушка) */
const NEWSLETTER_ACTION = 'https://example.com/newsletter-placeholder';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 px-6 md:px-12 lg:px-20 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rounded-full bg-[var(--color-campari)]/30 animate-liquid-wave" />
                <div className="absolute inset-1 rounded-full bg-[var(--color-campari)]/60" />
              </div>
              <Link
                href="/"
                className="font-[var(--font-display)] text-lg tracking-wide text-[var(--color-text-primary)] no-underline hover:text-[var(--color-campari)] transition-colors"
              >
                {t('logo')}
              </Link>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
              {t('hero.desc')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--color-text-primary)] mb-4">
                {t('nav.collection')}
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/collection" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors">
                    {t('collection.title')}
                  </Link>
                </li>
                <li>
                  <Link href="/curations" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors">
                    {t('nav.curations')}
                  </Link>
                </li>
                <li>
                  <Link href="/recipes" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors">
                    {t('nav.map')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--color-text-primary)] mb-4">
                {t('about.title')}
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/history" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors">
                    {t('nav.history')}
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors">
                    {t('nav.partners')}
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors">
                    {t('submit.title')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--color-text-primary)] mb-4">
              {t('footer.newsletterTitle')}
            </h4>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              {t('footer.newsletterDesc')}
            </p>
            <form
              action={NEWSLETTER_ACTION}
              method="post"
              target="_blank"
              rel="noopener noreferrer"
              className="flex"
            >
              <input
                type="email"
                name="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-campari)]/50 transition-colors rounded-l-[var(--radius-sm)]"
                aria-label={t('footer.newsletterPlaceholder')}
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[var(--color-campari)] text-[var(--color-on-campari)] text-xs tracking-widest uppercase hover:bg-[var(--color-campari-light)] transition-colors rounded-r-[var(--radius-sm)]"
              >
                {t('footer.newsletterSubmit')}
              </button>
            </form>
          </div>
        </div>

        <div className="py-6 border-t border-[var(--color-border)] mt-10">
          <h4 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            {t('roadmap.title')}
          </h4>
          <p className="text-xs text-[var(--color-text-secondary)] mb-3">
            {t('roadmap.desc')}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-campari)]" />
              {t('roadmap.item1')}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-campari)]" />
              {t('roadmap.item2')}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-campari)]" />
              {t('roadmap.item3')}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-campari)]" />
              {t('roadmap.item4')}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-campari)]" />
              {t('roadmap.item5')}
            </li>
          </ul>
        </div>

        <div className="pt-8 border-t border-[var(--color-border)]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-secondary)]">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
