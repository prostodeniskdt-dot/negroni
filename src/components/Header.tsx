'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import { useFavorites } from '@/hooks/useFavorites';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
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
          ? 'bg-[var(--color-bg)]/90 backdrop-blur-xl border-b border-[var(--color-border)] theme-light:bg-white/90'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-4 md:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0 no-underline"
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-[var(--color-campari)]/20 animate-liquid-wave" />
            <div className="absolute inset-1 rounded-full bg-[var(--color-campari)]/40 animate-liquid-wave [animation-delay:0.5s]" />
            <div className="absolute inset-2 rounded-full bg-[var(--color-campari)]/70" />
          </div>
          <span className="font-[var(--font-display)] text-xl tracking-wide text-[var(--color-text-primary)] group-hover:text-[var(--color-campari)] transition-colors duration-500">
            {t('logo')}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm tracking-widest uppercase transition-colors duration-500 group ${
                pathname === link.href
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--color-campari)] group-hover:w-full transition-all duration-500" />
            </Link>
          ))}

          <Link
            href="/favorites"
            className="relative flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
            aria-label={t('nav.favorites')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-[var(--color-campari)] text-[var(--color-on-campari)] text-[0.6rem] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                {favCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-2 py-1.5 rounded-[var(--radius-sm)] cursor-pointer text-xs font-semibold flex items-center justify-center min-w-[32px] min-h-[32px] transition-all hover:text-[var(--color-text-primary)] hover:border-[var(--color-campari)] hover:bg-[rgba(187,10,48,0.1)]"
            aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            )}
          </button>

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
            className="ml-2 px-5 py-2.5 text-sm tracking-widest uppercase border border-[var(--color-campari)]/40 text-[var(--color-campari)] bg-transparent hover:bg-[var(--color-campari)] hover:text-[var(--color-on-campari)] transition-all duration-500 no-underline"
            aria-label={t('nav.map')}
          >
            {t('nav.map')}
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link href="/favorites" className="relative p-2 text-[var(--color-text-muted)]" aria-label={t('nav.favorites')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            {favCount > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--color-campari)] text-[var(--color-on-campari)] text-[0.6rem] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center">{favCount}</span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]"
            aria-label={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
          >
            {theme === 'light' ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>}
          </button>
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
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 bg-[var(--color-bg)]/95 backdrop-blur-xl flex flex-col gap-2 border-t border-[var(--color-border)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-base tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border-b border-[var(--color-border)]/30"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
