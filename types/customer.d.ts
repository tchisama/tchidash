import { Timestamp } from "firebase/firestore";

/**
 * Represents the possible statuses a customer can have.
 */
export type CustomerStatus = "active" | "inactive" | "suspended";
// ACTIVE = "active",
// INACTIVE = "inactive",
// SUSPENDED = "suspended",

/**
 * Represents a customer entity with best practices applied.
 */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: CustomerStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  notes?: string;
  isEmailVerified: boolean;
  purchaseCount?: number;
  dateOfBirth?: Date;
  totalAmountSpent?: number;
  storeId: string;
}
