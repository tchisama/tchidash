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
import { ArrowUpFromLine, CircleDotDashed, CircleOff, PackageCheck,  Truck, Undo } from "lucide-react";
import { Order } from "@/types/order";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useOrderStore } from "@/store/orders";


export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";


// import { orderStatusValues } from "@/constents/order";
const orderStatusValues = [
  {
    name: "pending",
    icon: <CircleDotDashed className="h-4 w-4" />
  },
  {
    name: "processing",
    icon: <PackageCheck className="h-4 w-4" />
  },
  {
    name: "shipped",
    icon: <ArrowUpFromLine className="h-4 w-4" />
  },
  {
    name: "delivered",
    icon: <Truck className="h-4 w-4" />
  },
  {
    name: "cancelled",
    icon: <CircleOff className="h-4 w-4" />
  },
  {
    name: "returned",
    icon: <Undo className="h-4 w-4" />
  },
] 

export function StateChanger({state:st,order}:{state:OrderStatus,order:Order}) {
  const [state, setState] = React.useState<OrderStatus>();
  const {orders,setOrders,currentOrder,setCurrentOrder} = useOrderStore();
  useEffect(() => {
    if (st){
      setState(st);
    }
  },[st]);

  return (
      st && 
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant={"outline"} className="flex gap-2">
                        {orderStatusValues.find((status) => status.name === state)?.icon}
                        {state}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Order Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {orderStatusValues.map((status) => (
                        <DropdownMenuItem
                          key={status.name}
                          onClick={() => {
                            setState(status.name as OrderStatus);
                            updateDoc(doc(db, "orders", order.id), {
                              ...order,
                              orderStatus: status.name as OrderStatus,
                            })
                            setOrders(
                              orders.map((o) =>
                                o.id === order.id
                                  ? { ...order, orderStatus: status.name as OrderStatus }
                                  : o,
                              ),
                            )
                            if(currentOrder?.id === order.id){
                              setCurrentOrder(order.id)
                            }
                          }}
                        >
                          <span className="mr-2">{status.icon}</span>
                          {status.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
  );
}