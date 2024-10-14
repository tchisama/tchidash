import { ProductCategory } from "@/types/categories";
import { create } from "zustand";

// Define the store
interface DynamicVariantsImagesState {
  selectedOption: string | null;
  setSelectedOption: (option: string | null) => void;
}


export const useDynamicVariantsImages = create<DynamicVariantsImagesState>((set) => ({
  selectedOption: null,
  setSelectedOption: (option: string | null) => set({ selectedOption: option }),
}));
