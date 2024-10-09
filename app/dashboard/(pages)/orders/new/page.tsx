'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


import { Order } from "@/types/order";
import { Timestamp } from "firebase/firestore";
import { useOrderStore } from '@/store/orders'
import ItemsTable from './components/ItemsTable'


// Default canvas for a new order
export const defaultOrder: Order = {
  id: "", // Empty string for ID, will be generated later
  customer: {
    id: "", // Placeholder customer ID
    name: "Guest", // Default customer name
    firstName: "", // Optional
    lastName: "", // Optional
    email: "", // Optional
    phoneNumber: "", // Optional
    shippingAddress: {
      address: "", // Placeholder address
      city: "", // Placeholder city
    },
  },
  items: [], // Empty array for ordered items
  totalItems: 0, // Default to zero items
  subtotal: 0, // Default subtotal as 0
  discount: undefined, // No discount by default
  shippingInfo: {
    method: "standard", // Default shipping method
    cost: 0, // Default shipping cost
    trackingNumber: undefined, // No tracking number by default
    shippingStatus: "pending",
  },
  totalPrice: 0, // Default total price is 0
  currency: "MAD",
  paymentMethod: "cash_on_delivery",
  orderStatus: "pending",
  createdAt: Timestamp.now(), // Use the current timestamp for creation time
  updatedAt: undefined, // No update time initially
  storeId: "", // Placeholder store ID
  note: {
    creator: "",
    creatorId: "",
    content: "",
  }, // Optional note is undefined by default
};


export default function CreateOrder() {
  const {newOrder:order, setNewOrder:setOrder} = useOrderStore()
  useEffect(() => {
    setOrder(defaultOrder)
  }, [setOrder])


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted order:', order)
    // Here you would typically send the order to your backend
  }
  return (
    order &&
    <form onSubmit={handleSubmit} className="space-y-6  mx-auto p-6 bg-white rounded-lg shadow">
      <div className='flex gap-4'>
        <div className="space-y-4 flex-1 max-w-3xl">
          <h2 className="text-lg font-bold">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={order.customer.firstName} onChange={
                (e) => {
                  setOrder({ ...order, customer: { ...order.customer, firstName: e.target.value } })
                }
              } />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={order.customer.lastName} onChange={
                (e) => {
                  setOrder({ ...order, customer: { ...order.customer, lastName: e.target.value } })
                }
              } />
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" value={order.customer.phoneNumber} onChange={
              (e) => {
                setOrder({ ...order, customer: { ...order.customer, phoneNumber: e.target.value } } as Order)
              }
            } />
          </div>
        </div>
        <div className='h-[200px] mx-3 w-[1px] bg-slate-200'></div>
        <div className="space-y-4 max-w-3xl flex-1">
          <h2 className="text-lg font-bold">Shipping Address</h2>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={order.customer.shippingAddress.address} onChange={
              (e) => {
                setOrder({ ...order, customer: { ...order.customer, shippingAddress: { ...order.customer.shippingAddress, address: e.target.value } } })
              }
            } />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={order.customer.shippingAddress.city} onChange={
              (e) => {
                setOrder({ ...order, customer: { ...order.customer, shippingAddress: { ...order.customer.shippingAddress, city: e.target.value } } })
              }
            } />
          </div>
        </div>
      </div>
      <ItemsTable />
      <div>
        <Label htmlFor="note">Order Note (Optional)</Label>
        <Textarea id="note" name="note" value={order.note?.content} onChange={
          (e) => {
            if (!e.target.value) return
            if (!order.note) return
            setOrder({ ...order, note: { ...order.note, content: e.target.value } })
          }
        } />
      </div>

      <Button type="submit" className="min-w-xl">Place Order</Button>
    </form>
  );
}

