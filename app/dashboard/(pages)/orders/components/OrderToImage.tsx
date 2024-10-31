"use client";

import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOrderStore } from "@/store/orders";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { useStore } from "@/store/storeInfos";
import { Check } from "lucide-react";

export default function OrderToImage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentOrder } = useOrderStore();
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleDownloadImage = () => {
    if (!componentRef.current) return;
    toPng(componentRef.current, {
      backgroundColor: "black",
      quality: 2,
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        if (!currentOrder) return;
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = currentOrder.id + ".png";
        link.click();
      })
      .catch((err) => {
        console.log("Error capturing image:", err);
      })
      .finally(() => {
        window.location.reload();
      });
  };
  const { store } = useStore();

  return (
    currentOrder && (
      <div>
        <div onClick={() => setOpen(true)} className="flex  items-center">
          {children}
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <div />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-none w-fit min-w-none bg-transparent border-none">
            <AlertDialogHeader></AlertDialogHeader>
            <Card
              className="w-full bg-white overflow-hidden rounded-3xl max-w-3xl"
              ref={componentRef}
            >
              <CardHeader className="flex bg-white gap-4 flex-row">
                {store && (
                  <Image
                    src={store.logoUrl || "/fallback-image.jpg"}
                    width={70}
                    height={70}
                    alt={store.name}
                    className="rounded-lg border w-[60px] p-2 h-[60px] bg-white"
                  />
                )}
                <div>
                  <CardTitle className="text-xl capitalize">
                    {" "}
                    {store?.name} Confirmation.
                  </CardTitle>
                  <CardDescription className="max-w-[80%]">
                    Thanks{" "}
                    <span className="font-bold">
                      {currentOrder.customer.firstName}
                    </span>{" "}
                    for your order , we want to confirm it with you Please .
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="  bg-slate-50 pt-4 border-t">
                <h2 className="text-lg font-semibold mb-4">Your Order</h2>
                <div className="h-fit ">
                  {currentOrder.items.map((item) => (
                    <div
                      key={`item-${item.id}`} // Ensure unique key for each item
                      className="flex items-center space-x-4 mb-4 pb-4 last:mb-0 border-b last:border-b-0"
                    >
                      <Image
                        src={item.imageUrl || "/fallback-image.jpg"}
                        width={70}
                        height={70}
                        alt={item.title}
                        className="rounded-lg border w-[70px] h-[70px] bg-white"
                      />
                      <div className="flex-grow">
                        <h3 className="text-md font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity:{" "}
                          <span className="font-bold">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-semibold">
                          {item.totalPrice} Dh
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            {item.price} each
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex border-t bg-white pt-6 justify-between items-center">
                <h3 className="text-xl font-bold"></h3>
                <div className="flex items-end flex-col">
                  {currentOrder.shippingInfo.cost == 0 && (
                    <p className="text-md flex items-center text-slate-700 font-semibold">
                      <Check
                        className="w-4 h-4 inline-block mr-1"
                        strokeWidth={3}
                      />
                      Free Shipping
                    </p>
                  )}
                  <p className="text-4xl font-bold">
                    {currentOrder.totalPrice} Dh
                  </p>
                </div>
              </CardFooter>
            </Card>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={() => {
                  handleDownloadImage();
                }}
              >
                Download Order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  );
}
