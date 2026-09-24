// ============================================================
// Message.js — the shape of one contact-form submission as stored in
// MongoDB: name, email, message text, and whether it's been marked
// read in the admin dashboard. `timestamps: true` automatically adds
// createdAt/updatedAt fields.
// ============================================================
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
