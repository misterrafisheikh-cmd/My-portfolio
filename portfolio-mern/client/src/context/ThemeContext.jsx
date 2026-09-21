import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// Reads/writes localStorage directly (not the artifact "window.storage" API —
// this is a normal deployed site, so plain browser storage is correct here).
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("rs-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("rs-theme", theme);
    } catch {
      /* storage unavailable — theme just won't persist */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
