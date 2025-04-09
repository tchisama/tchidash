"use client"

import type { Section } from "@/components/landing-page-builder"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProductsSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function ProductsSection({ section, selectedElementId, onSelectElement }: ProductsSectionProps) {
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
        <h2 className="text-3xl font-bold mb-4">Our Products</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of high-quality products designed for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="relative h-48">
              <Image src={`/placeholder.svg?height=200&width=300`} alt={`Product ${i}`} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Product {i}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This is a placeholder for product description. Replace with actual product details.
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold">${(19.99 * i).toFixed(2)}</span>
                <Button size="sm">Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
