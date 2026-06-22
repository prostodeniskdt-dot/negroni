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
  if (!orientation) return 'contain';
  if (orientation === 'landscape') return 'cover';
  return 'contain';
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
  const backgroundSrc = orientation && resolvedFit === 'contain' ? resolvedSrc : null;

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
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl"
          loading="lazy"
        />
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
        className={`relative z-10 block h-full w-full ${resolvedFit === 'cover' ? 'object-cover' : 'object-contain p-3 sm:p-4'}`}
        loading="lazy"
      />
      {overlay}
      {failed && (
        <div className="absolute inset-x-0 bottom-0 bg-black/65 px-3 py-2 text-xs text-white">
          Фото временно недоступно
        </div>
      )}
    </div>
  );
}
