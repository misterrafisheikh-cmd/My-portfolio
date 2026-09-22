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

// ---------------- Admin dashboard ----------------

export async function adminLogin(password) {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Login failed.");
  return data.token;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchMessages(token) {
  const res = await fetch(`${BASE}/api/contact`, { headers: authHeaders(token) });
  if (res.status === 401) throw new Error("SESSION_EXPIRED");
  if (!res.ok) throw new Error("Couldn't load messages.");
  return res.json();
}

export async function setMessageRead(token, id, read) {
  const res = await fetch(`${BASE}/api/contact/${id}/read`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ read }),
  });
  if (res.status === 401) throw new Error("SESSION_EXPIRED");
  if (!res.ok) throw new Error("Couldn't update that message.");
  return res.json();
}

export async function deleteMessageById(token, id) {
  const res = await fetch(`${BASE}/api/contact/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (res.status === 401) throw new Error("SESSION_EXPIRED");
  if (!res.ok) throw new Error("Couldn't delete that message.");
  return res.json();
}
