import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  text: String,
  user: { type: String, default: "User" }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  text: String,
  user: { type: String, default: "User" },
  replies: [replySchema]
}, { timestamps: true });

const pollOptionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 }
});

const postSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["analysis", "engagement", "letters", "smme"],
    required: true
  },
  topic: { type: String, default: "general" },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  image: { type: String, default: null },
  video: { type: String, default: null },
  author: { type: String, default: "Admin" },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved"
  },
  likes:   { type: Number, default: 0 },
  likedBy: [{ type: String }], // stores user IDs or IP to prevent double-likes
  comments: [commentSchema],
  // For user-submitted content
  is_anonymous: { type: Boolean, default: false },
  author_name: { type: String, default: "" },
  // Poll support
  poll: {
    question: String,
    options: [pollOptionSchema]
  }
}, { timestamps: true });

postSchema.index({ title: "text", content: "text" }); // enables $text search
export default mongoose.model("Post", postSchema);
