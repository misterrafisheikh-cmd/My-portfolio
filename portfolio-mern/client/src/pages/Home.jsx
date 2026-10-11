// ============================================================
// Home — the main one-page portfolio: every section in the order they
// appear on screen. Edit this file to add a whole new hand-built
// section (sections added from the admin "Sections" tab need no code).
// Content, theme and the shared frame come from PageShell/App.
// ============================================================
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
import ExtraSections from "../components/ExtraSections.jsx";
import Contact from "../components/Contact.jsx";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ExtraSections />
      <Contact />
    </PageShell>
  );
}
