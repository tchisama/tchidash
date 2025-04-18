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
  whatsappConfirmationMessage?: string;
  AskReviewMessage?: string;
  sequences?: {
    orders?: number;
    products?: number;
  };
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  imageUrl?: string;
  active?: boolean;
};

type Integration = digylogIntegration | whatsappNotificationIntegration | posIntegration | landingPageBuilderIntegration;

type digylogIntegration = {
  name: "digylog";
  enabled: boolean;
  token: string;
  store: string;
  network: string;
  autoStatusUpdate: boolean;
  note: string;
};

type whatsappNotificationIntegration = {
  name: "whatsapp";
  enabled: boolean;
  connected: boolean;
};

type posIntegration = {
  name: "pos";
  enabled: boolean;
};

type landingPageBuilderIntegration = {
  name: "landing-page-builder";
  enabled: boolean;
};

export type whatsappNotification = {
  id: string;
  name: "whatsapp-notification";
  whatsappNumber: string;
  active: boolean;
  storeId: string;
  events: {
    newOrder: boolean;
    dailyReports: boolean;
    pendingOrdersReminders: boolean;
  };
};
