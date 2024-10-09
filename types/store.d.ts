import { Timestamp } from "firebase/firestore";

  
  
  // Type for store owner
  interface StoreOwner {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  }
  
  // Type for store settings (e.g., localization, payments)
  interface StoreSettings {
    currency: "USD" | "MAD" | "EUR" ;
    taxRate: number; // Tax rate applied to products
    // shippingEnabled: boolean;
    // paymentMethods: string[]; // e.g., ['paypal', 'credit_card']
    paymentMethod: "cash_on_delivery";
    shippingCost: number;
  }
  
  // Main Store type
 export type Store = {
    id: string;
    name: string;
    owner: StoreOwner;
    ownerEmail:string;
    status: "active" | "inactive" | "pending_approval";
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    description?: string; // Optional store description
    logoUrl?: string; // Optional logo for branding
    settings: StoreSettings; // Store-related settings
    productCount: number; // Total number of products
    shipping: ShippingInfo;
};
  