import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contact.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "50kb" }));

// Basic abuse guard on the public contact endpoint.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many messages sent — try again in a bit." },
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Add new feature routes the same way: create routes/<name>.routes.js
// and mount it here, e.g. app.use("/api/newsletter", newsletterRoutes)
app.use("/api/contact", contactLimiter, contactRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
