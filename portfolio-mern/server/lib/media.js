// ============================================================
// media.js — helper that turns a "data:image/...;base64,..." string
// into a stored Media document and returns a short URL for it.
// ============================================================
import Media from "../models/Media.js";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB per image (client shrinks images first)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function storeDataUrl(dataUrl) {
  const m = /^data:([\w/+.-]+);base64,(.+)$/s.exec(dataUrl || "");
  if (!m || !ALLOWED.includes(m[1])) {
    const e = new Error("Unsupported image. Use JPG, PNG, WebP or GIF.");
    e.status = 400;
    throw e;
  }
  const buf = Buffer.from(m[2], "base64");
  if (buf.length > MAX_BYTES) {
    const e = new Error("Image too large (max 2MB).");
    e.status = 400;
    throw e;
  }
  const doc = await Media.create({ contentType: m[1], data: buf });
  return `/api/media/${doc._id}`;
}

// Removes stored images that the content no longer references.
export async function deleteMediaByUrl(url) {
  const m = /^\/api\/media\/([a-f0-9]{24})$/.exec(url || "");
  if (m) await Media.deleteOne({ _id: m[1] }).catch(() => {});
}
