"use client"

import type { Section } from "@/components/landing-page-builder"

interface TestimonialsSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function TestimonialsSection({ section, selectedElementId, onSelectElement }: TestimonialsSectionProps) {
  // Default placeholder content
  return (
    <div
      className="py-12 px-6 md:px-12"
      style={{
        backgroundColor: section.props?.backgroundColor || "transparent",
        color: section.props?.textColor || "inherit",
      }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Testimonials Section</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This is a placeholder for your testimonials section. Add elements from the sidebar to customize this section.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 mr-4"></div>
              <div>
                <h4 className="font-semibold">Customer Name</h4>
                <p className="text-sm text-muted-foreground">Company</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "This is a placeholder for a testimonial. Replace with actual customer feedback."
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
