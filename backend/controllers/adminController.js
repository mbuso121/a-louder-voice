import Post from "../models/Post.js";

export const getPending = async (req, res) => {
  const posts = await Post.find({ status: "pending" });
  res.json(posts);
};

export const approvePost = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Approved" });
};

export const rejectPost = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Rejected" });
};