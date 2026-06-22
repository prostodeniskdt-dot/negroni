'use client';

import { useEffect, useState } from 'react';
import { fallbackRecipeImage } from '@/lib/public-recipes';

export function PublicRecipeImage({
  src,
  alt,
  className = '',
  overlay,
  fit = 'contain',
  preserveIntrinsicAspect = true,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
  fit?: 'contain' | 'cover';
  preserveIntrinsicAspect?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string | undefined>();
  const resolvedSrc = !failed && src ? src : fallbackRecipeImage;

  useEffect(() => {
    setFailed(false);
    setAspectRatio(undefined);
  }, [src, preserveIntrinsicAspect]);

  return (
    <div
      className={`relative overflow-hidden bg-[var(--color-bg)] ${className}`}
      style={preserveIntrinsicAspect && aspectRatio ? { aspectRatio } : undefined}
    >
      <img
        src={resolvedSrc}
        alt={alt}
        onLoad={(event) => {
          const image = event.currentTarget;
          if (preserveIntrinsicAspect && image.naturalWidth > 0 && image.naturalHeight > 0) {
            setAspectRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
          }
        }}
        onError={() => setFailed(true)}
        className={`block h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
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
