"use client"

import { useState, useEffect } from "react"
import { Preview } from "./../components/preview"
import { getLandingPageById } from "../lib/firebase-service"
import type { PageElement } from "../types/elements"
import { useStore } from "@/store/storeInfos"

interface LandingPageViewProps {
  pageId: string
}

export function LandingPageView({ pageId }: LandingPageViewProps) {
  const [elements, setElements] = useState<PageElement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // In a real app, you would get the storeId from authentication or context
  const {storeId} = useStore()
  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true)
        const page = await getLandingPageById(storeId??"", pageId)

        if (!page) {
          setError("Page not found")
          return
        }

        if (!page.published) {
          setError("This page is not published")
          return
        }

        setElements(page.elements || [])
      } catch (err) {
        console.error("Error loading page:", err)
        setError("Failed to load page")
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [pageId, storeId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error}</h1>
          <p className="text-gray-600">This page may not exist or is not currently published.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">This page is empty</h1>
            <p className="text-gray-600">There is no content to display.</p>
          </div>
        </div>
      ) : (
        <Preview elements={elements} previewWidth={1280} screenSize="desktop" />
      )}
    </div>
  )
}
