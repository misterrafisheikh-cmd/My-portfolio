import nodemailer from "nodemailer";

// Notifications are entirely optional. Without SMTP_* env vars set,
// this quietly does nothing — the message is still saved to MongoDB.
export async function sendNotification(msg) {
  if (!process.env.SMTP_HOST || !process.env.NOTIFY_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Portfolio site" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `New message from ${msg.name}`,
    text: `${msg.message}\n\n— ${msg.name} (${msg.email})`,
  });
}
