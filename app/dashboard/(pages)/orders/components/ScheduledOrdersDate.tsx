import React, { useEffect } from "react";
import { collection, doc, Timestamp } from "firebase/firestore";
import { dbAddDoc, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";
import { useOrderStore } from "@/store/orders";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useNotification from "@/hooks/useNotification";
import { Order } from "@/types/order";

function ScheduledOrdersDate({
  currentOrder
}:{
  currentOrder: Order
}) {
  const { storeId } = useStore();
  const {  setOrders,orders } = useOrderStore();
  const { data: session } = useSession();

  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    if (currentOrder?.scheduledDate) {
      setDate(currentOrder.scheduledDate.toDate());
    }
  }, [currentOrder]);
  const {sendNotification} = useNotification();

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
            size={"sm"}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              if (!currentOrder) return;
              if (!storeId) return;
              dbUpdateDoc(
                doc(db, "orders", currentOrder.id),
                {
                  scheduledDate: Timestamp.fromDate(date as Date),
                },
                storeId,
                "",
              );
              sendNotification(
                `scheduled 🕗`,
                `order #${currentOrder.sequence} to ${format(date as Date, "PPP")}`
              )
              dbAddDoc(
                collection(db, "notes"),
                {
                  content:
                    "SCHEDULED: " +
                    // day/month/year all numbers
                    format(date as Date, "dd/MM/yyyy"),
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
              // setCurrentOrderData({
              //   ...currentOrder,
              //   scheduledDate: Timestamp.fromDate(date as Date),
              // });
              setOrders(orders.map(o=>o.id == currentOrder.id ? {
                ...o,
                scheduledDate: Timestamp.fromDate(date as Date),
              }:o))
              setDate(date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ScheduledOrdersDate;
