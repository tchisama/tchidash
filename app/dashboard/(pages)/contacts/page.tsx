"use client";
import React from "react";
import { collection, query, where } from "firebase/firestore";
import { ContactMessage } from "@/types/messages";
import { db } from "@/firebase";


import { useQuery } from "@tanstack/react-query";
import CreateMessageDialog from "./components/CreateMessageDialog";
import { useStore } from "@/store/storeInfos";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { usePermission } from "@/hooks/use-permission";
import { Testimonial } from "@/components/ui/testimonial-card";
export default function Page() {
  const { storeId } = useStore();
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const q = query(
        collection(db, "messages"),
        where("storeId", "==", storeId),
      );
      if (!storeId) return;
      const response = await dbGetDocs(q, storeId, "");
      const data = response.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as ContactMessage,
      );
      return data;
    },

  });

  // Check if the user has view permission
  const hasViewPermission = usePermission();

   if (!hasViewPermission("messages", "view")) {
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
      <div className="flex justify-end">
        <CreateMessageDialog />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {
        messages?.map((msg:ContactMessage)=>(
          <Testimonial key={msg.id} 
            id={msg.id}
            name={msg.name}
            testimonial={msg.message}
            role={msg.phone ?? ''}
            type="message"
          />
        ))
      }
      </div>
    </div>
  );
}

