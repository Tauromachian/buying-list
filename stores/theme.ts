import { create } from "zustand";

import { themes, ThemeName, ResolvedTheme, ThemeState } from "@/types/theme";

const STORAGE_KEY = "theme";

function isTheme(possibleTheme?: string | null): possibleTheme is ThemeName {
  if (possibleTheme == null) return false;

  return (themes as readonly string[]).includes(possibleTheme);
}

function ensureTheme(possibleTheme?: string | null): ThemeName {
  if (!isTheme(possibleTheme)) return "system";

  return possibleTheme;
}

function applyTheme(preferred: ThemeName) {
  const resolved: ResolvedTheme =
    preferred === "system"
      ? getMatchMedia().matches
        ? "dark"
        : "light"
      : preferred;

  const html = document.querySelector("html");
  html?.setAttribute("data-theme", resolved);
}

function getMatchMedia() {
  return window.matchMedia("(prefers-color-scheme: dark)");
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  initTheme: () => {
    const theme = ensureTheme(localStorage.getItem(STORAGE_KEY));
    applyTheme(theme);
    set({ theme });

    getMatchMedia().addEventListener("change", () => {
      if (theme !== "system") return;

      applyTheme("system");
    });
  },
  setTheme: (theme: ThemeName) => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    set({ theme });
  },
}));
