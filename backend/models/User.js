import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String, unique: true, required: true,
    lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"]
  },
  password:      { type: String, required: true, minlength: 8 },
  role:          { type: String, enum: ["user", "admin"], default: "user" },
  loginAttempts: { type: Number, default: 0 },
  lockUntil:     { type: Date,   default: null },
  isActive:      { type: Boolean, default: true },
  lastLogin:     { type: Date,   default: null },
  // Password reset
  resetToken:       { type: String, default: null },
  resetTokenExpiry: { type: Date,   default: null }
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ resetToken: 1 });

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Generate a secure reset token (stored as hash, sent as raw)
userSchema.methods.createResetToken = function () {
  const raw   = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  this.resetToken       = hashed;
  this.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return raw;  // send this to user
};

export default mongoose.model("User", userSchema);
