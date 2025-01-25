"use client"
import React from "react";
import { Phone } from "lucide-react";
import { collection, doc, increment, Timestamp } from "firebase/firestore";
import { dbAddDoc, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";
import { useOrderStore } from "@/store/orders";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";

function CancelledCalls() {
  const { storeId } = useStore();
  const { currentOrder, setCurrentOrderData } = useOrderStore();
  const { data:session } = useSession();
  const {sendNotification} = useNotification();
  return (
    <div>
      <Button
        onClick={() => {
          if (!currentOrder) return;
          if (!storeId) return;
          dbUpdateDoc(
            doc(db, "orders", currentOrder.id),
            {
              numberOfCalls: increment(1),
            },
            storeId,
            "",
          );
          sendNotification(
            `called 📞`,
            `customer ${currentOrder?.customer?.name} for order order:#${currentOrder?.sequence}`
          )
          dbAddDoc(
            collection(db, "notes"),
            {
              content: "CALL: a call was made to the customer",
              creator: session?.user?.email,
              createdAt: Timestamp.now(),
              details: {
                for: "order",
                orderId: currentOrder?.id,
              },
            },
            storeId,
            "",
          );
          setCurrentOrderData({
            ...currentOrder,
            numberOfCalls: (currentOrder.numberOfCalls || 0) + 1,
          });
        }}
        size={"sm"}
        variant={"outline"}
      >
        <Phone className="mr-2 h-4 w-4" />
        {currentOrder?.numberOfCalls ?? 0}
      </Button>
    </div>
  );
}

export default CancelledCalls;
