// ============================================================
// ScrollToHash — when you move between pages (or click "/#about"
// from another page) this scrolls to the right place: the section
// if the URL has a #hash, otherwise the top of the new page.
// ============================================================
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return undefined; }
    // wait a tick so the target section has rendered
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}
