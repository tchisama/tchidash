import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  storeId: string;
  createdAt: Timestamp;
  action: string;
  email: string;
  target: string;
  seen:string[];
}