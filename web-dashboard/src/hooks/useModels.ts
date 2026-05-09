import { useEffect, useState, useCallback } from "react";
import { useStore } from "../store/useStore";
import type { Model } from "../types";

const MODELS_URL = "https://raw.githubusercontent.com/PraveenJayaprakash-JP/AI-Model-Radar/master/data/models.json";
const CACHE_KEY = "aiModelRadar_cache";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export function useModels() {
  const { setModels, setLoading, setError } = useStore();
  const [isLoading, setLocalLoading] = useState(true);
  const [error, setLocalError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLocalLoading(true);
    setLocalError(null);

    try {
      // Try cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setModels(data);
          setLocalLoading(false);
          return;
        }
      }

      const response = await fetch(MODELS_URL);
      if (!response.ok) throw new Error("Failed to fetch models");

      const json = await response.json();
      const data: Model[] = Array.isArray(json) ? json : json.data || [];

      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      setModels(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load models";
      setLocalError(message);
      setError(message);

      // Fallback to cache even if stale
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        setModels(data);
      }
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  }, [setModels, setLoading, setError]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { isLoading, error, refetch: fetchModels };
}
