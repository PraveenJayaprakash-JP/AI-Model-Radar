import { queryOptions } from "@tanstack/react-query";
import { loadCachedModels, saveModels } from "../lib/storage";

export const MODELS_QUERY_KEY = ["models"];

export const fetchModels = async () => {
  const response = await fetch("https://raw.githubusercontent.com/PraveenJayaprakash-JP/AI-Model-Radar/main/data/models.json");
  if (!response.ok) throw new Error("Failed to fetch models");
  return response.json();
};

export const modelsQueryOptions = queryOptions({
  queryKey: MODELS_QUERY_KEY,
  queryFn: fetchModels,
  initialData: () => loadCachedModels(),
  staleTime: 15 * 60 * 1000, // 15 minutes
  gcTime: 24 * 60 * 60 * 1000, // 24 hours
  refetchOnMount: (query) => {
    const cachedData = loadCachedModels();
    return !cachedData || query.state.dataUpdatedAt < (Date.now() - 15 * 60 * 1000);
  },
  onSuccess: (data) => {
    saveModels(data); // Cache fresh data
  },
});