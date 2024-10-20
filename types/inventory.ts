import { Timestamp } from "firebase/firestore";

export enum InventoryMoveType {
  IN = "IN",
  OUT = "OUT",
}

export enum InventoryMoveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface InventoryItemMove {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  quantity: number;
  storeId: string;
  imageUrl?: string;
  cost: number;
  unitPrice: number;
  vendorId: string;
  orderId?: string;
  note: string;
  createdById: string;
  type: InventoryMoveType;
  status: InventoryMoveStatus;
  referenceNumber: string;
}

export enum PurchaseOrderStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  itemsMovesIds: string[];
  itemsMoves: {
    productId: string;
    variantId?: string;
    title: string;
    quantity: number;
    unitPrice: number;
    imageUrl?: string;
  }[];
  totalCost: number;
  note: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdById: string;
  referenceNumber: string;
  status: PurchaseOrderStatus;
  storeId: string;
}
