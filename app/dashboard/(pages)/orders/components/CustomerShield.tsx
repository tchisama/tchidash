import React from "react";

import Cross from "@/public/images/svgs/icons/shield-cross.svg";
//import Star from "@/public/images/svgs/icons/shield-star.svg";
//import Up from "@/public/images/svgs/icons/shield-up.svg";
//import Warning from "@/public/images/svgs/icons/shield-warning.svg";
import Shield from "@/public/images/svgs/icons/shield.svg";
import Image from "next/image";
import { useStore } from "@/store/storeInfos";
import { useQuery } from "@tanstack/react-query";
import { query, where, and, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";

function CustomerShield({
  number,
  orderId,
}: {
  number: string;
  orderId: string;
}) {
  const { storeId } = useStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["CustomerShield", storeId, orderId],
    queryFn: async () => {
      const q = query(
        collection(db, "sales"),
        and(
          where("storeId", "==", storeId),
          where("phoneNumber", "==", number),
        ),
      );

      if (!storeId) return;
      const querySnapshot = await dbGetDocs(q, storeId, "");

      // Extract only the orderStatus from each document
      const orderStatuses = querySnapshot.docs.map((doc) => doc.data().status);
      console.log(orderStatuses);

      return orderStatuses;
    },
  });
  if (isLoading) return null;
  if (error) return <div>Error{error.message}</div>;

  const deliveryCount = data?.filter((x) => x === "delivered").length;
  const returnOrCancelCount = data?.filter((x) =>
    ["cancelled", "returned"].includes(x),
  ).length;
  return (
    <div className="flex gap-0">
      {(deliveryCount || 0) > 0 && (
        <div className="relative">
          <Image
            src={Shield}
            alt="Cross"
            className="h-6 w-6 opacity-80"
            width={24}
            height={24}
          />
          <div className="text-white text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
            {deliveryCount}
          </div>
        </div>
      )}
      {(returnOrCancelCount || 0) > 0 && (
        <div className="relative">
          <Image
            src={Cross}
            alt="Cross"
            className="h-6 w-6 opacity-80"
            width={24}
            height={24}
          />
          <div className="text-white text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
            {returnOrCancelCount}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerShield;
