// ============================================================
// PageShell — the shared frame every public page sits in: theme
// colors, scroll bar, cursor glow, rain, the top navbar and footer.
// Home and every "own page" section (like /research) use this so
// they look consistent.
// ============================================================
import ThemeVars from "./ThemeVars.jsx";
import Navbar from "./Navbar.jsx";
import Rain from "./Rain.jsx";
import Footer from "./Footer.jsx";
import ScrollProgress from "./ScrollProgress.jsx";
import CursorHalo from "./CursorHalo.jsx";

export default function PageShell({ children }) {
  return (
    <>
      <ThemeVars />
      <ScrollProgress />
      <CursorHalo />
      <Rain />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
