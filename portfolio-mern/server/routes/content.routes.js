// ============================================================
// content.routes.js — GET / is public (anyone loading the site reads
// the content this way). PUT / needs an admin login — that's the
// "Save changes" button in /admin/content.
// ============================================================
import { Router } from "express";
import { getContent, updateContent } from "../controllers/content.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getContent);
router.put("/", requireAdmin, updateContent);

export default router;
