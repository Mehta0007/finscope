import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "finscope-theme";

const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () =>
      setTheme((currentTheme) =>
        currentTheme === "dark" ? "light" : "dark",
      ),
  };
};
