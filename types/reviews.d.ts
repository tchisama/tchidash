import { Timestamp } from "firebase/firestore";

// Type for review rating system (1 to 5 stars)
export type Rating = 1 | 2 | 3 | 4 | 5;

// Type for the review schema
export interface Review {
  id: string;
  reviewerName: string;
  reviewerEmail?: string; // Optional email
  rating: Rating;
  storeId: string;
  reviewText: string;
  images?: string[]; // URLs to uploaded images
  storeName?: string; // Optional store-specific field
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  productId?: string;
  variantId?: string;
  publish: boolean;
}
