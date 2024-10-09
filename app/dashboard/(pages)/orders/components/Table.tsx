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
          <TableHead>Customer</TableHead>
          <TableHead className="">Status</TableHead>
          <TableHead className="">Product</TableHead>
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
              {order.items.reduce((total, item) => total + item.quantity, 0)}{" "}
              items
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

//  {
//   new Array(100).fill(0).map((_, index) => (
//     <TableRow
//     onClick={() => setSelected([index])}
//     className={cn("rounded-xl cursor-pointer ",index === selected[0] ? "bg-slate-100 hover:bg-slate-100" : "")}
//      key={index}>
//       <TableCell>
//         <div className="font-medium">Emma Brown</div>
//         <div className="hidden text-sm text-muted-foreground md:inline">
//           068997864
//         </div>
//       </TableCell>
//       <TableCell className="hidden sm:table-cell">
//         <Badge className="text-xs" variant="secondary">
//           Fulfilled
//         </Badge>
//       </TableCell>
//       <TableCell className="hidden sm:table-cell">
//         React T-Shirt
//       </TableCell>
//       <TableCell className="hidden md:table-cell">
//         <div className="font-medium">Marrakech</div>
//         <div className="hidden text-sm text-muted-foreground md:inline">
//           sidi mousa boulevard 5 boulevard
//         </div>
//       </TableCell>
//       <TableCell className="hidden md:table-cell">
//         <div className="text-sm">12/12/2022</div>
//         <div className="text-muted-foreground">02:00 PM</div>
//       </TableCell>

//       <TableCell className="text-right">$450.00</TableCell>
//     </TableRow>
//   ))
//  }
