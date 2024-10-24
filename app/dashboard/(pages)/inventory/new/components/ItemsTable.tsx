import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChooseProductWithVariant from "./ChooseProductWithVariant";
import { PlusCircle, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { and, collection, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { usePurchaseOrderStore } from "@/store/purchase";
import {
  InventoryItemMove,
  InventoryMoveStatus,
  InventoryMoveType,
} from "@/types/inventory";
import { v4 } from "uuid";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";

function ItemsTable() {
  const { purchaseOrderItmes, setPurchaseOrderItems } = usePurchaseOrderStore();
  // new order item with the type of OrderItem
  const addItem = () => {
    const newItem: InventoryItemMove = {
      id: v4(),
      productId: "",
      variantId: "",
      title: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      quantity: 10,
      storeId: "",
      cost: 0,
      unitPrice: 0,
      imageUrl: "",
      vendorId: "",
      orderId: "",
      note: "",
      createdById: "",
      type: InventoryMoveType.IN,
      status: InventoryMoveStatus.PENDING,
      referenceNumber: "",
    };

    if (!purchaseOrderItmes) return;

    setPurchaseOrderItems([newItem, ...purchaseOrderItmes]);
  };

  return (
    <div className="flex flex-col items-end">
      <Button
        size={"sm"}
        onClick={addItem}
        variant={"outline"}
        className="ml-auto mb-2"
      >
        <PlusCircle className="h-3.5 w-3.5 mr-2" />
        Add Item
      </Button>
      <div className="bg-slate-50 rounded-2xl w-full border">
        {purchaseOrderItmes.length === 0 ? (
          <div className="flex justify-center items-center h-24">
            <p className="text-slate-500">No items added</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Product</TableHead>
                <TableHead>Item Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="">Total Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {purchaseOrderItmes.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

const ItemRow = ({ item }: { item: InventoryItemMove }) => {
  const { purchaseOrderItmes, setPurchaseOrderItems } = usePurchaseOrderStore();
  const { storeId } = useStore();
  const { data: products } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => {
      const q = query(
        collection(db, "products"),
        and(where("storeId", "==", storeId), where("status", "==", "active")),
      );
      if (!storeId) return;
      const response = dbGetDocs(q, storeId, "").then((response) =>
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Product),
      );
      return response;
    },
  });

  const price = () => {
    const product = products?.find((p) => p.id === item.productId);
    if (!product) return 0;
    if (product.variantsAreOneProduct) {
      return product.price;
    } else {
      return item.unitPrice;
    }
  };

  useEffect(() => {
    console.log(purchaseOrderItmes);
  }, [purchaseOrderItmes]);

  return (
    purchaseOrderItmes && (
      <TableRow key={item.id}>
        {/* Product Info */}
        <TableCell>
          <ChooseProductWithVariant item={item} />
        </TableCell>

        {/* Item Price */}
        <TableCell>
          <div className="font-medium">{price()}</div>
        </TableCell>

        {/* Quantity */}
        <TableCell>
          <Input
            className={cn("w-32")}
            value={item.quantity}
            onChange={(e) => {
              setPurchaseOrderItems(
                purchaseOrderItmes.map((i) => {
                  if (i.id === item.id) {
                    return {
                      ...i,
                      quantity: Number(e.target.value),
                    };
                  }
                  return i;
                }),
              );
            }}
            onBlur={(e) => {
              try {
                const evaluatedValue = eval(e.target.value); // Use eval to calculate the result
                if (typeof evaluatedValue === "number") {
                  setPurchaseOrderItems(
                    purchaseOrderItmes.map((i) => {
                      if (i.id === item.id) {
                        return {
                          ...i,
                          quantity: evaluatedValue,
                        };
                      }
                      return i;
                    }),
                  );
                } else {
                  console.error("Invalid expression"); // Handle cases where eval does not return a number
                }
              } catch (error) {
                console.error("Error evaluating expression:", error); // Catch any errors from eval
              }
            }}
          />
        </TableCell>

        {/* Total Price */}
        <TableCell className="">{price() * item.quantity}</TableCell>
        <TableCell className="text-right">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => {
              setPurchaseOrderItems(
                purchaseOrderItmes.filter((i) => i.id !== item.id),
              );
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  );
};

export default ItemsTable;
