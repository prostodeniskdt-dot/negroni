'use client';

import { useEffect, useState } from 'react';

const MARK_SRC = '/style/006.webm';

let cachedFrame: string | null = null;
let frameRequest: Promise<string> | null = null;

function captureNegroniFrame(): Promise<string> {
  if (cachedFrame) return Promise.resolve(cachedFrame);
  if (frameRequest) return frameRequest;

  frameRequest = new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = MARK_SRC;

    const paint = () => {
      const width = video.videoWidth || 128;
      const height = video.videoHeight || 128;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('canvas'));
        return;
      }
      context.drawImage(video, 0, 0, width, height);
      cachedFrame = canvas.toDataURL('image/png');
      resolve(cachedFrame);
    };

    video.addEventListener('error', () => reject(new Error('video')), { once: true });
    video.addEventListener(
      'loadeddata',
      () => {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        if (duration > 0.12) {
          video.currentTime = Math.min(0.12, duration / 2);
          return;
        }
        paint();
      },
      { once: true }
    );
    video.addEventListener('seeked', paint, { once: true });
  });

  return frameRequest;
}

export default function NegroniMark({
  active = false,
  size = 22,
  className = '',
}: {
  active?: boolean;
  size?: number;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(cachedFrame);

  useEffect(() => {
    let cancelled = false;
    captureNegroniFrame()
      .then((frame) => {
        if (!cancelled) setSrc(frame);
      })
      .catch(() => {
        if (!cancelled) setSrc(MARK_SRC);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span
      className={`negroni-mark${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {src?.endsWith('.webm') ? (
        <video src={src} autoPlay muted loop playsInline />
      ) : src ? (
        <img src={src} alt="" />
      ) : null}
    </span>
  );
}
