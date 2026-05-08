import { TextInput, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { modelsQueryOptions } from "../queries/models";
import ModelList from "../components/ModelList";
import { useFilters, SortOption } from "../stores/useFilters";
import { loadCachedModels, saveModels } from "../lib/storage";
import { useEffect, useState } from "react";
import type { Model } from "../types/models";
import { Text, Banner } from "react-native";
import { getTheme } from "../lib/theme";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "../components/FilterModal";
import DetailModal from "../components/DetailModal";

export default function BrowseScreen() {
  const { 
    searchQuery, setSearchQuery, isDarkMode, sortBy, 
    providers, maxPrice, showFreeOnly, capabilities 
  } = useFilters();
  const [initialData, setInitialData] = useState<Model[] | undefined>(undefined);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const currentTheme = getTheme(isDarkMode);

  useEffect(() => {
    loadCachedModels().then((data) => {
      if (data) setInitialData(data);
    });
  }, []);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    ...modelsQueryOptions,
    initialData,
  });

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      saveModels(data);
    }
  }, [data, isLoading, isFetching]);

  const sortModels = (models: Model[]) => {
    const sorted = [...models];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return sorted.sort((a, b) => 
          (a.pricing?.input_cost_per_1k || 0) - (b.pricing?.input_cost_per_1k || 0)
        );
      case "price-high":
        return sorted.sort((a, b) => 
          (b.pricing?.input_cost_per_1k || 0) - (a.pricing?.input_cost_per_1k || 0)
        );
      case "context":
        return sorted.sort((a, b) => 
          (b.context_window || 0) - (a.context_window || 0)
        );
      case "newest":
        return sorted.sort((a, b) => 
          (b.launch_date || 0) - (a.launch_date || 0)
        );
      default:
        return sorted;
    }
  };

  const filteredModels = sortModels((data || []).filter(model => {
    const matchesSearch = !searchQuery || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvider = providers.length === 0 || 
      providers.some(p => model.provider.toLowerCase().includes(p.toLowerCase()));
    
    const matchesPrice = !model.pricing || 
      model.pricing.input_cost_per_1k <= maxPrice;
    
    const matchesFree = !showFreeOnly || model.free_tier;
    
    const matchesCapabilities = capabilities.length === 0 ||
      capabilities.every(cap => model.capabilities?.includes(cap));
    
    return matchesSearch && matchesProvider && matchesPrice && matchesFree && matchesCapabilities;
  }));

  const activeFilterCount = providers.length + capabilities.length + (showFreeOnly ? 1 : 0) + (maxPrice < 1 ? 1 : 0);

  // Loading state: Show large ActivityIndicator on initial load
  if (isLoading && (data || []).length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: currentTheme.background }}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={{ marginTop: 16, color: currentTheme.textSecondary, fontSize: 16 }}>Loading AI models...</Text>
      </View>
    );
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case "name": return "A → Z";
      case "price-low": return "Price ↑";
      case "price-high": return "Price ↓";
      case "context": return "Context";
      case "newest": return "Newest";
      default: return "Sort";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
        {/* Background refresh banner */}
        {isFetching && data && data.length > 0 && (
          <Banner
            visible={true}
            icon={() => <ActivityIndicator size="small" color="#007AFF" />}
            actions={[{ label: 'Hide', onPress: () => {} }]}
          >
            Updating models...
          </Banner>
        )}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center",
          backgroundColor: currentTheme.input,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: currentTheme.border,
          paddingHorizontal: 12,
          gap: 8,
        }}>
          <Ionicons name="search" size={20} color={currentTheme.textSecondary} />
          <TextInput
            style={{ 
              flex: 1,
              padding: 12, 
              color: currentTheme.text,
              fontSize: 16,
            }}
            placeholder="Search AI models..."
            placeholderTextColor={currentTheme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={currentTheme.textSecondary} 
              onPress={() => setSearchQuery("")}
            />
          )}
        </View>
        
        <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
          <TouchableOpacity 
            onPress={() => setFilterModalVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: currentTheme.surface,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: currentTheme.border,
            }}
          >
            <Ionicons name="options" size={18} color={currentTheme.text} />
            <Text style={{ color: currentTheme.text, fontSize: 14 }}>Filters</Text>
            {activeFilterCount > 0 && (
              <View style={{ 
                backgroundColor: "#007AFF", 
                borderRadius: 10, 
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}>
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: currentTheme.surface,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: currentTheme.border,
            }}
          >
            <Ionicons name="swap-vertical" size={18} color={currentTheme.text} />
            <Text style={{ color: currentTheme.text, fontSize: 14 }}>{getSortLabel()}</Text>
          </TouchableOpacity>
        </View>
        
        {searchQuery.length > 0 && (
          <Text style={{ 
            marginTop: 8, 
            color: currentTheme.textSecondary, 
            fontSize: 13 
          }}>
            {filteredModels.length} result{filteredModels.length !== 1 ? "s" : ""} found
          </Text>
        )}
      </View>
      <ModelList
        models={filteredModels}
        isLoading={isLoading}
        error={error?.message}
        onModelPress={setSelectedModel}
        refreshing={isFetching}
        onRefresh={() => refetch()}
      />
      <FilterModal 
        visible={filterModalVisible} 
        onClose={() => setFilterModalVisible(false)} 
      />
      <DetailModal
        model={selectedModel}
        visible={!!selectedModel}
        onClose={() => setSelectedModel(null)}
      />
    </View>
  );
}