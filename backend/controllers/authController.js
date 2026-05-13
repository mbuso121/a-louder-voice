import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendVerificationEmail
} from "../utils/sendEmail.js";

const MAX_ATTEMPTS  = 5;
const LOCK_TIME     = 15 * 60 * 1000;

function setCookieToken(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   7 * 24 * 60 * 60 * 1000
  });
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
    if (password.length < 8)          return res.status(400).json({ error: "Password must be at least 8 characters" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Invalid email format" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Registration failed. Please check your details." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false
    });

    const rawToken = user.createVerifyToken();
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
    try {
      await sendVerificationEmail({ toEmail: user.email, verifyUrl, userName: user.name });
    } catch (emailErr) {
      console.error("Verification email failed:", emailErr.message);
      // Still create account, just log the error
    }

    res.status(201).json({ message: "Account created! Please check your email to verify your account." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// ── VERIFY EMAIL ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verifyToken:       hashed,
      verifyTokenExpiry: { $gt: new Date() }
    });

    if (!user) return res.status(400).json({ error: "Verification link is invalid or has expired." });

    user.isVerified        = true;
    user.verifyToken       = null;
    user.verifyTokenExpiry = null;
    await user.save();

    res.json({ message: "Email verified! You can now log in." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ── RESEND VERIFICATION ───────────────────────────────────────────────────────
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.isVerified) {
      return res.json({ message: "If that email exists and is unverified, a new link has been sent." });
    }

    const rawToken  = user.createVerifyToken();
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
    await sendVerificationEmail({ toEmail: user.email, verifyUrl, userName: user.name });

    res.json({ message: "Verification email resent. Please check your inbox." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)          return res.status(401).json({ error: "Invalid email or password" });
    if (!user.isActive) return res.status(403).json({ error: "Account suspended. Contact support." });

    // Block OAuth users from password login
    if (user.authProvider !== "local") {
      return res.status(400).json({ error: "This account uses Google Sign In. Please use that option." });
    }

    if (user.isLocked()) {
      const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(429).json({ error: `Account locked. Try again in ${mins} minute(s).` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil     = new Date(Date.now() + LOCK_TIME);
        user.loginAttempts = 0;
        await user.save();
        return res.status(429).json({ error: "Too many failed attempts. Account locked for 15 minutes." });
      }
      await user.save();
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check email verified
    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
        unverified: true
      });
    }

    user.loginAttempts = 0;
    user.lockUntil     = null;
    user.lastLogin     = new Date();
    await user.save();

    const token = signToken(user);
    setCookieToken(res, token);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  res.json({ message: "Logged out" });
};

// ── GET ME ────────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -loginAttempts -lockUntil -resetToken -resetTokenExpiry -verifyToken -verifyTokenExpiry");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ message: "If that email exists, a reset link has been sent." });

    if (user.authProvider === "google") {
      return res.status(400).json({ error: "This account uses Google Sign In — no password to reset." });
    }

    const rawToken  = user.createResetToken();
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    try {
      await sendPasswordResetEmail({ toEmail: user.email, resetUrl, userName: user.name });
    } catch (emailErr) {
      user.resetToken = user.resetTokenExpiry = null;
      await user.save();
      return res.status(500).json({ error: "Failed to send email. Please try again." });
    }

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;
    if (!password || password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user   = await User.findOne({ resetToken: hashed, resetTokenExpiry: { $gt: new Date() } });
    if (!user)   return res.status(400).json({ error: "Reset link is invalid or has expired." });

    user.password         = await bcrypt.hash(password, 12);
    user.resetToken       = null;
    user.resetTokenExpiry = null;
    user.loginAttempts    = 0;
    user.lockUntil        = null;
    await user.save();

    try { await sendPasswordChangedEmail({ toEmail: user.email, userName: user.name }); } catch {}
    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both fields are required" });
    if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const user    = await User.findById(req.user.id);
    if (user.authProvider === "google") return res.status(400).json({ error: "Google accounts don't have a password to change." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    try { await sendPasswordChangedEmail({ toEmail: user.email, userName: user.name }); } catch {}
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};