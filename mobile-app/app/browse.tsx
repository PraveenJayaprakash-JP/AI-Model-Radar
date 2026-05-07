import { Searchbar } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { modelsQueryOptions } from "../queries/models";
import ModelList from "../components/ModelList";
import { useFilters } from "../stores/useFilters";
import { loadCachedModels, saveModels } from "../lib/storage";
import { useEffect } from "react";

export default function BrowseScreen() {
  const { searchQuery, setSearchQuery } = useFilters();

  // Offline-first: Load cached data immediately, refresh in background
  const { data, error, isLoading, isFetching } = useQuery({
    ...modelsQueryOptions,
    initialData: loadCachedModels(),
  });

  // Save fresh data to cache when available
  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      saveModels(data);
    }
  }, [data, isLoading, isFetching]);

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
