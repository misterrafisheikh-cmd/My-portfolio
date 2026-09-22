import Content, { getOrCreateContent } from "../models/Content.js";

// GET /api/content — public, the live site reads from here.
export async function getContent(req, res, next) {
  try {
    const doc = await getOrCreateContent();
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
    const allowed = ["hero", "about", "skills", "projects", "timeline", "links", "extraSections"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) doc[key] = req.body[key];
    }
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
