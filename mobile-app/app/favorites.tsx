import { Text, View, ScrollView } from "react-native";
import ModelList from "../components/ModelList";
import { useFavorites } from "../stores/useFilters";
import { useFilters } from "../stores/useFilters";
import { getTheme } from "../lib/theme";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <View style={{ padding: 16 }}>
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          gap: 10,
          marginBottom: 20,
          padding: 16,
          backgroundColor: "#f59e0b15",
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: "#f59e0b",
        }}>
          <View style={{ 
            backgroundColor: "#f59e0b", 
            padding: 8, 
            borderRadius: 8 
          }}>
            <Ionicons name="star" size={24} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: currentTheme.text }}>
              Favorites
            </Text>
            <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
              Your starred AI models
            </Text>
          </View>
        </View>

        {favorites.length === 0 ? (
          <View style={{ 
            padding: 32, 
            alignItems: "center",
            backgroundColor: currentTheme.surface,
            borderRadius: 12,
          }}>
            <Ionicons name="star-outline" size={64} color={currentTheme.textSecondary} />
            <Text style={{ 
              marginTop: 16, 
              fontSize: 16, 
              fontWeight: "600", 
              color: currentTheme.text 
            }}>
              No Favorites Yet
            </Text>
            <Text style={{ 
              marginTop: 8, 
              color: currentTheme.textSecondary, 
              fontSize: 14,
              textAlign: "center",
            }}>
              Tap the star icon on any model to add it to your favorites.
            </Text>
          </View>
        ) : (
          <ModelList models={favorites} />
        )}
      </View>
    </View>
  );
}