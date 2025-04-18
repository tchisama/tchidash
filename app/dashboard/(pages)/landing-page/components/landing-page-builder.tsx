"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Layers, Eye, Smartphone, Tablet, Monitor } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ElementsSidebar } from "../components/elements-sidebar"
import { StylePanel } from "../components/style-panel"
import { Canvas } from "../components/canvas"
import { Preview } from "../components/preview"
import { ProductSelector } from "../components/product-selector"
import { usePageElements } from "../hooks/use-page-elements"
import { useProduct } from "../context/product-context"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { ScreenSize } from "../types/elements"

export function LandingPageBuilder() {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const { elements, addElement, updateElement, removeElement, moveElement, selectedElementId, setSelectedElementId } =
    usePageElements()
  const { loading, error } = useProduct()
  const [mounted, setMounted] = useState(false)
  const [activeScreenSize, setActiveScreenSize] = useState<string>("desktop")

  const screenSizes: ScreenSize[] = [
    { id: "mobile", name: "Mobile", width: 375, icon: "Smartphone" },
    { id: "tablet", name: "Tablet", width: 768, icon: "Tablet" },
    { id: "desktop", name: "Desktop", width: 1280, icon: "Monitor" },
  ]

  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until after client-side hydration
  if (!mounted) {
    return null
  }

  const handleSelectElement = (id: string | null) => {
    setSelectedElementId(id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <p className="mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const getPreviewWidth = () => {
    const size = screenSizes.find((s) => s.id === activeScreenSize)
    return size ? size.width : 1280
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <header className="border-b bg-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Landing Page Builder</h1>
            <div className="flex items-center gap-4">
              <ProductSelector />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "editor" | "preview")}
            className="flex-1 flex flex-col"
          >
            <div className="border-b bg-white px-4 flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="editor" className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              {activeTab === "preview" && (
                <ToggleGroup
                  type="single"
                  value={activeScreenSize}
                  onValueChange={(value) => {
                    if (value) setActiveScreenSize(value)
                  }}
                >
                  <ToggleGroupItem value="mobile" aria-label="Mobile view">
                    <Smartphone className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="tablet" aria-label="Tablet view">
                    <Tablet className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="desktop" aria-label="Desktop view">
                    <Monitor className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="editor" className="h-full data-[state=active]:flex flex-col">
                <div className="grid h-full grid-cols-[250px_1fr_300px]">
                  <ElementsSidebar onAddElement={addElement} />
                  <Canvas
                    elements={elements}
                    selectedElementId={selectedElementId}
                    onSelectElement={handleSelectElement}
                    onMoveElement={moveElement}
                    onRemoveElement={removeElement}
                  />
                  <StylePanel
                    selectedElement={elements.find((el) => el.id === selectedElementId)}
                    onUpdateElement={updateElement}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-full data-[state=active]:block">
                <Preview elements={elements} previewWidth={getPreviewWidth()} screenSize={activeScreenSize} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DndProvider>
  )
}
