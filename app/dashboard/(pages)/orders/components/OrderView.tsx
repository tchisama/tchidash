"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Copy,
  DownloadIcon,
  MoreVertical,
  Phone,
  Trash2,
  Truck,
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

function OrderView() {
  const { currentOrder, setCurrentOrder } = useOrderStore();

  return (
    currentOrder && (
      <div className="h-full ">
        <Card
          className="overflow-hidden sticky top-20"
          x-chunk="dashboard-05-chunk-4"
        >
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Order {currentOrder?.id.slice(0, 8)}..
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
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Truck className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Track Order
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem> */}
                  {/* <DropdownMenuItem>Print</DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => {
                      window.open(
                        `https://wa.me/212${currentOrder?.customer?.phoneNumber}`,
                      );
                    }}
                  >
                    <Phone className="h-3.5 w-3.5 mr-2" /> Contact Whatsapp
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
                      navigator.clipboard.writeText(currentOrder?.id);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy Order ID
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(
                        currentOrder?.customer?.phoneNumber ?? "",
                      );
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy Customer Phone
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy Order Tracking number
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <DownloadIcon className="h-3.5 w-3.5 mr-2" />
                    Export Order Excel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
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
          <CardContent className="p-6 text-sm">
            <div className="grid gap-2">
              <ul className="grid gap-2">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Order State</span>
                  <StateChanger
                    state={currentOrder.orderStatus}
                    order={currentOrder}
                  />
                </li>
              </ul>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Customer Information</div>
                <dl className="grid gap-3">
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
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Shipping Information</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>{currentOrder.customer.shippingAddress.city}</span>
                    <span>{currentOrder.customer.shippingAddress.address}</span>
                  </address>
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
                      <span className="text-muted-foreground">
                        <HoverCard>
                          <HoverCardTrigger>{item.title}</HoverCardTrigger>
                          <HoverCardContent>
                            <div className="flex gap-4">
                              <Image
                                className="w-16 h-16 object-cover border rounded-md "
                                src={item.imageUrl ?? ""}
                                alt=""
                                width={80}
                                height={80}
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
                        x <span className="font-semibold">{item.quantity}</span>
                        <br />
                        {item.discount && (
                          <span className="text-xs text-green-600">
                            Discount: {item.discount.amount}{" "}
                            {item.discount.type === "percentage" ? "%" : "Dh"}
                          </span>
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
                                ? ((item.price * item.discount.amount) / 100) *
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
                  <span>+ {currentOrder.shippingInfo.cost} Dh</span>
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
      </div>
    )
  );
}

export default OrderView;
