import { ActivityIndicator, Text, Button, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ModelCard from "./ModelCard";
import ErrorBanner from "./ErrorBanner";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import { RefreshControl } from "react-native";
import { useFilters } from "../stores/useFilters";
import { getTheme } from "../lib/theme";

import type { Model } from "../types/models";

interface ModelListProps {
  models: Model[];
  isLoading?: boolean;
  error?: string;
  highlight?: boolean;
  onModelPress?: (model: Model) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function ModelList({ 
  models, 
  isLoading, 
  error, 
  highlight, 
  onModelPress,
  refreshing: externalRefreshing,
  onRefresh: externalOnRefresh 
}: ModelListProps) {
  const queryClient = useQueryClient();
  const [internalRefreshing, setRefreshing] = React.useState(false);
  const lastValidTime = React.useRef<number>(Date.now());
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  React.useEffect(() => {
    if (!isLoading && !error && models.length > 0) {
      lastValidTime.current = Date.now();
    }
  }, [isLoading, error, models]);

  const isStale = (Date.now() - lastValidTime.current) > 15 * 60 * 1000;

  const handleRefresh = useCallback(async () => {
    if (externalRefreshing !== undefined && externalOnRefresh) {
      externalOnRefresh();
    } else {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["models"] });
      setRefreshing(false);
    }
  }, [queryClient, externalRefreshing, externalOnRefresh]);

  // Memoize data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => models, [models]);

  // Optimize renderItem with useCallback to prevent new function on each render
  const renderItem = useCallback(({ item }: { item: Model }) => {
    return (
      <ModelCard 
        model={item} 
        highlight={highlight} 
        onPress={onModelPress ? () => onModelPress(item) : undefined}
      />
    );
  }, [highlight, onModelPress]);

  // Memoize keyExtractor for consistency
  const keyExtractor = useCallback((item: Model) => item.name, []);

  const refreshing = externalRefreshing ?? internalRefreshing;

  if (isLoading && models.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && models.length === 0) {
    return <ErrorBanner message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      {isStale && (
        <Button title="Data may be stale - Tap to refresh" onPress={handleRefresh} />
      )}
      <FlashList
        data={memoizedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={140}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ textAlign: "center", color: currentTheme.text, opacity: 0.6 }}>
              No models found
            </Text>
          </View>
        }
        removeClippedSubviews={true}
        windowSize={10}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}