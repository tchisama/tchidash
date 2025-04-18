"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Copy, Eye, Globe } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  getLandingPages,
  createLandingPage,
  deleteLandingPage,
  saveLandingPage,
  setLandingPagePublishStatus,
  type LandingPage,
} from "./../lib/firebase-service"
import { Switch } from "@/components/ui/switch"

interface LandingPagesListProps {
  storeId: string
}

export function LandingPagesList({ storeId }: LandingPagesListProps) {
  const [pages, setPages] = useState<LandingPage[]>([])
  const [newPageName, setNewPageName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadPages()
  }, [storeId])

  const loadPages = async () => {
    try {
      setIsLoading(true)
      const landingPages = await getLandingPages(storeId)
      setPages(landingPages)
    } catch (error) {
      console.error("Error loading landing pages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNewPage = async () => {
    if (!newPageName.trim()) return

    try {
      const newPage = await createLandingPage(storeId, newPageName)
      setPages([...pages, newPage])
      setNewPageName("")
      setIsCreateDialogOpen(false)

      // Navigate to the editor with the new page ID
      router.push(`/dashboard/landing-page/editor/${newPage.id}`)
    } catch (error) {
      console.error("Error creating landing page:", error)
    }
  }

  const handleDeletePage = async (id: string) => {
    try {
      await deleteLandingPage(storeId, id)
      setPages(pages.filter((page) => page.id !== id))
    } catch (error) {
      console.error("Error deleting landing page:", error)
    }
  }

  const handleDuplicatePage = async (page: LandingPage) => {
    try {
      const newPage = await createLandingPage(storeId, `${page.name} (Copy)`)

      // Copy elements and product info from the original page
      await saveLandingPage(storeId, newPage.id, {
        elements: page.elements,
        productId: page.productId,
        productName: page.productName,
        productImage: page.productImage,
      })

      // Reload pages to get the updated list
      await loadPages()
    } catch (error) {
      console.error("Error duplicating landing page:", error)
    }
  }

  const handleTogglePublish = async (page: LandingPage) => {
    try {
      const updatedPage = await setLandingPagePublishStatus(storeId, page.id, !page.published)
      setPages(pages.map((p) => (p.id === page.id ? updatedPage : p)))
    } catch (error) {
      console.error("Error toggling publish status:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Pages</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Landing Page</DialogTitle>
              <DialogDescription>Give your landing page a name to get started.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="page-name">Page Name</Label>
              <Input
                id="page-name"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="My Awesome Landing Page"
                className="mt-2"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNewPage}>Create Page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No landing pages yet</h3>
          <p className="text-gray-500 mb-6">Create your first landing page to get started</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Page
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="truncate">{page.name}</CardTitle>
                  <Badge variant={page.published ? "default" : "outline"}>
                    {page.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <CardDescription>
                  Updated {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-40 bg-gray-100 flex items-center justify-center border-y relative">
                {page.productImage ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={page.productImage || "/placeholder.svg"}
                      alt={page.productName || "Product"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="text-gray-400">No Product Selected</div>
                )}
                {page.productName && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm truncate">
                    {page.productName}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Switch checked={page.published} onCheckedChange={() => handleTogglePublish(page)} />
                    <span className="text-sm">{page.published ? "Published" : "Draft"}</span>
                  </div>
                  {page.published && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/landing-page/view/${page.id}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-1" />
                        Public URL
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/landing-page/editor/${page.id}`)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicatePage(page)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/landing-page/preview/${page.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </a>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the landing page {'"'}{page.name}{'"'}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePage(page.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
