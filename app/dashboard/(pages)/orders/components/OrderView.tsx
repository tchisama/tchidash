"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Bike,
  Box,
  Copy,
  Edit,
  FileText,
  MoreVertical,
  Phone,
  ScrollIcon,
  Trash2,
  TruckIcon,
  X,
} from "lucide-react";
import { useOrderStore } from "@/store/orders";
import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { dbDeleteDoc } from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";
import OrderToImage from "./OrderToImage";
import DigylogDialog from "./DigylogDialog";
import { useDialogs } from "@/store/dialogs";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import DetailsOrderView from "./DetailsOrderView";
import OrderNotes from "./OrderNotes";
import { useRouter } from "next/navigation";
import WhatsappCard from "./Whatsapp";
import { useSession } from "next-auth/react";
import useRenderWhatsappMessage from "@/lib/utils/functions/renderWhatsappMessage";
import useNotification from "@/hooks/useNotification";
function OrderView() {
  const { currentOrder, setCurrentOrder } = useOrderStore();
  const { storeId, store } = useStore();
  const { setDigylogOpen, setOrderToImageOpen } = useDialogs();
  const router = useRouter();
  const {data:session} = useSession();
  const renderMessage = useRenderWhatsappMessage();
  const {sendNotification} = useNotification();

  const deleteOrder = async (orderId: string) => {
    if (!currentOrder) return;
    if (
      ["cancelled", "returned", "pending"].includes(currentOrder.orderStatus)
    ) {
      if (!storeId) return;

      dbDeleteDoc(doc(db, "orders", orderId), storeId, "");
      dbDeleteDoc(doc(db, "sales", orderId), storeId, "");
      setCurrentOrder("");
      sendNotification(
        `deleted 🗑️`,
        `order #${currentOrder.sequence}`
      )
      return;
    } else {
      alert("You can't delete an order that is not cancelled or returned");
    }
  };

  return currentOrder
    ? store && (
        <motion.div className="h-full">
          <DigylogDialog />
          <OrderToImage />
          <Tabs defaultValue="details" className=" sticky top-32 h-[83vh] ">
            <Card
              className=" flex h-full flex-col"
              x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex border-b flex-row items-start bg-muted/50">
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
                  <CardDescription className="text-xs ">
                    {currentOrder?.createdAt
                      .toDate()
                      .toLocaleDateString()
                      .replaceAll("/", ",")}{" "}
                    at {currentOrder?.createdAt.toDate().toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">

                  <Button className="h-8 w-8" variant={"outline"} size="icon" onClick={() => router.push(`/dashboard/orders/${currentOrder?.sequence}`)}>
                      <ArrowUpRight className="h-4 w-4" />
                  </Button>
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
                          const whatsappConfirmMessage =
                            store?.whatsappConfirmationMessage;
                          if (!whatsappConfirmMessage) return;
                          if(!storeId) return;
                          if(!session) return;
                          sendNotification(
                            `Sent whatsapp confirmation 💬`,
                            `of order:#${currentOrder?.sequence}`
                          )
                          const message = renderMessage(
                            whatsappConfirmMessage,
                          )
                          window.open(
                            `https://wa.me/212${currentOrder?.customer?.phoneNumber}?text=${encodeURIComponent(
                              message,
                            )}`,
                          );
                        }}
                      >
                        <IconBrandWhatsapp className="h-3.5 w-3.5 mr-2" />
                        Confirm Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`/dashboard/orders/edit/${currentOrder?.sequence}`);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5 mr-2" />
                        Edit Order
                      </DropdownMenuItem>
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
              <TabsList className="bg-white border-b rounded-none gap-1  py-4 h-12">
                <TabsTrigger value="details" className="border">
                  <Box className="h-3.5 mr-2 w-3.5" /> Details
                </TabsTrigger>
                <TabsTrigger value="notes" className="border">
                  <FileText className="h-3.5 mr-2 w-3.5" />
                  Notes
                </TabsTrigger>
              </TabsList>
              <CardContent className="flex-1 overflow-auto bg-white">
                <TabsContent value="details" className="h-full">
                  <div className="py-2">
                    <DetailsOrderView />
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="h-[calc(100%-10px)]">
                  <OrderNotes />
                </TabsContent>
                <TabsContent value="whatsapp" className="h-[calc(100%-10px)]">
                  <WhatsappCard />
                </TabsContent>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated{" "}
                  {currentOrder &&
                    currentOrder?.updatedAt &&
                    currentOrder?.updatedAt
                      ?.toDate()
                      ?.toLocaleDateString()}{" "}
                  at{" "}
                </div>
              </CardFooter>
            </Card>
          </Tabs>
        </motion.div>
      )
    : null;
}

export default OrderView;
