"use client"

import { useState } from "react"
import { Store, Upload, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CreateNewStore() {
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Submitting new store:", { storeName, storeDescription, logoFile })
    // Add your API call or state management logic here
  }

  return (
    <div className="w-full bg-slate-100 min-h-screen flex justify-center items-center">
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6" />
            Create New Store
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                placeholder="Enter store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                placeholder="Enter store description"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Store Logo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <Label
                  htmlFor="logo"
                  className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  {logoFile ? logoFile.name : "Upload logo"}
                </Label>
                {logoFile && (
                  <span className="text-sm text-muted-foreground">
                    File selected
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Store
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </div>
  )
}