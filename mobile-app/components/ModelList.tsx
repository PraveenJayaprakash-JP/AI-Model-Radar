import { ActivityIndicator, Text, Button, View } from "react-native";
import ModelCard from "./ModelCard";
import ErrorBanner from "./ErrorBanner";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { useFilters } from "../stores/useFilters";
import { getTheme } from "../lib/theme";

import type { Model } from "../types/models";

interface ModelListProps {
  models: Model[];
  isLoading?: boolean;
  error?: string;
  highlight?: boolean;
  onModelPress?: (model: Model) => void;
}

export default function ModelList({ models, isLoading, error, highlight, onModelPress }: ModelListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const lastValidTime = React.useRef<number>(Date.now());
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  React.useEffect(() => {
    if (!isLoading && !error && models.length > 0) {
      lastValidTime.current = Date.now();
    }
  }, [isLoading, error, models]);

  const isStale = (Date.now() - lastValidTime.current) > 15 * 60 * 1000;

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["models"] });
    setRefreshing(false);
  };

  if (isLoading && models.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && models.length === 0) {
    return <ErrorBanner message={error} onRetry={onRefresh} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      {isStale && (
        <Button title="Data may be stale - Tap to refresh" onPress={onRefresh} />
      )}
      <FlatList
        data={models}
        renderItem={({ item }) => (
          <ModelCard 
            model={item} 
            highlight={highlight} 
            onPress={onModelPress ? () => onModelPress(item) : undefined}
          />
        )}
        keyExtractor={(item) => item.name}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={{ padding: 16, textAlign: "center", color: currentTheme.text }}>
            No models found
          </Text>
        }
      />
    </View>
  );
}