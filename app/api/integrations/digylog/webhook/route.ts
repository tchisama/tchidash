import { NextRequest, NextResponse } from "next/server";
import {
  DIGYLOG_BASE_URL,
  DIGYLOG_REFERER,
  getDigylogCredantials,
} from "../orders/route";
import axios from "axios";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Order } from "@/types/order";
import { Timestamp } from "firebase/firestore";
// register new webhook
//

// PUT /webhook Add or Update webhook
// Property Type Value Description
// url string required url of your webhook

// register new webhook
export async function POST(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId");
  console.log(storeId);

  if (!storeId) {
    return NextResponse.json({ status: "no storeId" });
  }

  const { token, errors } = await getDigylogCredantials(storeId);

  if (errors) {
    return NextResponse.json({ status: errors });
  }

  const url = "https://dash.tchisama.com/api/integrations/digylog/webhook";

  try {
    const response = await axios
      .put(
        `${DIGYLOG_BASE_URL}/webhook`,
        {
          url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer: DIGYLOG_REFERER,
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => res.data);

    return NextResponse.json({ status: "success", data: response });
  } catch (error) {
    console.error("Error sending data to Digylog");
    console.log(JSON.stringify(error, null, 2));
    return NextResponse.json({ status: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  console.log("PUT /webhook");

  try {
    const body = await request.json();
    console.log("Received body:", body);

    // Process the data (e.g., update order status in your database)
    // For now, we'll just log the data
    console.log("Processing order update:", {
      traking: body.traking,
      status: body.status,
      idStatus: body.idStatus,
      motif: body.motif,
      postponedTo: body.postponedTo,
      updatedAt: body.updatedAt,
    });

    const q = query(
      collection(db, "orders"),
      where("shippingInfo.trackingNumber", "==", body.traking),
    );

    const order = (await getDocs(q).then((res) => res.docs[0].data())) as Order;

    if (order) {
      if (!order.storeId) return;
      const notification = {
        id: "",
        storeId: order.storeId,
        createdAt: Timestamp.now(),
        action: "changed State",
        email: "Digylog",
        target: `of Order#${order.sequence} to ${body.status}`,
        seen: [],
      };
      console.log("Notification:", notification);
      await addDoc(collection(db, "notifications"), notification);
    }

    // Return a success response
    return NextResponse.json({ status: "success" });
  } catch (error: unknown) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { status: "error", message: error },
      { status: 500 },
    );
  }
}
