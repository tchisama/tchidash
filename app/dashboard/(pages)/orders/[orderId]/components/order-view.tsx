"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderItem } from "@/types/order";
import Image from "next/image";
import { StateChanger } from "../../components/StateChanger";
import CancelledCalls from "../../components/CancelledCalls";
import ScheduledOrdersDate from "../../components/ScheduledOrdersDate";
import { useOrderStore } from "@/store/orders";
import NoteViewer from "../../components/NoteViewer";
import OrderActions from "../../components/OrderActions";
import { CustomerCardByNumber } from "../../../customers/page";

const OrderSummary = (order: Order) => {
  // const paymentMethod = order.paymentMethod
  // const shippingMethod = order.shippingInfo.method
  const total = order.totalPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Overview of the order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
<<<<<<< Updated upstream
            <span className="text-muted-foreground">Subtotal:</span>
=======
            <span>Subtotal:</span>
>>>>>>> Stashed changes
            <span>
              {(total - (order.shippingInfo.cost ?? 0)).toFixed(2)} Dh
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping:</span>
            <span>{order.shippingInfo.cost ?? 0} Dh</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span className="text-xl">{total.toFixed(2)} Dh</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderItemsTable = ({ items }: { items: OrderItem[] }) => (
  <Card className="flex-1">
    <CardHeader>
      <CardTitle>Order Items</CardTitle>
      <CardDescription>Detailed list of items in this order</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Image
                  src={item.imageUrl ?? ""}
                  alt={item.title}
                  width={75}
                  height={75}
                  className="object-cover size-10 md:size-12 bg-slate-50 border aspect-square rounded-md"
                />
              </TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.totalPrice.toFixed(2)} Dh</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const OrderNotes = ({ order }: { order: Order }) => (
  <Card className="md:max-w-[400px]">
    <CardHeader>
      <CardTitle>Order Notes</CardTitle>
      <CardDescription>Additional information about this order</CardDescription>
    </CardHeader>
    <CardContent>
      <NoteViewer order={order} />
    </CardContent>
  </Card>
);

export function OrderView({ order }: { order: Order }) {
  const { currentOrder } = useOrderStore();

  return (
    currentOrder && (
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-2 space-y-4">
          <div className="mb-2 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.sequence ?? "-"}
              </h1>
              <p className="text-gray-500">
                Placed on {order.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              {currentOrder.orderStatus == "cancelled" && (
                <CancelledCalls currentOrder={currentOrder} />
              )}
              {currentOrder.orderStatus == "scheduled" && (
                <ScheduledOrdersDate currentOrder={currentOrder} />
              )}
              <StateChanger
                order={order}
                state={order.orderStatus}
                showNumberOfCalls
              />
              <OrderActions currentOrder={currentOrder} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <CustomerCardByNumber number={order.customer.phoneNumber ?? ""} />
            </div>
            <OrderSummary {...order} />
          </div>

          <div className="flex gap-3 flex-col md:flex-row">
            <OrderItemsTable items={order.items} />
            <OrderNotes order={order} />
          </div>
        </div>
      </div>
    )
  );
}
