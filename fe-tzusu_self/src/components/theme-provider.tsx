"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

export type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "tzusu-theme";
const THEME_EVENT = "tzusu-theme-change";

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(listener: () => void): () => void {
  window.addEventListener(THEME_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(THEME_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return children;
}
