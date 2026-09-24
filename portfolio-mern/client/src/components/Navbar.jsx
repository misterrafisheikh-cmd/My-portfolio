// ============================================================
// Navbar — the sticky bar at the top of the site.
// What it does, in order:
//  1. Builds the list of nav links (fixed ones + one per admin-added
//     "Section" from the dashboard).
//  2. Watches scroll position to know which section is "active" (for
//     the underline) and whether to shrink the bar.
//  3. Renders the bar itself: logo, links, clock, theme toggle,
//     mobile menu button, "Hire Me" button, and the animated sea-wave
//     edge at the bottom (Rain.jsx uses that wave's position to know
//     where to start falling from).
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useScrollProgress } from "../hooks/useScrollProgress.js";
import { useContent } from "../context/ContentContext.jsx";
import { navLinks as staticLinks } from "../data/links.js";
import Clock from "./Clock.jsx";

export default function Navbar() {
  const { theme, toggle } = useTheme();           // dark/light mode + the function to flip it
  const { scrolled } = useScrollProgress();        // true once the page has scrolled a bit (shrinks the bar)
  const { extraSections } = useContent();          // any sections the admin added from the dashboard
  const [open, setOpen] = useState(false);         // is the mobile dropdown menu open?
  const [active, setActive] = useState("home");    // which section id is currently in view

  // Build the final link list: the fixed ones (Home/About/Skills/
  // Projects/Contact) from data/links.js, plus one extra link for
  // every admin-added section — inserted right before Contact so the
  // nav order matches the order sections actually appear on the page
  // (see pages/Home.jsx). useMemo just means "only recalculate this
  // when extraSections actually changes", not on every render.
  const navLinks = useMemo(() => {
    const links = [...staticLinks];
    const contactIndex = links.findIndex((l) => l.href === "#contact");
    const extraLinks = (extraSections || []).map((s) => ({ href: `#section-${s.id}`, label: s.title || "Section" }));
    links.splice(contactIndex === -1 ? links.length : contactIndex, 0, ...extraLinks);
    return links;
  }, [extraSections]);

  // Scroll-spy: every scroll event, check which section's top has
  // passed a point near the top of the screen, and mark that link
  // "active" (gives it the underline). Re-runs if navLinks changes,
  // e.g. once admin-added sections finish loading.
  useEffect(() => {
    const sections = navLinks.map((l) => document.getElementById(l.href.slice(1))).filter(Boolean);
    const onScroll = () => {
      let current = sections[0]?.id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.36) current = s.id;
      }
      if (current) setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [navLinks]);

  return (
    <header className="fixed left-0 right-0 top-0 z-[80]">
      {/* The "sea" band — a gradient background plus a drifting light-streak layer */}
      <div
        className="relative shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)", // keeps content clear of a phone's notch/status bar
          background: "linear-gradient(180deg, var(--sea-deep) 0%, var(--sea-mid) 58%, var(--sea-fore) 100%)",
        }}
      >
        {/* drifting light streaks inside the water body — purely decorative */}
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-current"
          style={{
            background:
              "linear-gradient(100deg, transparent 0 42%, rgba(255,255,255,.055) 50%, transparent 58% 100%), linear-gradient(80deg, transparent 0 62%, rgba(255,255,255,.04) 70%, transparent 78% 100%)",
            backgroundSize: "220% 100%, 180% 100%",
          }}
        />

        {/* The actual bar: logo — links — clock/theme/menu/hire-me */}
        <div
          className={`relative z-[2] mx-auto flex w-[min(1180px,100%-44px)] items-center gap-1.5 transition-[padding] duration-300 ${
            scrolled ? "py-2.5" : "py-4"
          }`}
        >
          {/* Site name / logo — jumps to the top of the page */}
          <a href="#home" className="mr-3.5 whitespace-nowrap text-[1.02rem] font-bold tracking-tight">
            Rafi Sheikh{" "}
            <span className="font-mono" style={{ color: "var(--blue)" }}>
              "<i className="animate-blink not-italic">_</i>"
            </span>
          </a>

          {/* Nav links. On phones this becomes a dropdown (see the max-md: classes)
              that opens below the bar when the hamburger button is tapped. */}
          <nav
            className={`flex items-center gap-0.5 max-md:absolute max-md:left-0 max-md:right-0 max-md:top-[calc(100%+10px)] max-md:flex-col max-md:items-stretch max-md:gap-0.5 max-md:rounded-[20px] max-md:border max-md:p-2.5 max-md:shadow-[var(--shadow)] max-md:transition-all max-md:duration-200 ${
              open ? "max-md:pointer-events-auto max-md:opacity-100" : "max-md:pointer-events-none max-md:-translate-y-2 max-md:opacity-0"
            }`}
            style={{ borderColor: "var(--line)", background: "var(--panel-solid)" }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)} // closes the mobile dropdown after tapping a link
                className="relative rounded-full px-3.5 py-2 text-[0.925rem] transition-colors"
                style={{ color: active === l.href.slice(1) ? "var(--text)" : "var(--muted)" }}
              >
                {l.label}
                {active === l.href.slice(1) && (
                  <span
                    className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded max-md:left-3.5 max-md:right-auto max-md:w-4"
                    style={{ background: "var(--phase)" }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right-hand cluster: live clock, dark/light toggle, mobile menu button, Hire Me */}
          <div className="ml-2 flex items-center gap-3">
            <Clock />

            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="grid h-[38px] w-[38px] place-items-center rounded-full border transition-transform hover:rotate-[18deg]"
              style={{ borderColor: "var(--line)", color: "var(--muted)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </button>

            {/* Hamburger — only visible on phones (md:hidden is on the nav's mobile
                classes above; this button itself is hidden on desktop via CSS below) */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-[38px] w-[38px] place-items-center rounded-full border md:hidden"
              style={{ borderColor: "var(--line)", color: "var(--muted)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <a
              href="#contact"
              className="whitespace-nowrap rounded-full px-5 py-2.5 text-[0.93rem] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(47,107,255,.85)] transition-transform hover:-translate-y-0.5 max-md:hidden"
              style={{ background: "linear-gradient(135deg,#2f6bff,#6aa0ff)" }}
            >
              Hire Me
            </a>
          </div>
        </div>

        {/* The animated sea-wave edge at the bottom of the bar.
            data-wave-edge is how Rain.jsx finds this element's position,
            so its raindrops start falling from exactly here. */}
        <div data-wave-edge className="pointer-events-none absolute left-0 right-0 top-full h-14 animate-swell overflow-hidden">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path
              className="animate-driftA"
              fill="var(--sea-wave-a)"
              d="M0,34 C76,51 134,51 210,34 C286,17 344,17 420,34 C496,51 554,51 630,34 C706,17 764,17 840,34 C916,51 974,51 1050,34 C1126,17 1184,17 1260,34 C1336,51 1394,51 1470,34 C1546,17 1604,17 1680,34 C1756,51 1814,51 1890,34 C1966,17 2024,17 2100,34 C2176,51 2234,51 2310,34 C2386,17 2444,17 2520,34 C2596,51 2654,51 2730,34 L2880,0 L0,0 Z"
            />
            <path
              className="animate-driftB"
              fill="var(--sea-wave-b)"
              d="M0,40 C58,28 102,28 160,40 C218,52 262,52 320,40 C378,28 422,28 480,40 C538,52 582,52 640,40 C698,28 742,28 800,40 C858,52 902,52 960,40 C1018,28 1062,28 1120,40 C1178,52 1222,52 1280,40 C1338,28 1382,28 1440,40 C1498,52 1542,52 1600,40 C1658,28 1702,28 1760,40 C1818,52 1862,52 1920,40 C1978,28 2022,28 2080,40 C2138,52 2182,52 2240,40 C2298,28 2342,28 2400,40 C2458,52 2502,52 2560,40 C2618,28 2662,28 2720,40 C2778,52 2822,52 2880,40 L2880,0 L0,0 Z"
            />
            <path
              className="animate-driftC"
              fill="var(--sea-fore)"
              d="M0,46 C101,55 179,55 280,46 C381,37 459,37 560,46 C661,55 739,55 840,46 C941,37 1019,37 1120,46 C1221,55 1299,55 1400,46 C1501,37 1579,37 1680,46 C1781,55 1859,55 1960,46 C2061,37 2139,37 2240,46 C2341,55 2419,55 2520,46 C2621,37 2699,37 2800,46 L2880,0 L0,0 Z"
            />
            <path
              className="animate-driftC"
              fill="none"
              stroke="var(--sea-foam)"
              strokeWidth="1.4"
              d="M0,46 C101,55 179,55 280,46 C381,37 459,37 560,46 C661,55 739,55 840,46 C941,37 1019,37 1120,46 C1221,55 1299,55 1400,46 C1501,37 1579,37 1680,46 C1781,55 1859,55 1960,46 C2061,37 2139,37 2240,46 C2341,55 2419,55 2520,46 C2621,37 2699,37 2800,46"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
