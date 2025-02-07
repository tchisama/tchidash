"use client";
import React from "react";
import { collection, query, where } from "firebase/firestore";
import { Review } from "@/types/reviews";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import CreateReviewDialog from "./components/CreateReviewDialog";
import { useStore } from "@/store/storeInfos";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { usePermission } from "@/hooks/use-permission";
import { Testimonial } from "@/components/ui/testimonial-card";

export default function Page() {
  const { storeId } = useStore();
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews", storeId],
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
    <div>
      {/* Create Review Button */}
      <div className="flex justify-end">
        <CreateReviewDialog />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {
        reviews?.map((review:Review)=>(
          <Testimonial key={review.id} 
            id={review.id}
            name={review.reviewerName}
            testimonial={review.reviewText}
            role={review.reviewerEmail ?? ''}
            rating={review.rating}
          />
        ))
      }
      </div>
    </div>
  );
}

