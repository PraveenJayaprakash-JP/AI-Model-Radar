import { ActivityIndicator, Text } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import ModelCard from "./ModelCard";
import ErrorBanner from "./ErrorBanner";

interface ModelListProps {
  models: any[];
  isLoading: boolean;
  error?: string;
}

export default function ModelList({ models, isLoading, error }: ModelListProps) {
  if (isLoading && models.length === 0) {
    return <ActivityIndicator animating={true} />;
  }
  if (error) {
    return <ErrorBanner message={error} />;
  }
  return (
    <FlashList
      data={models}
      renderItem={({ item }) => <ModelCard model={item} />}
      estimatedItemSize={120}
      keyExtractor={(item) => item.name}
    />
  );
}