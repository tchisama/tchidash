"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import axios from "axios";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Order } from "@/types/order";
import { Timestamp } from "firebase/firestore";
import { useOrderStore } from "@/store/orders";
import ItemsTable from "./components/ItemsTable";
import { getTotalPriceFromItem } from "@/lib/orders";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/storeInfos";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

// Default canvas for a new order
const defaultOrder: Order = {
  id: "", // Empty string for ID, will be generated later
  customer: {
    id: "", // Placeholder customer ID
    name: "Guest", // Default customer name
    firstName: "", // Optional
    lastName: "", // Optional
    phoneNumber: "", // Optional
    shippingAddress: {
      address: "", // Placeholder address
      city: "", // Placeholder city
    },
  },
  items: [], // Empty array for ordered items
  totalItems: 0, // Default to zero items
  subtotal: 0, // Default subtotal as 0
  shippingInfo: {
    method: "standard", // Default shipping method
    cost: 40, // Default shipping cost
    shippingStatus: "pending",
  },
  totalPrice: 0, // Default total price is 0
  currency: "MAD",
  paymentMethod: "cash_on_delivery",
  orderStatus: "pending",
  createdAt: Timestamp.now(), // Use the current timestamp for creation time
  storeId: "", // Placeholder store ID
  note: {
    creator: "",
    creatorId: "",
    content: "",
  }, // Optional note is undefined by default
};

export default function CreateOrder() {
  const { newOrder: order, setNewOrder: setOrder } = useOrderStore();
  const { storeId, store } = useStore();
  const { data: session } = useSession();
  useEffect(() => {
    setOrder(defaultOrder);
  }, [setOrder]);

  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");

  const totalPrice = () => {
    if (!order) return 0;
    return order.items.reduce(
      (acc, item) => acc + getTotalPriceFromItem(item),
      0,
    );
  };

  const tp = totalPrice();
  const shippingCost = () => {
    if (!store) return 0;
    if (!store.settings) return 0;
    let cost = store.settings.shippingCost;
    if (
      store.settings.hasFreeShippingAboveAmount &&
      store.settings.shippingFreeAboveCartAmount
    ) {
      if (tp >= store?.settings?.shippingFreeAboveCartAmount) {
        cost = 0;
      }
    }
    return cost;
  };

  const handleSubmit = async () => {
    console.log(order);
    if (!order) return;
    if (!storeId) return;
    if (!session) return;
    if (!session.user?.email) return;
    if (!order.customer.firstName)
      return setError("Please enter the first name");
    if (!order.customer.lastName) return setError("Please enter the last name");
    // if(!order.customer.email) return setError("Please enter the email")
    if (!order.customer.phoneNumber)
      return setError("Please enter the phone number");
    if (!order.customer.shippingAddress.address)
      return setError("Please enter the shipping address");
    if (!order.customer.shippingAddress.city)
      return setError("Please enter the shipping city");

    if (!order.items.length) return setError("Please add at least one item");
    if (!tp) return setError("Please add at least one item");

    const orderForUpdate: Order = {
      ...order,
      //createdAt: Timestamp.now(),
      //updatedAt: Timestamp.now(),
      customer: {
        ...order.customer,
        name: order.customer.firstName + " " + order.customer.lastName,
      },
      orderStatus: "pending",
      items: order.items.map((item) => {
        return {
          ...item,
          totalPrice: getTotalPriceFromItem(item),
        };
      }),
      storeId: storeId,
      note: {
        creator: session.user?.name || "anonymous",
        creatorId: session.user?.email,
        content: order.note?.content || "",
      },
      shippingInfo: {
        ...order.shippingInfo,
        cost: shippingCost(),
      },
    };

    axios
      .post("/api/orders?storeId=" + storeId, orderForUpdate)
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        setError("An error occurred while creating the order");
        console.log("An error occurred while creating the order");
        toast({
          title: "An error occurred while creating the order",
          description: "Please try again later",
          variant: "destructive",
        });
      });

    toast({
      title: "Order created",
      description: "Your order has been created successfully.",
      duration: 3000,
    });
    router.push("/dashboard/orders");
  };
  return (
    order && (
      <div className="space-y-6  mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex gap-4">
          <div className="space-y-4 flex-1 max-w-3xl">
            <h2 className="text-lg font-bold">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={order.customer.firstName}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      customer: {
                        ...order.customer,
                        firstName: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={order.customer.lastName}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      customer: { ...order.customer, lastName: e.target.value },
                    });
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={order.customer.phoneNumber}
                onChange={(e) => {
                  setOrder({
                    ...order,
                    customer: {
                      ...order.customer,
                      phoneNumber: e.target.value,
                    },
                  } as Order);
                }}
              />
            </div>
          </div>
          <div className="h-[200px] mx-3 w-[1px] bg-slate-200"></div>
          <div className="space-y-4 max-w-3xl flex-1">
            <h2 className="text-lg font-bold">Shipping Address</h2>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={order.customer.shippingAddress.address}
                onChange={(e) => {
                  setOrder({
                    ...order,
                    customer: {
                      ...order.customer,
                      shippingAddress: {
                        ...order.customer.shippingAddress,
                        address: e.target.value,
                      },
                    },
                  });
                }}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={order.customer.shippingAddress.city}
                onChange={(e) => {
                  setOrder({
                    ...order,
                    customer: {
                      ...order.customer,
                      shippingAddress: {
                        ...order.customer.shippingAddress,
                        city: e.target.value,
                      },
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
        <ItemsTable />
        <div className="max-w-[800px]">
          <Label htmlFor="note">Order Note (Optional)</Label>
          <Textarea
            id="note"
            name="note"
            value={order.note?.content}
            onChange={(e) => {
              if (!e.target.value) return;
              if (!order.note) return;
              setOrder({
                ...order,
                note: { ...order.note, content: e.target.value },
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

        <Button onClick={handleSubmit} className="min-w-xl">
          Place Order
        </Button>
      </div>
    )
  );
}
