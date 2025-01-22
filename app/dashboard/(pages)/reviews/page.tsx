"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { collection, query, where } from "firebase/firestore";
import { Review } from "@/types/reviews";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import CreateReviewDialog from "./components/CreateReviewDialog";
import { useStore } from "@/store/storeInfos";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { usePermission } from "@/hooks/use-permission";

export default function Page() {
  const { storeId } = useStore();
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const q = query(
        collection(db, "reviews"),
        where("storeId", "==", storeId),
      );
      if (!storeId) return;
      const response = await dbGetDocs(q, storeId, "");
      const data = response.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as Review,
      );
      return data;
    },
  });

  // Check if the user has view permission
  const hasViewPermission = usePermission();

   if (!hasViewPermission("reviews", "view")) {
    return <div>You dont have permission to view this page</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Create Review Button */}
      <div className="flex justify-end">
        <CreateReviewDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>View all customer reviews</CardDescription>
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
              {reviews &&
                reviews.map((review: Review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.reviewerName}</TableCell>
                    <TableCell>{
                      new Array(review.rating).fill(0).map(() => (
                        "⭐"
                      ))
                    }</TableCell>
                    <TableCell>{review.reviewText}</TableCell>
                    <TableCell>
                      {review.images && review.images.length > 0 ? (
                        <div className="flex space-x-2">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt="review"
                              className="w-16 h-16 object-cover"
                            />
                          ))}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {review.createdAt.toDate().toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
