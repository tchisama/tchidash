import { NextResponse } from "next/server";
import { doc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { dbGetDoc, dbSetDoc, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { v4 } from "uuid";
import { OrderStatus } from "@/types/order";
import { orderStatusValues } from "@/lib/datajson/states";

interface OrderUpdateRequest {
  orderId: string;
  newStatus: OrderStatus;
  storeId: string;
}

export async function POST(req: Request) {
  try {
    const { orderId, newStatus, storeId }: OrderUpdateRequest =
      await req.json();

    console.log("orderId", orderId);
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await dbGetDoc(orderRef, storeId, "");
    if (!orderDoc) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const {
      items,
      customer,
      totalPrice,
      orderStatus: oldStatus,
      storeId: orderStoreId,
    } = orderDoc;

    if (orderStoreId !== storeId) {
      return NextResponse.json(
        { message: "The Order is not from this store" },
        { status: 403 },
      );
    }

    // Update order status in Firestore
    await dbUpdateDoc(
      doc(db, "orders", orderId),
      {
        orderStatus: newStatus,
        updatedAt: Timestamp.now(),
      },
      storeId,
      "",
    );

    // Log the sale in the "sales" collection
    await dbSetDoc(
      doc(db, "sales", orderId),
      {
        phoneNumber: customer.phoneNumber,
        totalPrice,
        status: newStatus,
        storeId,
        updatedAt: Timestamp.now(),
      },
      storeId,
      "",
    );

    const statusEffect = orderStatusValues.find(
      (status) => status.name === newStatus,
    )?.effectStock;

    const statusEffectOld = orderStatusValues.find(
      (status) => status.name === oldStatus,
    )?.effectStock;

    console.log("statusEffect", statusEffect);
    console.log("statusEffectOld", statusEffectOld);

    // Adjust inventory stock based on new status
    if (statusEffect == true && statusEffectOld == false) {
      for (const item of items) {
        await dbSetDoc(
          doc(db, "inventoryItems", orderId + item.id),
          {
            id: "",
            productId: item.productId,
            variantId: item?.variantId,
            title: item.title,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            quantity: -item.quantity,
            storeId,
            imageUrl: item.imageUrl,
            cost: item.totalPrice,
            unitPrice: item.price,
            vendorId: "",
            orderId,
            note: "",
            createdById: customer.name,
            type: "OUT",
            status: statusEffect ? "APPROVED" : "PENDING",
            referenceNumber: "SO-" + v4().substring(0, 8),
          },
          storeId,
          "",
        );
      }
    }

    // Restore stock if the order is cancelled or returned
    if (
      statusEffect == false &&
      statusEffectOld == true
      // (oldStatus === "processing" ||
      //   oldStatus === "shipped" ||
      //   oldStatus === "delivered") &&
      // (newStatus === "cancelled" ||
      //   newStatus === "returned" ||
      //   newStatus === "pending")
    ) {
      for (const item of items) {
        await dbSetDoc(
          doc(db, "inventoryItems", orderId + item.id),
          {
            id: "",
            productId: item.productId,
            variantId: item?.variantId,
            title: item.title,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            quantity: item.quantity,
            storeId,
            imageUrl: item.imageUrl,
            cost: item.totalPrice,
            unitPrice: item.price,
            vendorId: "",
            orderId,
            note: "",
            createdById: customer.name,
            type: "OUT",
            status: "REJECTED",
            referenceNumber: "SO-" + v4().substring(0, 8),
          },
          storeId,
          "",
        );
      }
    }

    return NextResponse.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 },
    );
  }
}
