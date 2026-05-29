import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { sendSubmissionStatusEmail } from "../utils/sendEmail.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ── STATS ─────────────────────────────────────────────────────────────────────
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

// ── PENDING POSTS ─────────────────────────────────────────────────────────────
router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ALL POSTS ─────────────────────────────────────────────────────────────────
router.get("/posts", protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ALL USERS ─────────────────────────────────────────────────────────────────
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role createdAt isVerified")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TOP LIKED POSTS ───────────────────────────────────────────────────────────
router.get("/top-posts", protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .select("title category likes comments createdAt")
      .sort({ likes: -1 })
      .limit(10)
      .lean();
    res.json(posts.map(p => ({ ...p, commentCount: p.comments?.length || 0 })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST LIKES DETAIL ─────────────────────────────────────────────────────────
router.get("/post-likes/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select("title likes likedBy").lean();
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userIds = post.likedBy
      .filter(id => id.startsWith("user_"))
      .map(id => id.replace("user_", ""));

    const users = userIds.length
      ? await User.find({ _id: { $in: userIds } }).select("name email").lean()
      : [];

    const ipLikes = post.likedBy.filter(id => !id.startsWith("user_"));

    res.json({
      title: post.title,
      totalLikes: post.likes,
      registeredLikes: users,
      anonymousLikes: ipLikes.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── APPROVE ───────────────────────────────────────────────────────────────────
router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, { status: "approved" }, { new: true }
    );
    if (post?.submittedBy) {
      const user = await User.findById(post.submittedBy).select("email name").lean();
      if (user) {
        sendSubmissionStatusEmail({
          toEmail: user.email, userName: user.name,
          status: "approved", postTitle: post.title,
          postUrl: `${process.env.CLIENT_URL}/post/${post._id}`
        }).catch(() => {});
      }
    }
    res.json({ message: "Post approved", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── REJECT ────────────────────────────────────────────────────────────────────
router.put("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, { status: "rejected" }, { new: true }
    );
    if (post?.submittedBy) {
      const user = await User.findById(post.submittedBy).select("email name").lean();
      if (user) {
        sendSubmissionStatusEmail({
          toEmail: user.email, userName: user.name,
          status: "rejected", postTitle: post.title
        }).catch(() => {});
      }
    }
    res.json({ message: "Post rejected", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE (:id must be LAST to avoid catching /users /posts etc) ─────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;