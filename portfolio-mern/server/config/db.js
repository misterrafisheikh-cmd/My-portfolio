import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️  MONGO_URI not set — the API will run, but /api/contact will fail until you add it to server/.env");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("✓ MongoDB connected");
  } catch (err) {
    console.error("✗ MongoDB connection failed:", err.message);
  }
}
