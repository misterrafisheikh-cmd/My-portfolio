import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { defaultContent } from "../lib/defaultContent.js";

const BASE = import.meta.env.VITE_API_URL || "";
const ContentContext = createContext(null);

// Fetches the live site content once on load. Every section component
// reads from here via useContent() instead of static data files, so
// editing something in the admin dashboard shows up on the site on the
// next refresh — no redeploy needed.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loaded, setLoaded] = useState(false);

  const refetch = useCallback(() => {
    fetch(`${BASE}/api/content`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setContent(data))
      .catch(() => { /* keep defaultContent — the site still works offline */ })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(refetch, [refetch]);

  return <ContentContext.Provider value={{ content, loaded, refetch }}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext).content;
}
