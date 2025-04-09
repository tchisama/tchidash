"use client"

import type { Section } from "@/components/landing-page-builder"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

interface TeamSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function TeamSection({ section, selectedElementId, onSelectElement }: TeamSectionProps) {
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
        <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">The talented people behind our success.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <div className="relative h-64 w-64 mx-auto mb-4 overflow-hidden rounded-lg">
              <Image
                src={`/placeholder.svg?height=300&width=300`}
                alt={`Team Member ${i}`}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg">Team Member {i}</h3>
            <p className="text-muted-foreground mb-3">Position</p>
            <div className="flex justify-center space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
