import { View, Text, TouchableOpacity, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Model } from "../types/models";
import { useCompare, useFilters, useFavorites } from "../stores/useFilters";
import { getTheme } from "../lib/theme";
import { spacing, radius, shadows, transitions, typography } from "../lib/tokens";
import ShareButton from "./ShareButton";
import React from "react";

interface ModelCardProps {
  model: Model;
  highlight?: boolean;
  onPress?: () => void;
}

const ModelCard = React.memo(function ModelCard({ model, highlight, onPress }: ModelCardProps) {
  const { selectedModels, addModel, removeModel } = useCompare();
  const { isDarkMode } = useFilters();
  const { favorites, toggleFavorite } = useFavorites();
  const currentTheme = getTheme(isDarkMode);
  const isSelected = selectedModels.some(m => m.id === model.id);
  const isFavorited = favorites.some(m => m.id === model.id);
  const canSelect = selectedModels.length < 3 || isSelected;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isSelected) {
      removeModel(model.id);
    } else if (canSelect) {
      addModel(model);
    }
  };

  const handleFavorite = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        padding: spacing.md,
        marginHorizontal: spacing.md,
        marginVertical: spacing.sm,
        backgroundColor: cardBgColor,
        borderRadius: radius.md,
        borderWidth: highlight ? 2 : 1,
        borderColor: cardBorderColor,
        ...shadows.card,
        shadowOpacity: isDarkMode ? 0.3 : 0.1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <View style={{
              backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
              padding: spacing.sm,
              borderRadius: radius.sm,
            }}>
              <Ionicons
                name={getProviderIcon(model.provider) as any}
                size={20}
                color={isDarkMode ? "#fff" : "#333"}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.heading.fontSize, fontWeight: typography.heading.fontWeight, color: currentTheme.text }}>{model.name}</Text>
              <Text style={{ fontSize: 13, color: currentTheme.textSecondary, marginTop: 2 }}>{model.provider}</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" }}>
          <TouchableOpacity onPress={handleFavorite} style={{ padding: spacing.xs }}>
            <Ionicons
              name={isFavorited ? "star" : "star-outline"}
              size={22}
              color={isFavorited ? "#f59e0b" : currentTheme.textSecondary}
            />
          </TouchableOpacity>
          {model.free_tier && (
            <View style={{
              backgroundColor: "#22c55e20",
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: radius.sm,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}>
              <Ionicons name="gift" size={12} color="#22c55e" />
              <Text style={{ fontSize: typography.small.fontSize, color: "#22c55e", fontWeight: typography.small.fontWeight }}>Free</Text>
            </View>
          )}
        </View>
      </View>

      {model.pricing && (
        <View style={{ marginTop: spacing.md, flexDirection: "row", gap: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
            <Ionicons name="enter" size={14} color={currentTheme.textSecondary} />
            <Text style={{ fontSize: typography.caption.fontSize, color: currentTheme.textSecondary }}>
              ${model.pricing.input_cost_per_1k}/1k
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
            <Ionicons name="exit" size={14} color={currentTheme.textSecondary} />
            <Text style={{ fontSize: typography.caption.fontSize, color: currentTheme.textSecondary }}>
              ${model.pricing.output_cost_per_1k}/1k
            </Text>
          </View>
        </View>
      )}

      {model.context_window && (
        <View style={{ marginTop: spacing.sm, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
          <Ionicons name="document-text" size={14} color={currentTheme.textSecondary} />
          <Text style={{ fontSize: typography.caption.fontSize, color: currentTheme.textSecondary }}>
            {model.context_window.toLocaleString()} tokens
          </Text>
        </View>
      )}

      {model.capabilities && model.capabilities.length > 0 && (
        <View style={{ marginTop: spacing.sm, flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
          {model.capabilities.slice(0, 3).map((cap, i) => (
            <View key={i} style={{
              backgroundColor: isDarkMode ? "#333" : "#eee",
              paddingHorizontal: spacing.sm,
              paddingVertical: 3,
              borderRadius: radius.sm,
            }}>
              <Text style={{ fontSize: typography.small.fontSize, color: currentTheme.textSecondary }}>{cap}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={handleToggle}
        disabled={!canSelect}
        style={{
          marginTop: spacing.md,
          backgroundColor: isSelected ? "#ef4444" : "#007AFF",
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: spacing.sm,
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
});

export default ModelCard;
