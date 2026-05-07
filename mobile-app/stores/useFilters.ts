import { create } from "zustand";

interface Filters {
  searchQuery: string;
  providers: string[];
  capabilities: string[];
  isDarkMode: boolean;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
}

export const useFilters = create<Filters>((set) => ({
  searchQuery: "",
  providers: [],
  capabilities: [],
  isDarkMode: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));