"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ExternalLink, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
} from "@/components/ui/alert-dialog";

interface LandingPage {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  elements: any[];
}

export default function LandingPagesList() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [newPageName, setNewPageName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = () => {
    try {
      const savedPages = localStorage.getItem("landingPages");
      if (savedPages) {
        setPages(JSON.parse(savedPages));
      }
    } catch (error) {
      console.error("Error loading landing pages:", error);
    }
  };

  const createNewPage = () => {
    if (!newPageName.trim()) return;

    const newPage: LandingPage = {
      id: crypto.randomUUID(),
      name: newPageName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [],
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    localStorage.setItem("landingPages", JSON.stringify(updatedPages));
    setNewPageName("");
    setIsCreateDialogOpen(false);

    // Navigate to the editor with the new page ID
    router.push(`/editor/${newPage.id}`);
  };

  const deletePage = (id: string) => {
    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);
    localStorage.setItem("landingPages", JSON.stringify(updatedPages));
  };

  const duplicatePage = (page: LandingPage) => {
    const duplicatedPage: LandingPage = {
      ...page,
      id: crypto.randomUUID(),
      name: `${page.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPages = [...pages, duplicatedPage];
    setPages(updatedPages);
    localStorage.setItem("landingPages", JSON.stringify(updatedPages));
  };

  return (
    <div className="space-y-6 ">
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
              <DialogDescription>
                Give your landing page a name to get started.
              </DialogDescription>
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
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={createNewPage}>Create Page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No landing pages yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first landing page to get started
          </p>
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
                <CardTitle className="truncate">{page.name}</CardTitle>
                <CardDescription>
                  Updated{" "}
                  {formatDistanceToNow(new Date(page.updatedAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-40 bg-gray-100 flex items-center justify-center border-y">
                <div className="text-gray-400">Page Preview</div>
              </CardContent>
              <CardFooter className="pt-4 flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/editor/${page.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicatePage(page)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/preview/${page.id}`)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the landing page "
                          {page.name}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePage(page.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
