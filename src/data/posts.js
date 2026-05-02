import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["analysis", "engagement", "letters", "smme"],
    required: true
  },

  title: String,
  content: String,

  image: String,
  video: String,

  author_name: {
    type: String,
    default: "Admin"
  },

  status: {
    type: String,
    default: "approved" // admin posts go live instantly
  }

}, { timestamps: true });

export default mongoose.model("Post", postSchema);