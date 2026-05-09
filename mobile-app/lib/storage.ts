import type { Model } from "../types/models";

let cachedModels: Model[] = [];

export const loadCachedModels = async (): Promise<Model[] | null> => {
  return cachedModels.length > 0 ? cachedModels : null;
};

export const saveModels = async (models: Model[]): Promise<void> => {
  cachedModels = models;
};

export const clearStorage = async (): Promise<void> => {
  cachedModels = [];
};