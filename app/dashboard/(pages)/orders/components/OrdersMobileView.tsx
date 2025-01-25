"use client";
import React from "react";
import { Order } from "@/types/order";
import { useOrderStore } from "@/store/orders";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { StateChanger } from "./StateChanger";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import NoteViewer from "./NoteViewer";
import { Edit2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

export function OrdersMobileView({
  orders,
}: {
  orders: Order[];
}) {
  const { currentOrder, setCurrentOrder, selectedOrder, setSelectedOrder } = useOrderStore();

  return (
    <div className="space-y-4">
      {orders?.map((order) => (
        <div
          key={order.id}
          onClick={() => setCurrentOrder(order.id)}
          className={cn(
            "cursor-pointer p-4 border rounded-lg bg-slate-50 shadow-sm hover:shadow-md transition-shadow",
            currentOrder?.id === order.id && "outline outline-primary/40"
          )}
        >
          {/* Order Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedOrder.includes(order.id)}
                onCheckedChange={() => {
                  if (selectedOrder.includes(order.id)) {
                    setSelectedOrder(selectedOrder.filter((id) => id !== order.id));
                  } else {
                    setSelectedOrder([...selectedOrder, order.id]);
                  }
                }}
              />
              <Link 
               href={`/dashboard/orders/${order.id}`}
               className="font-medium text-sm">
               Order  #{order?.sequence ?? "-"}
              </Link>
            </div>

            <div
              className="w-fit"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
            <StateChanger order={order} state={order.orderStatus} />
            </div>
          </div>

          {/* Product Images */}
          <div className="mt-3">
            <div className="flex space-x-2">
              {order.items.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative w-10 h-10 rounded-[15px] overflow-hidden border border-slate-200",
                    index > 0 && "-ml-3" // Overlap images slightly
                  )}
                >
                  <Image
                    src={item.imageUrl ?? "/placeholder-product.png"}
                    alt="Product Image"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-[15px] bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-500">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 items-center">
          {/* Customer Info */}
          <div className="mt-3">
            <div className="font-medium text-sm">
              {order.customer.firstName} {order.customer.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {order.customer.phoneNumber}
            </div>
          </div>

          <div className=" h-[20px] border-l" ></div>
          {/* Shipping Address */}
          <div className="mt-2">
            <div className="text-xs text-slate-600">
              {order.customer.shippingAddress.city}
            </div>
            <div className="text-xs text-muted-foreground">
              {order.customer.shippingAddress.address.slice(0, 40)}
              {order.customer.shippingAddress.address.length > 40 && "..."}
            </div>
          </div>
          </div>

          {/* Status and Note */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-right font-bold text-sm">
              {order.totalPrice} Dh
            </div>

            <Popover>
              <PopoverTrigger
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {order.note?.content ? (
                  <div className="w-fit text-xs text-slate-600 hover:text-slate-800">
                    {order.note?.content.slice(0, 40)}
                    {order.note?.content.length > 40 && "..."}
                  </div>
                ) : (
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="hover:bg-slate-100 text-slate-400"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-[300px]">
                <NoteViewer order={order} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Order Date and Time */}
          <div className="mt-2 text-xs text-muted-foreground">
            {order.createdAt.toDate().toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
            {" • "}
            {order.createdAt.toDate().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ))}
    </div>
  );
}