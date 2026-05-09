import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Plus, Trash, Users, Heart, ChartBar, Article, Eye, ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";
 
export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  const [pendingPosts, setPendingPosts]   = useState([]);
  const [allPosts, setAllPosts]           = useState([]);
  const [users, setUsers]                 = useState([]);
  const [topPosts, setTopPosts]           = useState([]);
  const [stats, setStats]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState("pending");
  const [likeModal, setLikeModal]         = useState(null); // { postId, data }
  const [likeLoading, setLikeLoading]     = useState(false);
 
  const [form, setForm] = useState({
    category: "analysis", topic: "relationships",
    title: "", content: "", image: null, video: null,
    pollQuestion: "", pollOptions: ""
  });
  const [creating, setCreating]         = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError]   = useState("");
 
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
 
  useEffect(() => { fetchData(); }, []);
 
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes, statsRes, usersRes, topRes] = await Promise.all([
        axios.get(`${API}/admin/pending`,   authHeader),
        axios.get(`${API}/admin/posts`,     authHeader),
        axios.get(`${API}/admin/stats`,     authHeader),
        axios.get(`${API}/admin/users`,     authHeader),
        axios.get(`${API}/admin/top-posts`, authHeader),
      ]);
      setPendingPosts(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setAllPosts(Array.isArray(allRes.data) ? allRes.data : []);
      setStats(statsRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setTopPosts(Array.isArray(topRes.data) ? topRes.data : []);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleApprove = async (id) => {
    try { await axios.put(`${API}/admin/approve/${id}`, {}, authHeader); fetchData(); }
    catch (err) { console.error(err); }
  };
 
  const handleReject = async (id) => {
    try { await axios.put(`${API}/admin/reject/${id}`, {}, authHeader); fetchData(); }
    catch (err) { console.error(err); }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try { await axios.delete(`${API}/admin/${id}`, authHeader); fetchData(); }
    catch (err) { console.error(err); }
  };
 
  const viewLikes = async (post) => {
    setLikeModal({ postId: post._id, title: post.title, data: null });
    setLikeLoading(true);
    try {
      const res = await axios.get(`${API}/admin/post-likes/${post._id}`, authHeader);
      setLikeModal({ postId: post._id, title: post.title, data: res.data });
    } catch { setLikeModal(null); }
    finally { setLikeLoading(false); }
  };
 
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true); setCreateError("");
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
      setForm({ category: "analysis", topic: "relationships", title: "", content: "", image: null, video: null, pollQuestion: "", pollOptions: "" });
      setTimeout(() => setCreateSuccess(false), 3000);
      fetchData();
    } catch (err) {
      setCreateError(err.response?.data?.error || "Failed to publish post");
    } finally { setCreating(false); }
  };
 
  const topicsByCategory = {
    analysis:   ["relationships", "self-growth", "society"],
    engagement: ["discussion", "poll"],
    letters:    ["love", "heartbreak", "family", "friendship"],
    smme:       ["business", "startup"]
  };
 
  const TABS = [
    { id: "pending",  label: `Pending (${pendingPosts.length})` },
    { id: "all",      label: "All Posts" },
    { id: "users",    label: "Users" },
    { id: "insights", label: "Insights" },
    { id: "create",   label: "Create Post" },
  ];
 
  return (
    <div className="min-h-screen bg-[#F4F0E6]">
 
      {/* TOP BAR */}
      <div className="bg-[#0A0A0A] text-[#F4F0E6] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg tracking-widest uppercase" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            A <span className="text-[#C5A059]">Louder</span> Voice — Admin
          </h1>
          <p className="text-xs text-[#F4F0E6]/40">Welcome, {user?.name}</p>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs text-[#F4F0E6]/70 hover:text-[#C5A059] transition uppercase tracking-widest border border-white/20 hover:border-[#C5A059] px-4 py-2">
            <ArrowLeft size={14} /> Back to Site
          </button>
          <button onClick={() => { logout(); navigate("/login"); }}
            className="text-xs border border-white/20 px-4 py-2 hover:border-[#C5A059] hover:text-[#C5A059] transition uppercase tracking-widest">
            Logout
          </button>
        </div>
      </div>
 
      <div className="max-w-6xl mx-auto px-6 py-10">
 
        {/* STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
            {[
              { label: "Total Posts",  value: stats.total,    icon: <Article size={18} /> },
              { label: "Pending",      value: stats.pending,  icon: <Eye size={18} />,      highlight: stats.pending > 0 },
              { label: "Published",    value: stats.approved, icon: <Check size={18} /> },
              { label: "Rejected",     value: stats.rejected, icon: <X size={18} /> },
              { label: "Members",      value: stats.members,  icon: <Users size={18} /> },
            ].map(({ label, value, icon, highlight }) => (
              <div key={label} className={`p-5 text-center border-l-2 ${
                highlight ? "bg-yellow-50 border-yellow-400" : "bg-white border-[#C5A059]"
              }`}>
                <div className={`flex justify-center mb-1 ${highlight ? "text-yellow-600" : "text-[#C5A059]"}`}>{icon}</div>
                <p className={`text-3xl font-light mb-1 ${highlight ? "text-yellow-700" : "text-[#0A0A0A]"}`}
                  style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {value ?? "—"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#4A4A4A]">{label}</p>
              </div>
            ))}
          </div>
        )}
 
        {/* TABS */}
        <div className="flex gap-1 mb-8 border-b border-[#0A0A0A]/10 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-xs uppercase tracking-widest whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "border-b-2 border-[#C5A059] text-[#C5A059]"
                  : "text-[#4A4A4A] hover:text-[#0A0A0A]"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
 
        {/* ===== PENDING TAB ===== */}
        {activeTab === "pending" && (
          <div>
            {loading ? <p className="text-center py-12 text-[#4A4A4A]">Loading...</p>
            : pendingPosts.length === 0 ? (
              <div className="text-center py-16 bg-white border">
                <Check size={32} className="text-green-500 mx-auto mb-3" />
                <p className="text-[#4A4A4A]">All caught up — no pending submissions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map(post => (
                  <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-[#C5A059] uppercase tracking-widest">
                          {post.category} · {post.topic}
                        </span>
                        <h3 className="text-xl mt-1 font-light">{post.title || "(No title)"}</h3>
                        <p className="text-sm text-[#4A4A4A] mt-2 line-clamp-3 leading-relaxed">{post.content}</p>
                        <div className="flex gap-4 mt-3 text-xs text-[#4A4A4A]">
                          <span>By: <strong>{post.is_anonymous ? "Anonymous" : (post.author_name || post.author || "Unknown")}</strong></span>
                          <span>{new Date(post.createdAt).toLocaleDateString("en-ZA")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleApprove(post._id)}
                          className="bg-green-600 text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-green-700 transition flex items-center gap-1">
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => handleReject(post._id)}
                          className="bg-red-500 text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-red-600 transition flex items-center gap-1">
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </div>
                    {post.image && <img src={post.image} alt="" className="mt-4 max-h-40 object-cover" />}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
 
        {/* ===== ALL POSTS TAB ===== */}
        {activeTab === "all" && (
          <div>
            {loading ? <p className="text-center py-12 text-[#4A4A4A]">Loading...</p>
            : (
              <div className="bg-white border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F4F0E6] text-xs uppercase tracking-widest text-[#4A4A4A]">
                    <tr>
                      <th className="text-left px-4 py-3">Title</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Status</th>
                      <th className="text-right px-4 py-3 hidden md:table-cell">Likes</th>
                      <th className="text-right px-4 py-3 hidden md:table-cell">Comments</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPosts.map((post, i) => (
                      <tr key={post._id} className={`border-t border-[#F4F0E6] hover:bg-[#F4F0E6]/50 transition ${i % 2 === 0 ? "" : "bg-[#FAFAF8]"}`}>
                        <td className="px-4 py-3">
                          <p className="font-medium line-clamp-1">{post.title || "(No title)"}</p>
                          <p className="text-xs text-[#4A4A4A] mt-0.5">{new Date(post.createdAt).toLocaleDateString("en-ZA")}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-xs text-[#C5A059] uppercase">{post.category}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs px-2 py-1 uppercase tracking-widest ${
                            post.status === "approved" ? "bg-green-100 text-green-700"
                            : post.status === "pending" ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600"
                          }`}>{post.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <button onClick={() => viewLikes(post)}
                            className="flex items-center gap-1 text-[#4A4A4A] hover:text-red-500 transition ml-auto">
                            <Heart size={14} weight={post.likes > 0 ? "fill" : "regular"} className={post.likes > 0 ? "text-red-400" : ""} />
                            <span>{post.likes || 0}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell text-[#4A4A4A]">
                          {post.comments?.length || 0}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => navigate(`/post/${post._id}`)}
                              className="text-[#C5A059] hover:text-black transition p-1" title="View">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleDelete(post._id)}
                              className="text-red-400 hover:text-red-600 transition p-1" title="Delete">
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
 
        {/* ===== USERS TAB ===== */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#4A4A4A]">{users.length} registered member{users.length !== 1 ? "s" : ""}</p>
            </div>
            {loading ? <p className="text-center py-12 text-[#4A4A4A]">Loading...</p>
            : (
              <div className="bg-white border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F4F0E6] text-xs uppercase tracking-widest text-[#4A4A4A]">
                    <tr>
                      <th className="text-left px-4 py-3">Name</th>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Role</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} className={`border-t border-[#F4F0E6] hover:bg-[#F4F0E6]/50 transition ${i % 2 === 0 ? "" : "bg-[#FAFAF8]"}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {u.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#4A4A4A]">{u.email}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`text-xs px-2 py-1 uppercase tracking-widest ${
                            u.role === "admin" ? "bg-[#C5A059]/20 text-[#8B6914]" : "bg-gray-100 text-gray-600"
                          }`}>{u.role || "user"}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-[#4A4A4A]">
                          {new Date(u.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
 
        {/* ===== INSIGHTS TAB ===== */}
        {activeTab === "insights" && (
          <div className="space-y-8">
 
            {/* TOP LIKED POSTS */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 flex items-center gap-2">
                <Heart size={14} weight="fill" className="text-red-400" /> Top Liked Posts
              </h2>
              <div className="bg-white border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F4F0E6] text-xs uppercase tracking-widest text-[#4A4A4A]">
                    <tr>
                      <th className="text-left px-4 py-3">Post</th>
                      <th className="text-right px-4 py-3">Likes</th>
                      <th className="text-right px-4 py-3 hidden sm:table-cell">Comments</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPosts.map((post, i) => (
                      <tr key={post._id} className={`border-t border-[#F4F0E6] hover:bg-[#F4F0E6]/50 transition`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-light text-[#C5A059] w-6 flex-shrink-0">#{i + 1}</span>
                            <div>
                              <button onClick={() => viewLikes(post)}
                                className="font-medium hover:text-[#C5A059] transition text-left line-clamp-1">
                                {post.title || "(No title)"}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="flex items-center justify-end gap-1 text-red-500 font-medium">
                            <Heart size={14} weight="fill" /> {post.likes || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell text-[#4A4A4A]">
                          {post.commentCount || 0}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs uppercase tracking-widest text-[#C5A059]">{post.category}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#4A4A4A] mt-2">Click a post title to see who liked it.</p>
            </div>
 
            {/* CATEGORY BREAKDOWN */}
            {stats && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 flex items-center gap-2">
                  <ChartBar size={14} /> Content Overview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Published", value: stats.approved, color: "bg-green-400" },
                    { label: "Pending",   value: stats.pending,  color: "bg-yellow-400" },
                    { label: "Rejected",  value: stats.rejected, color: "bg-red-400" },
                    { label: "Members",   value: stats.members,  color: "bg-[#C5A059]" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white border p-5">
                      <div className="flex items-end gap-2 mb-2">
                        <div className={`${color} w-2 self-stretch`} />
                        <p className="text-3xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>{value ?? 0}</p>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
 
        {/* ===== CREATE POST TAB ===== */}
        {activeTab === "create" && (
          <div className="bg-white border p-8 max-w-2xl">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
              <Plus size={20} /> New Post
            </h2>
 
            {createSuccess && <div className="mb-4 bg-green-100 text-green-700 p-3 text-sm">✅ Post published successfully!</div>}
            {createError  && <div className="mb-4 bg-red-100 text-red-700 p-3 text-sm">{createError}</div>}
 
            <form onSubmit={handleCreate} className="space-y-5">
 
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Category</label>
                  <select value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value, topic: topicsByCategory[e.target.value][0] })}
                    className="w-full border p-2 bg-[#F4F0E6] text-sm">
                    <option value="analysis">Analysis</option>
                    <option value="engagement">Engagement</option>
                    <option value="letters">Letters</option>
                    <option value="smme">SMME</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Topic</label>
                  <select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
                    className="w-full border p-2 bg-[#F4F0E6] text-sm">
                    {(topicsByCategory[form.category] || []).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
 
              {form.topic === "poll" && (
                <div className="space-y-3 bg-[#F4F0E6] p-4">
                  <input placeholder="Poll Question" className="w-full border p-2 text-sm"
                    value={form.pollQuestion} onChange={e => setForm({ ...form, pollQuestion: e.target.value })} />
                  <input placeholder="Options (comma separated: Yes, No, Maybe)" className="w-full border p-2 text-sm"
                    value={form.pollOptions} onChange={e => setForm({ ...form, pollOptions: e.target.value })} />
                </div>
              )}
 
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border p-2 text-sm" placeholder="Post title" />
              </div>
 
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Content</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full border p-2 h-40 resize-none text-sm" placeholder="Write your content..." />
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Image (optional)</label>
                  <input type="file" accept="image/*" className="text-sm"
                    onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Video (optional)</label>
                  <input type="file" accept="video/*" className="text-sm"
                    onChange={e => setForm({ ...form, video: e.target.files[0] })} />
                </div>
              </div>
 
              <button type="submit" disabled={creating}
                className="bg-[#0A0A0A] text-white px-8 py-3 flex items-center gap-2 hover:bg-[#C5A059] transition disabled:opacity-50 text-sm uppercase tracking-widest">
                <Plus size={16} />
                {creating ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>
        )}
 
      </div>
 
      {/* ===== LIKES MODAL ===== */}
      <AnimatePresence>
        {likeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setLikeModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}>
 
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h3 className="font-medium">Who liked this?</h3>
                  <p className="text-xs text-[#4A4A4A] mt-0.5 line-clamp-1">{likeModal.title}</p>
                </div>
                <button onClick={() => setLikeModal(null)} className="text-[#4A4A4A] hover:text-black">
                  <X size={18} />
                </button>
              </div>
 
              <div className="p-6">
                {likeLoading ? (
                  <p className="text-center text-[#4A4A4A] py-4">Loading...</p>
                ) : likeModal.data ? (
                  <div>
                    <div className="flex gap-4 mb-5 text-center">
                      <div className="flex-1 bg-[#F4F0E6] p-3">
                        <p className="text-2xl font-light text-[#C5A059]">{likeModal.data.totalLikes}</p>
                        <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">Total Likes</p>
                      </div>
                      <div className="flex-1 bg-[#F4F0E6] p-3">
                        <p className="text-2xl font-light text-[#C5A059]">{likeModal.data.registeredLikes?.length || 0}</p>
                        <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">Members</p>
                      </div>
                      <div className="flex-1 bg-[#F4F0E6] p-3">
                        <p className="text-2xl font-light text-[#C5A059]">{likeModal.data.anonymousLikes || 0}</p>
                        <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">Guests</p>
                      </div>
                    </div>
 
                    {likeModal.data.registeredLikes?.length > 0 ? (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#4A4A4A] mb-3">Liked by members:</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {likeModal.data.registeredLikes.map(u => (
                            <div key={u._id} className="flex items-center gap-3 py-2 border-b border-[#F4F0E6]">
                              <div className="w-7 h-7 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                {u.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{u.name}</p>
                                <p className="text-xs text-[#4A4A4A]">{u.email}</p>
                              </div>
                              <Heart size={14} weight="fill" className="text-red-400 ml-auto" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#4A4A4A] text-center py-2">
                        {likeModal.data.totalLikes > 0
                          ? `All ${likeModal.data.totalLikes} like${likeModal.data.totalLikes !== 1 ? "s" : ""} are from guest visitors`
                          : "No likes yet"}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
    </div>
  );
}