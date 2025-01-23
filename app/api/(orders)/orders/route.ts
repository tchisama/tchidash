import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  increment,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { dbAddDoc, dbGetDocs, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { db } from "@/firebase"; // Adjust this import based on your Firebase setup
import { Order, OrderItem } from "@/types/order";
import { Customer } from "@/types/customer";
import axios from "axios";
import { Store } from "@/types/store";

// Utility function to calculate order totals
const calculateOrderTotals = (items: OrderItem[], shippingCost: number) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const getTotalPriceFromItem = (item: OrderItem) => {
    const unitPrice = item.price;
    const quantity = item.quantity;
    const discount =
      item.discount?.type === "fixed"
        ? item.discount.amount
        : (unitPrice * (item.discount?.amount || 0)) / 100;
    return (unitPrice - discount) * quantity;
  };

  const total = items.reduce((acc, item) => acc + getTotalPriceFromItem(item), 0);
  const discountAmount = items.reduce(
    (acc, item) =>
      acc +
      (item.discount?.type === "fixed"
        ? item.discount.amount
        : (item.price * (item.discount?.amount || 0)) / 100) *
        item.quantity,
    0,
  );

  return {
    subtotal,
    totalItems,
    totalPrice: total + shippingCost,
    discountAmount,
  };
};

// Utility function to validate order inputs
const validateOrderInputs = (order: Order) => {
  if (!order.customer.firstName) throw new Error("First name is required");
  if (!order.customer.lastName) throw new Error("Last name is required");
  if (!order.customer.phoneNumber) throw new Error("Phone number is required");
  if (!order.customer.shippingAddress.address) throw new Error("Shipping address is required");
  if (!order.customer.shippingAddress.city) throw new Error("Shipping city is required");
  if (!order.items.length) throw new Error("At least one item is required");
};

// Function to fetch store details
const fetchStoreDetails = async (storeId: string) => {
  const storeDoc = await getDoc(doc(db, "stores", storeId));
  if (!storeDoc.exists()) throw new Error("Store not found");
  return storeDoc.data() as Store;
};

// Function to update or create an order
const createOrUpdateOrder = async (order: Order, storeId: string, update: boolean) => {
  if (update) {
    await dbUpdateDoc(
      doc(db, "orders", order.id),
      {
        ...order,
        updatedAt: Timestamp.now(),
      },
      storeId,
      "",
    );
  } else {
    await dbAddDoc(collection(db, "orders"), order, storeId, "");
  }
};

// Function to log a sale
// const logSale = async (order: Order) => {
//   await setDoc(doc(db, "sales", order.id), {
//     phoneNumber: order.customer.phoneNumber,
//     totalPrice: order.totalPrice,
//     status: order.orderStatus,
//     storeId: order.storeId,
//     createdAt: order.createdAt,
//   });
// };

// Function to create or update a customer
const handleCustomer = async (order: Order, storeId: string, update: boolean) => {
  const newCustomer: Customer = {
    id: "",
    firstName: order.customer.firstName ?? "",
    lastName: order.customer.lastName ?? "",
    email: order.customer.email || "",
    phoneNumber: order.customer.phoneNumber,
    address: {
      street: order.customer.shippingAddress.address,
      city: order.customer.shippingAddress.city,
      postalCode: order.customer.shippingAddress.postalCode || "",
      country: order.customer.shippingAddress.country || "",
    },
    status: "active",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isEmailVerified: false,
    purchaseCount: 1,
    totalAmountSpent: order.totalPrice,
    storeId: order.storeId,
  };

  if (!update) {
    const customerQuery = query(
      collection(db, "customers"),
      where("phoneNumber", "==", newCustomer.phoneNumber),
      where("storeId", "==", storeId),
    );
    const customerSnapshot = await getDocs(customerQuery);

    if (customerSnapshot.empty) {
      await dbAddDoc(collection(db, "customers"), newCustomer, storeId, "");
    } else {
      await dbUpdateDoc(
        doc(db, "customers", customerSnapshot.docs[0].id),
        {
          purchaseCount: increment(1),
          totalAmountSpent: increment(order.totalPrice),
        },
        storeId,
        "",
      );
    }
  }
};

// Function to send WhatsApp notifications
// const sendWhatsAppNotification = async (order: Order, storeId: string) => {
//   const whatsappEnable = await getDoc(doc(db, "stores", storeId)).then((doc) => {
//     return doc
//       .data()
//       ?.integrations?.find(
//         (integration: { name: string }) => integration.name === "whatsapp-notifications",
//       )?.enabled;
//   });

//   if (whatsappEnable) {
//     await dbAddDoc(
//       collection(db, "whatsapp-messages"),
//       {
//         message: `*New Order ✨🎉*
// *${order.customer.name.split(" ").filter((n) => n !== " ").join("_")}* from *${order.customer.shippingAddress.city.split(" ").filter((n) => n !== " ").join("_")}*.
// with a total of *${order.totalPrice} Dh*`,
//         status: "pending",
//         type: "newOrder",
//         createdAt: Timestamp.now(),
//         storeId: order.storeId,
//       },
//       storeId,
//       "",
//     );
//   }
// };

// Function to correct city name using an external API
const correctCityName = async (city: string) => {
  try {
    const response = await axios.get(
      `https://tchidash.vercel.app/api/ai/city-corrector?city=${city}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error correcting city name:", error);
    return null;
  }
};

// Main POST function
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const update = searchParams.get("update");

  if (!storeId) {
    return NextResponse.json({ error: "storeId is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const store = await fetchStoreDetails(storeId);

    const orderSequence = update ? body.sequence : (store?.sequences?.orders || 0);
    if (!update) {
      await updateDoc(doc(db, "stores", storeId), {
        sequences: {
          orders: orderSequence + 1,
        },
      });
    }

    const order = {
      ...body,
      sequence: orderSequence,
      storeId,
      createdAt: Timestamp.now(),
    } as Order;

    validateOrderInputs(order);

    // Correct city name if needed
    const cityData = await correctCityName(order.customer.shippingAddress.city);
    if (cityData) {
      order.cityAi = {
        city: cityData.city,
        region: cityData.region,
        ID: cityData["R-ID"],
      };
    }

    // Calculate order totals
    const { subtotal, totalItems, totalPrice, discountAmount } = calculateOrderTotals(
      order.items,
      order.shippingInfo.cost || 0,
    );
    order.subtotal = subtotal;
    order.totalItems = totalItems;
    order.totalPrice = totalPrice;
    order.discountAmount = discountAmount;

    // Create or update the order
    await createOrUpdateOrder(order, storeId, !!update);
    await handleCustomer(order, storeId, !!update);
    // await sendWhatsAppNotification(order, storeId);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// GET function to fetch orders
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return NextResponse.json({ error: "storeId is required" }, { status: 400 });
  }

  try {
    const data = await dbGetDocs(
      query(collection(db, "orders"), where("storeId", "==", storeId)),
      storeId,
      "",
    ).then((response) =>
      response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Order),
    );
    return NextResponse.json({ storeId, data });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}