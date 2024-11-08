import React from "react";

import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, QrCodeIcon, StarsIcon } from "lucide-react";
import QRCode from "react-qr-code";
import { useOrderStore } from "@/store/orders";
import { StateChanger } from "./StateChanger";
import { Separator } from "@/components/ui/separator";
import CustomerShield from "./CustomerShield";
import Avvvatars from "avvvatars-react";
import { useStore } from "@/store/storeInfos";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";

function DetailsOrderView() {
  const { currentOrder } = useOrderStore();
  const { store, storeId } = useStore();

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

  return (
    store &&
    currentOrder && (
      <>
        <div className="grid gap-2">
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <Popover>
                <PopoverTrigger className="border-none w-fit p-0">
                  <Button size="sm" variant="outline" className="flex gap-2 ">
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
              </Popover>

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
                borderSize={2}
                border
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
            store?.integrations?.find((i) => i.name === "digylog")?.enabled ==
              true && (
              <>
                <div className="">
                  <div>
                    {currentOrder?.shippingInfo?.shippingProvider && (
                      <>
                        <div className="flex gap-2 justify-between">
                          <span className="text-muted-foreground">
                            Provider
                          </span>
                          <span className="">
                            {currentOrder?.shippingInfo?.shippingProvider ??
                              "not assigned"}
                          </span>
                        </div>
                        <div className="flex gap-2 justify-between">
                          <span className="text-muted-foreground">
                            Tracking
                          </span>
                          <span className="">
                            {currentOrder?.shippingInfo?.trackingNumber ??
                              "not assigned"}
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
                    )}
                    <div className="flex mt-2 gap-2 justify-between">
                      <span className="text-muted-foreground">
                        Current Status
                      </span>
                      <span className="font-semibold">
                        {digylogData !== null && digylogData ? (
                          <div>
                            <Badge
                              style={{
                                backgroundColor: digylogData.stColor + "44",
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
                    <span>{currentOrder.customer.shippingAddress.city}</span>
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
                  <span>{currentOrder.customer.shippingAddress.address}</span>
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
                      <HoverCardTrigger className="flex text-sm gap-2 items-center cursor-pointer">
                        <Image
                          className="w-8 bg-slate-50 h-8 object-cover border rounded-sm "
                          src={item.imageUrl ?? ""}
                          alt=""
                          width={32}
                          height={32}
                        />
                        {item.title} x{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2 w-[300px]">
                        <div className="flex gap-4">
                          <Image
                            className="w-24 h-24 object-cover border rounded-md "
                            src={item.imageUrl ?? ""}
                            alt=""
                            width={100}
                            height={100}
                          />
                          <div>
                            <div className="font-semibold">{item.title}</div>
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
                          {item.discount.type === "percentage" ? "%" : "Dh"}
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
                <span className="text-muted-foreground">Discount Amount</span>
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
      </>
    )
  );
}

export default DetailsOrderView;
