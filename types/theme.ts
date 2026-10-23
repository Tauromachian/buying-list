export const themes = ["light", "system", "dark"] as const;

export type ThemeName = (typeof themes)[number];
export type ResolvedTheme = Exclude<ThemeName, "system">;
export type ThemeState = {
  theme: ThemeName;
  initTheme: () => void;
  setTheme: (newTheme: ThemeName) => void;
};
