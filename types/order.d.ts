import { Timestamp } from "firebase/firestore";

// Type for order status
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

// Type for shipping status
export type ShippingStatus = "pending" | "shipped" | "delivered" | "returned";

// Type for payment methods
export type PaymentMethod = "cash_on_delivery";

// Type for currency
export type Currency = "USD" | "MAD" | "EUR";

// Type for shipping address
export interface ShippingAddress {
  address: string;
  city: string;
}

// Type for customer information
export interface CustomerInfo {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  shippingAddress: ShippingAddress;
}

// Type for order line item
export interface OrderItem {
  productId: string;
  variantId?: string; // Optional variant ID if the product has variants
  // image?: string;
  title: string;
  quantity: number;
  price: number; // Price of a single unit
  totalPrice: number; // Total price for the item (price * quantity)
  discount?: Discount; // Optional discount for the item
  id: string;
  imageUrl?: string;
}

// Type for discount
export interface Discount {
  amount: number; // Discount value
  type: "percentage" | "fixed"; // Discount type
}

// Type for shipping information
export interface ShippingInfo {
  method: string; // e.g., 'standard', 'express'
  cost: number; // Shipping cost
  trackingNumber?: string;
  shippingStatus: ShippingStatus;
}
export interface Note {
  creator: string;
  creatorId: string;
  content: string;
}

// Main Order type
export type Order = {
  id: string;
  customer: CustomerInfo; // Customer details for the order
  items: OrderItem[]; // List of ordered items
  totalItems: number; // Total number of items in the order
  subtotal: number; // Total price without discount and shipping
  discount?: Discount; // Optional discount applied to the order
  shippingInfo: ShippingInfo; // Shipping method, cost, and status
  totalPrice: number; // Final total price after discount and shipping
  currency: Currency;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  storeId: string;
  note?: Note;
};
