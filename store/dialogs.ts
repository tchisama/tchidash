import { create } from "zustand";

// Define the store
interface DialogsState {
  digylogOpen: boolean;
  setDigylogOpen: (open: boolean) => void;

  OrderToImageOpen: boolean;
  setOrderToImageOpen: (open: boolean) => void;
}

// Create the Zustand store
export const useDialogs = create<DialogsState>((set) => ({
  digylogOpen: false,
  setDigylogOpen: (open) => set({ digylogOpen: open }),

  OrderToImageOpen: false,
  setOrderToImageOpen: (open) => set({ OrderToImageOpen: open }),
}));
