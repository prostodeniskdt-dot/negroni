import Link from 'next/link';
import Reveal from '@/components/Reveal';

export default function RussianNegroniWeekPage() {
  return (
    <main className="min-h-screen pt-24">
      <Reveal as="section" className="px-6 py-12 max-w-[1100px] mx-auto">
        <Link
          href="/"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          ← На главную
        </Link>

        <div className="mt-10">
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-[var(--color-campari)]">
            Project
          </span>
          <h1 className="mt-4 font-[var(--font-display)] text-[clamp(2.2rem,6vw,4.5rem)] font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
            Russian Negroni Week
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)] font-[var(--font-serif)]">
            Скоро здесь будет страница проекта: описание, участники, города, партнёры и карта событий.
          </p>
        </div>
      </Reveal>
    </main>
  );
}

