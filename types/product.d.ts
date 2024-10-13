import { Timestamp } from "firebase/firestore";

// Enum for product status

// Type for variant option values
export interface VariantValue {
  option: string; // e.g., "Size" or "Color"
  value: string; // e.g., "Large" or "Red"
}

// Type for product variant
export interface Variant {
  id: string;
  title: string;
  description?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  weight: number; // Weight in grams or other unit
  inventoryQuantity: number;
  hasInfiniteStock?: boolean; // If true, stock management is ignored
  taxable: boolean;
  barcode?: string;
  image: string;
  variantValues: VariantValue[]; // Array of option and value pairs
  totalSales?: number;
}

// Type for product option (general options like size, color)
export interface Option {
  name: string; // e.g., "Size"
  values: string[]; // e.g., ["Small", "Medium", "Large"]
  id: string;
}

// Type for discount
export interface Discount {
  amount: number; // Discount value
  type: "percentage" | "fixed"; // Discount type
  startDate: Timestamp;
  endDate?: Timestamp;
}

// Type for product bundle
export interface ProductBundle {
  id: string;
  title: string;
  products: Array<{ productId: string; quantity: number }>; // List of products and their quantities in the bundle
  price: number;
  discount?: Discount; // Optional discount for the bundle
  imageUrl?: string;
}

// Main Product type
export type Product = {
  id: string;
  title: string;
  storeId: string;
  description: string;
  tags?: string[];
  vendor?: string; // e.g., Brand or Seller
  category: string;
  status: "draft" | "active" | "archived" | "deleted" | "out_of_stock";
  variants?: Variant[];
  options?: Option[]; // Customizable product options (size, color)
  images?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  discount?: Discount; // Optional discount
  hasDiscount: boolean;
  stockQuantity: number; // Total stock of all variants
  hasInfiniteStock?: boolean; // If true, stock management is ignored
  price: number;
  bundle?: boolean;
  bundles?: ProductBundle[];
  totalSales?: number;
  dynamicVariantsImages?: boolean;
};
