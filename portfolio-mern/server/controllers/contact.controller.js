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

    // Fire-and-forget — a failed notification email should never fail the request.
    sendNotification(saved).catch((e) => console.error("Email notify failed:", e.message));

    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req, res, next) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(200);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}
