import { Header } from "@/components/negroni/header"
import { HeroSection } from "@/components/negroni/hero-section"
import { MarqueeBand } from "@/components/negroni/marquee-band"
import { CollectionSection } from "@/components/negroni/collection-section"
import { LiquidDivider } from "@/components/negroni/liquid-divider"
import { IngredientsSection } from "@/components/negroni/ingredients-section"
import { HistorySection } from "@/components/negroni/history-section"
import { GallerySection } from "@/components/negroni/gallery-section"
import { VisitSection } from "@/components/negroni/visit-section"
import { Footer } from "@/components/negroni/footer"
import { CursorGlow } from "@/components/negroni/cursor-glow"
import { FloatingParticles } from "@/components/negroni/floating-particles"
import { SmoothScrollProvider } from "@/components/negroni/smooth-scroll-provider"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SmoothScrollProvider />
      <CursorGlow />
      <FloatingParticles />
      <Header />
      <HeroSection />
      <MarqueeBand />
      <CollectionSection />
      <LiquidDivider />
      <IngredientsSection />
      <LiquidDivider />
      <HistorySection />
      <LiquidDivider />
      <GallerySection />
      <LiquidDivider />
      <VisitSection />
      <Footer />
    </main>
  )
}
