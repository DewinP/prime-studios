// Centralized theme configuration for dark mode
export const theme = {
  colors: {
    // Background colors
    background: {
      primary: "oklch(0.08 0 0)", // Very dark background
      secondary: "oklch(0.12 0 0)", // Slightly lighter background
      tertiary: "oklch(0.16 0 0)", // Card backgrounds
      elevated: "oklch(0.20 0 0)", // Elevated surfaces
    },

    // Text colors
    text: {
      primary: "oklch(0.95 0 0)", // Primary text
      secondary: "oklch(0.75 0 0)", // Secondary text
      muted: "oklch(0.60 0 0)", // Muted text
      inverse: "oklch(0.08 0 0)", // Text on primary colors
    },

    // Brand colors
    brand: {
      primary: "#e5a629", // Gold primary
      secondary: "#ffd700", // Bright gold
      accent: "#f4c430", // Accent gold
    },

    // Status colors
    status: {
      success: "oklch(0.65 0.15 142)", // Green
      warning: "oklch(0.75 0.15 85)", // Orange
      error: "oklch(0.65 0.25 25)", // Red
      info: "oklch(0.65 0.15 220)", // Blue
    },

    // Border and divider colors
    border: {
      primary: "oklch(0.25 0 0)", // Primary borders
      secondary: "oklch(0.20 0 0)", // Secondary borders
      subtle: "oklch(0.15 0 0)", // Subtle borders
    },

    // Interactive colors
    interactive: {
      hover: "oklch(0.18 0 0)", // Hover states
      active: "oklch(0.22 0 0)", // Active states
      focus: "oklch(0.25 0 0)", // Focus states
    },

    // Overlay colors
    overlay: {
      backdrop: "oklch(0 0 0 / 0.5)", // Backdrop overlay
      modal: "oklch(0 0 0 / 0.8)", // Modal overlay
    },
  },

  // Spacing scale
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  // Border radius
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 oklch(0 0 0 / 0.05)",
    md: "0 4px 6px -1px oklch(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px oklch(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px oklch(0 0 0 / 0.1)",
  },

  // Transitions
  transitions: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },
} as const;

// Utility function to get theme colors
export function getThemeColor(
  category: keyof typeof theme.colors,
  variant: string,
): string {
  return (
    theme.colors[category][
      variant as keyof (typeof theme.colors)[typeof category]
    ] || ""
  );
}

// CSS custom properties for the theme
export const themeCSSVariables = {
  // Background
  "--background": theme.colors.background.primary,
  "--background-secondary": theme.colors.background.secondary,
  "--background-tertiary": theme.colors.background.tertiary,
  "--background-elevated": theme.colors.background.elevated,

  // Text
  "--foreground": theme.colors.text.primary,
  "--foreground-secondary": theme.colors.text.secondary,
  "--foreground-muted": theme.colors.text.muted,
  "--foreground-inverse": theme.colors.text.inverse,

  // Brand
  "--primary": theme.colors.brand.primary,
  "--primary-foreground": theme.colors.text.inverse,
  "--secondary": theme.colors.brand.secondary,
  "--secondary-foreground": theme.colors.text.inverse,
  "--accent": theme.colors.brand.accent,
  "--accent-foreground": theme.colors.text.inverse,

  // Status
  "--success": theme.colors.status.success,
  "--warning": theme.colors.status.warning,
  "--error": theme.colors.status.error,
  "--info": theme.colors.status.info,

  // Interactive
  "--muted": theme.colors.interactive.hover,
  "--muted-foreground": theme.colors.text.muted,

  // Borders
  "--border": theme.colors.border.primary,
  "--border-secondary": theme.colors.border.secondary,
  "--border-subtle": theme.colors.border.subtle,

  // Input
  "--input": theme.colors.background.tertiary,
  "--ring": theme.colors.brand.primary,

  // Card
  "--card": theme.colors.background.tertiary,
  "--card-foreground": theme.colors.text.primary,

  // Popover
  "--popover": theme.colors.background.elevated,
  "--popover-foreground": theme.colors.text.primary,

  // Destructive
  "--destructive": theme.colors.status.error,
  "--destructive-foreground": theme.colors.text.primary,

  // Sidebar
  "--sidebar": theme.colors.background.secondary,
  "--sidebar-foreground": theme.colors.text.primary,
  "--sidebar-primary": theme.colors.brand.primary,
  "--sidebar-primary-foreground": theme.colors.text.inverse,
  "--sidebar-accent": theme.colors.interactive.hover,
  "--sidebar-accent-foreground": theme.colors.text.primary,
  "--sidebar-border": theme.colors.border.primary,
  "--sidebar-ring": theme.colors.brand.primary,

  // Charts
  "--chart-1": theme.colors.brand.primary,
  "--chart-2": theme.colors.brand.secondary,
  "--chart-3": theme.colors.status.info,
  "--chart-4": theme.colors.status.success,
  "--chart-5": theme.colors.status.warning,
} as const;

// Tailwind CSS classes that use our theme
export const themeClasses = {
  // Backgrounds
  bgPrimary: "bg-background",
  bgSecondary: "bg-muted",
  bgTertiary: "bg-card",
  bgElevated: "bg-popover",

  // Text
  textPrimary: "text-foreground",
  textSecondary: "text-muted-foreground",
  textMuted: "text-muted-foreground",
  textBrand: "text-primary",

  // Borders
  borderPrimary: "border-border",
  borderSecondary: "border-border/50",
  borderSubtle: "border-border/25",

  // Interactive
  hoverBg: "hover:bg-muted/50",
  activeBg: "active:bg-muted",
  focusRing:
    "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",

  // Transitions
  transition: "transition-all duration-200 ease-in-out",
  transitionFast: "transition-all duration-150 ease-in-out",
  transitionSlow: "transition-all duration-300 ease-in-out",
} as const;
