import { create } from "zustand";

// Define the store
interface DialogsState {
  employeeProfileDialogOpen: boolean;
  setEmployeeProfileDialogOpen: (open: boolean) => void;

  digylogOpen: boolean;
  setDigylogOpen: (open: boolean) => void;

  OrderToImageOpen: boolean;
  setOrderToImageOpen: (open: boolean) => void;
}

// Create the Zustand store
export const useDialogs = create<DialogsState>((set) => ({
  employeeProfileDialogOpen: false,
  setEmployeeProfileDialogOpen: (open) =>
    set({ employeeProfileDialogOpen: open }),

  digylogOpen: false,
  setDigylogOpen: (open) => set({ digylogOpen: open }),

  OrderToImageOpen: false,
  setOrderToImageOpen: (open) => set({ OrderToImageOpen: open }),
}));
