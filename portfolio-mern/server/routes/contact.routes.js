import { Router } from "express";
import { createMessage, listMessages } from "../controllers/contact.controller.js";

const router = Router();

// POST /api/contact        — the public form on the site
router.post("/", createMessage);

// GET  /api/contact         — for your own use (an admin page, Postman, etc.)
// Add real auth here before shipping this route publicly.
router.get("/", listMessages);

export default router;
