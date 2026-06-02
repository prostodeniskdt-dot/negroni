'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { MarqueeBand } from '@/components/landing/MarqueeBand';
import { TeaserCollection } from '@/components/landing/TeaserCollection';
import { LiquidDivider } from '@/components/landing/LiquidDivider';
import { TeaserHistory } from '@/components/landing/TeaserHistory';
import { TeaserCurations } from '@/components/landing/TeaserCurations';
import { TeaserHowTo } from '@/components/landing/TeaserHowTo';
import { TeaserAbout } from '@/components/landing/TeaserAbout';
import { CTABlock } from '@/components/landing/CTABlock';
import { CursorGlow } from '@/components/landing/CursorGlow';
import { FloatingParticles } from '@/components/landing/FloatingParticles';
import { SmoothScrollProvider } from '@/components/landing/SmoothScrollProvider';

export default function HomePage() {
  return (
    <div className="landing-page">
      <SmoothScrollProvider />
      <CursorGlow />
      <FloatingParticles />
      <HeroSection />
      <MarqueeBand />
      <TeaserCollection />
      <LiquidDivider />
      <TeaserHistory />
      <LiquidDivider />
      <TeaserCurations />
      <TeaserHowTo />
      <LiquidDivider />
      <CTABlock />
      <TeaserAbout />
    </div>
  );
}
