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
import { Order } from "@/types/order";
import { useOrderStore } from "@/store/orders";
import axios from "axios";
import { dbAddDoc, dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { collection, limit, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import { cn } from "@/lib/utils";
import {
  Clock,
  MapPinCheckInside,
  PackageCheck,
  PhoneOff,
  Stars,
  Truck,
  Undo,
  UserRoundCheck,
  UserRoundX,
  X,
} from "lucide-react";
import useNotification from "@/hooks/useNotification";

export const orderStatusValuesWithIcon = [
  {
    name: "pending",
    icon: <Stars className="h-4 w-4" />,
    color: "#72ce27", // Gold: Represents something waiting or in progress
    effectStock: false,
    next: ["confirmed", "scheduled", "cancelled", "fake"],
  },
  {
    name: "confirmed",
    icon: <UserRoundCheck className="h-4 w-4" />,
    color: "#4361ee", // Green: Represents confirmation and success
    effectStock: true,
    next: ["packed", "cancelled", "scheduled", "pending"],
  },
  {
    name: "packed",
    icon: <PackageCheck className="h-4 w-4" />,
    color: "#3a0ca3", // Orange: Represents preparation and readiness
    effectStock: true,
    next: ["shipped", "cancelled", "scheduled", "pending"],
  },
  {
    name: "shipped",
    icon: <Truck className="h-4 w-4" />,
    color: "#7209b7", // Blue: Represents movement and transit
    effectStock: true,
    next: ["delivered", "cancelled", "scheduled", "pending", "returned"],
  },
  {
    name: "delivered",
    icon: <MapPinCheckInside className="h-4 w-4" />,
    color: "#007f5f", // Light Green: Represents completion and success
    effectStock: true,
    next: [],
  },
  {
    name: "scheduled",
    icon: <Clock className="h-4 w-4" />,
    color: "#fdc700", // Purple: Represents planning and scheduling
    effectStock: true,
    next: ["packed", "cancelled"],
  },
  {
    name: "no_reply",
    icon: <PhoneOff className="h-4 w-4" />,
    color: "#fc7b28", // Bright Red: Represents urgency or lack of response
    effectStock: false,
    next: ["confirmed"],
  },
  {
    name: "cancelled",
    icon: <X className="h-4 w-4" />,
    color: "#fa442a", // Red: Represents cancellation or failure
    effectStock: false,
    next: [],
  },
  {
    name: "returned",
    icon: <Undo className="h-4 w-4" />,
    color: "#f9172b", // Pink: Represents reversal or return
    effectStock: false,
    next: [],
  },
  {
    name: "fake",
    icon: <UserRoundX className="h-4 w-4" />,
    color: "#607D8B", // Gray-Blue: Represents something invalid or fake
    effectStock: false,
    next: ["confirmed"],
  },
];

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "scheduled"
  | "delivered"
  | "cancelled"
  | "no_reply"
  | "returned";

export function StateChanger({
  state: st,
  order,
  showNumberOfCalls = true,
}: {
  state: OrderStatus;
  order: Order;
  showNumberOfCalls?: boolean;
}) {
  const { storeId, store } = useStore();
  const [state, setState] = React.useState<OrderStatus>();
  const { data: session } = useSession();
  const { sendNotification } = useNotification();
  const {
    orders,
    setOrders,
    currentOrder,
    setCurrentOrder,
    setCurrentOrderData,
    actionLoading,
    setActionLoading,
  } = useOrderStore();
  useEffect(() => {
    if (st) {
      setState(st);
    }
  }, [st]);
  const { data: user } = useQuery({
    queryKey: ["notes", storeId, order.id, state],
    queryFn: async () => {
      if (!storeId) return null;
      
      const q = query(
        collection(db, "notes"),
        where("details.for", "==", "order"),
        where("details.orderId", "==", order.id),
        where("changed", "==", order.orderStatus),
        limit(1),
      );
      const note = await dbGetDocs(q, storeId, "");
      const noteData = note.docs.map((doc) => doc.data())[0];
      console.log(noteData);
      if(!store) return null
      const user = store?.employees?.find(
        (employee) => employee.email.trim()== noteData?.creator.trim(),
      );

      return user;
    },
  });

  return (
    st && (
      <DropdownMenu>
        <DropdownMenuTrigger disabled={actionLoading} asChild>
          <Button
            style={{
              background:
                orderStatusValuesWithIcon.find(
                  (status) => status.name === state,
                )?.color + "90",
              borderColor:
                orderStatusValuesWithIcon.find(
                  (status) => status.name === state,
                )?.color + "90",
              color: "#000a",
            }}
            size="sm"
            variant={"outline"}
            className={cn("flex gap-2  rounded-full", user && "pr-1")}
          >
            {
              orderStatusValuesWithIcon.find((status) => status.name === state)
                ?.icon
            }
            <div className="capitalize">{state}</div>
            {state == "no_reply" &&
              showNumberOfCalls &&
              order?.numberOfCalls && (
                <div className="bg-white/30 border border-red-600/30 w-6 h-5  rounded-full flex justify-center items-center">
                  {order?.numberOfCalls ?? 0}
                </div>
              )}
            {user && (
              <Avatar className="w-6 h-6 border border-[#3335] ">
                <AvatarImage
                  src={user?.imageUrl ?? ""}
                  alt={user?.name ?? ""}
                />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="shadow-2xl" align="start" side="right">
          <DropdownMenuLabel>Order Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {orderStatusValuesWithIcon
          .filter((s) => s.name !== state)
          .map((status) => (
            <>
              <DropdownMenuItem
                key={status.name}
                style={{
                  background: status.color + "80",
                  borderColor: status.color + "90",
                  color: "#000a",
                  // opacity: !orderStatusValuesWithIcon.find(
                  //   (s) => s.name === state,
                  // )?.next.includes(status.name) ? "0.3" : "1",
                }}
                className="py-1 rounded-sm mt-[1px] cursor-pointer border"
                disabled={
                  false
                  // !orderStatusValuesWithIcon.find(
                  //   (s) => s.name === state,
                  // )?.next.includes(status.name)
                }
                onClick={async () => {
                  setActionLoading(true);
                  setState(status.name as OrderStatus);

                  try {
                    const response = await axios.post(
                      "/api/order-status-changer",
                      {
                        orderId: order.id,
                        newStatus: status.name as OrderStatus,
                        storeId: order.storeId,
                      },
                    );
                    console.log("Order status updated:", response.data);
                    setCurrentOrderData({
                      ...order,
                      orderStatus: status.name as OrderStatus,
                    } as Order);

                    if (!order.storeId) return;
                    // Send notification
                    sendNotification(
                      "Change order state 🔄",
                      `of order:#${order.sequence} to ${status.name}`,
                    );

                    // Add note
                    dbAddDoc(
                      collection(db, "notes"),
                      {
                        changed: `${status.name.toLocaleLowerCase()}`,
                        creator: session?.user?.email,
                        createdAt: Timestamp.now(),
                        details: {
                          for: "order",
                          orderId: order?.id,
                        },
                      },
                      order.storeId,
                      "",
                    );
                  } catch (error) {
                    console.error("Error updating order status:", error);

                    setOrders(
                      orders.map((o) =>
                        o.id === order.id
                          ? {
                              ...order,
                              orderStatus: status.name as OrderStatus,
                            }
                          : o,
                      ),
                    );
                    if (currentOrder?.id === order.id) {
                      setCurrentOrder(order.id);
                    }
                  } finally {
                    setActionLoading(false);
                  }
                }}
              >
                <span className="mr-2">{status.icon}</span>
                <span className="capitalize">{status.name}</span>
              </DropdownMenuItem>
              {(status.name == "delivered" || status.name == "pending") && (
                <DropdownMenuSeparator className="w-full h-[2px]" />
              )}
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
