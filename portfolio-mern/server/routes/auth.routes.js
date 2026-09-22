import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/admin/login  { password }  ->  { token }
router.post("/login", login);

export default router;
