'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const HERO_IMAGE_SRC = '/images/hero-negroni.png';
const HERO_IMAGE_ALT = 'Негрони на мраморном столе';

function useAnimatedCounter(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return count;
}

export function HeroSection() {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const recipesCount = useAnimatedCounter(100, 2000, loaded);
  const citiesCount = useAnimatedCounter(27, 1800, loaded);
  const yearCount = useAnimatedCounter(2025, 2200, loaded);

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-stage relative min-h-screen flex flex-col overflow-hidden bg-[var(--hero-wall,#f3f0ea)]"
    >
      <div
        className="hero-photo-layer z-0 transition-transform duration-100"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <Image
          src={HERO_IMAGE_SRC}
          alt={HERO_IMAGE_ALT}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#ebe7e1]/20" />
      </div>

      <div className="hero-table-edge" aria-hidden />
      <div
        className="hero-marble-surface z-[1]"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
        aria-hidden
      />
      <div className="hero-stage-fade" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 pt-[calc(var(--header-height)+1.5rem)] pb-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <span className="inline-flex items-center gap-3 text-base font-light tracking-[var(--letter-spacing-wide)] uppercase text-[var(--hero-accent,#8b3344)]">
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
            Est. 2025
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
          </span>
        </div>

        <h1 className="type-hero-title mt-6 w-full text-balance flex flex-col items-center gap-3 md:gap-4">
          <span
            className={`block text-[clamp(2.25rem,7vw,4rem)] leading-[1.2] text-[var(--hero-text,#1a1816)] transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '0.7s' }}
          >
            {t('hero.subtitle')}
          </span>
          <span
            className={`block text-[clamp(2.5rem,8vw,5rem)] leading-[1.22] text-[var(--hero-accent,#8b3344)] italic transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '0.95s' }}
          >
            {t('hero.title')}
          </span>
        </h1>

        <p
          className={`mt-6 font-display text-lg md:text-xl font-light text-[var(--hero-text-muted,rgba(26,24,22,0.62))] max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1.3s' }}
        >
          {t('hero.desc')}
        </p>

        <div
          className={`mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-lg sm:max-w-none transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1.6s' }}
        >
          <Link
            href="/recipes"
            className="group relative overflow-hidden px-8 py-4 bg-[var(--hero-accent,#8b3344)] text-[#f5f0e8] text-base tracking-[var(--letter-spacing-wide)] uppercase font-normal transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,51,68,0.25)]"
          >
            <span className="relative z-10">{t('hero.cta')}</span>
            <div className="absolute inset-0 bg-[#1a1816] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
          <Link
            href="/collection"
            className="group relative px-8 py-4 border border-black/15 text-[var(--hero-text,#1a1816)] text-base tracking-[var(--letter-spacing-wide)] uppercase font-normal hover:border-[var(--hero-accent,#8b3344)]/40 hover:text-[var(--hero-accent,#8b3344)] transition-all duration-500 overflow-hidden bg-white/20 backdrop-blur-[2px]"
          >
            <span className="relative z-10">{t('hero.secondary')}</span>
            <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-full bg-[var(--hero-accent,#8b3344)]/5 transition-all duration-700" />
          </Link>
        </div>

        <div
          className={`mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-14 transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1.9s' }}
        >
          {[
            { value: `${recipesCount}+`, label: t('hero.statsRecipes') },
            { value: String(citiesCount), label: t('hero.statsCities') },
            { value: String(yearCount), label: t('hero.statsYear') },
          ].map((stat) => (
            <div key={stat.label} className="text-center min-w-[5.5rem]">
              <div className="type-stat text-4xl md:text-5xl text-[var(--hero-accent,#8b3344)]">
                {stat.value}
              </div>
              <div className="mt-2.5 type-label text-[var(--hero-text-muted,rgba(26,24,22,0.62))] tracking-[var(--letter-spacing-wide)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 shrink-0 flex justify-center pb-10 pt-2">
        <Link
          href="#collection-teaser"
          className="flex flex-col items-center gap-2 text-[var(--hero-text-muted,rgba(26,24,22,0.62))] hover:text-[var(--hero-accent,#8b3344)] transition-colors"
        >
          <span className="type-label tracking-[var(--letter-spacing-wide)]">{t('hero.scrollHint')}</span>
          <ChevronDown size={26} className="animate-bounce" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
