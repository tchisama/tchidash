import { create } from "zustand";

// Define the store
interface DynamicVariantsImagesState {
  selectedOption: string | null;
  setSelectedOption: (option: string | null) => void;

  savefunctions: {
    [string: string]: () => string;
  };
  addSaveFunction: (saveFunction: { [string: string]: () => string }) => void;
}

export const useDynamicVariantsImages = create<DynamicVariantsImagesState>(
  (set) => ({
    selectedOption: null,
    setSelectedOption: (option: string | null) =>
      set({ selectedOption: option }),

    savefunctions: {},
    addSaveFunction: (saveFunction) =>
      set((state) => ({
        savefunctions: { ...state.savefunctions, ...saveFunction },
      })),
  }),
);
