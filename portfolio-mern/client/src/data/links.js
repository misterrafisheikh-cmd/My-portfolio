// Structural nav anchors — these map to actual section IDs in the code
// (Hero's id="home", About's id="about", etc.), so they stay here rather
// than in the database. Everything that's just text/content (the
// contact email, social links, project data...) lives in MongoDB and
// is edited from /admin — see context/ContentContext.jsx.
export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];
