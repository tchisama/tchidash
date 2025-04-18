"use client"

import { LandingPagesList } from "./../../components/landing-pages-list"
import { useStore } from "@/store/storeInfos"

export default function PagesPage() {
  // In a real app, you would get the storeId from authentication or context
  const {storeId} = useStore()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Your Landing Pages</h1>
        <LandingPagesList storeId={storeId??""} />
      </div>
    </main>
  )
}
