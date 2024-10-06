import { ProductCategory } from "@/types/categories";
import { create } from "zustand";

// Define the store
interface CategoriesState {
  categories: ProductCategory[];
  setCategories: (categories: ProductCategory[]) => void;
}

// Create the Zustand store
export const useCategories = create<CategoriesState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));
