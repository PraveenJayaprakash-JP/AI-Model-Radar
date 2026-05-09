import { TouchableOpacity, Text, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Model } from "../types/models";
import { shareModel } from "../lib/share";
import { useFilters } from "../stores/useFilters";
import { getTheme } from "../lib/theme";
import { spacing, radius, transitions } from "../lib/tokens";

interface ShareButtonProps {
  model: Model;
}

export default function ShareButton({ model }: ShareButtonProps) {
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  const handleShare = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await shareModel(model);
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      activeOpacity={0.7}
      style={{
        marginTop: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: currentTheme.border,
        backgroundColor: currentTheme.surface,
      }}
    >
      <Ionicons name="share-outline" size={16} color={currentTheme.textSecondary} />
      <Text style={{ color: currentTheme.textSecondary, fontSize: 14, fontWeight: "600" }}>
        Share Model
      </Text>
    </TouchableOpacity>
  );
}
