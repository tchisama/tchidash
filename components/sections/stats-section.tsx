"use client"

import type { Section } from "@/components/landing-page-builder"

interface StatsSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function StatsSection({ section, selectedElementId, onSelectElement }: StatsSectionProps) {
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
        <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're proud of what we've accomplished together with our customers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {[
          { number: "10K+", label: "Customers" },
          { number: "50+", label: "Countries" },
          { number: "99.9%", label: "Uptime" },
          { number: "24/7", label: "Support" },
        ].map((stat, i) => (
          <div key={i} className="text-center p-6 border rounded-lg">
            <div className="text-4xl font-bold mb-2 text-primary">{stat.number}</div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
