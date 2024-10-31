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

export default function OrderToImage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentOrder } = useOrderStore();
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleDownloadImage = () => {
    setTimeout(() => {
      if (!componentRef.current) return;
      toPng(componentRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "component-image.png";
          link.click();
        })
        .catch((err) => {
          console.log("Error capturing image:", err);
        });
    }, 1000);
  };

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
            <Card className="w-full max-w-3xl" ref={componentRef}>
              <CardHeader>
                <CardTitle className="text-xl"> Confirmation Order </CardTitle>
                <CardDescription>
                  Thanks{" "}
                  <span className="font-bolg">
                    {currentOrder.customer.firstName}
                  </span>{" "}
                  for your order , we want to confirm it with you Please .
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <h2 className="text-lg font-semibold mb-4">Items</h2>
                <div className="h-fit pr-4 w-[500px]">
                  {currentOrder.items.map((item) => (
                    <div
                      key={`item-${item.id}`} // Ensure unique key for each item
                      className="flex items-center space-x-4 mb-4 pb-4 border-b last:border-b-0"
                    >
                      <Image
                        src={item.imageUrl || "/fallback-image.jpg"}
                        width={70}
                        height={70}
                        alt={item.title}
                        className="rounded-lg border w-[70px] h-[70px] bg-slate-100"
                      />
                      <div className="flex-grow">
                        <h3 className="text-md font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-semibold">
                          {item.totalPrice} Dh
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Total</h3>
                <p className="text-2xl font-bold">
                  {currentOrder.totalPrice} Dh
                </p>
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
