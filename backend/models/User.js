import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, maxlength: 100 },
  email:    {
    type: String, unique: true, required: true,
    lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"]
  },
  password:      { type: String, minlength: 8, default: null }, // null for OAuth users
  role:          { type: String, enum: ["user", "admin"], default: "user" },
  loginAttempts: { type: Number, default: 0 },
  lockUntil:     { type: Date,   default: null },
  isActive:      { type: Boolean, default: true },
  lastLogin:     { type: Date,   default: null },

  // Email verification
  isVerified:         { type: Boolean, default: false },
  verifyToken:        { type: String,  default: null },
  verifyTokenExpiry:  { type: Date,    default: null },

  // Password reset
  resetToken:       { type: String, default: null },
  resetTokenExpiry: { type: Date,   default: null },

  // OAuth
  googleId:  { type: String, default: null },
  avatar:    { type: String, default: null }, // Google profile photo
  authProvider: { type: String, enum: ["local", "google"], default: "local" }

}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ resetToken: 1 });
userSchema.index({ verifyToken: 1 });
userSchema.index({ googleId: 1 });

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.createResetToken = function () {
  const raw    = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  this.resetToken       = hashed;
  this.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  return raw;
};

userSchema.methods.createVerifyToken = function () {
  const raw    = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  this.verifyToken       = hashed;
  this.verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return raw;
};

export default mongoose.model("User", userSchema);