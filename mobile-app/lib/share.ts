import { Share, Platform } from "react-native";
import type { Model } from "../types/models";

export async function shareModel(model: Model) {
  const message = `Check out ${model.name} by ${model.provider}${model.free_tier ? " (Free tier!)" : ""}\n\nPricing: $${model.pricing?.input_cost_per_1k ?? 0}/1k tokens\nCapabilities: ${model.capabilities?.join(", ") ?? "N/A"}`;

  try {
    const result = await Share.share({
      message,
      title: model.name,
    });

    if (result.action === Share.sharedAction) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error sharing model:", error);
    return false;
  }
}
