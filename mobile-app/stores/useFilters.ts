import { create } from "zustand";
import type { Model } from "../types/models";

export type SortOption = "name" | "price-low" | "price-high" | "context" | "newest";

interface Filters {
  searchQuery: string;
  providers: string[];
  capabilities: string[];
  isDarkMode: boolean;
  sortBy: SortOption;
  maxPrice: number;
  showFreeOnly: boolean;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
  setSortBy: (sort: SortOption) => void;
  setProviders: (providers: string[]) => void;
  toggleProvider: (provider: string) => void;
  setCapabilities: (capabilities: string[]) => void;
  toggleCapability: (capability: string) => void;
  setMaxPrice: (price: number) => void;
  setShowFreeOnly: (show: boolean) => void;
  clearFilters: () => void;
}

export const useFilters = create<Filters>((set) => ({
  searchQuery: "",
  providers: [],
  capabilities: [],
  isDarkMode: false,
  sortBy: "name",
  maxPrice: 1,
  showFreeOnly: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setSortBy: (sort) => set({ sortBy: sort }),
  setProviders: (providers) => set({ providers }),
  toggleProvider: (provider) => set((state) => {
    const exists = state.providers.includes(provider);
    return { 
      providers: exists 
        ? state.providers.filter(p => p !== provider)
        : [...state.providers, provider]
    };
  }),
  setCapabilities: (capabilities) => set({ capabilities }),
  toggleCapability: (capability) => set((state) => {
    const exists = state.capabilities.includes(capability);
    return {
      capabilities: exists
        ? state.capabilities.filter(c => c !== capability)
        : [...state.capabilities, capability]
    };
  }),
  setMaxPrice: (price) => set({ maxPrice: price }),
  setShowFreeOnly: (show) => set({ showFreeOnly: show }),
  clearFilters: () => set({ 
    providers: [], 
    capabilities: [], 
    maxPrice: 1, 
    showFreeOnly: false 
  }),
}));

interface CompareStore {
  selectedModels: Model[];
  addModel: (model: Model) => void;
  removeModel: (modelId: string) => void;
  clearModels: () => void;
}

export const useCompare = create<CompareStore>((set) => ({
  selectedModels: [],
  addModel: (model) => set((state) => {
    if (state.selectedModels.length >= 3) return state;
    if (state.selectedModels.find(m => m.id === model.id)) return state;
    return { selectedModels: [...state.selectedModels, model] };
  }),
  removeModel: (modelId) => set((state) => ({
    selectedModels: state.selectedModels.filter(m => m.id !== modelId)
  })),
  clearModels: () => set({ selectedModels: [] }),
}));

interface FavoritesStore {
  favorites: Model[];
  addFavorite: (model: Model) => void;
  removeFavorite: (modelId: string) => void;
  isFavorite: (modelId: string) => boolean;
  toggleFavorite: (model: Model) => void;
}

export const useFavorites = create<FavoritesStore>((set, get) => ({
  favorites: [],
  addFavorite: (model) => set((state) => {
    if (state.favorites.find(m => m.id === model.id)) return state;
    return { favorites: [...state.favorites, model] };
  }),
  removeFavorite: (modelId) => set((state) => ({
    favorites: state.favorites.filter(m => m.id !== modelId)
  })),
  isFavorite: (modelId) => get().favorites.some(m => m.id === modelId),
  toggleFavorite: (model) => set((state) => {
    const exists = state.favorites.find(m => m.id === model.id);
    if (exists) {
      return { favorites: state.favorites.filter(m => m.id !== model.id) };
    }
    return { favorites: [...state.favorites, model] };
  }),
}));