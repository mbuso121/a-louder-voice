import express from "express";
import { sendContactEmail } from "../utils/sendEmail.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", apiLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (message.length < 10) {
      return res.status(400).json({ error: "Message is too short" });
    }

    await sendContactEmail({ fromName: name, fromEmail: email, subject, message });

    res.json({ message: "Message sent successfully! We'll get back to you soon." });
  } catch (err) {
    console.error("Contact email error:", err);
    res.status(500).json({ error: "Failed to send message. Please try again or email us directly." });
  }
});

export default router;
