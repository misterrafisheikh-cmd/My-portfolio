import { Router } from "express";
import { getContent, updateContent } from "../controllers/content.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getContent);
router.put("/", requireAdmin, updateContent);

export default router;
