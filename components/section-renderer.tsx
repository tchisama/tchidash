"use client"

import type { Section } from "@/components/landing-page-builder"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { FAQSection } from "@/components/sections/faq-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ProductsSection } from "@/components/sections/products-section"
import { CTASection } from "@/components/sections/cta-section"
import { StatsSection } from "@/components/sections/stats-section"
import { TeamSection } from "@/components/sections/team-section"

interface SectionRendererProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function SectionRenderer({ section, selectedElementId, onSelectElement }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
    case "features":
      return (
        <FeaturesSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
      )
    case "testimonials":
      return (
        <TestimonialsSection
          section={section}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
        />
      )
    case "pricing":
      return (
        <PricingSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
      )
    case "faq":
      return <FAQSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
    case "contact":
      return (
        <ContactSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
      )
    case "products":
      return (
        <ProductsSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
      )
    case "cta":
      return <CTASection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
    case "stats":
      return <StatsSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
    case "team":
      return <TeamSection section={section} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
    default:
      return (
        <div className="p-6 text-center">
          <p>Unknown section type: {section.type}</p>
        </div>
      )
  }
}
