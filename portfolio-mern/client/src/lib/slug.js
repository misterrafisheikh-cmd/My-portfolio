// ============================================================
// slug.js — builds the URL name for a section shown on its own page.
// "Research Work" -> "research-work" -> yourdomain.com/research-work
// ============================================================
const RESERVED = ["admin", "read", "api", "p", "assets"];

export function slugify(text) {
  return (text || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// The slug to actually use: the one typed in admin, else made from the title.
export function sectionSlug(section) {
  let s = slugify(section.slug) || slugify(section.title) || section.id;
  if (RESERVED.includes(s)) s = `${s}-page`;
  return s;
}
