export const theme = {
  light: {
    background: "#fff",
    surface: "#f5f5f5",
    text: "#000",
    textSecondary: "#666",
    border: "#e0e0e0",
    input: "#fff",
  },
  dark: {
    background: "#1a1a1a",
    surface: "#2d2d2d",
    text: "#fff",
    textSecondary: "#999",
    border: "#444",
    input: "#333",
  },
};

export const getTheme = (isDarkMode: boolean) => isDarkMode ? theme.dark : theme.light;
