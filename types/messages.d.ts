import { Timestamp } from "firebase/firestore";

// Type for Message Status
type MessageStatus = "unread" | "read" | "responded";

// Type for contact message
export interface ContactMessage {
  id: string; // Unique identifier for the message
  name: string; // Name of the person sending the message
  phone: string; // Phone number of the person sending the message
  message: string; // The actual message content
  email?: string; // Optional email if user decides to provide it
  storeId?: string; // Optional store identifier (in case it's tied to a specific store)
  storeName?: string; // Optional store name (for businesses with multiple stores)
  status: MessageStatus; // Status of the message, e.g., 'unread', 'read', 'responded'
  createdAt: Timestamp; // Timestamp for when the message was sent
  updatedAt?: Timestamp; // Timestamp for when the message was last updated
}
