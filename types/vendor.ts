import { Timestamp } from "firebase/firestore";

// Type for vendor contact details
interface VendorContact {
  email?: string; // Contact email
  phone: string; // Contact phone number
}

// Main Vendor structure
export interface Vendor {
  id: string; // Unique ID of the vendor
  name: string; // Vendor name (company or individual)
  address: string; // Address details of the vendor
  Image: string; // URL of the vendor's logo or image
  contact: VendorContact; // List of contacts at the vendor company
  createdAt: Timestamp; // When the vendor record was created
  updatedAt?: Timestamp; // When the vendor record was last updated
  storeId: string; // ID of the store the vendor is associated with
}
