import { Product } from "@/types/product";
import { create } from "zustand";

// Define the store
interface State {
  products: Product[];
  setProducts: (products: Product[]) => void;

  currentProduct: Product | null;
  setCurrentProduct: (product: Product | null) => void;
}

// Create the Zustand store
export const useProducts = create<State>((set) => ({
  products: [],
  setProducts: (products: Product[]) => set(() => ({ products })), // Function to update products

  currentProduct: null,
  setCurrentProduct: (product: Product | null) =>
    set(() => ({ currentProduct: product })),
}));
