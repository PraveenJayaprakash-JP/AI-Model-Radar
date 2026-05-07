import { ActivityIndicator, Text, Banner } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import ModelCard from "./ModelCard";
import ErrorBanner from "./ErrorBanner";

interface ModelListProps {
  models: any[];
  isLoading?: boolean;
  error?: string;
  highlight?: boolean;
  dataUpdatedAt?: number;
}

export default function ModelList({ models, isLoading, error, highlight, dataUpdatedAt }: ModelListProps) {
  const isStale = dataUpdatedAt && (Date.now() - dataUpdatedAt) > 15 * 60 * 1000;

  if (isLoading && models.length === 0) {
    return <ActivityIndicator animating={true} />;
  }
  if (error) {
    return <ErrorBanner message={error} />;
  }
  return (
    <>
      {isStale && (
        <Banner visible={true} actions={[
          { label: "Refresh" }
        ]}>
          Data may be out of date. Pull to refresh.
        </Banner>
      )}
      <FlashList
        data={models}
        renderItem={({ item }) => <ModelCard model={item} highlight={highlight} />}
        estimatedItemSize={120}
        keyExtractor={(item) => item.name}
      />
    </>
  );
}