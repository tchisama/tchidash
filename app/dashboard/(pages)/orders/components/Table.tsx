"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/firebase";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/store/orders";
// import { cn } from "@/lib/utils"
import { useStore } from "@/store/storeInfos";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { and, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect } from "react";

export function OrdersTable() {
  const { storeId } = useStore();
  const { orders, setOrders, currentOrder, setCurrentOrder } = useOrderStore();
  const { data } = useQuery({
    queryKey: ["orders", storeId],
    queryFn: async () => {
      const response = await getDocs(
        query(collection(db, "orders"), and(where("storeId", "==", storeId))),
      );
      const data = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return data;
    },
    refetchOnWindowFocus:false,
  });
  useEffect(() => {
    if (data) setOrders(data as Order[]);
  }, [data, setOrders]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="">Status</TableHead>
          <TableHead className="">Address</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow
            key={order.id}
            onClick={() => setCurrentOrder(order.id)}
            className={cn(
              "cursor-pointer",
              currentOrder && currentOrder.id === order.id && "bg-muted",
            )}
          >
            <TableCell className="">
              <div className="relative h-10 w-20">
              {
                order.items.slice(0, 3).map((item,i) => {
                  return (
                        <div key={item.id} className={cn("mask absolute top-0 w-10 aspect-auto",i===0 &&"left-0",i===1&& "left-6",i===2&& "left-12" )}>
                          <Image
                            width={50}
                            height={50}
                            src={item.imageUrl??""}
                            alt="Avatar Tailwind CSS Component"
                            className="w-10 rounded-xl border-[3px] aspect-square  shadow-lg object-cover"
                          />
                        </div>
                  );
                })
              }
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {order.customer.firstName} {order.customer.lastName}
              </div>

              <div className=" text-sm text-muted-foreground ">
                {order.customer.phoneNumber}
              </div>
            </TableCell>
            <TableCell className="">
              <Badge>{order.orderStatus}</Badge>
            </TableCell>
            <TableCell className="">
              <div className="text-sm">
                {order.customer.shippingAddress.city}
              </div>
              <div className="text-xs text-muted-foreground">
                {order.customer.shippingAddress.address}
              </div>
            </TableCell>
            <TableCell className="">
              <div className="text-sm">
                {order.createdAt.toDate().toDateString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {order.createdAt.toDate().toLocaleTimeString()}
              </div>
            </TableCell>
            <TableCell className="text-right">{order.totalPrice} Dh</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
