"use client"

import { useEffect, useState } from "react"
import { getLandingPageById } from "@/app/dashboard/(pages)/landing-page/lib/firebase-service"
import { Preview } from "@/app/dashboard/(pages)/landing-page/components/preview"
import { ProductProvider } from "@/app/dashboard/(pages)/landing-page/context/product-context"
import type { PageElement } from "@/app/dashboard/(pages)/landing-page/types/elements"
import type { LandingPage } from "@/app/dashboard/(pages)/landing-page/lib/firebase-service"

export default function PublicLandingPage({ params }: { params: { id: string } }) {
  const [elements, setElements] = useState<PageElement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<LandingPage | null>(null)

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true)
        const pageData = await getLandingPageById(params.id)

        if (!pageData) {
          setError("Page not found")
          return
        }

        if (!pageData.published) {
          setError("This page is not published")
          return
        }

        setPage(pageData)
        setElements(pageData.elements || [])
      } catch (err) {
        console.error("Error loading page:", err)
        setError("Failed to load page")
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [params.id])

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
    <ProductProvider storeId={page?.storeId || ""}>
      <div className="min-h-screen bg-white">
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">This page is empty</h1>
              <p className="text-gray-600">There is no content to display.</p>
            </div>
          </div>
        ) : (
          <Preview storeId={page?.storeId || ""} elements={elements} previewWidth={1280} screenSize="desktop" />
        )}
      </div>
    </ProductProvider>
  )
} 