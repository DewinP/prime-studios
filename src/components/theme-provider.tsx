"use client";

import { createContext, useContext, useEffect } from "react";
import { theme, themeCSSVariables, themeClasses } from "@/lib/theme";

interface ThemeContextType {
  theme: typeof theme;
  themeClasses: typeof themeClasses;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Ensure dark mode is always applied
    const html = document.documentElement;
    html.classList.add("dark");

    // Apply theme CSS variables
    Object.entries(themeCSSVariables).forEach(([property, value]) => {
      html.style.setProperty(property, value);
    });

    // Prevent theme switching by monitoring for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target as HTMLElement;
          if (!target.classList.contains("dark")) {
            target.classList.add("dark");
          }
        }
      });
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const contextValue: ThemeContextType = {
    theme,
    themeClasses,
    isDark: true, // Always dark mode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Hook for getting theme colors
export function useThemeColor(
  category: keyof typeof theme.colors,
  variant: string,
) {
  const { theme } = useTheme();
  return (
    theme.colors[category][
      variant as keyof (typeof theme.colors)[typeof category]
    ] || ""
  );
}

// Hook for getting theme classes
export function useThemeClasses() {
  const { themeClasses } = useTheme();
  return themeClasses;
}
