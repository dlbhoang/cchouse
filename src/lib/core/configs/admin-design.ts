import type { CSSProperties } from "react";

/** Shared values from the four Admin Figma sections. */
export const adminDesignTheme = {
  colorPrimary: "#0588f0",
  colorPrimaryHover: "#0d74ce",
  colorPrimaryActive: "#0d74ce",
  colorText: "#0a0a0a",
  colorTextPlaceholder: "#a1a1aa",
  colorBorder: "#e5e5e5",
  borderRadius: 10,
  controlHeight: 40,
  fontFamily: "Inter, sans-serif",
};

export const adminDesignVariables = {
  "--primary": adminDesignTheme.colorPrimary,
  "--primary-foreground": "#ffffff",
  "--ring": adminDesignTheme.colorPrimary,
  "--admin-brand": adminDesignTheme.colorPrimary,
  "--admin-brand-hover": adminDesignTheme.colorPrimaryHover,
  "--admin-text": adminDesignTheme.colorText,
  "--admin-muted": "#737373",
  "--admin-subtle": adminDesignTheme.colorTextPlaceholder,
  "--admin-border": adminDesignTheme.colorBorder,
  "--admin-surface": "#ffffff",
  "--admin-background": "#fbfbfd",
  "--admin-section": "#dbeafe",
  "--admin-selected": "#eff6ff",
  "--admin-font": adminDesignTheme.fontFamily,
  "--Text-Main": adminDesignTheme.colorText,
  "--Brand-Main": adminDesignTheme.colorPrimary,
  "--Font-family-Text": "Inter",
} as CSSProperties;
