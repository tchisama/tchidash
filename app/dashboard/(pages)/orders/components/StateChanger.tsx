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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useOrderStore } from "@/store/orders";
import { Product } from "@/types/product";


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
  const {orders,setOrders,currentOrder,setCurrentOrder,actionLoading,setActionLoading} = useOrderStore();
  useEffect(() => {
    if (st){
      setState(st);
    }
  },[st]);

  return (
      st && 
                  <DropdownMenu >
                    <DropdownMenuTrigger disabled={actionLoading} asChild>
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
                          onClick={async () => {
                            setActionLoading(true)
                            setState(status.name as OrderStatus);
                            await updateDoc(doc(db, "orders", order.id), {
                              ...order,
                              orderStatus: status.name as OrderStatus,
                            })
                            await updateStockOfProductsBasedOnStatus(status.name as OrderStatus, order.orderStatus, order.items)
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
                            setActionLoading(false)
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



const updateStockOfProductsBasedOnStatus = async (
  status: OrderStatus, 
  oldStatus: OrderStatus, 
  products: Order["items"]
) => {
  // Check if the order status is transitioning to "shipped" or "delivered"
  if ((oldStatus === "pending" || oldStatus === "cancelled" || oldStatus === "returned") && (status === "processing" || status === "shipped" || status === "delivered")) {
    // Decrease stock based on the order items
    for (const item of products) {
      const productRef = doc(db, "products", item.productId);
      const productSnapshot = await getDoc(productRef);
      
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data() as Product;

        if(productData.variants&& productData.variants.length > 0){
            const newUpdatedProductVariants = productData.variants.map((variant) => {
              if (variant.id === item.variantId) {
                return {
                  ...variant,
                  inventoryQuantity: variant.inventoryQuantity - item.quantity
                };
              } else {
                return variant;
              }
            })

            await updateDoc(productRef, {
              variants: newUpdatedProductVariants
            });
        }else{
          if (!productData.hasInfiniteStock && productData.stockQuantity >= item.quantity) {
            await updateDoc(productRef, {
              stockQuantity: productData.stockQuantity - item.quantity
            });
          }
        }

      }
    }
  }

  // If the order is being canceled or returned, revert the stock
  if ((oldStatus === "processing" || oldStatus === "shipped" || oldStatus === "delivered") && (status === "cancelled" || status === "returned" || status === "pending")) {
    // Restore stock based on the order items
    for (const item of products) {
      const productRef = doc(db, "products", item.productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data() as Product;


        if(productData.variants&& productData.variants.length > 0){
            const newUpdatedProductVariants = productData.variants.map((variant) => {
              if (variant.id === item.variantId) {
                return {
                  ...variant,
                  inventoryQuantity: variant.inventoryQuantity + item.quantity
                };
              } else {
                return variant;
              }
            })

            await updateDoc(productRef, {
              variants: newUpdatedProductVariants
            });
        }else{
          if (!productData.hasInfiniteStock) {
            await updateDoc(productRef, {
              stockQuantity: productData.stockQuantity + item.quantity
            });
          }
        }




      }

    }
  }
};
