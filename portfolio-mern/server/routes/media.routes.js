// media.routes.js — GET is public (images show on the site); POST needs admin login.
import { Router } from "express";
import { getMedia, uploadMedia } from "../controllers/media.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
router.get("/:id", getMedia);
router.post("/", requireAdmin, uploadMedia);
export default router;
