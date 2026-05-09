import { View, Text, Button } from "react-native";
import { useFilters } from "../stores/useFilters";
import { getTheme } from "../lib/theme";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);
  
  const errorBgColor = isDarkMode ? "#3d1f1f" : "#ffebee";
  const errorTextColor = isDarkMode ? "#ff6b6b" : "#c62828";

  return (
    <View style={{ padding: 16, backgroundColor: errorBgColor, margin: 8, borderRadius: 8 }}>
      <Text style={{ color: errorTextColor, marginBottom: 8 }}>{message}</Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} />
      )}
    </View>
  );
}