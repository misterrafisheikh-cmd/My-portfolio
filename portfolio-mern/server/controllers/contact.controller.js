import Message from "../models/Message.js";
import { sendNotification } from "../lib/mailer.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function createMessage(req, res, next) {
  try {
    const { name = "", email = "", message = "" } = req.body || {};
    const errors = {};

    if (name.trim().length < 2) errors.name = "Add a name so I know who's writing.";
    if (!EMAIL_RE.test(email.trim())) errors.email = "That email address doesn't look right.";
    if (message.trim().length < 12) errors.message = "A sentence or two about the project is enough.";

    if (Object.keys(errors).length) {
      return res.status(422).json({ errors });
    }

    const saved = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    sendNotification(saved).catch((e) => console.error("Email notify failed:", e.message));

    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    next(err);
  }
}

// --- everything below is admin-only (see routes/contact.routes.js) ---

export async function listMessages(req, res, next) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(500);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { read: req.body?.read !== false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Message not found." });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Message not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
