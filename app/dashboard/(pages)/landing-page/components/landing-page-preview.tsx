"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import { Preview } from "../components/preview"
import { getLandingPageById } from "../lib/firebase-service"
import type { PageElement } from "../types/elements"
import { useStore } from "@/store/storeInfos"

interface LandingPagePreviewProps {
  pageId: string
}

export function LandingPagePreview({ pageId }: LandingPagePreviewProps) {
  const [pageName, setPageName] = useState<string>("")
  const [elements, setElements] = useState<PageElement[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // In a real app, you would get the storeId from authentication or context
  const {storeId} = useStore()

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true)
        const page = await getLandingPageById(storeId??"", pageId)

        if (page) {
          setPageName(page.name)
          if (page.elements && page.elements.length > 0) {
            setElements(page.elements)
          }
        }
      } catch (error) {
        console.error("Error loading page:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [pageId, storeId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/landing-page/pages")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Pages
            </Button>
            <h1 className="text-xl font-bold">Preview: {pageName || "Untitled Page"}</h1>
          </div>
          <Button onClick={() => router.push(`/dashboard/landing-page/editor/${pageId}`)} className="flex items-center gap-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit Page
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-white">
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h2 className="text-xl font-semibold mb-2">This page is empty</h2>
              <p className="text-gray-500 mb-4">There are no elements on this landing page yet.</p>
              <Button onClick={() => router.push(`/dashboard/landing-page/editor/${pageId}`)}>
                <Edit className="h-4 w-4 mr-1" />
                Start Editing
              </Button>
            </div>
          </div>
        ) : (
          <Preview elements={elements} previewWidth={1280} screenSize="desktop" />
        )}
      </main>
    </div>
  )
}
