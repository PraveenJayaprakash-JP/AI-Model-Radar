import { create } from "zustand";

interface Filters {
  searchQuery: string;
  providers: string[];
  capabilities: string[];
  setSearchQuery: (query: string) => void;
}

export const useFilters = create<Filters>((set) => ({
  searchQuery: "",
  providers: [],
  capabilities: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
}));