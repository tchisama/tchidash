"use client";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, CircleDotDashed, Undo } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { PurchaseOrder, PurchaseOrderStatus } from "@/types/inventory";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

// import { orderStatusValues } from "@/constents/order";
export const purchaseOrderStatusValues = [
  {
    name: PurchaseOrderStatus.PENDING,
    icon: <CircleDotDashed className="h-4 w-4" />,
    color: "#534b52",
  },
  {
    name: PurchaseOrderStatus.APPROVED,
    icon: <Check className="h-4 w-4" />,
    color: "#43aa8b",
  },
  {
    name: PurchaseOrderStatus.REJECTED,
    icon: <Undo className="h-4 w-4" />,
    color: "#f8961e",
  },
];

export function StateChanger({
  state: st,
  order,
}: {
  state: PurchaseOrderStatus;
  order: PurchaseOrder;
}) {
  const [state, setState] = React.useState<PurchaseOrderStatus>();
  useEffect(() => {
    if (st) {
      setState(st);
    }
  }, [st]);

  return (
    st && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            style={{
              background:
                purchaseOrderStatusValues.find(
                  (status) => status.name === state,
                )?.color + "20",
              borderColor:
                purchaseOrderStatusValues.find(
                  (status) => status.name === state,
                )?.color + "30",
              color: "#000a",
            }}
            size="sm"
            variant={"outline"}
            className="flex gap-2"
          >
            {
              purchaseOrderStatusValues.find((status) => status.name === state)
                ?.icon
            }
            {state}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Purchase Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {purchaseOrderStatusValues.map((status) => (
            <>
              <DropdownMenuItem
                key={status.name}
                style={{
                  background: status.color + "30",
                  borderColor: status.color + "40",
                  color: "#000a",
                }}
                className=" mt-[2px] cursor-pointer border"
                onClick={async () => {
                  setState(status.name);
                  await updateDoc(doc(db, "purchaseOrders", order.id), {
                    status: status.name,
                  });
                  order.itemsMovesIds.forEach(async (id) => {
                    await updateDoc(doc(db, "inventoryItems", id), {
                      status: status.name,
                    });
                  });
                }}
              >
                <span className="mr-2">{status.icon}</span>
                {status.name}
              </DropdownMenuItem>
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
