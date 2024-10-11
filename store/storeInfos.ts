import { create } from "zustand";

// Define the store interface
interface StoreState {
  storeId: string | null;
  setStoreId: (id: string) => void;
  loadStoreId: () => void;
}

// Create the Zustand store
export const useStore = create<StoreState>((set) => ({
  storeId: null, // Initialize storeId as null

  // Function to set storeId in both Zustand store and localStorage
  setStoreId: (id: string) => {
    localStorage.setItem('storeId', id); // Save to localStorage
    set(() => ({ storeId: id }));
  },

  // Function to load storeId from localStorage on initialization
  loadStoreId: () => {
    const savedStoreId = localStorage.getItem('storeId'); // Retrieve from localStorage
    if (savedStoreId) {
      set(() => ({ storeId: savedStoreId }));
    }
  },
}));


  export const currencyOptions = [
      {
        name: "USD",
        symbol: "$",
      },
      {
        name: "EUR",
        symbol: "€",
      },
      {
        name: "MAD",
        symbol: "dh",
      }
  ]