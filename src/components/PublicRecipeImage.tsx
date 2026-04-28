'use client';

import { useState } from 'react';
import { fallbackRecipeImage } from '@/lib/public-recipes';

export function PublicRecipeImage({
  src,
  alt,
  className = '',
  overlay,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = !failed && src ? src : fallbackRecipeImage;

  return (
    <div className={`relative overflow-hidden bg-[var(--color-bg)] ${className}`}>
      <img
        src={resolvedSrc}
        alt={alt}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
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
