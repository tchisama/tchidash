import { Timestamp } from "firebase/firestore";

// Type for order status
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";

// Type for shipping status
type ShippingStatus = "pending" | "shipped" | "delivered" | "returned";

// Type for payment methods
type PaymentMethod =  "cash_on_delivery";

// Type for currency
type Currency = "USD" | "MAD" | "EUR";

// Type for shipping address
interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

// Type for customer information
interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  shippingAddress: ShippingAddress;
}

// Type for order line item
interface OrderItem {
  productId: string;
  variantId?: string; // Optional variant ID if the product has variants
  quantity: number;
  price: number; // Price of a single unit
  totalPrice: number; // Total price for the item (price * quantity)
}

// Type for discount
interface Discount {
  amount: number; // Discount value
  type: "percentage" | "fixed"; // Discount type
}

// Type for shipping information
interface ShippingInfo {
  method: string; // e.g., 'standard', 'express'
  cost: number; // Shipping cost
  trackingNumber?: string;
  shippingStatus: ShippingStatus;
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
};
