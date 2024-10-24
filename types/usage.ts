import { Timestamp } from "firebase/firestore";

export interface Usage {
  id: string; // Unique ID for each usage record
  userEmail: string; // The ID of the user performing the action
  storeId?: string; // Optional, if tracking usage per store/project
  action: "upload" | "download" | "delete"; // The type of action performed
  fileId?: string; // Optional, the ID of the file being uploaded or downloaded
  endpoint: string; // The API endpoint used for the operation
  collection: string; // The collection/table name where the data is stored
  dataAmount: number; // Size of the data in bytes (e.g., 50000 bytes for 50KB)
  ipAddress?: string; // Optional, IP address of the user making the request
  device?: string; // Optional, device type (e.g., "mobile", "desktop")
  createdAt: Timestamp; // Timestamp when the record was created
}
