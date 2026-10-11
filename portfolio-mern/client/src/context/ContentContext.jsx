// ============================================================
// ContentContext — loads the site's editable content and shares it
// with every component through useContent().
//
// FAST LOAD TRICK ("stale-while-revalidate"): the last content the
// visitor saw is kept in their browser (localStorage). On the next
// visit the page paints INSTANTLY from that copy, and the fresh copy
// is fetched quietly in the background and swapped in. So even if the
// free Render server is asleep, visitors never stare at a blank page.
// ============================================================
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { defaultContent } from "../lib/defaultContent.js";

const BASE = import.meta.env.VITE_API_URL || "";
const CACHE_KEY = "rs-content-cache-v1";
const ContentContext = createContext(null);

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ContentProvider({ children }) {
  // Start from cache (if any) layered over the built-in defaults.
  const [content, setContent] = useState(() => ({ ...defaultContent, ...(readCache() || {}) }));
  const [loaded, setLoaded] = useState(() => !!readCache());

  // refetch(): ask the server for the latest. `no-cache` forces a
  // revalidation so edits made in admin show up right away.
  const refetch = useCallback(() => {
    fetch(`${BASE}/api/content`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setContent({ ...defaultContent, ...data });
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* storage full/blocked: fine */ }
      })
      .catch(() => { /* keep what we have — the site still works */ })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(refetch, [refetch]);

  const value = useMemo(() => ({ content, loaded, refetch }), [content, loaded, refetch]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext).content;
}

// For components that also need to know if the first load finished.
export function useContentApi() {
  return useContext(ContentContext);
}
