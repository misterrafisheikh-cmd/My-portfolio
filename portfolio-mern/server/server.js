// ============================================================
// server.js — the entry point. This is the file that actually starts
// the backend: sets up Express, connects to MongoDB, and mounts every
// route group (contact form, admin login, content). To add a whole
// new feature's API, create routes/yourthing.routes.js and mount it
// here the same way the others are mounted below.
// ============================================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
// The default 50kb limit is fine for the contact form, but a profile
// photo saved as a base64 data URL (see AdminContent.jsx) can run to a
// few hundred KB or more, so the content-save endpoint needs headroom.
app.use(express.json({ limit: "8mb" }));

// Basic abuse guard on the public contact endpoint.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many messages sent — try again in a bit." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts — try again in a bit." },
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Add new feature routes the same way: create routes/<name>.routes.js
// and mount it here, e.g. app.use("/api/newsletter", newsletterRoutes)
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/admin", loginLimiter, authRoutes);
app.use("/api/content", contentRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
