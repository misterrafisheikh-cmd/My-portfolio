import Navbar from "./components/Navbar.jsx";
import Rain from "./components/Rain.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import CursorHalo from "./components/CursorHalo.jsx";
import Toast from "./components/Toast.jsx";

// Add a new section by importing it here and dropping it in the order
// you want it to appear. See README.md for the full walkthrough.
export default function App() {
  return (
    <>
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
      <Toast />
    </>
  );
}
