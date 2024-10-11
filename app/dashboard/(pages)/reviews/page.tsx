"use client"
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { collection, getDocs, query } from 'firebase/firestore'
import { Review } from '@/types/reviews'
import { db } from '@/firebase'
import { useQuery } from '@tanstack/react-query'
import CreateReviewDialog from './components/CreateReviewDialog'

export default function Page() {
  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const q = query(collection(db, "reviews"));
      const response = await getDocs(q);
      const data = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      } as Review));
      return data;
    }
  });

  return (
    <>
      {/* Create Review Button */}
      <div className="flex justify-end">
        <CreateReviewDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            View all customer reviews
          </CardDescription>
        </CardHeader>
        <CardContent>

          <Table>
            <TableCaption>Customer Reviews</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                reviews &&
                reviews.map((review: Review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.reviewerName}</TableCell>
                    <TableCell>{review.rating} ⭐</TableCell>
                    <TableCell>{review.reviewText}</TableCell>
                    <TableCell>
                      {review.images && review.images.length > 0 ? (
                        <div className="flex space-x-2">
                          {review.images.map((image, index) => (
                            <img key={index} src={image} alt="review" className="w-16 h-16 object-cover" />
                          ))}
                        </div>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>{review.createdAt.toDate().toLocaleString()}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
