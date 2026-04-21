'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import ru from '@/locales/ru';
import en from '@/locales/en';

type Lang = 'ru' | 'en';

const dictionaries: Record<Lang, Record<string, string>> = { ru, en };

interface I18nContextValue {
  lang: Lang;
  t: (key: string, fallback?: string) => string;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'ru',
  t: (key, fallback) => fallback || key,
  toggleLang: () => {},
  setLang: () => {},
});

const STORAGE_KEY = 'negroni-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ru');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === 'ru' || stored === 'en') {
        setLangState(stored);
      }
    } catch { /* no-op */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return dictionaries[lang]?.[key] || dictionaries.ru[key] || fallback || key;
    },
    [lang]
  );

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch { /* no-op */ }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  }, [lang, setLang]);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
