const BASE = import.meta.env.VITE_API_URL || "";

// In dev this hits Vite's proxy (see vite.config.js) which forwards to
// the Express server. In production, set VITE_API_URL to your deployed
// API's origin.
export async function sendContactMessage({ name, email, message }) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong.");
    err.fieldErrors = data.errors || null;
    throw err;
  }
  return data;
}
