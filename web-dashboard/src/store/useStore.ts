import { create } from "zustand";
import type { Model } from "../types";

export type SortOption = "name" | "price-low" | "price-high" | "context" | "newest";

interface AppState {
  models: Model[];
  searchQuery: string;
  providers: string[];
  capabilities: string[];
  sortBy: SortOption;
  maxPrice: number;
  showFreeOnly: boolean;
  favorites: string[];
  compareList: string[];
  isDarkMode: boolean;
  isOffline: boolean;
  isLoading: boolean;
  error: string | null;
  selectedModel: Model | null;

  setModels: (models: Model[]) => void;
  setSearchQuery: (query: string) => void;
  toggleProvider: (provider: string) => void;
  toggleCapability: (cap: string) => void;
  setSortBy: (sort: SortOption) => void;
  setMaxPrice: (price: number) => void;
  setShowFreeOnly: (show: boolean) => void;
  toggleFavorite: (modelId: string) => void;
  toggleCompare: (modelId: string) => void;
  clearCompare: () => void;
  toggleTheme: () => void;
  setOffline: (offline: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedModel: (model: Model | null) => void;
  clearFilters: () => void;
}

export const useStore = create<AppState>((set) => ({
  models: [],
  searchQuery: "",
  providers: [],
  capabilities: [],
  sortBy: "name",
  maxPrice: 1,
  showFreeOnly: false,
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
  compareList: JSON.parse(localStorage.getItem("compare") || "[]"),
  isDarkMode: localStorage.getItem("theme") === "dark",
  isOffline: false,
  isLoading: true,
  error: null,
  selectedModel: null,

  setModels: (models) => set({ models }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleProvider: (provider) => set((state) => ({
    providers: state.providers.includes(provider)
      ? state.providers.filter((p) => p !== provider)
      : [...state.providers, provider],
  })),
  toggleCapability: (cap) => set((state) => ({
    capabilities: state.capabilities.includes(cap)
      ? state.capabilities.filter((c) => c !== cap)
      : [...state.capabilities, cap],
  })),
  setSortBy: (sort) => set({ sortBy: sort }),
  setMaxPrice: (price) => set({ maxPrice: price }),
  setShowFreeOnly: (show) => set({ showFreeOnly: show }),
  toggleFavorite: (modelId) => set((state) => {
    const newFavorites = state.favorites.includes(modelId)
      ? state.favorites.filter((id) => id !== modelId)
      : [...state.favorites, modelId];
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    return { favorites: newFavorites };
  }),
  toggleCompare: (modelId) => set((state) => {
    if (state.compareList.includes(modelId)) {
      const newList = state.compareList.filter((id) => id !== modelId);
      localStorage.setItem("compare", JSON.stringify(newList));
      return { compareList: newList };
    }
    if (state.compareList.length >= 5) return state;
    const newList = [...state.compareList, modelId];
    localStorage.setItem("compare", JSON.stringify(newList));
    return { compareList: newList };
  }),
  clearCompare: () => {
    localStorage.setItem("compare", "[]");
    set({ compareList: [] });
  },
  toggleTheme: () => set((state) => {
    const newMode = !state.isDarkMode;
    localStorage.setItem("theme", newMode ? "dark" : "light");
    return { isDarkMode: newMode };
  }),
  setOffline: (offline) => set({ isOffline: offline }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  clearFilters: () => set({ providers: [], capabilities: [], maxPrice: 1, showFreeOnly: false }),
}));
