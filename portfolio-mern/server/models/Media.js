// ============================================================
// Media.js — stores uploaded images (as binary) in their own
// collection, SEPARATE from the site content. This is the key to
// speed: the content document stays tiny (just a short URL like
// /api/media/abc123), and the browser downloads each image once and
// caches it forever.
// ============================================================
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
