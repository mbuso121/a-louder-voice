import Post from "../models/Post.js";

// CREATE POST (ADMIN)
export const createPost = async (req, res) => {
  try {
    const { category, topic, title, content } = req.body;

    const post = await Post.create({
      category,
      topic,
      title,
      content,
      image: req.files?.image?.[0]?.filename || "",
      video: req.files?.video?.[0]?.filename || "",
      author: "Admin",
      status: "approved"
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET POSTS BY CATEGORY
export const getPosts = async (req, res) => {
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
};