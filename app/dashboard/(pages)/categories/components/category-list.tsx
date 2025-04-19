"use client"

import { useState, useEffect } from "react"
import { useCategories } from "@/store/categories"
import { ProductCategory } from "@/types/categories"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Plus } from "lucide-react"

interface CategoryListProps {
  selectedCategory: ProductCategory | null
  onSelectCategory: (category: ProductCategory | null) => void
}

export function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
  const { categories } = useCategories()
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedCategories, setDisplayedCategories] = useState<ProductCategory[]>([])

  // Update displayed categories when categories or search query changes
  useEffect(() => {
    console.log("Categories in component:", categories)
    
    // Get root categories (those without a mother)
    const rootCategories = categories.filter(cat => !cat.motherCategory)
    console.log("Root categories:", rootCategories)
    
    // Filter by search query if needed
    let filtered = rootCategories
    if (searchQuery) {
      filtered = rootCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    console.log("Displayed categories:", filtered)
    setDisplayedCategories(filtered)
  }, [categories, searchQuery])

  // Render a category and its children
  const renderCategory = (category: ProductCategory, level = 0) => {
    // Find children of this category
    const children = categories.filter(cat => cat.motherCategory === category.id)
    const isSelected = selectedCategory?.id === category.id
    
    return (
      <div key={category.id} className="mb-1">
        <Button
          variant="ghost"
          className={`w-full justify-start ${isSelected ? "bg-accent" : ""}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelectCategory(category)}
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          <span className="truncate">{category.name}</span>
          {children.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({children.length})
            </span>
          )}
        </Button>
        
        {/* Render children */}
        {children.length > 0 && (
          <div className="ml-4">
            {children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onSelectCategory(null)}
              title="Add new category"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No categories found.</p>
              <p className="text-sm mt-1">Click the + button to create your first category.</p>
            </div>
          ) : displayedCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No categories match your search.</p>
              <p className="text-sm mt-1">Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayedCategories.map(category => renderCategory(category))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 