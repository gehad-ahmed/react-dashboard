import type { CSSProperties } from "react";

export const colors = {
  bgDeep: "#0f172a",
  panel: "#1e293b",
  border: "#334155",
  text: "#e2e8f0",
  muted: "#94a3b8",
  cyan: "#6EE7F7",
  purple: "#A78BFA",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
} as const;

export const chartColors = [
  colors.cyan,
  colors.purple,
  colors.green,
  colors.amber,
  colors.red,
];

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 20,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 30,
} as const;

export const panelStyle: CSSProperties = {
  backgroundColor: colors.panel,
  borderRadius: radius.md,
  padding: spacing.xl,
};

// --- Polish tokens (additive) -------------------------------------------
// Soft elevation shadows for panels/toasts.
export const shadow = {
  sm: "0 1px 2px rgba(0,0,0,0.25)",
  md: "0 4px 14px rgba(0,0,0,0.35)",
  lg: "0 10px 30px rgba(0,0,0,0.45)",
} as const;

// Standard easing/duration for interactive transitions.
export const transitions = {
  fast: "0.15s ease",
  base: "0.2s ease",
} as const;

// Focus ring color derived from the cyan accent (used by inputs/buttons).
export const focusRing = `${colors.cyan}55`;

// Subtle hover tint for interactive table rows.
export const rowHoverBg = "rgba(110,231,247,0.06)";
