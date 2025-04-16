"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, X } from "lucide-react"
import type { Review } from "@/types/elements"

interface ReviewFormProps {
  initialData?: Review
  onSubmit: (review: Omit<Review, "id">) => void
  onCancel: () => void
}

export function ReviewForm({ initialData, onSubmit, onCancel }: ReviewFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [rating, setRating] = useState(initialData?.rating || 5)
  const [text, setText] = useState(initialData?.text || "")
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0])
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      rating,
      text,
      date,
      photoUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reviewer-name">Reviewer Name</Label>
        <Input
          id="reviewer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter reviewer name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              type="button"
              variant="ghost"
              size="sm"
              className={`p-1 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            >
              <Star className={`h-5 w-5 ${star <= rating ? "fill-yellow-500" : ""}`} />
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-text">Review Text</Label>
        <Textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter review text"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-date">Date</Label>
        <Input id="review-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo-url">Product Photo URL (optional)</Label>
        <div className="flex gap-2">
          <Input
            id="photo-url"
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Enter product photo URL"
            className="flex-1"
          />
          {photoUrl && (
            <Button type="button" variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setPhotoUrl("")}>
              <X className="h-4 w-4" />
              <span className="sr-only">Clear photo</span>
            </Button>
          )}
        </div>

        {photoUrl && (
          <div className="mt-2 relative h-32 w-32 rounded-md overflow-hidden border">
            <img
              src={photoUrl || "/placeholder.svg"}
              alt="Product photo preview"
              className="object-cover h-full w-full"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=128&width=128"
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update Review" : "Add Review"}</Button>
      </div>
    </form>
  )
}
