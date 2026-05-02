import { useState } from "react";
import { motion } from "framer-motion";
import API from "../lib/api";

export default function AdminCreatePost() {
  const [category, setCategory] = useState("engagement");
  const [topic, setTopic] = useState("discussion");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("category", category);
    formData.append("topic", topic);
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);
    if (topic === "poll") {
      formData.append("pollQuestion", pollQuestion);
      formData.append("pollOptions", JSON.stringify(pollOptions.split(",")));
    }

    try {
      const res = await fetch(`${API}/posts/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle("");
        setContent("");
        setImage(null);
        setVideo(null);
        setPollQuestion("");
        setPollOptions("");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Post failed - check backend");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] flex justify-center p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-4xl mb-6">Create Platform Post</h1>

        {success && (
          <div className="bg-green-100 p-3 mb-4">Post created successfully 🚀</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <select className="w-full border p-3" value={category}
            onChange={(e) => { setCategory(e.target.value); setTopic("discussion"); }}>
            <option value="analysis">Analysis</option>
            <option value="engagement">Engagement</option>
            <option value="letters">Letters</option>
            <option value="smme">SMME</option>
          </select>

          <select className="w-full border p-3" value={topic}
            onChange={(e) => setTopic(e.target.value)}>
            {category === "analysis" && (
              <>
                <option value="relationships">Relationships</option>
                <option value="self-growth">Self Growth</option>
                <option value="society">Society</option>
              </>
            )}
            {category === "letters" && (
              <>
                <option value="love">Love</option>
                <option value="heartbreak">Heartbreak</option>
                <option value="family">Family</option>
                <option value="friendship">Friendship</option>
              </>
            )}
            {category === "engagement" && (
              <>
                <option value="discussion">Discussion</option>
                <option value="poll">Poll</option>
              </>
            )}
            {category === "smme" && (
              <>
                <option value="business">Business</option>
                <option value="startup">Startup</option>
              </>
            )}
          </select>

          {topic === "poll" && (
            <>
              <input className="w-full border p-3" placeholder="Poll Question"
                value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
              <input className="w-full border p-3" placeholder="Options (comma separated)"
                value={pollOptions} onChange={(e) => setPollOptions(e.target.value)} />
            </>
          )}

          <input className="w-full border p-3" placeholder="Title"
            value={title} onChange={(e) => setTitle(e.target.value)} />

          <textarea className="w-full border p-3 h-40" placeholder="Write your message..."
            value={content} onChange={(e) => setContent(e.target.value)} />

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-2">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-2">Video</label>
            <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
          </div>

          <button className="bg-black text-white px-6 py-3 w-full hover:bg-[#C5A059] transition">
            Publish Post
          </button>
        </form>
      </motion.div>
    </div>
  );
}
