"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/storeInfos"
import { useCategories } from "@/store/categories"
import { ProductCategory } from "@/types/categories"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import FilesystemExplorer from "@/components/FilesystemExplorer"
import Image from "next/image"
import { collection, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { getIconComponent, AVAILABLE_ICONS } from "../utils/icons"

interface CategoryFormProps {
  selectedCategory: ProductCategory | null
  onCategoryUpdated: () => void
}

export function CategoryForm({ selectedCategory, onCategoryUpdated }: CategoryFormProps) {
  const { storeId } = useStore()
  const { categories, setCategories } = useCategories()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [motherCategory, setMotherCategory] = useState("none")
  const [image, setImage] = useState("")
  const [imagePath, setImagePath] = useState("")
  const [icon, setIcon] = useState("Grid")

  // Reset form when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name)
      setMotherCategory(selectedCategory.motherCategory || "none")
      setImage(selectedCategory.image || "")
      setImagePath(selectedCategory.imagePath || "")
      setIcon(selectedCategory.icon || "Grid")
    } else {
      setName("")
      setMotherCategory("none")
      setImage("")
      setImagePath("")
      setIcon("Grid")
    }
  }, [selectedCategory])

  // Get category path for display
  const getCategoryPath = (categoryId: string): string => {
    const visited = new Set<string>()
    
    const getPath = (id: string): string => {
      if (visited.has(id)) return ""
      
      const category = categories.find((cat) => cat.id === id)
      if (!category) return ""
      
      visited.add(id)
      
      if (category.motherCategory) {
        const motherPath = getPath(category.motherCategory)
        return motherPath ? `${motherPath} / ${category.name}` : category.name
      }
      
      return category.name
    }
    
    return getPath(categoryId)
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!storeId || !name) return

    const categoryData = {
      name,
      storeId,
      motherCategory: motherCategory === "none" ? null : motherCategory,
      image,
      imagePath,
      icon,
    }

    try {
      if (selectedCategory) {
        // Update existing category
        console.log("Updating category:", selectedCategory.id)
        await updateDoc(doc(db, "categories", selectedCategory.id), categoryData)
        setCategories(
          categories.map((cat) =>
            cat.id === selectedCategory.id ? { ...cat, ...categoryData } : cat
          )
        )
      } else {
        // Add new category
        console.log("Creating new category")
        const categoriesRef = collection(db, "categories")
        const newCategoryRef = await addDoc(categoriesRef, categoryData)
        console.log("New category created with ID:", newCategoryRef.id)
        
        const newCategory = { id: newCategoryRef.id, ...categoryData }
        setCategories([...categories, newCategory])
      }

      onCategoryUpdated()
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  // Handle category deletion
  const handleDelete = async () => {
    if (!selectedCategory || !storeId) return

    try {
      console.log("Deleting category:", selectedCategory.id)
      await deleteDoc(doc(db, "categories", selectedCategory.id))
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id))
      setShowDeleteDialog(false)
      onCategoryUpdated()
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </CardTitle>
            {selectedCategory && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            <div>
              <Label htmlFor="motherCategory">Parent Category (Optional)</Label>
              <Select
                value={motherCategory}
                onValueChange={setMotherCategory}
              >
                <SelectTrigger id="motherCategory">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories
                    .filter((cat) => cat.id !== selectedCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {getCategoryPath(category.id)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {AVAILABLE_ICONS.map((iconName) => {
                  const IconComponent = getIconComponent(iconName)
                  return (
                    <Button
                      key={iconName}
                      variant={icon === iconName ? "default" : "outline"}
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setIcon(iconName)}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label>Image (Optional)</Label>
              <div className="flex items-center gap-2 mt-2">
                <FilesystemExplorer
                  callback={(url) => {
                    setImage(url)
                    setImagePath(url)
                  }}
                >
                  <Button variant="outline">
                    {image ? "Change Image" : "Select Image"}
                  </Button>
                </FilesystemExplorer>
                
                {image && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setImage("")
                      setImagePath("")
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {image && (
                <div className="relative w-32 h-32 mt-4">
                  <Image
                    src={image}
                    alt="Category"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={!name}
            >
              {selectedCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category and unlink it from any products.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 