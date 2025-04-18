"use client"

import { useDrop } from "react-dnd"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PageElement } from "../types/elements"
import { CanvasElement } from "../components/canvas-element"
import { RefObject } from "react"

interface CanvasProps {
  elements: PageElement[]
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  onMoveElement: (id: string, direction: "up" | "down") => void
  onRemoveElement: (id: string) => void
}

export function Canvas({ elements, selectedElementId, onSelectElement, onMoveElement, onRemoveElement }: CanvasProps) {
  const [, drop] = useDrop(() => ({
    accept: "element",
    drop: () => ({ name: "Canvas" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <div className="bg-gray-100 h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-white">
        <h2 className="font-semibold">Canvas</h2>
        <p className="text-sm text-muted-foreground">Click on an element to edit its properties</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div
            ref={drop as unknown as RefObject<HTMLDivElement>}
            className="w-full max-w-3xl mx-auto min-h-[calc(100vh-12rem)] bg-white shadow-sm rounded-lg p-8"
            onClick={() => onSelectElement(null)}
          >
            {elements.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <p>Add elements from the sidebar to start building your landing page</p>
              </div>
            ) : (
              <div className="space-y-4">
                {elements.map((element, index) => (
                  <CanvasElement
                    key={element.id}
                    element={element}
                    isSelected={element.id === selectedElementId}
                    onSelect={() => onSelectElement(element.id)}
                    onMove={(direction) => onMoveElement(element.id, direction)}
                    onRemove={() => onRemoveElement(element.id)}
                    isFirst={index === 0}
                    isLast={index === elements.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
