'use client';

import { useEffect, useState } from 'react';
import { fallbackRecipeImage } from '@/lib/public-recipes';

type ImageVariant = 'hero' | 'card' | 'thumbnail';

const imageClassByVariant: Record<ImageVariant, string> = {
  hero: 'h-[92%] w-auto max-w-[88%] object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.62)]',
  card: 'h-[90%] w-auto max-w-[84%] object-contain object-bottom drop-shadow-[0_16px_36px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out group-hover:scale-[1.03]',
  thumbnail:
    'h-[86%] w-auto max-w-[80%] object-contain object-bottom drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]',
};

export function PublicRecipeImage({
  src,
  alt,
  className = '',
  overlay,
  variant = 'card',
}: {
  src?: string | null;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
  fit?: 'contain' | 'cover';
  variant?: ImageVariant;
  preserveIntrinsicAspect?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = !failed && src ? src : fallbackRecipeImage;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(196,165,116,0.14),transparent_62%),var(--color-surface-solid)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_12%,rgba(255,255,255,0.07),transparent_72%)]" />
      {variant !== 'hero' && (
        <div className="pointer-events-none absolute bottom-[5%] left-1/2 h-7 w-[58%] -translate-x-1/2 rounded-full bg-black/55 blur-2xl" />
      )}
      <div className="absolute inset-0 z-10 flex items-end justify-center pb-[1.5%]">
        <img
          src={resolvedSrc}
          alt={alt}
          onError={() => setFailed(true)}
          className={`relative block bg-transparent ${imageClassByVariant[variant]}`}
          loading="lazy"
        />
      </div>
      {overlay && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {overlay}
        </div>
      )}
      {failed && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-black/65 px-3 py-2 text-xs text-white">
          Фото временно недоступно
        </div>
      )}
    </div>
  );
}
