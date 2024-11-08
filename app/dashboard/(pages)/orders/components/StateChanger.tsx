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
import { collection, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import { cn } from "@/lib/utils";
import {
  CircleDotDashed,
  Clock,
  MapPinCheckInside,
  PackageCheck,
  PhoneOff,
  Truck,
  Undo,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

export const orderStatusValuesWithIcon = [
  {
    name: "pending",
    icon: <CircleDotDashed className="h-4 w-4" />,
    color: "#a3b18a",
    effectStock: false,
  },
  {
    name: "confirmed",
    icon: <UserRoundCheck className="h-4 w-4" />,
    color: "#3a86ff",
    effectStock: true,
  },
  {
    name: "packed",
    icon: <PackageCheck className="h-4 w-4" />,
    color: "#5c374c",
    effectStock: true,
  },
  {
    name: "shipped",
    icon: <Truck className="h-4 w-4" />,
    color: "#5a189a",
    effectStock: true,
  },
  {
    name: "delivered",
    icon: <MapPinCheckInside className="h-4 w-4" />,
    color: "#386641",
    effectStock: true,
  },
  {
    name: "scheduled",
    icon: <Clock className="h-4 w-4" />,
    color: "#f8961e",
    effectStock: true,
  },
  {
    name: "cancelled",
    icon: <PhoneOff className="h-4 w-4" />,
    color: "#fb5607",
    effectStock: false,
  },
  {
    name: "returned",
    icon: <Undo className="h-4 w-4" />,
    color: "#e63946",
    effectStock: false,
  },
  {
    name: "fake",
    icon: <UserRoundX className="h-4 w-4" />,
    color: "#6d6a75",
    effectStock: false,
  },
];

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export function StateChanger({
  state: st,
  order,
}: {
  state: OrderStatus;
  order: Order;
}) {
  const { storeId } = useStore();
  const [state, setState] = React.useState<OrderStatus>();
  const { data: session } = useSession();
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
  const { data: user } = useQuery({
    queryKey: ["notes", storeId, order.id, state],
    queryFn: async () => {
      if (!storeId) return;
      const q = query(
        collection(db, "notes"),
        where("details.for", "==", "order"),
        where("details.orderId", "==", order.id),
        where("changed", "==", order.orderStatus),
      );
      const note = await dbGetDocs(q, storeId, "");
      const noteData = note.docs.map((doc) => doc.data())[0];
      if (!noteData) return;
      const q2 = query(
        collection(db, "users"),
        where("email", "==", noteData.creator),
      );
      const user = await dbGetDocs(q2, storeId, "");
      return user.docs.map((doc) => doc.data())[0];
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
                )?.color + "50",
              borderColor:
                orderStatusValuesWithIcon.find(
                  (status) => status.name === state,
                )?.color + "30",
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
            {state}
            {user && (
              <Avatar className="w-6 h-6 border border-[#3335] ">
                <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
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
        <DropdownMenuContent align="start" side="right">
          <DropdownMenuLabel>Order Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {orderStatusValuesWithIcon.map((status) => (
            <>
              <DropdownMenuItem
                key={status.name}
                style={{
                  background: status.color + "50",
                  borderColor: status.color + "30",
                  color: "#000a",
                }}
                className="py-1 mt-[2px] cursor-pointer border"
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

                    if (!order.storeId) return;
                    dbAddDoc(
                      collection(db, "notes"),
                      {
                        changed: `${status.name}`,
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
                {status.name}
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

//const updateStockOfProductsBasedOnStatus = async (
//  status: OrderStatus,
//  oldStatus: OrderStatus,
//  products: Order["items"],
//  order: Order,
//) => {
//  // Check if the order status is transitioning to "shipped" or "delivered"
//  //
//  //
//  //
//
//  dbSetDoc(
//    doc(db, "sales", order.id),
//    {
//      phoneNumber: order.customer.phoneNumber,
//      totalPrice: order.totalPrice,
//      status,
//      storeId: order.storeId,
//      createdAt: order.createdAt,
//    },
//    order.storeId,
//    "",
//  );
//
//  if (
//    (oldStatus === "pending" ||
//      oldStatus === "cancelled" ||
//      oldStatus === "returned") &&
//    (status === "processing" || status === "shipped" || status === "delivered")
//  ) {
//    // Decrease stock based on the order items
//    for (const item of products) {
//      dbSetDoc(
//        doc(db, "inventoryItems", order.id + item.id),
//        {
//          id: "",
//          productId: item.productId,
//          variantId: item?.variantId,
//          title: item.title,
//          createdAt: Timestamp.now(),
//          updatedAt: Timestamp.now(),
//          quantity: -item.quantity,
//          storeId: order.storeId,
//          imageUrl: item.imageUrl,
//          cost: item.totalPrice,
//          unitPrice: item.price,
//          vendorId: "",
//          orderId: order.id,
//          note: "",
//          createdById: order.customer.name,
//          type: "OUT",
//          status: "APPROVED",
//          referenceNumber: "SO-" + v4().substring(0, 8),
//        },
//        order.storeId,
//        "",
//      );
//    }
//  }
//
//  // If the order is being canceled or returned, revert the stock
//  if (
//    (oldStatus === "processing" ||
//      oldStatus === "shipped" ||
//      oldStatus === "delivered") &&
//    (status === "cancelled" || status === "returned" || status === "pending")
//  ) {
//    // Restore stock based on the order items
//    for (const item of products) {
//      const inventoryItem = {
//        id: "",
//        productId: item.productId,
//        variantId: item?.variantId,
//        title: item.title,
//        createdAt: Timestamp.now(),
//        updatedAt: Timestamp.now(),
//        quantity: -item.quantity,
//        storeId: order.storeId,
//        imageUrl: item.imageUrl,
//        cost: item.totalPrice,
//        unitPrice: item.price,
//        vendorId: "",
//        orderId: order.id,
//        note: "",
//        createdById: order.customer.name,
//        type: "OUT",
//        status: "REJECTED",
//        referenceNumber: "SO-" + v4().substring(0, 8),
//      };
//      dbSetDoc(
//        doc(db, "inventoryItems", order.id + item.id),
//        inventoryItem,
//        order.storeId,
//        "",
//      );
//    }
//  }
//};

//
//const updateStockOfProductsBasedOnStatus = async (
//  status: OrderStatus,
//  oldStatus: OrderStatus,
//  products: Order["items"],
//  order: Order,
//) => {
//  // Check if the order status is transitioning to "shipped" or "delivered"
//  //
//  //
//  //
//
//  setDoc(doc(db, "sales", order.id), {
//    phoneNumber: order.customer.phoneNumber,
//    totalPrice: order.totalPrice,
//    status,
//    storeId: order.storeId,
//    createdAt: order.createdAt,
//  });
//
//  if (
//    (oldStatus === "pending" ||
//      oldStatus === "cancelled" ||
//      oldStatus === "returned") &&
//    (status === "processing" || status === "shipped" || status === "delivered")
//  ) {
//    // Decrease stock based on the order items
//    for (const item of products) {
//      const productRef = doc(db, "products", item.productId);
//      const productSnapshot = await getDoc(productRef);
//
//      if (productSnapshot.exists()) {
//        const productData = productSnapshot.data() as Product;
//
//        if (
//          productData.variants &&
//          productData.variants.length > 0 &&
//          productData.variantsAreOneProduct === false
//        ) {
//          const newUpdatedProductVariants = productData.variants.map(
//            (variant) => {
//              if (variant.id === item.variantId) {
//                return {
//                  ...variant,
//                  inventoryQuantity: variant.hasInfiniteStock
//                    ? variant.inventoryQuantity
//                    : variant.inventoryQuantity - item.quantity,
//                  totalSales: (variant?.totalSales ?? 0) + item.quantity,
//                };
//              } else {
//                return variant;
//              }
//            },
//          );
//
//          await updateDoc(productRef, {
//            variants: newUpdatedProductVariants,
//          });
//        } else {
//          if (productData.stockQuantity >= item.quantity) {
//            await updateDoc(productRef, {
//              stockQuantity: productData.hasInfiniteStock
//                ? productData.stockQuantity
//                : productData.stockQuantity - item.quantity,
//              totalSales: (productData?.totalSales ?? 0) + item.quantity,
//            });
//          }
//        }
//      }
//    }
//  }
//
//  // If the order is being canceled or returned, revert the stock
//  if (
//    (oldStatus === "processing" ||
//      oldStatus === "shipped" ||
//      oldStatus === "delivered") &&
//    (status === "cancelled" || status === "returned" || status === "pending")
//  ) {
//    // Restore stock based on the order items
//    for (const item of products) {
//      const productRef = doc(db, "products", item.productId);
//      const productSnapshot = await getDoc(productRef);
//
//      if (productSnapshot.exists()) {
//        const productData = productSnapshot.data() as Product;
//
//        if (
//          productData.variants &&
//          productData.variants.length > 0 &&
//          productData.variantsAreOneProduct === false
//        ) {
//          const newUpdatedProductVariants = productData.variants.map(
//            (variant) => {
//              if (variant.id === item.variantId) {
//                return {
//                  ...variant,
//                  inventoryQuantity: variant.hasInfiniteStock
//                    ? variant.inventoryQuantity
//                    : variant.inventoryQuantity + item.quantity,
//                  totalSales:
//                    (variant?.totalSales ?? item.quantity) - item.quantity,
//                };
//              } else {
//                return variant;
//              }
//            },
//          );
//
//          await updateDoc(productRef, {
//            variants: newUpdatedProductVariants,
//          });
//        } else {
//          await updateDoc(productRef, {
//            stockQuantity: productData.hasInfiniteStock
//              ? productData.stockQuantity
//              : productData.stockQuantity + item.quantity,
//            totalSales:
//              (productData?.totalSales ?? item.quantity) - item.quantity,
//          });
//        }
//      }
//    }
//  }
//};
