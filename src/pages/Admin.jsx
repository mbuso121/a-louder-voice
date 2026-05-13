import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Plus, Trash, Users, Heart, ChartBar, Article, Eye, ArrowLeft, Warning } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";

const safe = (fn) => fn.catch(e => ({ error: e.message, data: null }));

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pendingPosts,  setPendingPosts]  = useState([]);
  const [allPosts,      setAllPosts]      = useState([]);
  const [users,         setUsers]         = useState([]);
  const [topPosts,      setTopPosts]      = useState([]);
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [fetchError,    setFetchError]    = useState("");
  const [activeTab,     setActiveTab]     = useState("pending");
  const [likeModal,     setLikeModal]     = useState(null);
  const [likeLoading,   setLikeLoading]   = useState(false);
  const [creating,      setCreating]      = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError,   setCreateError]   = useState("");

  const [form, setForm] = useState({
    category: "analysis", topic: "relationships",
    title: "", content: "", image: null, video: null,
    pollQuestion: "", pollOptions: ""
  });

  const token = localStorage.getItem("token");
  const auth  = { headers: { Authorization: `Bearer ${token}` } };

  const topicsByCategory = {
    analysis:   ["relationships", "self-growth", "society"],
    engagement: ["discussion", "poll"],
    letters:    ["love", "heartbreak", "family", "friendship"],
    smme:       ["business", "startup"]
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setFetchError("");
    try {
      // Fetch each independently so one failure doesn't block others
      const [pendingRes, allRes, statsRes, usersRes, topRes] = await Promise.allSettled([
        axios.get(`${API}/admin/pending`,   auth),
        axios.get(`${API}/admin/posts`,     auth),
        axios.get(`${API}/admin/stats`,     auth),
        axios.get(`${API}/admin/users`,     auth),
        axios.get(`${API}/admin/top-posts`, auth),
      ]);

      if (pendingRes.status === "fulfilled") setPendingPosts(Array.isArray(pendingRes.value.data) ? pendingRes.value.data : []);
      if (allRes.status    === "fulfilled") setAllPosts(Array.isArray(allRes.value.data) ? allRes.value.data : []);
      if (statsRes.status  === "fulfilled") setStats(statsRes.value.data);
      if (usersRes.status  === "fulfilled") setUsers(Array.isArray(usersRes.value.data) ? usersRes.value.data : []);
      if (topRes.status    === "fulfilled") setTopPosts(Array.isArray(topRes.value.data) ? topRes.value.data : []);

      // Log any failures
      [pendingRes, allRes, statsRes, usersRes, topRes].forEach((r, i) => {
        if (r.status === "rejected") {
          const names = ["pending","posts","stats","users","top-posts"];
          console.error(`Admin fetch failed [${names[i]}]:`, r.reason?.response?.data || r.reason?.message);
        }
      });

      // Check if all failed — likely auth issue
      const allFailed = [pendingRes, allRes, statsRes].every(r => r.status === "rejected");
      if (allFailed) {
        const reason = pendingRes.reason?.response?.data?.error || "Failed to load. Check your session.";
        setFetchError(reason);
      }

    } catch (err) {
      console.error("Admin fatal error:", err);
      setFetchError("Unexpected error loading dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try { await axios.put(`${API}/admin/approve/${id}`, {}, auth); fetchData(); }
    catch (err) { alert(err.response?.data?.error || "Failed to approve"); }
  };

  const handleReject = async (id) => {
    try { await axios.put(`${API}/admin/reject/${id}`, {}, auth); fetchData(); }
    catch (err) { alert(err.response?.data?.error || "Failed to reject"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try { await axios.delete(`${API}/admin/${id}`, auth); fetchData(); }
    catch (err) { alert(err.response?.data?.error || "Failed to delete"); }
  };

  const viewLikes = async (post) => {
    setLikeModal({ postId: post._id, title: post.title, data: null });
    setLikeLoading(true);
    try {
      const res = await axios.get(`${API}/admin/post-likes/${post._id}`, auth);
      setLikeModal({ postId: post._id, title: post.title, data: res.data });
    } catch (err) {
      console.error("Likes fetch error:", err);
      setLikeModal(null);
    } finally { setLikeLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true); setCreateError("");
    try {
      const fd = new FormData();
      fd.append("category", form.category);
      fd.append("topic",    form.topic);
      fd.append("title",    form.title);
      fd.append("content",  form.content);
      if (form.image) fd.append("image", form.image);
      if (form.video) fd.append("video", form.video);
      if (form.topic === "poll") {
        fd.append("pollQuestion", form.pollQuestion);
        fd.append("pollOptions",  JSON.stringify(form.pollOptions.split(",")));
      }
      await axios.post(`${API}/posts/create`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setCreateSuccess(true);
      setForm({ category: "analysis", topic: "relationships", title: "", content: "", image: null, video: null, pollQuestion: "", pollOptions: "" });
      setTimeout(() => setCreateSuccess(false), 3000);
      fetchData();
    } catch (err) {
      setCreateError(err.response?.data?.error || "Failed to publish. Check Cloudinary env vars.");
    } finally { setCreating(false); }
  };

  const TABS = [
    { id: "pending",  label: `Pending${pendingPosts.length > 0 ? ` (${pendingPosts.length})` : ""}` },
    { id: "all",      label: "All Posts" },
    { id: "users",    label: "Users" },
    { id: "insights", label: "Insights" },
    { id: "create",   label: "+ Create" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F0E6]">

      {/* TOP BAR */}
      <div className="bg-[#0A0A0A] text-[#F4F0E6] px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div>
          <h1 className="text-lg tracking-widest uppercase" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            A <span className="text-[#C5A059]">Louder</span> Voice
            <span className="text-[#F4F0E6]/40 ml-2 text-sm">/ Admin</span>
          </h1>
          <p className="text-xs text-[#F4F0E6]/40 mt-0.5">Welcome, {user?.name}</p>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs text-[#F4F0E6]/70 hover:text-[#C5A059] transition border border-white/20 hover:border-[#C5A059] px-4 py-2 uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Site
          </button>
          <button onClick={() => { logout(); navigate("/login"); }}
            className="text-xs border border-white/20 px-4 py-2 hover:border-red-400 hover:text-red-400 transition uppercase tracking-widest">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* FETCH ERROR */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6 flex items-center gap-3">
            <Warning size={18} />
            <span className="text-sm">{fetchError}</span>
            <button onClick={fetchData} className="ml-auto text-xs underline">Retry</button>
          </div>
        )}

        {/* STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {[
              { label: "Total Posts",  value: stats.total,    icon: <Article size={16} /> },
              { label: "Pending",      value: stats.pending,  icon: <Eye size={16} />,     highlight: stats.pending > 0 },
              { label: "Published",    value: stats.approved, icon: <Check size={16} /> },
              { label: "Rejected",     value: stats.rejected, icon: <X size={16} /> },
              { label: "Members",      value: stats.members,  icon: <Users size={16} /> },
            ].map(({ label, value, icon, highlight }) => (
              <div key={label} className={`p-4 text-center border-l-2 ${
                highlight ? "bg-yellow-50 border-yellow-400" : "bg-white border-[#C5A059]"
              }`}>
                <div className={`flex justify-center mb-1 ${highlight ? "text-yellow-600" : "text-[#C5A059]"}`}>{icon}</div>
                <p className={`text-3xl font-light ${highlight ? "text-yellow-700" : "text-[#0A0A0A]"}`}
                   style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {value ?? "—"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#4A4A4A] mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-0 mb-6 border-b border-[#0A0A0A]/10 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-5 text-xs uppercase tracking-widest whitespace-nowrap transition border-b-2 -mb-[1px] ${
                activeTab === tab.id
                  ? "border-[#C5A059] text-[#C5A059]"
                  : "border-transparent text-[#4A4A4A] hover:text-[#0A0A0A]"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* ── PENDING TAB ── */}
            {activeTab === "pending" && (
              <div>
                {pendingPosts.length === 0 ? (
                  <div className="text-center py-20 bg-white border">
                    <Check size={36} className="text-green-500 mx-auto mb-3" />
                    <p className="text-[#4A4A4A]">All caught up — no pending submissions.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPosts.map(post => (
                      <motion.div key={post._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white border p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#C5A059] uppercase tracking-widest mb-1">
                              {post.category} · {post.topic}
                            </p>
                            <h3 className="text-lg font-light mb-2">{post.title || "(No title)"}</h3>
                            <p className="text-sm text-[#4A4A4A] line-clamp-3 leading-relaxed">{post.content}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#4A4A4A]">
                              <span>By: <strong>{post.is_anonymous ? "Anonymous" : (post.author_name || post.author || "Unknown")}</strong></span>
                              <span>{new Date(post.createdAt).toLocaleDateString("en-ZA")}</span>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2 flex-shrink-0">
                            <button onClick={() => handleApprove(post._id)}
                              className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-green-700 transition flex items-center justify-center gap-1">
                              <Check size={14} /> Approve
                            </button>
                            <button onClick={() => handleReject(post._id)}
                              className="flex-1 sm:flex-none bg-red-500 text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-red-600 transition flex items-center justify-center gap-1">
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </div>
                        {post.image && (
                          <img src={post.image} alt="" className="mt-4 max-h-40 object-cover rounded" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ALL POSTS TAB ── */}
            {activeTab === "all" && (
              <div className="bg-white border overflow-x-auto">
                {allPosts.length === 0 ? (
                  <p className="text-center py-16 text-[#4A4A4A]">No posts yet.</p>
                ) : (
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-[#F4F0E6] text-[10px] uppercase tracking-widest text-[#4A4A4A]">
                      <tr>
                        <th className="text-left px-4 py-3">Title</th>
                        <th className="text-left px-4 py-3">Category</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-right px-4 py-3">Likes</th>
                        <th className="text-right px-4 py-3">Comments</th>
                        <th className="text-right px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPosts.map((post, i) => (
                        <tr key={post._id}
                          className={`border-t border-[#F4F0E6] hover:bg-[#FAFAF8] transition ${i % 2 === 0 ? "" : "bg-[#FAFAF8]/50"}`}>
                          <td className="px-4 py-3">
                            <p className="font-medium line-clamp-1 max-w-[220px]">{post.title || "(No title)"}</p>
                            <p className="text-xs text-[#4A4A4A] mt-0.5">{new Date(post.createdAt).toLocaleDateString("en-ZA")}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs uppercase text-[#C5A059] tracking-widest">{post.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 uppercase tracking-widest ${
                              post.status === "approved" ? "bg-green-100 text-green-700"
                              : post.status === "pending" ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                            }`}>{post.status}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => viewLikes(post)}
                              className="flex items-center gap-1 ml-auto hover:text-red-500 transition text-[#4A4A4A]">
                              <Heart size={13} weight={post.likes > 0 ? "fill" : "regular"}
                                className={post.likes > 0 ? "text-red-400" : ""} />
                              {post.likes || 0}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right text-[#4A4A4A]">
                            {post.comments?.length || 0}
                          </td>
                          <td className="px-4 py-3">
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
                )}
              </div>
            )}

            {/* ── USERS TAB ── */}
            {activeTab === "users" && (
              <div>
                <p className="text-sm text-[#4A4A4A] mb-4">
                  {users.length} registered member{users.length !== 1 ? "s" : ""}
                </p>
                {users.length === 0 ? (
                  <div className="text-center py-20 bg-white border">
                    <Users size={36} className="text-[#C5A059] mx-auto mb-3" />
                    <p className="text-[#4A4A4A]">No users yet.</p>
                  </div>
                ) : (
                  <div className="bg-white border overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                      <thead className="bg-[#F4F0E6] text-[10px] uppercase tracking-widest text-[#4A4A4A]">
                        <tr>
                          <th className="text-left px-4 py-3">Name</th>
                          <th className="text-left px-4 py-3">Email</th>
                          <th className="text-left px-4 py-3">Role</th>
                          <th className="text-left px-4 py-3">Verified</th>
                          <th className="text-left px-4 py-3">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u._id}
                            className={`border-t border-[#F4F0E6] hover:bg-[#FAFAF8] transition ${i % 2 === 0 ? "" : "bg-[#FAFAF8]/50"}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                  {u.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <span className="font-medium">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#4A4A4A]">{u.email}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 uppercase tracking-widest ${
                                u.role === "admin" ? "bg-[#C5A059]/20 text-[#8B6914]" : "bg-gray-100 text-gray-600"
                              }`}>{u.role || "user"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 uppercase tracking-widest ${
                                u.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                              }`}>{u.isVerified ? "Yes" : "No"}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-[#4A4A4A]">
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

            {/* ── INSIGHTS TAB ── */}
            {activeTab === "insights" && (
              <div className="space-y-8">

                {/* TOP LIKED POSTS */}
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 flex items-center gap-2">
                    <Heart size={13} weight="fill" className="text-red-400" /> Top Liked Posts
                  </h2>
                  {topPosts.length === 0 ? (
                    <p className="text-[#4A4A4A] text-sm py-8 text-center bg-white border">No approved posts yet.</p>
                  ) : (
                    <div className="bg-white border overflow-x-auto">
                      <table className="w-full text-sm min-w-[400px]">
                        <thead className="bg-[#F4F0E6] text-[10px] uppercase tracking-widest text-[#4A4A4A]">
                          <tr>
                            <th className="text-left px-4 py-3">#</th>
                            <th className="text-left px-4 py-3">Post</th>
                            <th className="text-right px-4 py-3">Likes</th>
                            <th className="text-right px-4 py-3">Comments</th>
                            <th className="text-left px-4 py-3">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topPosts.map((post, i) => (
                            <tr key={post._id} className="border-t border-[#F4F0E6] hover:bg-[#FAFAF8] transition">
                              <td className="px-4 py-3">
                                <span className="text-lg font-light text-[#C5A059]">#{i + 1}</span>
                              </td>
                              <td className="px-4 py-3">
                                <button onClick={() => viewLikes(post)}
                                  className="font-medium hover:text-[#C5A059] transition text-left line-clamp-1 max-w-[200px]">
                                  {post.title || "(No title)"}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="flex items-center justify-end gap-1 text-red-500 font-medium">
                                  <Heart size={13} weight="fill" /> {post.likes || 0}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-[#4A4A4A]">{post.commentCount || 0}</td>
                              <td className="px-4 py-3">
                                <span className="text-xs uppercase tracking-widest text-[#C5A059]">{post.category}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className="text-xs text-[#4A4A4A] mt-2">Click a post title to see who liked it.</p>
                </div>

                {/* OVERVIEW */}
                {stats && (
                  <div>
                    <h2 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 flex items-center gap-2">
                      <ChartBar size={13} /> Content Overview
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

            {/* ── CREATE POST TAB ── */}
            {activeTab === "create" && (
              <div className="bg-white border p-6 sm:p-8 max-w-2xl">
                <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
                  <Plus size={20} /> New Post
                </h2>

                {createSuccess && (
                  <div className="mb-4 bg-green-100 text-green-700 p-3 text-sm flex items-center gap-2">
                    <Check size={16} /> Post published successfully!
                  </div>
                )}
                {createError && (
                  <div className="mb-4 bg-red-100 text-red-700 p-3 text-sm">{createError}</div>
                )}

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
                      className="w-full border p-2 text-sm" placeholder="Post title" required />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widests text-[#C5A059] mb-1">Content</label>
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                      className="w-full border p-2 h-40 resize-none text-sm" placeholder="Write your content..." required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Image (optional)</label>
                      <input type="file" accept="image/*" className="text-sm w-full"
                        onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-1">Video (optional)</label>
                      <input type="file" accept="video/*" className="text-sm w-full"
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
          </>
        )}

      </div>

      {/* ── LIKES MODAL ── */}
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
                <button onClick={() => setLikeModal(null)}
                  className="text-[#4A4A4A] hover:text-black p-1"><X size={18} /></button>
              </div>

              <div className="p-6">
                {likeLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : likeModal.data ? (
                  <>
                    <div className="flex gap-3 mb-5">
                      {[
                        { label: "Total", value: likeModal.data.totalLikes },
                        { label: "Members", value: likeModal.data.registeredLikes?.length || 0 },
                        { label: "Guests", value: likeModal.data.anonymousLikes || 0 },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex-1 bg-[#F4F0E6] p-3 text-center">
                          <p className="text-2xl font-light text-[#C5A059]">{value}</p>
                          <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">{label}</p>
                        </div>
                      ))}
                    </div>

                    {likeModal.data.registeredLikes?.length > 0 ? (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#4A4A4A] mb-3">Liked by members:</p>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {likeModal.data.registeredLikes.map(u => (
                            <div key={u._id} className="flex items-center gap-3 py-2 border-b border-[#F4F0E6]">
                              <div className="w-7 h-7 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                {u.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium">{u.name}</p>
                                <p className="text-xs text-[#4A4A4A] truncate">{u.email}</p>
                              </div>
                              <Heart size={13} weight="fill" className="text-red-400 ml-auto flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#4A4A4A] text-center py-4">
                        {likeModal.data.totalLikes > 0
                          ? `All ${likeModal.data.totalLikes} like${likeModal.data.totalLikes !== 1 ? "s" : ""} are from guest visitors`
                          : "No likes yet"}
                      </p>
                    )}
                  </>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}