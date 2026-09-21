// Add/remove projects by editing this array — the grid and filters
// on the Projects section pick up changes automatically.
// `category` must be one of: "web", "tool", "lab" (or add a new one
// and register it in Projects.jsx's `filters` list).
export const projects = [

  
  {
    id: "coming-soon",
  title: "Projects Coming Soon",
  year: "2026",
  category: "learning",
  description:
    "Currently building full-stack MERN applications and AI/ML projects. New projects will be added as they are completed.",
  stack: ["React", "Node.js", "MongoDB", "AI/ML"],
    link: "#contact",
  },
  // {
  //   id: "cipher",
  //   title: "Cipher",
  //   year: "2025",
  //   category: "tool",
  //   description:
  //     "Browser-only file encryption. Keys never leave the tab, nothing hits a server, and the whole thing is small enough to audit in an afternoon.",
  //   stack: ["WebCrypto", "Vite", "IndexedDB"],
  //   link: "#contact",
  // },
  // {
  //   id: "harmonic",
  //   title: "Harmonic",
  //   year: "2025",
  //   category: "lab",
  //   description:
  //     "A teaching toy for Fourier series. Drag any waveform and watch the epicycles rearrange themselves to draw it back.",
  //   stack: ["Canvas", "DSP", "Web Audio"],
  //   link: "#contact",
  // },
  // {
  //   id: "nokta",
  //   title: "Nokta Commerce",
  //   year: "2024",
  //   category: "web",
  //   description:
  //     "Storefront and admin for a local retailer moving online for the first time. Checkout went from a four-page form to one screen.",
  //   stack: ["React", "Node", "Stripe", "Redis"],
  //   link: "#contact",
  // },
  // {
  //   id: "sentry-lite",
  //   title: "Sentry Lite",
  //   year: "2024",
  //   category: "tool",
  //   description:
  //     "A self-hosted uptime and error monitor for teams too small to justify a monitoring bill.",
  //   stack: ["Python", "FastAPI", "Docker"],
  //   link: "#contact",
  // },
  // {
  //   id: "glyph",
  //   title: "Glyph",
  //   year: "2023",
  //   category: "lab",
  //   description:
  //     "A generative type experiment that grows letterforms from particle flow fields.",
  //   stack: ["WebGL", "GLSL", "Canvas"],
  //   link: "#contact",
  // },
];

export const filters = [
  { key: "all", label: "Everything" },
  { key: "web", label: "Web apps" },
  { key: "tool", label: "Tools" },
  { key: "lab", label: "Experiments" },
];
