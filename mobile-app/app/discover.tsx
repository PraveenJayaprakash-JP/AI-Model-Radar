import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import ModelList from "../components/ModelList";
import { useQuery } from "@tanstack/react-query";
import { modelsQueryOptions } from "../queries/models";
import type { Model } from "../types/models";
import { loadCachedModels } from "../lib/storage";
import { useEffect, useState } from "react";
import { useFilters } from "../stores/useFilters";
import { getTheme } from "../lib/theme";
import { Ionicons } from "@expo/vector-icons";

export default function DiscoverScreen() {
  const [initialData, setInitialData] = useState<Model[] | undefined>(undefined);
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  useEffect(() => {
    loadCachedModels().then((data) => {
      if (data) setInitialData(data);
    });
  }, []);

  const { data, isLoading } = useQuery({
    ...modelsQueryOptions,
    initialData,
  });

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  const newModels: Model[] = (data || []).filter(
    (model) => model.launch_date && (Date.now() - new Date(model.launch_date * 1000).getTime()) < THIRTY_DAYS_MS
  );

  const freeModels: Model[] = (data || []).filter((model) => model.free_tier);

  // Loading state: Show ActivityIndicator on initial load
  if (isLoading && newModels.length === 0 && freeModels.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: currentTheme.background }}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={{ marginTop: 16, color: currentTheme.textSecondary, fontSize: 16 }}>Discovering models...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <View style={{ padding: 16 }}>
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          gap: 10,
          marginBottom: 20,
          padding: 16,
          backgroundColor: "#007AFF15",
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: "#007AFF",
        }}>
          <View style={{ 
            backgroundColor: "#007AFF", 
            padding: 8, 
            borderRadius: 8 
          }}>
            <Ionicons name="sparkles" size={24} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: currentTheme.text }}>
              Discover
            </Text>
            <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
              Find the best AI models for your needs
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Ionicons name="time" size={20} color="#f59e0b" />
            <Text style={{ fontSize: 17, fontWeight: "600", color: currentTheme.text }}>
              New Models
            </Text>
            <View style={{ 
              backgroundColor: "#f59e0b20", 
              paddingHorizontal: 8, 
              paddingVertical: 2, 
              borderRadius: 10 
            }}>
              <Text style={{ fontSize: 12, color: "#f59e0b", fontWeight: "600" }}>
                {newModels.length}
              </Text>
            </View>
          </View>
          <ModelList models={newModels} highlight isLoading={isLoading && data === undefined} />
        </View>

        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Ionicons name="gift" size={20} color="#22c55e" />
            <Text style={{ fontSize: 17, fontWeight: "600", color: currentTheme.text }}>
              Free Models
            </Text>
            <View style={{ 
              backgroundColor: "#22c55e20", 
              paddingHorizontal: 8, 
              paddingVertical: 2, 
              borderRadius: 10 
            }}>
              <Text style={{ fontSize: 12, color: "#22c55e", fontWeight: "600" }}>
                {freeModels.length}
              </Text>
            </View>
          </View>
          <ModelList models={freeModels} highlight isLoading={false} />
        </View>
      </View>
    </ScrollView>
  );
}