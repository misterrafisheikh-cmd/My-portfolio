// ============================================================
// media.controller.js — upload (admin) and serve (public) images.
// Served with a 1-year "immutable" cache header, so after the first
// view the browser never re-downloads the image.
// ============================================================
import mongoose from "mongoose";
import Media from "../models/Media.js";
import { storeDataUrl } from "../lib/media.js";

// POST /api/media  { dataUrl } -> { url }
export async function uploadMedia(req, res, next) {
  try {
    const url = await storeDataUrl(req.body?.dataUrl);
    res.json({ url });
  } catch (err) {
    next(err);
  }
}

// GET /api/media/:id
export async function getMedia(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.sendStatus(404);
    const doc = await Media.findById(req.params.id);
    if (!doc) return res.sendStatus(404);
    res.set({
      "Content-Type": doc.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      // allow the Vercel site (a different domain) to display the image
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    res.send(doc.data);
  } catch (err) {
    next(err);
  }
}
