import { Timestamp } from "firebase/firestore";

// Type for store owner
interface StoreOwner {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export type Currency = {
  name: string;
  symbol: string;
};

// Type for store settings (e.g., localization, payments)
interface StoreSettings {
  currency: Currency;
  taxRate: number; // Tax rate applied to products
  // shippingEnabled: boolean;
  paymentMethods: string[]; // e.g., ['paypal', 'credit_card']
  shippingCost: number;
  shippingFreeAboveCartAmount?: number;
  hasFreeShippingAboveAmount?: boolean;
  country: string;

  dynamicVariantsImages?: boolean;
}

interface Discount {
  above: number;
  amount: number;
  type: "percentage" | "fixed";
}

// Main Store type
export type Store = {
  id: string;
  name: string;
  owner: StoreOwner;
  ownerEmail: string;
  status: "active" | "inactive" | "pending_approval";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  description?: string; // Optional store description
  phoneNumber?: string; // Optional store phone number
  logoUrl?: string; // Optional logo for branding
  settings: StoreSettings; // Store-related settings
  productCount: number; // Total number of products
  discountOnOrdersAboveAmount?: Discount;
  apiKeys?: {
    name: string;
    key: string;
  }[];
  employeesEmails?: string[];
  employees?: Employee[];
  integrations?: Integration[];
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  access: {
    [key: string]: boolean;
  };
};

type Integration = digylogIntegration | whatsappNotificationIntegration;

type digylogIntegration = {
  name: "digylog";
  enabled: boolean;
  phoneNumber: string;
  password: string;
  headers: {
    authorization: string;
  };
};

type whatsappNotificationIntegration = {
  name: "whatsapp";
  enabled: boolean;
};

export type whatsappUser = {
  id: string;
  name: string;
  whatsappNumber: string;
  active: boolean;
  storeId: string;
  events: {
    newOrder: boolean;
    dailyReports: boolean;
    pendingOrdersReminders: boolean;
  };
};
