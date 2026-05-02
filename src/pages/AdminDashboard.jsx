import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, X, Plus } from "@phosphor-icons/react";
import API from "../lib/api";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createData, setCreateData] = useState({
    category: "engagement",
    topic: "discussion",
    title: "",
    content: "",
    media: null,
    pollQuestion: "",
    pollOptions: ""
  });

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE POST
  const handleCreate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", createData.category);
    formData.append("topic", createData.topic);
    formData.append("title", createData.title);
    formData.append("content", createData.content);

    if (createData.media) {
      if (createData.media.type.startsWith("image")) {
        formData.append("image", createData.media);
      } else {
        formData.append("video", createData.media);
      }
    }

    if (createData.topic === "poll") {
      formData.append("pollQuestion", createData.pollQuestion);
      formData.append("pollOptions", JSON.stringify(createData.pollOptions.split(",")));
    }

    try {
      await axios.post(`${API}/posts/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Post created!");

      setCreateData({
        category: "engagement",
        topic: "discussion",
        title: "",
        content: "",
        media: null,
        pollQuestion: "",
        pollOptions: ""
      });

      fetchPosts();

    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl mb-10">Admin Dashboard</h1>

        {/* CREATE */}
        <div className="bg-[#EAE5D9] p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Plus />
            <h2>Create Post</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">

            <select
              value={createData.category}
              onChange={(e) => setCreateData({ ...createData, category: e.target.value, topic: "discussion" })}
              className="w-full p-2"
            >
              <option value="analysis">Analysis</option>
              <option value="engagement">Engagement</option>
              <option value="letters">Letters</option>
              <option value="smme">SMME</option>
            </select>

            <select
              value={createData.topic}
              onChange={(e) => setCreateData({ ...createData, topic: e.target.value })}
              className="w-full p-2"
            >
              <option value="discussion">Discussion</option>
              <option value="poll">Poll</option>
              <option value="love">Love</option>
              <option value="heartbreak">Heartbreak</option>
            </select>

            {createData.topic === "poll" && (
              <>
                <input
                  placeholder="Poll Question"
                  className="w-full p-2"
                  onChange={(e) => setCreateData({ ...createData, pollQuestion: e.target.value })}
                />
                <input
                  placeholder="Options (comma separated)"
                  className="w-full p-2"
                  onChange={(e) => setCreateData({ ...createData, pollOptions: e.target.value })}
                />
              </>
            )}

            <input
              placeholder="Title"
              value={createData.title}
              onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
              className="w-full p-2"
            />

            <textarea
              placeholder="Content"
              value={createData.content}
              onChange={(e) => setCreateData({ ...createData, content: e.target.value })}
              className="w-full p-2"
            />

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setCreateData({ ...createData, media: e.target.files[0] })}
            />

            <button className="bg-black text-white px-6 py-2">Publish</button>
          </form>
        </div>

        {/* POSTS LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white p-4 mb-4">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <span>{post.category} • {post.topic}</span>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
