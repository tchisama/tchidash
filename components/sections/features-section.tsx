"use client"

import type { Section } from "@/components/landing-page-builder"

interface FeaturesSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function FeaturesSection({ section, selectedElementId, onSelectElement }: FeaturesSectionProps) {
  // Default placeholder content
  if (section.elements.length === 0) {
    return (
      <div
        className="py-12 px-6 md:px-12"
        style={{
          backgroundColor: section.props?.backgroundColor || "transparent",
          color: section.props?.textColor || "inherit",
        }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features Section</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This is a placeholder for your features section. Add elements from the sidebar to customize this section.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-lg">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary">✦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
              <p className="text-muted-foreground">
                This is a placeholder for feature description. Click to edit and customize.
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render actual elements
  return (
    <div
      className="py-12 px-6 md:px-12"
      style={{
        backgroundColor: section.props?.backgroundColor || "transparent",
        color: section.props?.textColor || "inherit",
      }}
    >
      {section.elements.map((element) => (
        <div
          key={element.id}
          className={`cursor-pointer p-2 ${selectedElementId === element.id ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectElement(element.id)}
          style={{
            textAlign: element.props?.textAlign || "left",
            margin:
              element.props?.margin === "none"
                ? "0"
                : element.props?.margin === "small"
                  ? "0.5rem 0"
                  : element.props?.margin === "large"
                    ? "2rem 0"
                    : "1rem 0",
          }}
        >
          {/* Render elements based on their type */}
          {/* Similar to HeroSection but with different layout */}
        </div>
      ))}
    </div>
  )
}
