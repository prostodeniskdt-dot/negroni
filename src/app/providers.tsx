'use client';

import { ThemeProvider } from '@/hooks/useTheme';
import { I18nProvider } from '@/hooks/useI18n';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AnalyticsTracker />
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
