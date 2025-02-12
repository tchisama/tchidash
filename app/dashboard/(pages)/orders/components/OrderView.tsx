"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Box, Copy, FileText, X } from "lucide-react";
import { useOrderStore } from "@/store/orders";
import { motion } from "framer-motion";
import { useStore } from "@/store/storeInfos";
import DetailsOrderView from "./DetailsOrderView";
import OrderNotes from "./OrderNotes";
import { useRouter } from "next/navigation";
import WhatsappCard from "./Whatsapp";
import OrderActions from "./OrderActions";
function OrderView() {
  const { currentOrder, setCurrentOrder } = useOrderStore();
  const { store } = useStore();
  const router = useRouter();
  return currentOrder
    ? store && (
        <div className="">
          <div
            onClick={() => setCurrentOrder("")}
            className="w-screen h-screen bg-[#0003] fixed top-0 left-0 z-50"
          ></div>
          <motion.div className="h-fit z-50 rounded-xl fixed shadow-2xl w-full md:w-[700px]  top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <Tabs defaultValue="details" className=" sticky top-32 h-[83vh] ">
              <Card
                className=" flex h-full rounded-xl flex-col"
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
                    <Button
                      className="h-8 w-8"
                      variant={"outline"}
                      size="icon"
                      onClick={() =>
                        router.push(
                          `/dashboard/orders/${currentOrder?.sequence}`,
                        )
                      }
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>

                    <OrderActions
                      variant="outline"
                      currentOrder={currentOrder}
                    />

                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 hover:bg-slate-300 bg-slate-200"
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
        </div>
      )
    : null;
}

export default OrderView;
