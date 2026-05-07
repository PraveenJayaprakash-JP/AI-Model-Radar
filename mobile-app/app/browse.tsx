import { Searchbar } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { modelsQueryOptions } from "../queries/models";
import ModelList from "../components/ModelList";
import { useFilters } from "../stores/useFilters";
import { loadCachedModels } from "../lib/storage";

export default function BrowseScreen() {
  const { searchQuery, setSearchQuery } = useFilters();

  // Offline-first: Load cached data immediately, refresh in background
  const { data, error, isLoading } = useQuery({
    ...modelsQueryOptions,
    initialData: loadCachedModels,
    refetchOnMount: true,
  });

  return (
    <>
      <Searchbar
        placeholder="Search models..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ModelList
        models={data || []}
        isLoading={isLoading}
        error={error?.message}
      />
    </>
  );
}