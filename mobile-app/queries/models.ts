import { queryOptions } from "@tanstack/react-query";
import { loadCachedModels, saveModels } from "../lib/storage";

export const MODELS_QUERY_KEY = ["models"];

import type { Model, ModelsResponse } from "../types/models";

export const fetchModels = async (): Promise<Model[]> => {
  const response = await fetch("https://raw.githubusercontent.com/PraveenJayaprakash-JP/AI-Model-Radar/main/data/models.json");
  if (!response.ok) throw new Error("Failed to fetch models");
  const data: ModelsResponse = await response.json();
  return data.data || [];
};

export const modelsQueryOptions = queryOptions({
  queryKey: MODELS_QUERY_KEY,
  queryFn: fetchModels,
  initialData: () => loadCachedModels(),
  staleTime: 15 * 60 * 1000, // 15 minutes
  gcTime: 24 * 60 * 60 * 1000, // 24 hours
  refetchOnMount: true,
  onSuccess: (data) => {
    saveModels(data); // Cache fresh data
  },
});

// Note: onSuccess is deprecated in TanStack Query v5, use onSuccess callback in useQuery instead
