import { create } from "zustand";

// Define the store
interface NavbarState {
  // actions are buttons can be any node
  actions: React.ReactNode[];
  setActions: (actions: React.ReactNode[]) => void;
}

// Create the Zustand store
export const useNavbar = create<NavbarState>((set) => ({
  actions: [],
  setActions: (actions) => set({ actions }),
}))