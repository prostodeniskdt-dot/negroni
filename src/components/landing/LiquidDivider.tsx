'use client';

import { useEffect, useRef, useState } from 'react';

export function LiquidDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full h-24 overflow-hidden">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`absolute bottom-0 w-full h-full transition-opacity duration-1000 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <defs>
          <linearGradient id="liquidGradLanding" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(187,10,48,0.05)">
              <animate
                attributeName="stop-color"
                values="rgba(187,10,48,0.05);rgba(187,10,48,0.1);rgba(187,10,48,0.05)"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="rgba(187,10,48,0.15)">
              <animate
                attributeName="stop-color"
                values="rgba(187,10,48,0.15);rgba(187,10,48,0.2);rgba(187,10,48,0.15)"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="rgba(187,10,48,0.05)">
              <animate
                attributeName="stop-color"
                values="rgba(187,10,48,0.05);rgba(187,10,48,0.1);rgba(187,10,48,0.05)"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <path
          d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
          fill="url(#liquidGradLanding)"
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z;
              M0,80 C150,20 350,100 600,40 C850,0 1050,100 1200,80 L1200,120 L0,120 Z;
              M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z
            "
          />
        </path>
        <path
          d="M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z"
          fill="rgba(187,10,48,0.05)"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z;
              M0,60 C200,100 400,40 600,80 C800,100 1000,40 1200,60 L1200,120 L0,120 Z;
              M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z
            "
          />
        </path>
        <path
          d="M0,90 C300,70 600,100 900,85 C1050,78 1150,95 1200,90 L1200,120 L0,120 Z"
          fill="rgba(187,10,48,0.03)"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,90 C300,70 600,100 900,85 C1050,78 1150,95 1200,90 L1200,120 L0,120 Z;
              M0,85 C300,95 600,75 900,90 C1050,98 1150,80 1200,85 L1200,120 L0,120 Z;
              M0,90 C300,70 600,100 900,85 C1050,78 1150,95 1200,90 L1200,120 L0,120 Z
            "
          />
        </path>
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px overflow-hidden">
        <div
          className={`bg-gradient-to-b from-transparent to-[var(--color-campari)]/30 transition-all duration-1000 ${
            visible ? 'h-12' : 'h-0'
          }`}
        />
      </div>
    </div>
  );
}
