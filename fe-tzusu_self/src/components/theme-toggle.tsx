"use client";

import { setTheme, useTheme } from "@/components/theme-provider";

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const theme = useTheme();

  return (
    <div
      aria-label="Che do mau"
      className={`theme-toggle ${compact ? "theme-toggle-compact" : ""}`}
      role="group"
    >
      <button
        aria-pressed={theme === "light"}
        className={theme === "light" ? "is-active" : ""}
        onClick={() => setTheme("light")}
        type="button"
      >
        Light
      </button>
      <button
        aria-pressed={theme === "dark"}
        className={theme === "dark" ? "is-active" : ""}
        onClick={() => setTheme("dark")}
        type="button"
      >
        Dark
      </button>
    </div>
  );
}
