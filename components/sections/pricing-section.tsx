"use client"

import type { Section } from "@/components/landing-page-builder"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "@radix-ui/react-icons"

interface PricingSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function PricingSection({ section, selectedElementId, onSelectElement }: PricingSectionProps) {
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
        <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs. Simple, transparent pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {["Basic", "Pro", "Enterprise"].map((plan, i) => (
          <div key={plan} className={`p-6 rounded-lg border ${i === 1 ? "border-primary ring-1 ring-primary" : ""}`}>
            <h3 className="text-xl font-bold mb-2">{plan}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">${i === 0 ? "9" : i === 1 ? "29" : "99"}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              {[...Array(3 + i)].map((_, j) => (
                <li key={j} className="flex items-center">
                  <CheckIcon className="h-4 w-4 mr-2 text-primary" />
                  <span>Feature {j + 1}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={i === 1 ? "default" : "outline"}>
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
