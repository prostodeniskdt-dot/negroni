'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

export function TeaserAbout() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20 border-t border-[var(--color-border)]"
    >
      <div className="absolute top-0 left-[15%] right-[15%] h-px bg-[linear-gradient(90deg,transparent,var(--color-campari),transparent)] opacity-50" />
      <div
        className={`max-w-[min(640px,58ch)] mx-auto transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="font-[var(--font-display)] text-2xl font-bold tracking-wide mb-4 text-[var(--color-text-primary)]">
          {t('about.title')}
        </h2>
        <p className="text-[var(--color-text-muted)] font-[var(--font-serif)] text-[0.95rem] leading-[1.75] mb-3">
          {t('about.p1')}
        </p>
        <p className="text-[var(--color-text-muted)] font-[var(--font-serif)] text-[0.95rem] leading-[1.75] mb-3">
          {t('about.p2')}
        </p>
        <p
          className="text-[var(--color-text-muted)] font-[var(--font-serif)] text-[0.95rem] leading-[1.75] mb-4"
          dangerouslySetInnerHTML={{ __html: t('about.p3') }}
        />
        <p>
          <Link
            href="/partners"
            className="text-[0.9rem] text-[var(--color-text-muted)] no-underline transition-all hover:text-[var(--color-text-primary)] hover:underline hover:translate-x-1 inline-block"
          >
            {t('about.partnerLink')}
          </Link>
        </p>
      </div>
    </section>
  );
}
