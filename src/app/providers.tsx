'use client';

import { ThemeProvider } from '@/hooks/useTheme';
import { I18nProvider } from '@/hooks/useI18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
