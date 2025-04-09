"use client"

import type { Section } from "@/components/landing-page-builder"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function CTASection({ section, selectedElementId, onSelectElement }: CTASectionProps) {
  // Default placeholder content
  return (
    <div
      className="py-16 px-6 md:px-12"
      style={{
        backgroundColor: section.props?.backgroundColor || "transparent",
        color: section.props?.textColor || "inherit",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have already taken the first step towards success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Get Started Now</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}
