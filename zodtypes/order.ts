import { z } from "zod";
import { Timestamp } from "firebase/firestore";

// Zod schema for order status
const OrderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
]);

// Zod schema for shipping status
const ShippingStatusSchema = z.enum([
  "pending",
  "shipped",
  "delivered",
  "returned",
]);

// Zod schema for payment methods
const PaymentMethodSchema = z.enum([
  "cash_on_delivery", // Cash on delivery method
  "stripe_card",      // Stripe card payment
  "stripe_wallet",    // Stripe wallet like Apple Pay, Google Pay, etc.
]);

// Zod schema for currency
const CurrencySchema = z.enum(["USD", "MAD", "EUR"]);

// Zod schema for shipping address
const ShippingAddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// Zod schema for customer information
const CustomerInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  shippingAddress: ShippingAddressSchema,
});

// Zod schema for order line item
const OrderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(), // Optional variant ID if the product has variants
  title: z.string(),
  quantity: z.number().int().positive(), // Ensure quantity is a positive integer
  price: z.number().positive(), // Price of a single unit
  totalPrice: z.number().positive(), // Total price for the item (price * quantity)
  discount: z.object({
    amount: z.number().positive(), // Discount value
    type: z.enum(["percentage", "fixed"]), // Discount type
  }).optional(), // Optional discount for the item
  id: z.string(),
  imageUrl: z.string().url().optional(), // Optional image URL
});

// Zod schema for shipping information
const ShippingInfoSchema = z.object({
  method: z.string(), // e.g., 'standard', 'express'
  cost: z.number().positive(), // Shipping cost
  trackingNumber: z.string().optional(),
  shippingStatus: ShippingStatusSchema,
});

// Zod schema for payment information
const PaymentInfoSchema = z.object({
  method: PaymentMethodSchema, // Payment method (cash on delivery, stripe card, etc.)
  transactionId: z.string().optional(), // Transaction ID for Stripe payments (not needed for cash on delivery)
  status: z.enum(["pending", "paid", "failed"]), // Payment status
});

// Zod schema for notes
const NoteSchema = z.object({
  creator: z.string(),
  creatorId: z.string(),
  content: z.string(),
});

// Main Order schema
const OrderSchema = z.object({
  id: z.string(),
  customer: CustomerInfoSchema, // Customer details for the order
  items: OrderItemSchema.array(), // List of ordered items
  totalItems: z.number().int().nonnegative(), // Total number of items in the order
  subtotal: z.number().positive(), // Total price without discount and shipping
  discountAmount: z.number().optional(), // Optional discount applied to the order
  shippingInfo: ShippingInfoSchema, // Shipping method, cost, and status
  totalPrice: z.number().positive(), // Final total price after discount and shipping
  currency: CurrencySchema,
  paymentMethod: PaymentMethodSchema,
  paymentInfo: PaymentInfoSchema.optional(),
  orderStatus: OrderStatusSchema,
  createdAt: z.instanceof(Timestamp), // Timestamp from Firebase
  updatedAt: z.instanceof(Timestamp).optional(), // Optional updated timestamp
  storeId: z.string(),
  note: NoteSchema.optional(),
});

// Export the schema
export {
  OrderSchema,
  OrderStatusSchema,
  ShippingStatusSchema,
  PaymentMethodSchema,
  CurrencySchema,
  ShippingAddressSchema,
  CustomerInfoSchema,
  OrderItemSchema,
  ShippingInfoSchema,
  PaymentInfoSchema,
  NoteSchema,
};
