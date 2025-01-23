"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import axios from "axios";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Order } from "@/types/order";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { useOrderStore } from "@/store/orders";
import ItemsTable from "./components/ItemsTable";
import { getTotalPriceFromItem } from "@/lib/orders";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/storeInfos";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import { StateChanger } from "../../components/StateChanger";




export default function CreateOrder() {
  const { newOrder: order, setNewOrder: setOrder } = useOrderStore();
  const { id } = useParams<{ id: string }>();
  const { storeId, store } = useStore();
  const { data: session } = useSession();



  const { } = useQuery({
    queryKey: ["order", storeId, id],
    queryFn: async () => {
      if (!storeId) return;
      if (!id) return;
      const o = await getDocs(
        query(collection(db, "orders"), where("storeId", "==", storeId),
          where("sequence", "==", parseInt(id))
        ),
      ).then(async (response) => {
        const data = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Order);
        setOrder(data[0]);
        return data[0];
      })
      return o;
    },
  });



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
    // get all the inventory items and delete them before creating new ones
    if (!order) return;
    if (order.orderStatus !== "pending") return;
    const inventoryItems = await getDocs(query(collection(db, "inventoryItems"), where("orderId", "==", order.id)));
    inventoryItems.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });


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
      customer: {
        ...order.customer,
        name: order.customer.firstName + " " + order.customer.lastName,
      },
      items: order.items.map((item) => {
        return {
          ...item,
          totalPrice: getTotalPriceFromItem(item),
        };
      }),
      storeId: storeId,
      shippingInfo: {
        ...order.shippingInfo,
        cost: shippingCost(),
      },
    };

    // lets delete all the inventory items before creating new ones
    await getDocs(query(collection(db, "inventoryItems"), where("orderId", "==", order.id))).then((snapshot) => {
      snapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    });

    axios
      .post("/api/orders?storeId=" + storeId + "&update=true", {
        ...orderForUpdate,
      }
      )
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
        <div className="flex gap-2 justify-between">
          <h1 className="text-3xl font-bold">Order #{order.sequence}</h1>
          <StateChanger showNumberOfCalls state={order.orderStatus} order={order} />
        </div>
        {
          order.orderStatus !== "pending" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You cant modify the order if its not pending
              </AlertDescription>
            </Alert>
          )
        }
        <div className="flex max-w-7xl gap-4">
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

        <Button
          disabled={order.orderStatus !== "pending"}
          onClick={handleSubmit} className="min-w-xl">
          Place Order
        </Button>
      </div>
    )
  );
}
