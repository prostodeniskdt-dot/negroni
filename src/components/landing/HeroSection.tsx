'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const HERO_IMAGE_SRC = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920';
const HERO_IMAGE_ALT = 'Негрони коктейль';

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const recipesCount = useAnimatedCounter(100, 2000, loaded);
  const citiesCount = useAnimatedCounter(27, 1800, loaded);
  const yearCount = useAnimatedCounter(1919, 2200, loaded);

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 transition-transform duration-100"
        style={{
          transform: `translateY(${scrollY * 0.3}px) scale(${1.1 + scrollY * 0.0002})`,
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
        <div className="absolute inset-0 bg-[var(--color-bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/40 via-transparent to-[var(--color-bg)]" />
      </div>

      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--color-campari)]/5 animate-liquid-wave blur-sm"
          style={{
            animationDuration: '8s',
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-[var(--color-accent)]/5 animate-liquid-wave blur-sm"
          style={{
            animationDuration: '10s',
            animationDelay: '1s',
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-40 h-40 bg-[var(--color-campari)]/8 animate-liquid-wave blur-sm"
          style={{
            animationDuration: '7s',
            animationDelay: '2s',
            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
            transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <div
          className="absolute top-[15%] right-[15%] w-3 h-3 rounded-full bg-[var(--color-campari)]/30 animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-[var(--color-accent)]/25 animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-[40%] right-[8%] w-1.5 h-1.5 rounded-full bg-[var(--color-campari)]/20 animate-float"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px z-[1]">
        <div
          className={`w-full bg-gradient-to-b from-[var(--color-campari)]/0 via-[var(--color-campari)]/40 to-[var(--color-campari)]/0 transition-all duration-[3s] ease-out ${
            loaded ? 'h-48' : 'h-0'
          }`}
          style={{ transitionDelay: '1s' }}
        />
        <div
          className={`w-2 h-2 rounded-full bg-[var(--color-campari)]/50 -ml-[3px] transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          style={{
            transitionDelay: '3.5s',
            animation: loaded ? 'float 3s ease-in-out infinite 4s' : 'none',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-[var(--color-campari)]">
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-campari)]/60 to-transparent shimmer-line" />
            EST. 1919
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-campari)]/60 to-transparent shimmer-line" />
          </span>
        </div>

        <h1 className="mt-8 font-[var(--font-display)] text-5xl md:text-7xl lg:text-9xl font-bold leading-[0.9] tracking-tight text-balance">
          <span className="block text-[var(--color-text-primary)] overflow-hidden">
            <span
              className={`inline-block transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
              }`}
              style={{ transitionDelay: '0.7s' }}
            >
              {t('hero.subtitle').toUpperCase()}
            </span>
          </span>
          <span className="block text-[var(--color-campari)] mt-1 overflow-hidden">
            <span
              className={`inline-block transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
              }`}
              style={{ transitionDelay: '0.95s' }}
            >
              {t('hero.title').toUpperCase()}
            </span>
          </span>
        </h1>

        <p
          className={`mt-8 text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1.3s' }}
        >
          {t('hero.desc')}
        </p>

        <div
          className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1.6s' }}
        >
          <Link
            href="/recipes"
            className="group relative overflow-hidden px-8 py-4 bg-[var(--color-campari)] text-[var(--color-on-campari)] text-sm tracking-widest uppercase font-medium transition-all duration-500 hover:shadow-[0_0_40px_rgba(187,10,48,0.3)]"
          >
            <span className="relative z-10">{t('hero.cta')}</span>
            <div className="absolute inset-0 bg-[var(--color-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
          <Link
            href="/collection"
            className="group relative px-8 py-4 border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm tracking-widest uppercase font-medium hover:border-[var(--color-campari)]/50 hover:text-[var(--color-campari)] transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">{t('hero.secondary')}</span>
            <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-full bg-[var(--color-campari)]/5 transition-all duration-700" />
          </Link>
        </div>

        <div
          className={`mt-20 flex items-center justify-center gap-8 md:gap-16 transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1.9s' }}
        >
          {[
            { value: `${recipesCount}+`, label: t('hero.statsRecipes') },
            { value: String(citiesCount), label: t('hero.statsCities') },
            { value: String(yearCount), label: t('hero.statsYear') },
          ].map((stat) => (
            <div key={stat.label} className="text-center group cursor-default">
              <div className="font-[var(--font-display)] text-2xl md:text-4xl font-bold text-[var(--color-campari)] tabular-nums group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="mt-1 text-xs tracking-widest uppercase text-[var(--color-text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <Link
          href="#collection-teaser"
          className="flex flex-col items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors group"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">{t('hero.scrollHint')}</span>
          <div className="relative">
            <ChevronDown
              size={20}
              className="animate-bounce group-hover:text-[var(--color-campari)] relative z-10"
            />
            <div className="absolute inset-0 -m-2 rounded-full border border-[var(--color-campari)]/20 animate-ping" />
          </div>
        </Link>
      </div>
    </section>
  );
}
