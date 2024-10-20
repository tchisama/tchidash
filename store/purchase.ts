import { InventoryItemMove, PurchaseOrder } from "@/types/inventory";
import { create } from "zustand";

// Define the Order type as before

// Define Zustand Store
interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[]; // List of all orders
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;

  currentPurchaseOrder: PurchaseOrder | null; // The current order being worked on
  setCurrentPurchaseOrder: (purchaseOrder: PurchaseOrder) => void;

  purchaseOrderItmes: InventoryItemMove[];
  setPurchaseOrderItems: (items: InventoryItemMove[]) => void;
}

// Zustand store implementation

export const usePurchaseOrderStore = create<PurchaseOrderState>((set) => ({
  purchaseOrders: [],
  setPurchaseOrders: (orders: PurchaseOrder[]) =>
    set({ purchaseOrders: orders }),

  currentPurchaseOrder: null,
  setCurrentPurchaseOrder: (purchaseOrder: PurchaseOrder) =>
    set({ currentPurchaseOrder: purchaseOrder }),

  purchaseOrderItmes: [],
  setPurchaseOrderItems: (items: InventoryItemMove[]) =>
    set({ purchaseOrderItmes: items }),
}));
