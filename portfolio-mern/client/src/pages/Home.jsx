import { ContentProvider } from "../context/ContentContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Rain from "../components/Rain.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
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
      <ScrollProgress />
      <CursorHalo />
      <Rain />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ContentProvider>
  );
}
