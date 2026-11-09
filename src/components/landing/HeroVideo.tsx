'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const VIDEO_SRC = '/videos/negroni-hero.mp4';
const POSTER_SRC = '/images/hero/negroni-film-poster.jpg';

export function HeroVideo() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasSource, setHasSource] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!reducedMotion.matches && !connection?.saveData) setHasSource(true);

    const stopForReducedMotion = () => {
      if (reducedMotion.matches) videoRef.current?.pause();
    };
    reducedMotion.addEventListener('change', stopForReducedMotion);
    return () => reducedMotion.removeEventListener('change', stopForReducedMotion);
  }, []);

  useEffect(() => {
    if (!hasSource || failed) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => setPlaying(false));
  }, [hasSource, failed]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) videoRef.current?.pause();
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);

  const togglePlayback = () => {
    if (!hasSource) {
      setHasSource(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <div className="relative isolate aspect-video min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-black shadow-[var(--shadow-lg)] self-start">
      <Image
        src={POSTER_SRC}
        alt={t('hero.videoLabel')}
        fill
        sizes="(min-width: 1440px) 840px, (min-width: 1024px) 60vw, 100vw"
        className="object-contain"
        priority
      />
      {!failed && (
        <video
          ref={videoRef}
          src={hasSource ? VIDEO_SRC : undefined}
          poster={POSTER_SRC}
          autoPlay={hasSource}
          muted={muted}
          loop
          playsInline
          preload="none"
          aria-label={t('hero.videoLabel')}
          className="absolute inset-0 h-full w-full object-contain"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onError={() => { setPlaying(false); setFailed(true); }}
        />
      )}
      {!failed && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 sm:bottom-4 sm:right-4">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={t(playing ? 'hero.pauseVideo' : 'hero.playVideo')}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/65 px-4 py-2.5 text-sm text-white backdrop-blur-md transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            <span>{t(playing ? 'hero.pauseVideo' : 'hero.playVideo')}</span>
          </button>
          <button
            type="button"
            disabled={!hasSource}
            onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.muted = !video.muted;
                setMuted(video.muted);
              }
            }}
            aria-label={t(muted ? 'hero.unmuteVideo' : 'hero.muteVideo')}
            title={t(muted ? 'hero.unmuteVideo' : 'hero.muteVideo')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur-md transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-40"
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
        </div>
      )}
    </div>
  );
}
