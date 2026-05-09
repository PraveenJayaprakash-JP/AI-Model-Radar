import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import ModelGrid from "./components/ModelGrid";
import { DetailModal } from "./components/DetailModal";
import FavoritesDrawer from "./components/FavoritesDrawer";
import CompareBar from "./components/CompareBar";
import { useModels } from "./hooks/useModels";
import type { Model } from "./types";

function App() {
  const {
    models,
    searchQuery,
    providers,
    capabilities,
    sortBy,
    showFreeOnly,
    favorites,
    compareList,
    isDarkMode,
    selectedModel,
    setSearchQuery,
    toggleProvider,
    toggleCapability,
    setSortBy,
    setShowFreeOnly,
    toggleFavorite,
    toggleCompare,
    toggleTheme,
    setSelectedModel,
    clearFilters,
  } = useStore();

  const { isLoading, error, refetch } = useModels();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const filteredModels = models
    .filter((model: Model) => {
      const matchesSearch =
        !searchQuery ||
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvider =
        providers.length === 0 ||
        providers.some((p) => model.provider.toLowerCase().includes(p.toLowerCase()));
      const matchesPrice = !model.pricing || model.pricing.input_cost_per_1k <= 1;
      const matchesFree = !showFreeOnly || model.free_tier;
      const matchesCapabilities =
        capabilities.length === 0 ||
        capabilities.every((cap) => model.capabilities?.includes(cap));
      return matchesSearch && matchesProvider && matchesPrice && matchesFree && matchesCapabilities;
    })
    .sort((a: Model, b: Model) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return (a.pricing?.input_cost_per_1k || 0) - (b.pricing?.input_cost_per_1k || 0);
        case "price-high":
          return (b.pricing?.input_cost_per_1k || 0) - (a.pricing?.input_cost_per_1k || 0);
        case "context":
          return (b.context_window || 0) - (a.context_window || 0);
        case "newest":
          return (b.launch_date || 0) - (a.launch_date || 0);
        default:
          return 0;
      }
    });

  const dynamicProviders = [...new Set(models.map((m) => m.provider))].sort();
  const dynamicCapabilities = [...new Set(models.flatMap((m) => m.capabilities || []))].sort();

  // Map our sort values to FilterBar's expected format
  const filterBarSort = sortBy === "price-low" ? "price_low" : sortBy === "price-high" ? "price_high" : sortBy;
  const handleSort = (sort: string) => {
    const mapped = sort === "price_low" ? "price-low" : sort === "price_high" ? "price-high" : sort;
    setSortBy(mapped as any);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-200">
      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        favoritesCount={favorites.length}
        onToggleFavorites={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBar
          providers={dynamicProviders}
          capabilities={dynamicCapabilities}
          activeProviders={providers}
          activeCapabilities={capabilities}
          sortBy={filterBarSort as any}
          showFreeOnly={showFreeOnly}
          onToggleProvider={toggleProvider}
          onToggleCapability={toggleCapability}
          onSort={handleSort}
          onToggleFree={() => setShowFreeOnly(!showFreeOnly)}
          onClear={clearFilters}
        />

        {isLoading && models.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-400">Loading AI models...</p>
          </div>
        )}

        {error && models.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && filteredModels.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            No models found matching your criteria.
          </div>
        )}

        {filteredModels.length > 0 && (
          <ModelGrid
            models={filteredModels}
            favorites={favorites}
            compareList={compareList}
            onFavorite={toggleFavorite}
            onCompare={toggleCompare}
            onSelect={setSelectedModel}
          />
        )}
      </main>

      <DetailModal
        model={selectedModel}
        isOpen={!!selectedModel}
        onClose={() => setSelectedModel(null)}
        isFavorite={selectedModel ? favorites.includes(selectedModel.id) : false}
        onFavorite={() => selectedModel && toggleFavorite(selectedModel.id)}
      />

      <FavoritesDrawer />
      <CompareBar />
    </div>
  );
}

export default App;
