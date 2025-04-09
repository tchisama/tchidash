"use client"
import type { Section } from "@/components/landing-page-builder"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react"
import { SectionRenderer } from "@/components/section-renderer"

interface PageCanvasProps {
  sections: Section[]
  selectedSectionId: string | null
  selectedElementId: string | null
  onSelectSection: (sectionId: string) => void
  onSelectElement: (elementId: string) => void
  onRemoveSection: (sectionId: string) => void
  onMoveSection: (fromIndex: number, toIndex: number) => void
  onMoveElement: (sectionId: string, fromIndex: number, toIndex: number) => void
}

export function PageCanvas({
  sections,
  selectedSectionId,
  selectedElementId,
  onSelectSection,
  onSelectElement,
  onRemoveSection,
  onMoveSection,
  onMoveElement,
}: PageCanvasProps) {
  if (sections.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Your page is empty</h3>
          <p className="text-muted-foreground mt-1">Add sections from the sidebar to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <Card
          key={section.id}
          className={`relative overflow-hidden ${selectedSectionId === section.id ? "ring-2 ring-primary" : ""}`}
        >
          <div className="absolute right-2 top-2 z-10 flex space-x-1">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 bg-background"
              onClick={() => onSelectSection(section.id)}
            >
              <span className="sr-only">Edit section</span>
              <span className="h-4 w-4">⚙️</span>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 bg-background"
              onClick={() => onRemoveSection(section.id)}
            >
              <span className="sr-only">Remove section</span>
              <Trash2 className="h-4 w-4" />
            </Button>
            {index > 0 && (
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7 bg-background"
                onClick={() => onMoveSection(index, index - 1)}
              >
                <span className="sr-only">Move up</span>
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
            {index < sections.length - 1 && (
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7 bg-background"
                onClick={() => onMoveSection(index, index + 1)}
              >
                <span className="sr-only">Move down</span>
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardContent className="p-0">
            <SectionRenderer
              section={section}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
