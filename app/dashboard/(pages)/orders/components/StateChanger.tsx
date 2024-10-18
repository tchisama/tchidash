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
import {
  CircleDotDashed,
  PackageCheck,
  PackageX,
  Truck,
  Undo,
  UserCheck,
} from "lucide-react";
import { Order } from "@/types/order";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
export const orderStatusValuesWithIcon = [
  {
    name: "pending",
    icon: <CircleDotDashed className="h-4 w-4" />,
    color: "#534b52",
  },
  {
    name: "processing",
    icon: <PackageCheck className="h-4 w-4" />,
    color: "#3d348b",
  },
  {
    name: "shipped",
    icon: <Truck className="h-4 w-4" />,
    color: "#2667ff",
  },
  {
    name: "delivered",
    icon: <UserCheck className="h-4 w-4" />,
    color: "#43aa8b",
  },
  {
    name: "cancelled",
    icon: <PackageX className="h-4 w-4" />,
    color: "#e63946",
  },
  {
    name: "returned",
    icon: <Undo className="h-4 w-4" />,
    color: "#f8961e",
  },
];

export function StateChanger({
  state: st,
  order,
}: {
  state: OrderStatus;
  order: Order;
}) {
  const [state, setState] = React.useState<OrderStatus>();
  const {
    orders,
    setOrders,
    currentOrder,
    setCurrentOrder,
    actionLoading,
    setActionLoading,
  } = useOrderStore();
  useEffect(() => {
    if (st) {
      setState(st);
    }
  }, [st]);

  return (
    st && (
      <DropdownMenu>
        <DropdownMenuTrigger disabled={actionLoading} asChild>
          <Button
            style={{
              background:
                orderStatusValuesWithIcon.find(
                  (status) => status.name === state,
                )?.color + "20",
              borderColor:
                orderStatusValuesWithIcon.find(
                  (status) => status.name === state,
                )?.color + "30",
              color: "#000a",
            }}
            size="sm"
            variant={"outline"}
            className="flex gap-2"
          >
            {
              orderStatusValuesWithIcon.find((status) => status.name === state)
                ?.icon
            }
            {state}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Order Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {orderStatusValuesWithIcon.map((status) => (
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
                  setActionLoading(true);
                  setState(status.name as OrderStatus);
                  await updateDoc(doc(db, "orders", order.id), {
                    ...order,
                    orderStatus: status.name as OrderStatus,
                  });
                  await updateStockOfProductsBasedOnStatus(
                    status.name as OrderStatus,
                    order.orderStatus,
                    order.items,
                    order,
                  );
                  setOrders(
                    orders.map((o) =>
                      o.id === order.id
                        ? { ...order, orderStatus: status.name as OrderStatus }
                        : o,
                    ),
                  );
                  if (currentOrder?.id === order.id) {
                    setCurrentOrder(order.id);
                  }
                  setActionLoading(false);
                }}
              >
                <span className="mr-2">{status.icon}</span>
                {status.name}
              </DropdownMenuItem>
              {status.name == "delivered" && (
                <DropdownMenuSeparator className="w-full h-[2px]" />
              )}
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}

const updateStockOfProductsBasedOnStatus = async (
  status: OrderStatus,
  oldStatus: OrderStatus,
  products: Order["items"],
  order: Order,
) => {
  // Check if the order status is transitioning to "shipped" or "delivered"
  //
  //
  //

  setDoc(doc(db, "sales", order.id), {
    phoneNumber: order.customer.phoneNumber,
    totalPrice: order.totalPrice,
    status,
    storeId: order.storeId,
  });

  if (
    (oldStatus === "pending" ||
      oldStatus === "cancelled" ||
      oldStatus === "returned") &&
    (status === "processing" || status === "shipped" || status === "delivered")
  ) {
    // Decrease stock based on the order items
    for (const item of products) {
      const productRef = doc(db, "products", item.productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data() as Product;

        if (
          productData.variants &&
          productData.variants.length > 0 &&
          productData.variantsAreOneProduct === false
        ) {
          const newUpdatedProductVariants = productData.variants.map(
            (variant) => {
              if (variant.id === item.variantId) {
                return {
                  ...variant,
                  inventoryQuantity: variant.hasInfiniteStock
                    ? variant.inventoryQuantity
                    : variant.inventoryQuantity - item.quantity,
                  totalSales: (variant?.totalSales ?? 0) + item.quantity,
                };
              } else {
                return variant;
              }
            },
          );

          await updateDoc(productRef, {
            variants: newUpdatedProductVariants,
          });
        } else {
          if (productData.stockQuantity >= item.quantity) {
            await updateDoc(productRef, {
              stockQuantity: productData.hasInfiniteStock
                ? productData.stockQuantity
                : productData.stockQuantity - item.quantity,
              totalSales: (productData?.totalSales ?? 0) + item.quantity,
            });
          }
        }
      }
    }
  }

  // If the order is being canceled or returned, revert the stock
  if (
    (oldStatus === "processing" ||
      oldStatus === "shipped" ||
      oldStatus === "delivered") &&
    (status === "cancelled" || status === "returned" || status === "pending")
  ) {
    // Restore stock based on the order items
    for (const item of products) {
      const productRef = doc(db, "products", item.productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data() as Product;

        if (
          productData.variants &&
          productData.variants.length > 0 &&
          productData.variantsAreOneProduct === false
        ) {
          const newUpdatedProductVariants = productData.variants.map(
            (variant) => {
              if (variant.id === item.variantId) {
                return {
                  ...variant,
                  inventoryQuantity: variant.hasInfiniteStock
                    ? variant.inventoryQuantity
                    : variant.inventoryQuantity + item.quantity,
                  totalSales:
                    (variant?.totalSales ?? item.quantity) - item.quantity,
                };
              } else {
                return variant;
              }
            },
          );

          await updateDoc(productRef, {
            variants: newUpdatedProductVariants,
          });
        } else {
          await updateDoc(productRef, {
            stockQuantity: productData.hasInfiniteStock
              ? productData.stockQuantity
              : productData.stockQuantity + item.quantity,
            totalSales:
              (productData?.totalSales ?? item.quantity) - item.quantity,
          });
        }
      }
    }
  }
};
