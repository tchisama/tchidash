"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/Popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  Bike,
  Copy,
  MoreVertical,
  Phone,
  QrCodeIcon,
  ScrollIcon,
  StarsIcon,
  Trash2,
  TruckIcon,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/orders";
import { StateChanger } from "./StateChanger";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import CustomerShield from "./CustomerShield";
import { db } from "@/firebase";
import { collection, doc, Timestamp } from "firebase/firestore";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { dbAddDoc, dbDeleteDoc } from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";
import Avvvatars from "avvvatars-react";
import OrderToImage from "./OrderToImage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import DigylogDialog from "./DigylogDialog";
import { useDialogs } from "@/store/dialogs";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { ChatWithCustomer } from "./ChatWithCustomer";
function OrderView() {
  const { currentOrder, setCurrentOrder } = useOrderStore();
  const { storeId, store } = useStore();
  const { setDigylogOpen, setOrderToImageOpen } = useDialogs();

  const { data: digylogData } = useQuery({
    queryKey: [
      "digylog",
      storeId,
      currentOrder?.id,
      currentOrder?.shippingInfo?.trackingNumber,
    ],
    queryFn: async () => {
      if (!store) return null;
      if (!currentOrder) return null;

      if (!store.integrations) return null;
      if (!store.integrations.find((i) => i.name === "digylog")?.enabled)
        return null;
      if (!storeId) return null;
      if (!currentOrder?.shippingInfo?.trackingNumber) return null;

      const response = await axios.get(
        //http://localhost:3000/api/integrations/digylog?phone=0644424634)
        `/api/integrations/digylog`,
        {
          params: {
            traking: currentOrder?.shippingInfo?.trackingNumber,
            storeId,
          },
        },
      );
      console.log(response.data);
      if (response.data.data.length == 0) return null;
      return response.data.data[0];
    },
    staleTime: 1000 * 60 * 1,
  });

  const deleteOrder = async (orderId: string) => {
    if (!currentOrder) return;
    if (
      ["cancelled", "returned", "pending"].includes(currentOrder.orderStatus)
    ) {
      if (!storeId) return;
      dbDeleteDoc(doc(db, "orders", orderId), storeId, "");
      dbDeleteDoc(doc(db, "sales", orderId), storeId, "");
      setCurrentOrder("");
      return;
    } else {
      alert("You can't delete an order that is not cancelled or returned");
    }
  };

  //   const sendWhatsappMessage = () => {
  //     if (!currentOrder) return;
  //     const message = `
  // Dear *${
  //       currentOrder.customer.firstName
  //     }* , Thanks for your order , we would like to confirm that order with you.
  //
  // *Order Details:*
  // ${currentOrder.items
  //   .map((item) => `• ${item.title} x ${item.quantity} = ${item.totalPrice} Dh`)
  //   .join("\n")}
  //
  // Order Total: *${currentOrder.totalPrice + " Dh"}*
  // Shipping: *${currentOrder.shippingInfo.cost ? currentOrder.shippingInfo.cost + " Dh" : "Free Delivery"}*
  //
  // *Thank you for choosing us! We'll notify you once your order ships.*
  // `;
  //     const encodedMessage = encodeURIComponent(message); // Replace newlines with spaces
  //     const phoneNumber = "212770440046"; // Ensure the format is correct
  //     const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  //     window.open(whatsappURL, "_blank");
  //   };

  return currentOrder
    ? store && (
        <motion.div className="h-full">
          <DigylogDialog />
          <OrderToImage />
          <Card className=" sticky top-20" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Order Details
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      navigator.clipboard.writeText(currentOrder?.id)
                    }
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription className="text-xs">
                  {currentOrder?.createdAt
                    .toDate()
                    .toLocaleDateString()
                    .replaceAll("/", ",")}{" "}
                  at {currentOrder?.createdAt.toDate().toLocaleTimeString()}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {/*                 <Button */}
                {/*                   onClick={async () => { */}
                {/*                     if (!storeId) return; */}
                {/**/}
                {/*                     const whatsappEnable = await getDoc( */}
                {/*                       doc(db, "stores", storeId), */}
                {/*                     ).then((doc) => { */}
                {/*                       return doc */}
                {/*                         .data() */}
                {/*                         ?.integrations?.find( */}
                {/*                           (integration: { name: string }) => */}
                {/*                             integration.name === "whatsapp-notifications", */}
                {/*                         )?.enabled; */}
                {/*                     }); */}
                {/*                     if (whatsappEnable) { */}
                {/*                       dbAddDoc( */}
                {/*                         collection(db, "whatsapp-messages"), */}
                {/*                         { */}
                {/*                           message: `*New Order ✨🎉* */}
                {/* *${currentOrder.customer.name */}
                {/*                             .split(" ") */}
                {/*                             .filter((n) => n != " ") */}
                {/*                             .join( */}
                {/*                               "_", */}
                {/*                             )}* from *${currentOrder.customer.shippingAddress.city */}
                {/*                             .split(" ") */}
                {/*                             .filter((n) => n != " ") */}
                {/*                             .join("_")}* . */}
                {/* with a total of *${currentOrder.totalPrice} Dh*`, */}
                {/*                           status: "pending", */}
                {/*                           type: "newOrder", */}
                {/*                           createdAt: Timestamp.now(), */}
                {/*                           storeId: storeId, */}
                {/*                         }, */}
                {/*                         storeId, */}
                {/*                         "", */}
                {/*                       ); */}
                {/*                     } */}
                {/*                   }} */}
                {/*                 > */}
                {/*                   Test Message */}
                {/*                 </Button> */}
                <ChatWithCustomer />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => {
                        if (!storeId) return;
                        dbAddDoc(
                          collection(db, "whatsapp-sender-messages"),
                          {
                            message: `Hello ${currentOrder.customer.name}, we want to confirm your order with you`,
                            storeId,
                            status: "pending",
                            type: "orderConfirmation",
                            createdAt: Timestamp.now(),
                            orderId: currentOrder.id,
                            to: currentOrder.customer.phoneNumber,
                          },
                          storeId,
                          "",
                        );
                      }}
                    >
                      <IconBrandWhatsapp className="h-3.5 w-3.5 mr-2" />
                      Confirm Order
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={sendWhatsappMessage}> */}
                    {/*   <Phone className="h-3.5 w-3.5 mr-2" /> Contact Whatsapp */}
                    {/* </DropdownMenuItem> */}
                    <DropdownMenuItem
                      onClick={() => {
                        window.open(
                          `tel:+212${currentOrder?.customer?.phoneNumber}`,
                        );
                      }}
                    >
                      <Phone className="h-3.5 w-3.5 mr-2" />
                      Call Customer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setOrderToImageOpen(true);
                      }}
                    >
                      <ScrollIcon className="h-3.5 w-3.5 mr-2" />
                      Get Order Receipt
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <TruckIcon className="h-3.5 w-3.5 mr-2" />
                        Shipping Options
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <Bike className="h-3.5 w-3.5 mr-2" />
                            Manual
                          </DropdownMenuItem>
                          {store?.integrations?.find(
                            (i) => i.name === "digylog",
                          )?.enabled && (
                            <DropdownMenuItem
                              onClick={() => setDigylogOpen(true)}
                            >
                              <div className="flex items-center">
                                <TruckIcon className="h-3.5 w-3.5 mr-2" />
                                Digylog
                              </div>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 bg-red-50"
                      onClick={() => {
                        deleteOrder(currentOrder.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => {
                    // close the order view
                    setCurrentOrder("");
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 text-sm">
              <div className="grid gap-2">
                <ul className="grid gap-2">
                  <li className="flex items-center justify-between">
                    <PopoverRoot>
                      <PopoverTrigger className="border-none w-fit p-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex gap-2 "
                        >
                          <QrCodeIcon className="h-5 w-5 " />
                          QR Code
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] h-[250px] p-4">
                        <QRCode
                          className="w-full h-full"
                          value={"Order:" + currentOrder.id}
                          fgColor="#444"
                        />
                      </PopoverContent>
                    </PopoverRoot>

                    <StateChanger
                      state={currentOrder.orderStatus}
                      order={currentOrder}
                    />
                  </li>
                </ul>

                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <div className="font-semibold">Customer Information</div>
                    <CustomerShield
                      number={currentOrder.customer.phoneNumber ?? ""}
                      orderId={currentOrder.id}
                    />
                  </div>
                  <dl className=" gap-4 flex  ">
                    <Avvvatars
                      style={"shape"}
                      value={currentOrder.customer.phoneNumber ?? ""}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Customer</dt>
                        <dd>{currentOrder.customer.name}</dd>
                      </div>
                      {currentOrder.customer.email && (
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd>
                            <a href="mailto:">
                              {currentOrder.customer?.email ?? "no email"}
                            </a>
                          </dd>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd>
                          <a href="tel:" className="font-semibold">
                            {currentOrder.customer.phoneNumber}
                          </a>
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
                <Separator className="my-2" />
                <h1 className="font-semibold">Shipping Provider</h1>
                {store &&
                  store.integrations &&
                  store?.integrations?.find((i) => i.name === "digylog")
                    ?.enabled == true && (
                    <>
                      <div className="">
                        <div>
                          {
                            currentOrder?.shippingInfo?.shippingProvider &&
                            <>
                          <div className="flex gap-2 justify-between">
                            <span className="text-muted-foreground">
                              Provider
                            </span>
                            <span className="">
                              {currentOrder?.shippingInfo?.shippingProvider 
                              ?? "not assigned"
                              }
                            </span>
                          </div>
                          <div className="flex gap-2 justify-between">
                            <span className="text-muted-foreground">
                              Tracking
                            </span>
                            <span className="">
                              {currentOrder?.shippingInfo?.trackingNumber
                                ?? "not assigned"}
                            </span>
                          </div>
                          <div className="flex gap-2 justify-between">
                            <span className="text-muted-foreground">
                              Shipping Cost
                            </span>
                            <span className="">
                              {digylogData
                                ? digylogData.delivery_cost + " Dh"
                                : "no data yet"}
                            </span>
                          </div>
                            </>
                          }
                          <div className="flex mt-2 gap-2 justify-between">
                            <span className="text-muted-foreground">
                              Current Status
                            </span>
                            <span className="font-semibold">
                              {digylogData !== null && digylogData ? (
                                <div>
                                  <Badge
                                    style={{
                                      backgroundColor:
                                        digylogData.stColor + "44",
                                      borderColor: digylogData.stColor,
                                    }}
                                    className="text-slate-900 font-normal shadow-none"
                                  >
                                    {digylogData?.statusEn}
                                  </Badge>
                                </div>
                              ) : (
                                <Badge
                                  style={{
                                    backgroundColor: "#8883",
                                    borderColor: "#aaa",
                                  }}
                                  className="text-slate-900 capitalize font-normal shadow-none"
                                >
                                  not shipped yet
                                </Badge>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                <Separator className="my-4" />
                <div className="grid  gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Shipping Information</div>

                    <div className="flex w-full">
                      <address className="flex-1 grid gap-0.5 not-italic text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>
                            {currentOrder.customer.shippingAddress.city}
                          </span>
                          <ArrowRightIcon className="h-4 w-4" />
                          <span className="text-primary/80 font-bold flex gap-1">
                            {currentOrder.cityAi && currentOrder.cityAi.city}
                            <StarsIcon className="h-4 w-4" />
                          </span>
                          <span className="">| </span>
                          <span>
                            {currentOrder.cityAi && currentOrder.cityAi.region}
                          </span>
                        </div>
                        <span>
                          {currentOrder.customer.shippingAddress.address}
                        </span>
                      </address>
                      {
                        //currentOrder.cityAi && currentOrder.cityAi.city && (
                        //  <address className="flex-1  grid gap-0.5 not-italic text-primary/80 font-bold">
                        //    <span>{currentOrder.cityAi.city}</span>
                        //    <span className="font-medium opacity-70">
                        //      {currentOrder.cityAi.region}
                        //    </span>
                        //  </address>
                        //)
                      }
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  {/* <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Glimmer Lamps x <span>2</span>
                  </span>
                  <span>$250.00</span>
                </li> */}
                  {currentOrder?.items?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="flex border-t pt-1 border-slate-100 items-center justify-between"
                      >
                        <span className="text-muted-foreground flex gap-2">
                          <HoverCard>
                            <HoverCardTrigger className="flex gap-2 items-center cursor-pointer">
                              <Image
                                className="w-8 bg-slate-50 h-8 object-cover border rounded-sm "
                                src={item.imageUrl ?? ""}
                                alt=""
                                width={32}
                                height={32}
                              />
                              {item.title} x{" "}
                              <span className="font-semibold">
                                {item.quantity}
                              </span>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="flex gap-4">
                                <Image
                                  className="w-24 h-24 object-cover border rounded-md "
                                  src={item.imageUrl ?? ""}
                                  alt=""
                                  width={100}
                                  height={100}
                                />
                                <div>
                                  <div className="font-semibold">
                                    {item.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {item.price} dh x {item.quantity} ={" "}
                                    {item.totalPrice} dh
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                          {item.discount && (
                            <>
                              <br />
                              <span className="text-xs text-green-600">
                                Discount: {item.discount.amount}{" "}
                                {item.discount.type === "percentage"
                                  ? "%"
                                  : "Dh"}
                              </span>
                            </>
                          )}
                        </span>
                        {item.discount ? (
                          <div className="flex gap-2">
                            <span className="line-through  text-muted-foreground">
                              {item.price * item.quantity} Dh
                            </span>
                            <span>
                              {item.price * item.quantity -
                                (item.discount.type === "percentage"
                                  ? ((item.price * item.discount.amount) /
                                      100) *
                                    item.quantity
                                  : item.discount.amount * item.quantity)}{" "}
                              Dh
                            </span>
                          </div>
                        ) : (
                          <span>{item.totalPrice} Dh</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{currentOrder.subtotal} Dh</span>
                  </li>
                  {currentOrder?.discountAmount ? (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Discount Amount
                      </span>
                      <span>- {currentOrder?.discountAmount} Dh</span>
                    </li>
                  ) : null}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>+ {currentOrder.shippingInfo.cost || 0} Dh</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>{currentOrder.totalPrice} Dh</span>
                  </li>
                </ul>
              </div>
              {currentOrder.note && currentOrder.note?.content && (
                <div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Note</div>
                    <p className="text-muted-foreground">
                      {currentOrder.note?.content ?? "No note"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated{" "}
                {currentOrder &&
                  currentOrder.updatedAt &&
                  currentOrder.updatedAt.toDate().toLocaleDateString()}{" "}
                at{" "}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )
    : null;
}

export default OrderView;
