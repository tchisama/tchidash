import { Timestamp } from "firebase/firestore";

// Type for order status
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "scheduled"
  | "cancelled"
  | "no_reply"
  | "returned";

// Type for shipping status
export type ShippingStatus = "pending" | "shipped" | "delivered" | "returned";

// Type for payment methods
export type PaymentMethod =
  | "cash_on_delivery" // Cash on delivery method
  | "stripe_card" // Stripe card payment
  | "stripe_wallet"; // Stripe wallet like Apple Pay, Google Pay, etc.

// Type for currency
export type Currency = "USD" | "MAD" | "EUR";

// Type for shipping address
export interface ShippingAddress {
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
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
  shippingProvider?: string;
  shippingStatus?: ShippingStatus;
  // the shipping cost i give the provider
  shippingCost?: number;
}

// Type for payment information
export interface PaymentInfo {
  method: PaymentMethod; // Payment method (cash on delivery, stripe card, etc.)
  transactionId?: string; // Transaction ID for Stripe payments (not needed for cash on delivery)
  status: "pending" | "paid" | "failed"; // Payment status
}

export interface Note {
  creator: string;
  creatorId: string;
  content: string;
}

// Main Order type
export type Order = {
  sequence: number;
  id: string;
  customer: CustomerInfo; // Customer details for the order
  shippedTo?: CustomerInfo | null;
  isShippedToAnotherPerson?: boolean;
  items: OrderItem[]; // List of ordered items
  totalItems: number; // Total number of items in the order
  subtotal: number; // Total price without discount and shipping
  discountAmount?: number; // Optional discount applied to the order
  shippingInfo: ShippingInfo; // Shipping method, cost, and status
  totalPrice: number; // Final total price after discount and shipping
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentInfo?: PaymentInfo;
  orderStatus: OrderStatus;
  numberOfCalls?: number;
  scheduledDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  storeId: string;
  note?: Note;
  cityAi?: {
    city: string;
    region: string;
    ID: string;
  };
};
