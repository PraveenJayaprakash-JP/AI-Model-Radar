import { ActivityIndicator, Text, Banner, RefreshControl } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import ModelCard from "./ModelCard";
import ErrorBanner from "./ErrorBanner";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

import type { Model } from "../types/models";

interface ModelListProps {
  models: Model[];
  isLoading?: boolean;
  error?: string;
  highlight?: boolean;
}

export default function ModelList({ models, isLoading, error, highlight }: ModelListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const lastValidTime = React.useRef<number>(Date.now());

  // Update the last valid time when data is successfully loaded
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
    return <ActivityIndicator animating={true} />;
  }

  if (error && models.length === 0) {
    return <ErrorBanner message={error} onRetry={onRefresh} />;
  }

  return (
    <>
      {isStale && (
        <Banner visible={true} actions={[
          { label: "Refresh", onPress: onRefresh }
        ]}>
          Data may be out of date. Pull to refresh.
        </Banner>
      )}
      <FlashList
        data={models}
        renderItem={({ item }) => <ModelCard model={item} highlight={highlight} />}
        estimatedItemSize={120}
        keyExtractor={(item) => item.name}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={{ padding: 16, textAlign: "center" }}>
            No models found
          </Text>
        }
      />
    </>
  );
}
