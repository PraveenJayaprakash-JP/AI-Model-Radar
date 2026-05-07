import { queryOptions } from "@tanstack/react-query";

export const MODELS_QUERY_KEY = ["models"];

export const fetchModels = async () => {
  const response = await fetch("https://raw.githubusercontent.com/PraveenJayaprakash-JP/AI-Model-Radar/main/data/models.json");
  if (!response.ok) throw new Error("Failed to fetch models");
  return response.json();
};

export const modelsQueryOptions = queryOptions({
  queryKey: MODELS_QUERY_KEY,
  queryFn: fetchModels,
});