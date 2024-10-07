import { Timestamp } from "firebase/firestore";

// Enum for store status
enum StoreStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING_APPROVAL = "pending_approval",
}
  
  
  // Type for store owner
  interface StoreOwner {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  }
  
  // Type for store settings (e.g., localization, payments)
  interface StoreSettings {
    currency: "USD" | "DH" | "EUR" ;
    taxRate: number; // Tax rate applied to products
    // shippingEnabled: boolean;
    // paymentMethods: string[]; // e.g., ['paypal', 'credit_card']
  }
  
  // Main Store type
 export type Store = {
    id: string;
    name: string;
    owner: StoreOwner;
    ownerEmail:string;
    status: StoreStatus;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    description?: string; // Optional store description
    logoUrl?: string; // Optional logo for branding
    settings: StoreSettings; // Store-related settings
    productCount: number; // Total number of products
};
  