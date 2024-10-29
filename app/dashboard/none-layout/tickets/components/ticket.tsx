import Image from "next/image";
import { Phone, HeartIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Order } from "@/types/order";
import { useStore } from "@/store/storeInfos";
import QRCode from "react-qr-code";
import { Separator } from "@/components/ui/separator";

export default function OrderTicket({ order }: { order: Order }) {
  const { store } = useStore();
  return (
    <div className="border border-[#3333] border-dashed  p-2">
      <Card className="w-full aspect-[9/10] flex flex-col h-fit mx-auto  print:rounded-none print:shadow-none">
        <CardHeader className="border-b pb-4 print:pb-2">
          <div className="flex items-center gap-4">
            <div className="flex relative  items-center justify-center w-[50px] h-[50px] bg-slate-100 rounded overflow-hidden">
              <Image
                src={store?.logoUrl ?? ""}
                alt="Store Logo"
                layout="fill" // Makes image fill the parent container
                objectFit="contain" // Ensures entire image is visible
                className="dark:invert"
              />
            </div>
            <div className="-space-y-1">
              <h1 className="font-bold text-xl">{store?.name}</h1>
              <p className="text-sm text-muted-foreground ">
                {store?.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className=" flex-1 flex flex-col gap-4 pt-4 print:pt-2 print:gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Customer Details</h3>
              <p>{order.customer.name}</p>
              <p>{order.customer?.phoneNumber}</p>
              <p className="max-w-[200px]">
                {order.customer.shippingAddress.city}
                <br />
                <span className="text-sm text-slate-700">
                  {order.customer.shippingAddress.address}
                </span>
              </p>
            </div>
            <div className="border border-[#3333] p-1">
              <QRCode value={"Order:" + order.id} size={70} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Order Description</h3>
            <p className="text-sm mt-2 text-muted-foreground">
              {order.items
                .map((item) => item.title + " x " + item.quantity)
                .slice(0, 8)
                .map((item) => (
                  <div key={item}>{item}</div>
                ))}
              {
                // If more than 10 items, show a message
                order.items.length > 8 && (
                  <div className="text-sm text-muted-foreground">
                    and {order.items.length - 8} more...
                  </div>
                )
              }
            </p>
          </div>
          <Separator />
          {
            //<div className="grid grid-cols-2 gap-4 print:gap-2">
            //  <div>
            //    <h4 className="font-medium">Order Date</h4>
            //    <p className="text-sm">
            //      {order.createdAt.toDate().toLocaleDateString()}
            //    </p>
            //  </div>
            //  <div>
            //    <h4 className="font-medium">Expected Delivery</h4>
            //    <p className="text-sm text-slate-800">
            //      {
            //        // 3 days from createdAt
            //        new Date(
            //          order.createdAt.toDate().getTime() + 3 * 24 * 60 * 60 * 1000,
            //        ).toLocaleDateString()
            //      }
            //    </p>
            //  </div>
            //</div>
          }
          <div className="">
            <h4 className="font-medium">Order Total</h4>
            <p className="text-2xl font-bold capitalize">
              {order.totalPrice} {store?.settings.currency.symbol}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 border-t pt-4 print:pt-2">
          <p className="text-sm font-medium flex items-center gap-1">
            Thank you{" "}
            <span className="font-bold">
              {" " + order.customer.firstName + " "}
            </span>{" "}
            for your order! <HeartIcon className="h-4 w-4 inline ml-2" />
          </p>
          <div className="flex items-center text-sm text-muted-foreground ">
            <Phone className="mr-2 h-4 w-4" />
            Need help? Call us at:{" "}
            <span className="font-medium ml-1">number</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
