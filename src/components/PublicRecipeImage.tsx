'use client';

import { useEffect, useState } from 'react';
import { fallbackRecipeImage } from '@/lib/public-recipes';

type ImageFit = 'contain' | 'cover';
type ImageVariant = 'hero' | 'card' | 'thumbnail';
type ImageOrientation = 'portrait' | 'square' | 'landscape';

function getOrientation(width: number, height: number): ImageOrientation {
  const ratio = width / height;
  if (ratio < 0.82) return 'portrait';
  if (ratio > 1.35) return 'landscape';
  return 'square';
}

function getAutoFit(variant: ImageVariant, orientation?: ImageOrientation): ImageFit {
  if (variant === 'hero') return 'contain';
  return 'contain';
}

function getImageScale(variant: ImageVariant, orientation?: ImageOrientation): number {
  if (variant === 'hero') return 1;
  if (orientation === 'portrait') return variant === 'thumbnail' ? 1.15 : 1.22;
  if (orientation === 'square') return 1.05;
  return 1;
}

function getImagePadding(variant: ImageVariant): string {
  if (variant === 'hero') return '0.5rem 0.75rem 0.25rem';
  if (variant === 'thumbnail') return '0.25rem 0.5rem 0';
  return '0.15rem 0.5rem 0';
}

export function PublicRecipeImage({
  src,
  alt,
  className = '',
  overlay,
  fit,
  variant = 'card',
  preserveIntrinsicAspect,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
  fit?: ImageFit;
  variant?: ImageVariant;
  preserveIntrinsicAspect?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string | undefined>();
  const [orientation, setOrientation] = useState<ImageOrientation | undefined>();
  const resolvedSrc = !failed && src ? src : fallbackRecipeImage;
  const shouldPreserveAspect = preserveIntrinsicAspect ?? false;
  const resolvedFit = fit ?? getAutoFit(variant, orientation);
  const imageScale = getImageScale(variant, orientation);
  const imagePadding = getImagePadding(variant);

  useEffect(() => {
    setFailed(false);
    setAspectRatio(undefined);
    setOrientation(undefined);
  }, [src, shouldPreserveAspect]);

  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(196,165,116,0.16),transparent_58%),var(--color-bg)] ${className}`}
      style={shouldPreserveAspect && aspectRatio ? { aspectRatio } : undefined}
    >
      {variant !== 'hero' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(196,165,116,0.30),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(187,10,48,0.10))]" />
          <div className="absolute bottom-6 left-1/2 h-10 w-[62%] -translate-x-1/2 rounded-full bg-black/45 blur-2xl" />
        </>
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            setOrientation(getOrientation(image.naturalWidth, image.naturalHeight));
            if (shouldPreserveAspect) {
              setAspectRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
            }
          }
        }}
        onError={() => setFailed(true)}
        className={`absolute inset-0 z-10 block ${variant === 'hero' ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: resolvedFit,
          objectPosition: 'center bottom',
          padding: imagePadding,
          transform: `scale(${imageScale})`,
          transformOrigin: 'center bottom',
        }}
        loading="lazy"
      />
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
