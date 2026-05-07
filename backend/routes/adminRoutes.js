import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { sendSubmissionStatusEmail } from "../utils/sendEmail.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


// ADMIN STATS
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [total, pending, approved, rejected, members] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: "pending" }),
      Post.countDocuments({ status: "approved" }),
      Post.countDocuments({ status: "rejected" }),
      User.countDocuments()
    ]);
    res.json({ total, pending, approved, rejected, members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET pending posts
router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// APPROVE post
router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    // Notify submitter
    if (post?.submittedBy) {
      const user = await User.findById(post.submittedBy).select("email name").lean();
      if (user) {
        sendSubmissionStatusEmail({
          toEmail: user.email,
          userName: user.name,
          status: "approved",
          postTitle: post.title,
          postUrl: `${process.env.CLIENT_URL}/post/${post._id}`
        }).catch(() => {}); // don't fail if email fails
      }
    }
    res.json({ message: "Post approved", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REJECT post
router.put("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (post?.submittedBy) {
      const user = await User.findById(post.submittedBy).select("email name").lean();
      if (user) {
        sendSubmissionStatusEmail({
          toEmail: user.email,
          userName: user.name,
          status: "rejected",
          postTitle: post.title
        }).catch(() => {});
      }
    }
    res.json({ message: "Post rejected", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE post
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all posts (admin view)
router.get("/posts", protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
