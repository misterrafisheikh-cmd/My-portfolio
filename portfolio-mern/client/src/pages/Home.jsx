// ============================================================
// Home — the actual public-facing portfolio page: every section in
// the order they appear on screen. This is the file to edit if you
// want to add a whole new hand-built section (as opposed to one added
// from the admin dashboard's "Sections" tab, which needs no code).
// ContentProvider at the top fetches all editable text/colors once and
// makes it available to every section below via useContent().
// ============================================================
import { ContentProvider } from "../context/ContentContext.jsx";
import ThemeVars from "../components/ThemeVars.jsx";
import Navbar from "../components/Navbar.jsx";
import Rain from "../components/Rain.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
import ExtraSections from "../components/ExtraSections.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import ScrollProgress from "../components/ScrollProgress.jsx";
import CursorHalo from "../components/CursorHalo.jsx";

// The public-facing portfolio page — everything that used to live
// directly in App.jsx. Add a new section here (see README.md).
// ContentProvider fetches the editable site content once and hands it
// to every child via useContent().
export default function Home() {
  return (
    <ContentProvider>
      <ThemeVars />
      <ScrollProgress />
      <CursorHalo />
      <Rain />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <ExtraSections />
        <Contact />
      </main>
      <Footer />
    </ContentProvider>
  );
}
