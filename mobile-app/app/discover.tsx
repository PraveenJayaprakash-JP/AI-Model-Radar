import { Text } from "react-native-paper";
import ModelList from "../components/ModelList";
import { useQuery } from "@tanstack/react-query";
import { modelsQueryOptions } from "../queries/models";
import type { Model } from "../types/models";
import { loadCachedModels } from "../lib/storage";

export default function DiscoverScreen() {
  const { data, isLoading } = useQuery({
    ...modelsQueryOptions,
    initialData: loadCachedModels(),
  });

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  const newModels: Model[] = data?.filter(
    (model) => model.launch_date && (Date.now() - new Date(model.launch_date * 1000).getTime()) < THIRTY_DAYS_MS
  ) || [];

  const freeModels: Model[] = data?.filter((model) => model.free_tier) || [];

  return (
    <>
      <Text variant="titleLarge" style={{ margin: 16 }}>
        New Models ({newModels.length})
      </Text>
      <ModelList models={newModels} highlight isLoading={isLoading && data === undefined} />

      <Text variant="titleLarge" style={{ margin: 16 }}>
        Free Models ({freeModels.length})
      </Text>
      <ModelList models={freeModels} highlight isLoading={false} />
    </>
  );
}
