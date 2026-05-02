import express from "express";
import Post from "../models/Post.js";
import { uploadMedia } from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ============================
// CREATE POST (Admin only)
// ============================
router.post("/create", protect, adminOnly, uploadMedia, async (req, res) => {
  try {
    const { category, topic, title, content, pollQuestion, pollOptions } = req.body;

    // Cloudinary returns the secure_url in file.path
    const image = req.files?.image ? req.files.image[0].path : null;
    const video = req.files?.video ? req.files.video[0].path : null;

    let poll = null;
    if (topic === "poll" && pollQuestion) {
      let options = [];
      try { options = JSON.parse(pollOptions); }
      catch { options = pollOptions.split(",").map(o => o.trim()); }
      poll = { question: pollQuestion, options: options.map(opt => ({ text: opt, votes: 0 })) };
    }

    const post = await Post.create({
      category, topic, title, content, image, video, poll,
      status: "approved",
      author: "Admin"
    });
    res.json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// SUBMIT (User — pending)
// ============================
router.post("/submit", async (req, res) => {
  try {
    const { content, category, topic, title, is_anonymous, author_name } = req.body;
    const post = await Post.create({
      category:     category || "letters",
      topic:        topic    || "general",
      title:        title    || "",
      content,
      is_anonymous: is_anonymous ?? true,
      author_name:  is_anonymous ? "" : (author_name || ""),
      status:       "pending"
    });
    res.json({ message: "Submitted. Pending review.", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET ALL POSTS
// ============================
router.get("/", async (req, res) => {
  try {
    const { category, topic } = req.query;
    let filter = { status: "approved" };
    if (category) filter.category = category;
    if (topic && topic !== "all") filter.topic = topic;
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET SINGLE POST
// ============================
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// LIKE
// ============================
router.post("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// COMMENT
// ============================
router.post("/comment/:id", async (req, res) => {
  try {
    const { text, user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.comments.push({ text, user: user || "Anonymous", replies: [] });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// REPLY
// ============================
router.post("/reply/:postId/:commentId", async (req, res) => {
  try {
    const { text, user } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    comment.replies.push({ text, user: user || "Anonymous" });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// VOTE ON POLL
// ============================
router.post("/vote/:postId/:optionIndex", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post || !post.poll) return res.status(404).json({ error: "Poll not found" });
    const idx = parseInt(req.params.optionIndex);
    if (isNaN(idx) || idx < 0 || idx >= post.poll.options.length)
      return res.status(400).json({ error: "Invalid option" });
    post.poll.options[idx].votes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
