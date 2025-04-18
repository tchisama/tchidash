"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Layers, Eye, Smartphone, Tablet, Monitor, Save, ArrowLeft, Globe } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ElementsSidebar } from "./../components/elements-sidebar"
import { StylePanel } from "./../components/style-panel"
import { Canvas } from "./../components/canvas"
import { Preview } from "./../components/preview"
import { ProductSelector } from "./../components/product-selector"
import { usePageElements } from "./../hooks/use-page-elements"
import { useProduct } from "../context/product-context"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from  "@/components/ui/button"
import { Switch } from  "@/components/ui/switch"
import { toast } from   "../hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getLandingPageById, LandingPage, saveLandingPage, setLandingPagePublishStatus } from "../lib/firebase-service"
import type { ScreenSize } from "../types/elements"
import { useStore } from "@/store/storeInfos"

interface LandingPageEditorProps {
  pageId: string
}

export function LandingPageEditor({ pageId }: LandingPageEditorProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const {
    elements,
    setElements,
    addElement,
    updateElement,
    removeElement,
    moveElement,
    selectedElementId,
    setSelectedElementId,
  } = usePageElements()
  const { loading: productLoading, error: productError, selectedProduct } = useProduct()
  const [mounted, setMounted] = useState(false)
  const [activeScreenSize, setActiveScreenSize] = useState<string>("desktop")
  const [pageName, setPageName] = useState<string>("")
  const [isPublished, setIsPublished] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()

  // In a real app, you would get the storeId from authentication or context
  const {storeId} = useStore()

  const screenSizes: ScreenSize[] = [
    { id: "mobile", name: "Mobile", width: 375, icon: "Smartphone" },
    { id: "tablet", name: "Tablet", width: 768, icon: "Tablet" },
    { id: "desktop", name: "Desktop", width: 1280, icon: "Monitor" },
  ]

  // Load page data
  useEffect(() => {
    async function loadPage() {
      if (pageId) {
        try {
          setPageLoading(true)
          const page = await getLandingPageById(storeId??"", pageId)

          if (page) {
            setPageName(page.name)
            setIsPublished(page.published || false)
            if (page.elements && page.elements.length > 0) {
              setElements(page.elements)
            }
          }
        } catch (error) {
          console.error("Error loading page:", error)
          toast({
            title: "Error loading page",
            description: "There was a problem loading the landing page.",
            variant: "destructive",
          })
        } finally {
          setPageLoading(false)
        }
      }
    }

    loadPage()
  }, [pageId, setElements])

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

  const savePage = async () => {
    try {
      // Get product information if a product is selected
      const productInfo = selectedProduct
        ? {
            productId: selectedProduct.id,
            productName: selectedProduct.title,
            productImage: selectedProduct.images?.[0] || null,
          }
        : {}

      await saveLandingPage(storeId??"", pageId, {
        elements,
        ...productInfo,
      } as Partial<LandingPage>)

      toast({
        title: "Page saved",
        description: "Your landing page has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving page:", error)
      toast({
        title: "Error saving page",
        description: "There was a problem saving your landing page.",
        variant: "destructive",
      })
    }
  }

  const togglePublishStatus = async () => {
    try {
      await setLandingPagePublishStatus(storeId??"", pageId, !isPublished)
      setIsPublished(!isPublished)
      toast({
        title: isPublished ? "Page unpublished" : "Page published",
        description: isPublished
          ? "Your landing page is now in draft mode."
          : "Your landing page is now live and publicly accessible.",
      })
    } catch (error) {
      console.error("Error toggling publish status:", error)
      toast({
        title: "Error updating publish status",
        description: "There was a problem updating the publish status.",
        variant: "destructive",
      })
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading page...</p>
        </div>
      </div>
    )
  }

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  if (productError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p>Error: {productError}</p>
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/landing-page/pages")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Pages
              </Button>
              <h1 className="text-xl font-bold">{pageName || "Untitled Page"}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={isPublished} onCheckedChange={togglePublishStatus} id="publish-toggle" />
                <label htmlFor="publish-toggle" className="text-sm font-medium">
                  {isPublished ? "Published" : "Draft"}
                </label>
              </div>

              {isPublished && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/dashboard/landing-page/view/${pageId}`} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-1" />
                    View Live
                  </a>
                </Button>
              )}

              <ProductSelector />

              <Button onClick={savePage} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save
              </Button>
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
        <Toaster />
      </div>
    </DndProvider>
  )
}
