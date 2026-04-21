'use client';

export function MarqueeBand() {
  const items = [
    'GIN',
    'CAMPARI',
    'VERMOUTH',
    'NEGRONI',
    'SBAGLIATO',
    'BOULEVARDIER',
    'AMERICANO',
    'BITTER',
    'APERITIVO',
    'COCKTAIL',
  ];

  return (
    <div
      data-pause-on-hover="true"
      className="relative overflow-hidden py-6 border-y border-[var(--color-border)] bg-[var(--color-surface)]/50"
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 25s linear infinite' }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`marquee-${i}`}
            className="flex items-center gap-6 mx-6 text-sm md:text-base tracking-[0.3em] uppercase text-[var(--color-text-muted)]/60 font-light hover:text-[var(--color-campari)]/80 transition-colors duration-500 cursor-default"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-campari)]/40" />
          </span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--color-surface)]/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--color-surface)]/50 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
