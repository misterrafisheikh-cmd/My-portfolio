import { useEffect } from "react";
import { useContent } from "../context/ContentContext.jsx";

// Converts a "#rrggbb" hex color into "r, g, b" text, so we can build
// an rgba() string for the softer/translucent version of the color
// (used behind buttons, badges, etc.) at whatever opacity we want.
function hexToRgb(hex) {
  const clean = (hex || "").replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num) || full.length !== 6) return "79, 141, 255"; // fallback: the default blue
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

// This component renders nothing on screen — its only job is to read
// the site's chosen colors (set from /admin/content's "Theme" tab) and
// push them onto the page as CSS variables. Because it sets them with
// plain JavaScript (element.style.setProperty), these values override
// the defaults written in index.css, on top of whichever light/dark
// theme is active — so admin colors always win, in both modes.
export default function ThemeVars() {
  const { theme } = useContent();

  useEffect(() => {
    const root = document.documentElement;
    if (theme?.accent) {
      root.style.setProperty("--blue", theme.accent);
      root.style.setProperty("--blue-soft", `rgba(${hexToRgb(theme.accent)}, 0.16)`);
    }
    if (theme?.signal) root.style.setProperty("--signal", theme.signal);
    if (theme?.phase) root.style.setProperty("--phase", theme.phase);
  }, [theme]);

  return null;
}
