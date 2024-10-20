"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import ItemsTable from "./components/ItemsTable";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/storeInfos";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { VendorCombobox } from "../commponents/SelectVendor";
import {
  InventoryItemMove,
  PurchaseOrder,
  PurchaseOrderStatus,
} from "@/types/inventory";
import { usePurchaseOrderStore } from "@/store/purchase";
import { db } from "@/firebase";
import { v4 } from "uuid";

// Default canvas for a new order
const defaultPurchaseOrder: PurchaseOrder = {
  id: "",
  vendorId: "",
  vendorName: "",
  itemsMovesIds: [],
  itemsMoves: [],
  note: "",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  createdById: "",
  status: PurchaseOrderStatus.PENDING,
  referenceNumber: "",
  totalCost: 0,
  storeId: "",
};

export default function CreateOrder() {
  const { currentPurchaseOrder, setCurrentPurchaseOrder, purchaseOrderItmes } =
    usePurchaseOrderStore();
  const { storeId } = useStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPurchaseOrder({
      ...defaultPurchaseOrder,
      storeId: storeId ?? "",
      createdById: session?.user?.email ?? "",
    });
  }, [storeId, setCurrentPurchaseOrder, session]);

  useEffect(() => {
    console.log(currentPurchaseOrder);
  }, [currentPurchaseOrder]);

  const CreatePurchaseOrder = async () => {
    setError(null);
    if (!currentPurchaseOrder) return;
    if (!currentPurchaseOrder.vendorId) {
      setError("Please select a vendor");
      return;
    }

    if (purchaseOrderItmes.length === 0) {
      setError("Please add items to the order");
      return;
    }

    purchaseOrderItmes.forEach(async (item) => {
      await setDoc(doc(db, "inventoryItems", item.id), {
        ...item,
        storeId: storeId,
        vendorId: currentPurchaseOrder.vendorId,
        createdById: session?.user?.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        cost: item.unitPrice * item.quantity,
      });
    });
    const purchaseForUpload = {
      ...currentPurchaseOrder,
      totalCost: purchaseOrderItmes.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0,
      ),
      itemsMoves: purchaseOrderItmes.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        imageUrl: item.imageUrl,
      })),
      itemsMovesIds: purchaseOrderItmes.map(
        (item: InventoryItemMove) => item.id,
      ),
    };
    const order = await addDoc(collection(db, "purchaseOrders"), {
      ...purchaseForUpload,
      referenceNumber: "PO-" + v4().substring(0, 8),
    });

    if (order) {
      toast({
        title: "Order Created",
        description: "Order has been created successfully",
      });
      setCurrentPurchaseOrder(defaultPurchaseOrder);
      router.push("/dashboard/inventory");
    }
  };

  return (
    currentPurchaseOrder && (
      <div className="space-y-6  mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex gap-4">
          <div className="space-y-4 flex-1 max-w-3xl">
            <h2 className="text-lg font-bold">Vendor Information</h2>
            <div className="flex flex-col gap-2 max-w-[500px]">
              <Label htmlFor="vendor">Vendor</Label>
              <VendorCombobox />
            </div>
          </div>
          <div className="space-y-4 max-w-3xl flex-1"></div>
        </div>
        <ItemsTable />
        <div className="max-w-[800px] flex flex-col gap-2">
          <Label htmlFor="note">Purchase Note (Optional)</Label>
          <Textarea
            id="note"
            name="note"
            value={currentPurchaseOrder.note}
            onChange={(e) => {
              setCurrentPurchaseOrder({
                ...currentPurchaseOrder,
                note: e.target.value,
              });
            }}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button className="min-w-xl" onClick={CreatePurchaseOrder}>
          Place Purchase Order
        </Button>
      </div>
    )
  );
}
