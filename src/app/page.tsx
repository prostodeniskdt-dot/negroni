'use client';

import { SmoothScrollProvider } from '@/components/landing/SmoothScrollProvider';
import { CursorGlow } from '@/components/landing/CursorGlow';
import { FloatingParticles } from '@/components/landing/FloatingParticles';
import { HeroSection } from '@/components/landing/HeroSection';
import { MarqueeBand } from '@/components/landing/MarqueeBand';
import { LiquidDivider } from '@/components/landing/LiquidDivider';
import { TeaserHistory } from '@/components/landing/TeaserHistory';
import { TeaserCollection } from '@/components/landing/TeaserCollection';
import { TeaserHowTo } from '@/components/landing/TeaserHowTo';
import { TeaserCurations } from '@/components/landing/TeaserCurations';
import { TeaserAbout } from '@/components/landing/TeaserAbout';
import { CTABlock } from '@/components/landing/CTABlock';

export default function HomePage() {
  return (
    <>
      <SmoothScrollProvider />
      <CursorGlow />
      <FloatingParticles />
      <HeroSection />
      <MarqueeBand />
      <LiquidDivider />
      <TeaserHistory />
      <LiquidDivider />
      <TeaserCollection />
      <LiquidDivider />
      <TeaserHowTo />
      <LiquidDivider />
      <TeaserCurations />
      <LiquidDivider />
      <TeaserAbout />
      <CTABlock />
    </>
  );
}
