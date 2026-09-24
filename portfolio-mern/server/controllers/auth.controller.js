// ============================================================
// auth.controller.js — the admin login check. There's only one admin
// account here (the ADMIN_PASSWORD in server/.env, or on Render's
// Environment tab for the live site) — this isn't a full user system,
// just a single password gate for the dashboard.
// ============================================================
import jwt from "jsonwebtoken";

// Single hardcoded admin — this is a personal portfolio, not a multi-user
// system, so one password (from .env, never committed) is enough. If you
// ever need more than one admin, swap this for a real User model.
export function login(req, res) {
  const { password } = req.body || {};

  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Admin login isn't configured yet — set ADMIN_PASSWORD and JWT_SECRET in server/.env." });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password." });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
}
