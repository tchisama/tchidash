import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  storeId: string;
  createdAt: Timestamp;
  action: string;
  user: string;
  email: string;
  target: string;
  image: string;
  seen:string[];
}