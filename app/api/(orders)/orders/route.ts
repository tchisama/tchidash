import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  increment,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { dbAddDoc, dbGetDocs, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { db } from "@/firebase"; // Adjust this import based on your Firebase setup
import { Order } from "@/types/order";
import { OrderItem } from "@/types/order";
import { Customer } from "@/types/customer";
import axios from "axios";
import { Store } from "@/types/store";

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
    return NextResponse.json({
      storeId,
      data,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const update = searchParams.get("update");

  // create New Order
  const body = await request.json();


  // store 
  if (!storeId) {
    return NextResponse.json({ error: "storeId is required" }, { status: 400 });
  }
  const store = await getDoc(
    doc(db, "stores", storeId)
  ).then((doc) => {
    if (doc.exists()) {
      return doc.data() as Store;
    }
  })
  let orderSequence ;
  if(update){
    orderSequence = body.sequence
  }else{
    orderSequence = (store?.sequences?.orders || 0);
    if(!store?.sequences?.orders){
      updateDoc(doc(db, "stores", storeId), {
        sequences: {
          orders: 1,
        },
      })
    }else{
      updateDoc(doc(db, "stores", storeId), {
        sequences: {
          orders: orderSequence + 1,
        },
      }).then(() => {
        console.log("Sequence up successfully");
      })
    }
  }



  const order = {
    ...body,
    sequence: orderSequence,
    storeId,
    createdAt: Timestamp.now(),
  } as Order;



  if (!order.customer.firstName)
    return NextResponse.json(
      { error: "Please enter the first name" },
      { status: 400 },
    );
  if (!order.customer.lastName)
    return NextResponse.json(
      { error: "Please enter the last name" },
      { status: 400 },
    );
  if (!order.customer.phoneNumber)
    return NextResponse.json(
      { error: "Please enter the phone number" },
      { status: 400 },
    );
  if (!order.customer.shippingAddress.address)
    return NextResponse.json(
      { error: "Please enter the shipping address" },
      { status: 400 },
    );
  if (!order.customer.shippingAddress.city)
    return NextResponse.json(
      { error: "Please enter the shipping city" },
      { status: 400 },
    );
  if (!order.items.length)
    return NextResponse.json(
      { error: "Please add at least one item" },
      { status: 400 },
    );

  // lets Correct the city name if it not already in the correct format
  await axios
    .get(
      "https://tchidash.vercel.app/api/ai/city-corrector?city=" +
        order.customer.shippingAddress.city,
    )
    .then((response) => {
      console.log(response.data);
      order.cityAi = {
        city: response.data.city,
        region: response.data.region,
        ID: response.data["R-ID"],
      };
    })
    .catch((error) => {
      console.error(error);
    });

  const { items } = order;

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const getTotalPriceFromItem = (item: OrderItem) => {
    const unitPrice = item.price;
    const quantity = item.quantity;
    const discount =
      item.discount?.type == "fixed"
        ? item.discount.amount
        : (unitPrice * (item.discount?.amount || 0)) / 100;
    return (unitPrice - discount) * quantity;
  };
  const total = items.reduce(
    (acc, item) => acc + getTotalPriceFromItem(item),
    0,
  );
  const shippingCost = order.shippingInfo.cost || 0;
  const discountAmount = items.reduce(
    (acc, item) =>
      acc +
      (item.discount?.type == "fixed"
        ? item.discount.amount
        : (item.price * (item.discount?.amount || 0)) / 100) *
        item.quantity,
    0,
  );

  order.subtotal = subtotal;
  order.totalItems = totalItems;
  order.totalPrice = total + shippingCost;
  order.discountAmount = discountAmount;
  if (!storeId)
    return NextResponse.json({ error: "storeId is required" }, { status: 400 });

let createdOrder;
    if (update) {
      createdOrder = await dbUpdateDoc(
        doc(db, "orders", order.id),
        {
          ...order,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        storeId,
        "",
      ).then(() => {
        setDoc(doc(db, "sales", order.id), {
          phoneNumber: order.customer.phoneNumber,
          totalPrice: order.totalPrice,
          status: order.orderStatus,
          storeId: order.storeId,
          createdAt: order.createdAt,
        });
        return order.id;
      })
    }else{
      // create New Order
      createdOrder = await dbAddDoc(
        collection(db, "orders"),
        order,
        storeId,
        "",
      ).then((response) => {
        setDoc(doc(db, "sales", response.id), {
          phoneNumber: order.customer.phoneNumber,
          totalPrice: order.totalPrice,
          status: order.orderStatus,
          storeId: order.storeId,
          createdAt: order.createdAt,
        });
        return response.id;
      });

    }

  const newCustomer: Customer = {
    id: "", // Auto-generated by Firebase Firestore
    firstName: order.customer.firstName,
    lastName: order.customer.lastName,
    email: order.customer.email || "", // Optional depending on your form
    phoneNumber: order.customer.phoneNumber,
    address: {
      street: order.customer.shippingAddress.address,
      city: order.customer.shippingAddress.city,
      postalCode: order.customer?.shippingAddress?.postalCode || "",
      country: order.customer?.shippingAddress?.country || "",
    },
    status: "active", // Default status for new customers
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isEmailVerified: false, // Depends on your flow
    purchaseCount: 1, // Optional
    totalAmountSpent: order.totalPrice,
    storeId: order.storeId,
  };

  // notification part
  //
  //
  //

  const whatsappEnable = await getDoc(doc(db, "stores", order.storeId)).then(
    (doc) => {
      return doc
        .data()
        ?.integrations?.find(
          (integration: { name: string }) =>
            integration.name === "whatsapp-notifications",
        )?.enabled;
    },
  );
  console.log("whatsappEnable", whatsappEnable);
  console.log("store", order.storeId);
  if (whatsappEnable) {
    dbAddDoc(
      collection(db, "whatsapp-messages"),
      {
        message: `*New Order ✨🎉*
*${order.customer.name
          .split(" ")
          .filter((n) => n != " ")
          .join("_")}* from *${order.customer.shippingAddress.city
          .split(" ")
          .filter((n) => n != " ")
          .join("_")}* .
with a total of *${order.totalPrice} Dh*`,
        status: "pending",
        type: "newOrder",
        createdAt: Timestamp.now(),
        storeId: order.storeId,
      },
      storeId,
      "",
    );
  }

  // Create a new customer or update existing customer
  try {
    // Check if customer already exists based on phone number or email
    const customerQuery = query(
      collection(db, "customers"),
      where("phoneNumber", "==", newCustomer.phoneNumber),
      where("storeId", "==", storeId),
    );
    const customerSnapshot = await getDocs(customerQuery);

    if(!update){
      if (customerSnapshot.empty) {
        // No existing customer found, create a new customer
        const customerDocRef = await dbAddDoc(
          collection(db, "customers"),
          newCustomer,
          storeId,
          "",
        );
        console.log("New customer created with ID:", customerDocRef.id);
      } else {
        // increment customer purchase count
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
    // router.push("/dashboard/orders");
  } catch (error) {
    console.error("Error creating customer or order:", error);
  }

  if (!createdOrder) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
  return NextResponse.json({
    createdOrder,
  });
}
