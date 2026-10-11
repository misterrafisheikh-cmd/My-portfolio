// ============================================================
// content.controller.js — the logic behind the whole editable site.
// getContent is public (the live site calls this on every page load
// to get its text/colors/projects/etc). updateContent requires an
// admin login and is what /admin/content's "Save changes" button
// calls — it just overwrites whichever top-level fields were sent.
//
// SPEED NOTES: images are NOT stored inside this document anymore —
// only a short URL (/api/media/<id>) is. If an old base64 image or a
// freshly picked one shows up here, it's moved to the media
// collection automatically (see lib/media.js).
// ============================================================
import Content, { getOrCreateContent } from "../models/Content.js";
import { storeDataUrl, deleteMediaByUrl } from "../lib/media.js";

// GET /api/content — public, the live site reads from here.
export async function getContent(req, res, next) {
  try {
    let doc = await getOrCreateContent();
    // One-time migration of an old base64 photo to the media store.
    if (doc.about?.avatarUrl?.startsWith("data:")) {
      doc.about.avatarUrl = await storeDataUrl(doc.about.avatarUrl).catch(() => "");
      await doc.save();
    }
    // Browser may keep it briefly, then revalidates (ETag => tiny 304 reply).
    res.set("Cache-Control", "public, max-age=0, must-revalidate");
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// PUT /api/content — admin only. The dashboard always sends the whole
// document back, so this simply replaces it wholesale.
export async function updateContent(req, res, next) {
  try {
    const doc = await getOrCreateContent();
    const oldAvatar = doc.about?.avatarUrl;
    const allowed = ["hero", "about", "skills", "projects", "timeline", "links", "theme", "extraSections"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) doc[key] = req.body[key];
    }
    // If a raw data URL slipped in, store it as a separate image.
    if (doc.about?.avatarUrl?.startsWith("data:")) {
      doc.about.avatarUrl = await storeDataUrl(doc.about.avatarUrl);
    }
    await doc.save();
    // Delete the replaced photo so the database doesn't fill with orphans.
    if (oldAvatar && oldAvatar !== doc.about.avatarUrl) await deleteMediaByUrl(oldAvatar);
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
