import { Router } from "express";
import { createMessage, listMessages, markRead, deleteMessage } from "../controllers/contact.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/contact         — the public form on the site (no auth)
router.post("/", createMessage);

// Everything below is the admin dashboard's API — token required.
router.get("/", requireAdmin, listMessages);
router.patch("/:id/read", requireAdmin, markRead);
router.delete("/:id", requireAdmin, deleteMessage);

export default router;
