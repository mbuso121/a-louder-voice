import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, X, Plus, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pendingPosts, setPendingPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const [form, setForm] = useState({
    category: "analysis",
    topic: "general",
    title: "",
    content: "",
    image: null,
    video: null,
    pollQuestion: "",
    pollOptions: ""
  });
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [stats, setStats] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/pending`, authHeader),
        axios.get(`${API}/admin/posts`, authHeader),
        axios.get(`${API}/admin/stats`, authHeader)
      ]);
      setPendingPosts(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setAllPosts(Array.isArray(allRes.data) ? allRes.data : []);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API}/admin/approve/${id}`, {}, authHeader);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API}/admin/reject/${id}`, {}, authHeader);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API}/admin/${id}`, authHeader);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("category", form.category);
      formData.append("topic", form.topic);
      formData.append("title", form.title);
      formData.append("content", form.content);
      if (form.image) formData.append("image", form.image);
      if (form.video) formData.append("video", form.video);
      if (form.topic === "poll") {
        formData.append("pollQuestion", form.pollQuestion);
        formData.append("pollOptions", JSON.stringify(form.pollOptions.split(",")));
      }

      await axios.post(`${API}/posts/create`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      setCreateSuccess(true);
      setForm({
        category: "analysis",
        topic: "general",
        title: "",
        content: "",
        image: null,
        video: null,
        pollQuestion: "",
        pollOptions: ""
      });
      setTimeout(() => setCreateSuccess(false), 3000);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create post. Check backend.");
    } finally {
      setCreating(false);
    }
  };

  const topicsByCategory = {
    analysis: ["relationships", "self-growth", "society"],
    engagement: ["discussion", "poll"],
    letters: ["love", "heartbreak", "family", "friendship"],
    smme: ["business", "startup"]
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Admin Dashboard
          </h1>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="text-sm text-[#C5A059] hover:underline"
          >
            Logout
          </button>
        </div>


        {/* STATS */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Posts", value: stats.total },
              { label: "Pending", value: stats.pending, highlight: stats.pending > 0 },
              { label: "Published", value: stats.approved },
              { label: "Members", value: stats.members },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`p-5 text-center border ${highlight ? "bg-yellow-50 border-yellow-200" : "bg-[#EAE5D9] border-transparent"}`}>
                <p className={`text-3xl font-light mb-1 ${highlight ? "text-yellow-700" : "text-[#C5A059]"}`}
                   style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {value ?? "—"}
                </p>
                <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-[#0A0A0A]/10">
          {["pending", "all", "create"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm uppercase tracking-widest transition ${
                activeTab === tab
                  ? "border-b-2 border-[#C5A059] text-[#C5A059]"
                  : "text-[#4A4A4A] hover:text-[#0A0A0A]"
              }`}
            >
              {tab === "pending" ? `Pending (${pendingPosts.length})` : tab === "all" ? "All Posts" : "Create Post"}
            </button>
          ))}
        </div>

        {/* ========== PENDING TAB ========== */}
        {activeTab === "pending" && (
          <div>
            {loading ? (
              <p className="text-center py-12 text-[#4A4A4A]">Loading...</p>
            ) : pendingPosts.length === 0 ? (
              <p className="text-center py-12 text-[#4A4A4A]">No pending submissions.</p>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border p-6"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs text-[#C5A059] uppercase tracking-widest">
                          {post.category} · {post.topic}
                        </span>
                        <h3 className="text-xl mt-1">{post.title || "(No title)"}</h3>
                        <p className="text-sm text-[#4A4A4A] mt-1 line-clamp-3">{post.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          By: {post.is_anonymous ? "Anonymous" : (post.author_name || post.author || "Unknown")}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <button
                          onClick={() => handleApprove(post._id)}
                          className="bg-green-600 text-white p-2 hover:bg-green-700"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(post._id)}
                          className="bg-red-500 text-white p-2 hover:bg-red-600"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {post.image && (
                      <img
                        src={post.image}
                        alt="post"
                        className="mt-3 max-h-48 object-cover"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== ALL POSTS TAB ========== */}
        {activeTab === "all" && (
          <div>
            {loading ? (
              <p className="text-center py-12 text-[#4A4A4A]">Loading...</p>
            ) : allPosts.length === 0 ? (
              <p className="text-center py-12 text-[#4A4A4A]">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {allPosts.map((post) => (
                  <div key={post._id} className="bg-white border p-5 flex justify-between items-start">
                    <div>
                      <span className={`text-xs uppercase tracking-widest px-2 py-0.5 ${
                        post.status === "approved" ? "bg-green-100 text-green-700"
                        : post.status === "pending" ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-600"
                      }`}>
                        {post.status}
                      </span>
                      <h3 className="text-lg mt-1">{post.title || "(No title)"}</h3>
                      <p className="text-xs text-[#C5A059] mt-1">
                        {post.category} · {post.topic}
                      </p>
                      <p className="text-sm text-[#4A4A4A] mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="ml-4 text-red-400 hover:text-red-600 shrink-0"
                      title="Delete"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== CREATE POST TAB ========== */}
        {activeTab === "create" && (
          <div className="bg-white border p-8">
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <Plus size={20} /> New Post
            </h2>

            {createSuccess && (
              <div className="mb-4 bg-green-100 text-green-700 p-3">
                ✅ Post published successfully!
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">

              {/* CATEGORY */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value, topic: topicsByCategory[e.target.value][0] })
                  }
                  className="w-full border p-2 bg-[#F4F0E6]"
                >
                  <option value="analysis">Analysis</option>
                  <option value="engagement">Engagement</option>
                  <option value="letters">Letters</option>
                  <option value="smme">SMME</option>
                </select>
              </div>

              {/* TOPIC */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Topic</label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full border p-2 bg-[#F4F0E6]"
                >
                  {(topicsByCategory[form.category] || []).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* POLL FIELDS */}
              {form.topic === "poll" && (
                <>
                  <input
                    placeholder="Poll Question"
                    className="w-full border p-2"
                    value={form.pollQuestion}
                    onChange={(e) => setForm({ ...form, pollQuestion: e.target.value })}
                  />
                  <input
                    placeholder="Options (comma separated)"
                    className="w-full border p-2"
                    value={form.pollOptions}
                    onChange={(e) => setForm({ ...form, pollOptions: e.target.value })}
                  />
                </>
              )}

              {/* TITLE */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Title</label>
                <input
                  placeholder="Post title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border p-2"
                />
              </div>

              {/* CONTENT */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Content</label>
                <textarea
                  placeholder="Write your content..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border p-2 h-40 resize-none"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                />
              </div>

              {/* VIDEO */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Video (optional)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setForm({ ...form, video: e.target.files[0] })}
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="bg-[#0A0A0A] text-white px-8 py-3 flex items-center gap-2 hover:bg-[#C5A059] transition disabled:opacity-50"
              >
                <Plus size={18} />
                {creating ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
