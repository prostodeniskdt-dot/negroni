'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { useFavorites } from '@/hooks/useFavorites';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { t, toggleLang, lang } = useI18n();
  const { count: favCount } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/russian-negroni-week', label: t('nav.rnw') || 'Russian Negroni Week', tone: 'primary' as const },
    { href: '/#about', label: t('nav.about') },
    { href: '/collection', label: t('nav.collection') },
    { href: '/curations', label: t('nav.curations') || 'Подборки' },
    { href: '/history', label: t('nav.history') },
    { href: '/partners', label: t('nav.partners') },
  ];

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-[var(--color-bg)]/90 backdrop-blur-xl border-b border-[var(--color-border)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="flex items-center justify-between gap-3 px-6 py-3 md:px-8 lg:px-12 min-h-[var(--header-height)]">
        <div className="flex items-center gap-3 min-w-0 shrink">
          <Link
            href="/"
            className="flex items-center gap-3 group no-underline"
          >
            <div className="w-px h-7 bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent opacity-80" aria-hidden />
            <span className="font-display text-xl md:text-2xl font-semibold tracking-[var(--letter-spacing-hero)] text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-500 leading-tight">
              {t('logo')}
            </span>
          </Link>
          <a
            href="https://barbossonline.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 leading-none no-underline shrink-0 whitespace-nowrap"
            aria-label="Бар Босс Онлайн"
          >
            <span className="type-label text-[0.65rem] tracking-[0.16em] text-[var(--color-text-secondary)]">
              от
            </span>
            <span className="type-label text-[0.65rem] tracking-[0.12em] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
              Бар Босс Онлайн
            </span>
          </a>
        </div>

        <div className="hidden xl:flex flex-wrap items-center justify-end gap-1.5 2xl:gap-2 min-w-0 flex-1 max-w-[62%]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isPrimary = link.tone === 'primary';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isPrimary
                    ? `type-nav relative rounded-full px-3 py-1.5 border border-[var(--color-accent)]/40 text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all duration-500 ${
                        isActive ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/8' : ''
                      }`
                    : `type-nav relative transition-colors duration-500 group ${
                        isActive
                          ? 'text-[var(--color-text-primary)]'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      }`
                }
              >
                {link.label}
                {!isPrimary && (
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-500" />
                )}
              </Link>
            );
          })}

          <Link
            href="/favorites"
            className="relative flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
            aria-label={t('nav.favorites')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-[var(--color-campari)] text-[var(--color-on-campari)] text-[0.6rem] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none font-display">
                {favCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleLang}
            className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-2 py-1.5 rounded-[var(--radius-sm)] cursor-pointer text-xs font-semibold min-w-[32px] min-h-[32px] transition-all hover:text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[rgba(187,10,48,0.1)]"
            aria-label="Сменить язык"
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>

          <Link
            href="/recipes"
            className="type-nav ml-2 px-4 py-2 tracking-[var(--letter-spacing-label)] border border-[var(--color-accent)]/50 text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-contrast)] transition-all duration-500 no-underline shrink-0"
            aria-label={t('nav.map')}
          >
            {t('nav.map')}
          </Link>
        </div>

        <div className="flex xl:hidden items-center gap-2 shrink-0">
          <Link href="/favorites" className="relative p-2 text-[var(--color-text-muted)]" aria-label={t('nav.favorites')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            {favCount > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--color-campari)] text-[var(--color-on-campari)] text-[0.6rem] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center">{favCount}</span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggleLang}
            className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-xs font-semibold text-[var(--color-text-muted)]"
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>
          <Link href="/recipes" className="px-3 py-2 text-xs font-semibold bg-[var(--color-campari)] text-[var(--color-on-campari)] rounded-[var(--radius-sm)] no-underline">
            {t('nav.map')}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-campari)]"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`xl:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-[min(80vh,32rem)] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 bg-[var(--color-bg)]/95 backdrop-blur-xl flex flex-col gap-2 border-t border-[var(--color-border)] overflow-y-auto max-h-[min(80vh,32rem)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 type-nav text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border-b border-[var(--color-border)]/30"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://barbossonline.ru/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="py-3 type-nav text-[var(--color-campari)] hover:text-[var(--color-text-primary)] border-b border-[var(--color-border)]/30"
          >
            Бар Босс Онлайн
          </a>
        </div>
      </div>
    </header>
  );
}
