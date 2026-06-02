'use client';

import { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import Reveal from '@/components/Reveal';
export default function SubmitRecipePage() {
  const { lang } = useI18n();
  const [query, setQuery] = useState('');
  const link = `https://t.me/${lang === 'ru' ? 'barbossonline' : 'barbossonline'}`;
  const title = lang === 'ru' ? 'Добавление через чат' : 'Chat-based updates';
  const heroTitle = lang === 'ru' ? 'Обновления каталога' : 'Catalog updates';
  const heroDesc = lang === 'ru'
    ? 'Добавляйте новые рецепты, напитки и партнёрские карточки через чат с агентом.'
    : 'Add new recipes, drinks, and partner cards through agent chat.';

  return (
    <>
      {/* Hero */}
      <section className="mt-[60px] min-h-[25vh] flex flex-col justify-center px-8 py-10 relative overflow-hidden noise-overlay">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(187,10,48,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[700px]">
          <h1 className="type-page-title text-[clamp(2rem,5vw,3rem)] mb-3">
            {heroTitle}
          </h1>
          <p className="type-prose text-[var(--color-text-muted)] max-w-[55ch]">
            {heroDesc}
          </p>
        </div>
      </section>

      {/* Form */}
      <Reveal as="section" className="px-6 py-10 max-w-[700px] mx-auto">
        <div className="space-y-5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
              {lang === 'ru' ? 'Что хотите добавить' : 'What would you like to add'}
            </label>
            <textarea
              placeholder={lang === 'ru' ? 'Опишите новый напиток, обновление по партнёрам или рецепт...' : 'Describe a new drink, partner update, or recipe...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors resize-y"
            />
          </div>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {lang === 'ru'
              ? 'Вход в админ-панель убран. Добавляйте новые напитки и обновления через чат с агентом — так безопаснее и быстрее для текущего формата проекта.'
              : 'Admin login has been removed. Add new drinks and updates via chat with the agent for a faster and safer workflow.'}
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-primary)]">
            {title}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-campari)] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-campari)] transition-colors hover:bg-[var(--color-campari-light)]"
          >
            {lang === 'ru' ? 'Открыть чат для обновлений' : 'Open chat for updates'}
          </a>
        </div>
      </Reveal>
    </>
  );
}
