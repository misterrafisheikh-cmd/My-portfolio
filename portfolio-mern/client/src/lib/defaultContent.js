// Used the instant the site loads, before the API call in ContentContext
// resolves — so there's never a blank flash. Once the fetch succeeds this
// is fully replaced by whatever's in the database. Keeping this in sync
// with server/models/Content.js defaults is nice-to-have, not required —
// it's just what's shown for the first split second, or if the API is
// ever unreachable.
export const defaultContent = {
  hero: {
    name: "Rafi Sheikh",
    roles: ["full-stack engineer", "interface builder", "systems tinkerer", "problem chaser"],
    lede: "I build web software the way a signal gets cleaned up: strip the noise, keep the shape, make every layer do one job well. Front-end that feels instant, back-end that holds under load.",
    cipherName: "K9XQ VF2MTP",
    cipherLede: "Payload sealed. AES-256-GCM, key held client-side. Press decrypt to restore the plaintext.",
  },
  about: {
    blurb: "Five years of shipping products that people actually open on a Monday morning.",
    identity: [
      { label: "Based in", value: "Dhaka, Bangladesh" },
      { label: "Focus", value: "Full-stack · Web" },
      { label: "Working since", value: "2021" },
      { label: "Availability", value: "Freelance / Full-time" },
    ],
    paragraphs: [
      "I started out writing small scripts to automate things I was bored of doing twice, and never really stopped. These days I spend most of my time on product teams — turning half-formed Figma files and vague Slack threads into interfaces that hold up under real traffic.",
      "The animation running behind the hero is a Fourier series: a square wave rebuilt out of nothing but spinning circles. Complicated behaviour is usually a stack of simple parts, layered in the right order, each one smaller than the last.",
      "When I'm not shipping, I'm reading about cryptography, breaking my own APIs on purpose, or losing an evening to a rendering bug I could have avoided.",
    ],
    stats: [
      { label: "projects shipped", value: 42, suffix: "" },
      { label: "years building", value: 5, suffix: "+" },
      { label: "happy clients", value: 18, suffix: "" },
    ],
  },
  skills: {
    groups: [
      { title: "Interface", subtitle: "What people touch", items: [
        { name: "React & Next.js", level: "expert", pct: 94 },
        { name: "TypeScript", level: "expert", pct: 90 },
        { name: "CSS & animation", level: "strong", pct: 88 },
        { name: "Canvas / WebGL", level: "working", pct: 72 },
      ]},
      { title: "Systems", subtitle: "What holds it up", items: [
        { name: "Node & Express", level: "expert", pct: 91 },
        { name: "MongoDB / Postgres", level: "strong", pct: 84 },
        { name: "Python", level: "strong", pct: 80 },
        { name: "Redis & queues", level: "working", pct: 70 },
      ]},
      { title: "Delivery", subtitle: "Getting it out the door", items: [
        { name: "Docker & CI", level: "strong", pct: 82 },
        { name: "AWS", level: "strong", pct: 76 },
        { name: "Testing", level: "strong", pct: 78 },
        { name: "Security basics", level: "working", pct: 74 },
      ]},
    ],
    marquee: ["React", "Next.js", "TypeScript", "Node", "MongoDB", "Express", "Tailwind", "Framer Motion", "Python", "FastAPI", "Docker", "AWS", "Redis", "GraphQL", "Vitest", "Figma"],
  },
  projects: [
    { id: "meridian", title: "Meridian Analytics", year: "2026", category: "web", description: "A reporting dashboard for a logistics company tracking 40k shipments a day. Streams live position data over websockets and renders it without dropping frames on a five-year-old laptop.", stack: ["Next.js", "TypeScript", "Postgres", "WebSocket"], link: "#contact" },
    { id: "cipher", title: "Cipher", year: "2025", category: "tool", description: "Browser-only file encryption. Keys never leave the tab, nothing hits a server, and the whole thing is small enough to audit in an afternoon.", stack: ["WebCrypto", "Vite", "IndexedDB"], link: "#contact" },
    { id: "harmonic", title: "Harmonic", year: "2025", category: "lab", description: "A teaching toy for Fourier series. Drag any waveform and watch the epicycles rearrange themselves to draw it back.", stack: ["Canvas", "DSP", "Web Audio"], link: "#contact" },
    { id: "nokta", title: "Nokta Commerce", year: "2024", category: "web", description: "Storefront and admin for a local retailer moving online for the first time. Checkout went from a four-page form to one screen.", stack: ["React", "Node", "Stripe", "Redis"], link: "#contact" },
    { id: "sentry-lite", title: "Sentry Lite", year: "2024", category: "tool", description: "A self-hosted uptime and error monitor for teams too small to justify a monitoring bill.", stack: ["Python", "FastAPI", "Docker"], link: "#contact" },
    { id: "glyph", title: "Glyph", year: "2023", category: "lab", description: "A generative type experiment that grows letterforms from particle flow fields.", stack: ["WebGL", "GLSL", "Canvas"], link: "#contact" },
  ],
  timeline: [
    { range: "2024 — now", role: "Senior Frontend Engineer · Northbeam Studio", detail: "Lead the web platform for three client products. Rebuilt the shared component library and cut first-load JavaScript by 47%." },
    { range: "2022 — 2024", role: "Full-stack Developer · Arclight Labs", detail: "Shipped the customer portal and billing service from first commit to 12k monthly users. Owned the on-call rotation for both." },
    { range: "2021 — 2022", role: "Freelance Developer", detail: "Twenty-odd sites and small apps for local businesses. Learned more about scoping and saying no than about any framework." },
  ],
  links: {
    email: "rafi.sheikh@example.com",
    contact: [
      { label: "rafi.sheikh@example.com", type: "Email", copy: "rafi.sheikh@example.com" },
      { label: "github.com/rafisheikh", type: "Code", copy: "github.com/rafisheikh" },
      { label: "linkedin.com/in/rafisheikh", type: "LinkedIn", copy: "linkedin.com/in/rafisheikh" },
      { label: "+880 1700 000000", type: "Phone", copy: "+880 1700 000000" },
    ],
  },
  extraSections: [],
};
