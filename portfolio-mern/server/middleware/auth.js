import jwt from "jsonwebtoken";

// Protects any route it's placed in front of. Expects
// "Authorization: Bearer <token>" — the admin dashboard sends this
// automatically once you've logged in (see client/src/lib/api.js).
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Login required." });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired — log in again." });
  }
}
