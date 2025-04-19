"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/storeInfos"
import { useCategories } from "@/store/categories"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useQuery } from "@tanstack/react-query"
import { ProductCategory } from "@/types/categories"
import { Separator } from "@/components/ui/separator"
import { CategoryList } from "./components/category-list"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { db } from "@/firebase"
import { CategoryForm } from "./components/category-form"

export default function CategoriesPage() {
  const router = useRouter()
  const { storeId, loadStoreId } = useStore()
  const { setCategories, categories: storeCategories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)

  // Load storeId on component mount
  useEffect(() => {
    loadStoreId()
    console.log("Store ID loaded:", storeId)
  }, [loadStoreId, storeId])

  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ["categories", storeId],
    queryFn: async () => {
      console.log("Fetching categories for store:", storeId)
      if (!storeId) {
        console.log("No store ID available")
        return []
      }

      const categoriesRef = collection(db, "categories")
      const q = query(categoriesRef, where("storeId", "==", storeId))
      const snapshot = await getDocs(q)
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProductCategory[]

      console.log("Fetched categories:", categories.length)
      categories.forEach(cat => {
        console.log(`Category: ${cat.name}, ID: ${cat.id}, Mother: ${cat.motherCategory || 'none'}`)
      })

      return categories
    },
    enabled: !!storeId
  })

  useEffect(() => {
    if (categoriesData) {
      console.log("Setting categories in store:", categoriesData.length)
      setCategories(categoriesData)
    }
  }, [categoriesData, setCategories])

  // Debug: Log store categories
  useEffect(() => {
    console.log("Store categories:", storeCategories)
    console.log("Store categories count:", storeCategories.length)
  }, [storeCategories])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {(error as Error).message}
      </div>
    )
  }

  // Show message if no store is selected
  if (!storeId) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">No Store Selected</h1>
          <p className="text-muted-foreground mb-6">
            Please select a store to manage categories
          </p>
          <Button onClick={() => router.push("/dashboard/switch-store")}>
            Select Store
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and subcategories
          </p>
        </div>
      </div>
      <Separator className="my-6" />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <CategoryList 
            onSelectCategory={setSelectedCategory} 
            selectedCategory={selectedCategory} 
          />
        </div>
        <div className="w-full lg:w-1/3">
          <CategoryForm
            selectedCategory={selectedCategory} 
            onCategoryUpdated={() => setSelectedCategory(null)} 
          />
        </div>
      </div>
    </div>
  )
} 