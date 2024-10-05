import { create } from "zustand";

// Define the store
interface StoreState {
  storeId: string | null;
  setStoreId: (id: string) => void;
}

// Create the Zustand store
export const useStore = create<StoreState>((set) => ({
  storeId: "test", // Initial value for storeId
  setStoreId: (id: string) => set(() => ({ storeId: id })), // Function to update storeId
}));
