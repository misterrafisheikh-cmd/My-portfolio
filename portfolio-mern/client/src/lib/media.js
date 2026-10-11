// ============================================================
// media.js — image helpers.
//  resolveMedia: turns "/api/media/abc" into a full URL pointing at
//    the backend (needed because the site and API live on different
//    domains in production). Normal https:// URLs pass through.
//  compressImage: shrinks a chosen photo in the browser BEFORE upload
//    (max 900px wide, WebP) so uploads are fast and the image loads
//    fast for visitors. A 4MB phone photo becomes ~60-120KB.
// ============================================================
const BASE = import.meta.env.VITE_API_URL || "";

export function resolveMedia(url) {
  if (!url) return "";
  return url.startsWith("/api/") ? `${BASE}${url}` : url;
}

export function compressImage(file, maxSize = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      // WebP is smallest; fall back to JPEG if the browser can't encode it.
      let out = canvas.toDataURL("image/webp", quality);
      if (!out.startsWith("data:image/webp")) out = canvas.toDataURL("image/jpeg", quality);
      resolve(out);
    };
    img.onerror = () => reject(new Error("Couldn't read that image."));
    img.src = objectUrl;
  });
}

export async function uploadImage(token, file) {
  const dataUrl = await compressImage(file);
  const res = await fetch(`${BASE}/api/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ dataUrl }),
  });
  if (res.status === 401) throw new Error("SESSION_EXPIRED");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url;
}
