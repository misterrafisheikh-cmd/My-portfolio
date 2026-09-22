const BASE = import.meta.env.VITE_API_URL || "";

export async function fetchContentAdmin() {
  const res = await fetch(`${BASE}/api/content`);
  if (!res.ok) throw new Error("Couldn't load content.");
  return res.json();
}

export async function saveContent(token, content) {
  const res = await fetch(`${BASE}/api/content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(content),
  });
  if (res.status === 401) throw new Error("SESSION_EXPIRED");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Couldn't save changes.");
  return data;
}
