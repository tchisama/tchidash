"use client"

import { useState } from "react"
import { Pencil, Printer, Send, ShoppingCart, Trash, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Order, OrderItem } from "@/types/order"
import Image from "next/image"
import { StateChanger } from "../../components/StateChanger"
import CancelledCalls from "../../components/CancelledCalls"
import ScheduledOrdersDate from "../../components/ScheduledOrdersDate"
import { useOrderStore } from "@/store/orders"






// const OrderTimeline = ({ estimatedDelivery }: { estimatedDelivery: string }) => (
//   <Card className="flex-1">
//     <CardHeader>
//       <CardTitle>Order Timeline</CardTitle>
//       <CardDescription>Estimated delivery by {estimatedDelivery}</CardDescription>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-4">
//         <Progress value={75} className="w-full" />
//         <div className="flex justify-between text-sm">
//           <span>Order Placed</span>
//           <span>Processing</span>
//           <span>Shipped</span>
//           <span>Delivered</span>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// )

const OrderActions = () => (
  <Card className="flex-1">
    <CardHeader>
      <CardTitle>Actions</CardTitle>
      <CardDescription>Manage this order</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-4">
      <Button variant="outline">
        <Pencil className="mr-2 h-4 w-4" />
        Edit Order
      </Button>
      <Button variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Print Invoice
      </Button>
      <Button variant="outline">
        <Send className="mr-2 h-4 w-4" />
        Send Confirmation
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <Button variant="outline" className="text-red-500 hover:text-red-700">
        <Trash className="mr-2 h-4 w-4" />
        Cancel Order
      </Button>
    </CardContent>
  </Card>
)

const CustomerInfo = (order: Order) => {
  const customerName = order.customer.name
  const email = order.customer.email
  const phone = order.customer.phoneNumber
  const shippingAddress = order.customer.shippingAddress.address
  const billingAddress = order.customer.shippingAddress.address

  return <Card>
    <CardHeader>
      <CardTitle>Customer Information</CardTitle>
      <CardDescription>Details about the customer</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${customerName}`} />
          <AvatarFallback>
            {customerName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{customerName}</h3>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">{phone}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <h4 className="font-semibold">Shipping Address</h4>
        <p className="text-sm text-gray-500">{shippingAddress}</p>
        <h4 className="font-semibold">Billing Address</h4>
        <p className="text-sm text-gray-500">{billingAddress}</p>
      </div>
    </CardContent>
  </Card>
}

const OrderSummary = (order: Order) => {
  // const paymentMethod = order.paymentMethod
  // const shippingMethod = order.shippingInfo.method
  const items = order.items
  const total = order.totalPrice


  return <Card>
    <CardHeader>
      <CardTitle>Order Summary</CardTitle>
      <CardDescription>Overview of the order</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {/* <div className="flex justify-between">
          <span>Payment Method:</span>
          <span>{paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Method:</span>
          <span>{shippingMethod}</span>
        </div> */}
        <div className="flex justify-between">
          <span>Total Items:</span>
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{(total - (order.shippingInfo.cost??0)).toFixed(2)} Dh</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{
            order.shippingInfo.cost ??0
          } Dh
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total Amount:</span>
          <span className="text-xl">{total.toFixed(2)} Dh</span>
        </div>
      </div>
    </CardContent>
  </Card>
}

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
            <TableHead>Price</TableHead>
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
                  className="object-cover bg-slate-50 border aspect-square rounded-md"
                />
              </TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.price.toFixed(2)} Dh</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.totalPrice.toFixed(2)} Dh</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

const OrderNotes = ({ note }: { note: string }) => (
  <Card className="max-w-[400px]">
    <CardHeader>
      <CardTitle>Order Notes</CardTitle>
      <CardDescription>Additional information about this order</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">{note || "No notes available for this order."}</p>
    </CardContent>
  </Card>
)

const OrderCart = ({ isCartOpen, setIsCartOpen, order }: { isCartOpen: boolean, setIsCartOpen: (isOpen: boolean) => void, order: Order }) => (
  <div
    className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
  >
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Order Items</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(!isCartOpen)}>
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {order.items.map((item) => (
          <div key={item.id} className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">{item.totalPrice.toFixed(2)} Dh</p>
            </div>
            {/* <p className={`text-sm mt-2 ${getItemStatusColor(item.status)}`}>{item.status}</p> */}
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span>Subtotal:</span>
          <span>${(order.totalPrice - order.shippingInfo.cost).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Shipping:</span>
          <span>{order.shippingInfo.cost} Dh</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold text-xl">{
            order.shippingInfo.cost
          } Dh</span>
        </div>
        <Button className="w-full">Checkout</Button>
      </div>
    </div>
  </div>
)

export function OrderView({ order }: { order: Order }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { currentOrder } = useOrderStore();

  return (
    currentOrder &&
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 p-4 space-y-4">
        <div className="mb-2 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.sequence ?? "-"}</h1>
            <p className="text-gray-500">Placed on {order.createdAt.toDate().toLocaleDateString()}</p>
          </div>

          <div className="flex gap-2">
            {currentOrder.orderStatus == "cancelled" && <CancelledCalls />}
            {currentOrder.orderStatus == "scheduled" && (
              <ScheduledOrdersDate />
            )}
            <StateChanger order={order} state={order.orderStatus} showNumberOfCalls />
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          {/* <OrderTimeline estimatedDelivery={order.} /> */}
          <OrderActions />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <CustomerInfo {...order} />
          <OrderSummary {...order} />
        </div>

        <div className="flex gap-3">
          <OrderItemsTable items={order.items} />
          <OrderNotes note={order?.note?.content ?? ""} />
        </div>
      </div>

      <OrderCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} order={order} />

      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <ShoppingCart className="h-6 w-6" />
      </Button>
    </div>
  )
}