"use client"
import React, { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { Rating } from '@/types/reviews'
import { Textarea } from '@/components/ui/textarea'
import { storage } from '@/firebase' // Assuming Firebase storage is set up
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/store/storeInfos'

export default function CreateReviewDialog() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [rating, setRating] = useState<Rating>(3) // Default rating of 3 stars
  const [reviewText, setReviewText] = useState<string>("")
  const [images, setImages] = useState<File[]>([])
    const {storeId} = useStore()

  const { toast } = useToast()

  const handleSubmit = async () => {
    if (name && rating && reviewText) {
      let uploadedImages: string[] = []

      // Upload images to Firebase storage
      if (images.length > 0) {
        uploadedImages = await Promise.all(images.map(async (image) => {
          const imageRef = ref(storage, `reviews/${name}-${image.name}`);
          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);
          return imageUrl;
        }));
      }

      // Add review to Firestore
      await addDoc(collection(db, "reviews"), {
        reviewerName: name,
        reviewerEmail: email || null, // Only add email if provided
        rating,
        reviewText,
        images: uploadedImages,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        storeId,
      });

      // Reset the form
      setName("");
      setEmail("");
      setRating(3);
      setReviewText("");
      setImages([]);

      // Show success toast
      toast({ title: "Review created", description: "Your review has been successfully submitted!" })
    }
  }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mb-4">Create Review</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Review</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the form below to create a new product review.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
          </div>
          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" />
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant={star === rating ? "default" : "outline"}
                  onClick={() => setRating(star as Rating)}
                >
                  {star} ⭐
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="reviewText">Review</Label>
            <Textarea id="reviewText" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Your review" />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Submit Review</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}