'use client';

import { useEffect, useState } from 'react';
import { fallbackRecipeImage } from '@/lib/public-recipes';

type ImageVariant = 'hero' | 'card' | 'thumbnail';

function getImagePadding(variant: ImageVariant): string {
  if (variant === 'hero') return '6%';
  if (variant === 'thumbnail') return '8%';
  return '7%';
}

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
  const imagePadding = getImagePadding(variant);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(196,165,116,0.16),transparent_58%),var(--color-bg)] ${className}`}
    >
      {variant !== 'hero' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,165,116,0.28),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(187,10,48,0.10))]" />
          <div className="absolute bottom-[14%] left-1/2 h-8 w-[48%] -translate-x-1/2 rounded-full bg-black/40 blur-2xl" />
        </>
      )}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ padding: imagePadding }}
      >
        <img
          src={resolvedSrc}
          alt={alt}
          onError={() => setFailed(true)}
          className={`block max-h-full max-w-full object-contain ${
            variant === 'hero'
              ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]'
              : 'drop-shadow-[0_10px_24px_rgba(0,0,0,0.42)]'
          }`}
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
