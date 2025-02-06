"use client";

import React, { useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useStore } from "@/store/storeInfos";
import { Check } from "lucide-react";
import { useDialogs } from "@/store/dialogs";
import { Order } from "@/types/order";

export default function OrderToImage({
  currentOrder,
}: {
  currentOrder: Order
}) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const { OrderToImageOpen: open, setOrderToImageOpen: setOpen } = useDialogs();
  const { store } = useStore();

  const handleDownloadImage = async () => {
    if (!componentRef.current) {
      return;
    }

    // Dynamically import html2canvas
    const html2canvas = (await import("html2canvas")).default;

    html2canvas(componentRef.current, {
      backgroundColor: "black",
      scale: 2, // Increase scale for better quality
      useCORS: true, // Enable CORS for external images
    })
      .then((canvas) => {
        if (!currentOrder) {
          console.error("Current order is not set");
          return;
        }

        // Convert canvas to image and trigger download
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${currentOrder.sequence}.png`;
        link.click();
      })
      .catch((err) => {
        console.error("Error capturing image:", err);
      });
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        handleDownloadImage();
        setOpen(false);
      }, 1000);
    }
  }, [open]);

  if (!currentOrder) {
    return null; // or return a loading spinner or some placeholder
  }


  return (
    <div className="relative opacity-0">
      <AlertDialog  open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-none opacity-0 w-fit min-w-none bg-transparent border-none">
          <AlertDialogHeader></AlertDialogHeader>
          <Card
            className=" w-[600px] bg-white overflow-hidden rounded-3xl max-w-3xl"
            ref={componentRef}
          >
            <CardHeader className="flex bg-white gap-4 flex-row">
              {store && (
                <Image
                  src={`/api/proxy-image?url=${encodeURIComponent(
                    store.logoUrl || "/fallback-image.jpg"
                  )}`}
                  width={70}
                  height={70}
                  alt={store.name}
                  className="rounded-lg border w-[60px] p-2 h-[60px] bg-white"
                />
              )}
              <div>
                <CardTitle className="text-xl capitalize">
                  {store?.name} Confirmation.
                </CardTitle>
                <CardDescription className="max-w-[80%]">
                  Thanks{" "}
                  <span className="font-bold">
                    {currentOrder.customer.firstName}
                  </span>{" "}
                  for your order, we want to confirm it with you please.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="bg-slate-50 pt-4 border-t">
              <h2 className="text-lg font-semibold mb-4">Your Order</h2>
              <div className="h-fit">
                {currentOrder.items.map((item) => (
                  <div
                    key={`item-${item.id}`}
                    className="flex items-center space-x-4 mb-4 pb-4 last:mb-0 border-b last:border-b-0"
                  >
                    <Image
                      src={`/api/proxy-image?url=${encodeURIComponent(
                        item.imageUrl || "/fallback-image.jpg"
                      )}`}
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
                {currentOrder.shippingInfo.cost === 0 && (
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
            <Button onClick={handleDownloadImage}>Download Order</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}