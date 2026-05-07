import { Text, View } from "react-native-paper";
import { Button } from "react-native-paper";
import { useState } from "react";
import type { Model } from "../types/models";

export default function CompareScreen() {
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  if (showPlaceholder) {
    return (
      <View style={{ padding: 16, alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text variant="bodyLarge" style={{ textAlign: "center", marginBottom: 16 }}>
          Select models from the Browse tab to compare their pricing and capabilities.
        </Text>
        <Text variant="bodySmall" style={{ textAlign: "center", color: "gray" }}>
          Comparison feature coming soon in v1.1
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 24 }}>
        Compare Models ({selectedModels.length}/3)
      </Text>
      {selectedModels.length === 0 && (
        <Text variant="bodyMedium" style={{ textAlign: "center" }}>
          No models selected. Go to Browse tab and tap on models to add them to comparison.
        </Text>
      )}
      {/* Model comparison cards will be rendered here */}
    </View>
  );
}
