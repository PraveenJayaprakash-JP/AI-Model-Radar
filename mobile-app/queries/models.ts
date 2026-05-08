import { queryOptions } from "@tanstack/react-query";
import { loadCachedModels, saveModels } from "../lib/storage";
import type { Model, ModelsResponse } from "../types/models";

export const MODELS_QUERY_KEY = ["models"];

// Sample data embedded directly for offline use
const SAMPLE_MODELS: Model[] = [
  {
    id: "openai-gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    free_tier: false,
    pricing: { input_cost_per_1k: 0.03, output_cost_per_1k: 0.06 },
    capabilities: ["text", "code", "vision"],
    launch_date: 1672531200000,
    context_window: 8192
  },
  {
    id: "openai-gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    free_tier: true,
    pricing: { input_cost_per_1k: 0.0015, output_cost_per_1k: 0.002 },
    capabilities: ["text", "code"],
    launch_date: 1677628800000,
    context_window: 4096
  },
  {
    id: "anthropic-claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    free_tier: false,
    pricing: { input_cost_per_1k: 0.015, output_cost_per_1k: 0.075 },
    capabilities: ["text", "code", "vision"],
    launch_date: 1704067200000,
    context_window: 200000
  },
  {
    id: "anthropic-claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    free_tier: true,
    pricing: { input_cost_per_1k: 0.003, output_cost_per_1k: 0.015 },
    capabilities: ["text", "code", "vision"],
    launch_date: 1706659200000,
    context_window: 200000
  },
  {
    id: "google-gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    free_tier: true,
    pricing: { input_cost_per_1k: 0.00125, output_cost_per_1k: 0.005 },
    capabilities: ["text", "code", "vision"],
    launch_date: 1704067200000,
    context_window: 128000
  },
  {
    id: "mistral-mistral-7b",
    name: "Mistral 7B",
    provider: "Mistral",
    free_tier: true,
    pricing: { input_cost_per_1k: 0, output_cost_per_1k: 0 },
    capabilities: ["text", "code"],
    launch_date: 1696118400000,
    context_window: 8192
  },
  {
    id: "replicate-llama-2-70b",
    name: "Llama 2 70B",
    provider: "Replicate",
    free_tier: false,
    pricing: { input_cost_per_1k: 0.001, output_cost_per_1k: 0.001 },
    capabilities: ["text", "code"],
    launch_date: 1693526400000,
    context_window: 4096
  },
  {
    id: "together-ai-mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Together.ai",
    free_tier: true,
    pricing: { input_cost_per_1k: 0.0006, output_cost_per_1k: 0.0006 },
    capabilities: ["text", "code"],
    launch_date: 1701302400000,
    context_window: 32768
  }
];

export const fetchModels = async (): Promise<Model[]> => {
  // First try cached data
  const cached = await loadCachedModels();
  if (cached && cached.length > 0) {
    return cached;
  }

  // Try to fetch from GitHub
  try {
    const response = await fetch("https://raw.githubusercontent.com/PraveenJayaprakash-JP/AI-Model-Radar/main/data/models.json");
    if (response.ok) {
      const json = await response.json();
      const models = Array.isArray(json) ? json : (json.data || []);
      if (models.length > 0) {
        saveModels(models);
        return models;
      }
    }
  } catch (e) {
    // Silently fall back to sample data
  }

  // Use embedded sample data as fallback
  saveModels(SAMPLE_MODELS);
  return SAMPLE_MODELS;
};

export const modelsQueryOptions = queryOptions({
  queryKey: MODELS_QUERY_KEY,
  queryFn: fetchModels,
  staleTime: 15 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
  refetchOnMount: true,
});