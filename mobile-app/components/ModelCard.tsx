import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Model } from "../types/models";
import { useCompare, useFilters, useFavorites } from "../stores/useFilters";
import { getTheme } from "../lib/theme";
import ShareButton from "./ShareButton";

interface ModelCardProps {
  model: Model;
  highlight?: boolean;
  onPress?: () => void;
}

export default function ModelCard({ model, highlight, onPress }: ModelCardProps) {
  const { selectedModels, addModel, removeModel } = useCompare();
  const { isDarkMode } = useFilters();
  const { favorites, toggleFavorite } = useFavorites();
  const currentTheme = getTheme(isDarkMode);
  const isSelected = selectedModels.some(m => m.id === model.id);
  const isFavorited = favorites.some(m => m.id === model.id);
  const canSelect = selectedModels.length < 3 || isSelected;

  const handleToggle = () => {
    if (isSelected) {
      removeModel(model.id);
    } else if (canSelect) {
      addModel(model);
    }
  };

  const handleFavorite = () => {
    toggleFavorite(model);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const selectedBgColor = isDarkMode ? "#1a3a5c" : "#e3f2fd";
  const cardBgColor = isSelected ? selectedBgColor : currentTheme.surface;
  const selectedBorderColor = "#2196f3";
  const cardBorderColor = highlight ? "gold" : isSelected ? selectedBorderColor : currentTheme.border;

  const getProviderIcon = (provider: string) => {
    const lower = provider.toLowerCase();
    if (lower.includes("openai")) return "logo-openai";
    if (lower.includes("anthropic")) return "person";
    if (lower.includes("google")) return "logo-google";
    if (lower.includes("mistral")) return "cloud";
    if (lower.includes("meta")) return "logo-facebook";
    if (lower.includes("amazon")) return "cloud";
    return "server";
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      style={{ 
      padding: 16, 
      marginHorizontal: 12, 
      marginVertical: 6,
      backgroundColor: cardBgColor, 
      borderRadius: 12,
      borderWidth: highlight ? 2 : 1,
      borderColor: cardBorderColor,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ 
              backgroundColor: isDarkMode ? "#333" : "#f0f0f0", 
              padding: 8, 
              borderRadius: 8 
            }}>
              <Ionicons 
                name={getProviderIcon(model.provider) as any} 
                size={20} 
                color={isDarkMode ? "#fff" : "#333"} 
              />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: currentTheme.text }}>{model.name}</Text>
              <Text style={{ fontSize: 13, color: currentTheme.textSecondary, marginTop: 2 }}>{model.provider}</Text>
            </View>
          </View>
        </View>
        
        <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
          <TouchableOpacity onPress={handleFavorite} style={{ padding: 4 }}>
            <Ionicons 
              name={isFavorited ? "star" : "star-outline"} 
              size={22} 
              color={isFavorited ? "#f59e0b" : currentTheme.textSecondary} 
            />
          </TouchableOpacity>
          {model.free_tier && (
            <View style={{ 
              backgroundColor: "#22c55e20", 
              paddingHorizontal: 8, 
              paddingVertical: 4, 
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}>
              <Ionicons name="gift" size={12} color="#22c55e" />
              <Text style={{ fontSize: 11, color: "#22c55e", fontWeight: "600" }}>Free</Text>
            </View>
          )}
        </View>
      </View>
      
      {model.pricing && (
        <View style={{ marginTop: 12, flexDirection: "row", gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="enter" size={14} color={currentTheme.textSecondary} />
            <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
              ${model.pricing.input_cost_per_1k}/1k
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="exit" size={14} color={currentTheme.textSecondary} />
            <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
              ${model.pricing.output_cost_per_1k}/1k
            </Text>
          </View>
        </View>
      )}
      
      {model.context_window && (
        <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="document-text" size={14} color={currentTheme.textSecondary} />
          <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
            {model.context_window.toLocaleString()} tokens
          </Text>
        </View>
      )}
      
      {model.capabilities && model.capabilities.length > 0 && (
        <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          {model.capabilities.slice(0, 3).map((cap, i) => (
            <View key={i} style={{ 
              backgroundColor: isDarkMode ? "#333" : "#eee", 
              paddingHorizontal: 8, 
              paddingVertical: 3, 
              borderRadius: 6 
            }}>
              <Text style={{ fontSize: 10, color: currentTheme.textSecondary }}>{cap}</Text>
            </View>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        onPress={handleToggle}
        disabled={!canSelect}
        style={{ 
          marginTop: 12,
          backgroundColor: isSelected ? "#ef4444" : "#007AFF",
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
          opacity: canSelect ? 1 : 0.5,
        }}
      >
        <Ionicons 
          name={isSelected ? "close" : "git-compare"} 
          size={16} 
          color="#fff" 
        />
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
          {isSelected ? "Remove" : canSelect ? "Compare" : "Full (3/3)"}
        </Text>
      </TouchableOpacity>

      <ShareButton model={model} />
    </TouchableOpacity>
  );
}