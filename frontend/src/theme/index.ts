import { DefaultTheme } from "react-native-paper"

export const colors = {
  primary: "#4F46E5",
  secondary: "#10B981",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  error: "#EF4444",
  text: "#1F2937",
  disabled: "#9CA3AF",
  placeholder: "#6B7280",
  backdrop: "rgba(0, 0, 0, 0.5)",
  notification: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
}

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
    notification: colors.notification,
  },
  roundness: 8,
}

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
}

export const fontSizes = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
}

export const fontWeights = {
  regular: "400",
  medium: "500",
  bold: "700",
}
