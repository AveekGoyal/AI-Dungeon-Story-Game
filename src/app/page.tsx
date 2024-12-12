import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { GamePreview } from "@/components/landing/game-preview"
import { Testimonials } from "@/components/landing/testimonals"
import { CTASection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <GamePreview />
      <Testimonials />
      <CTASection />
    </>
  )
}