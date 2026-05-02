import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChatCircle, ArrowRight, X } from "@phosphor-icons/react";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";
import SEO from "../components/SEO";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ─── MODAL (full Instagram-style post view) ───────────────────────────────────
function PostModal({ post, onClose, onLike, onComment, onReply, user }) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [openReply, setOpenReply] = useState(null);
  const commentsRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setCommentText("");
  };

  const total = post.poll?.options?.reduce((s, o) => s + o.votes, 0) || 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white w-full max-w-5xl max-h-[90vh] flex overflow-hidden rounded-sm shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT — media/content */}
          <div className="flex-1 bg-[#0A0A0A] flex items-center justify-center min-h-[400px] overflow-hidden">
            {post.image ? (
              <img src={post.image} alt={post.title} className="w-full h-full object-contain max-h-[90vh]" />
            ) : post.video ? (
              <video controls autoPlay className="w-full max-h-[90vh]">
                <source src={post.video} />
              </video>
            ) : (
              <div className="p-10 text-[#F4F0E6] max-w-lg">
                {post.title && (
                  <h2 className="text-3xl font-light mb-4 italic" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {post.title}
                  </h2>
                )}
                <p className="text-[#F4F0E6]/80 text-sm leading-relaxed">{post.content}</p>

                {/* Poll in modal */}
                {post.poll?.question && (
                  <div className="mt-6">
                    <p className="font-medium mb-3 text-[#C5A059]">{post.poll.question}</p>
                    <div className="space-y-3">
                      {post.poll.options.map((opt, i) => {
                        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                        return (
                          <div key={i} className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{opt.text}</span>
                              <span className="text-[#C5A059]">{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                              <div className="h-full bg-[#C5A059]" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-[#F4F0E6]/30 mt-2">{total} votes</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — comments panel */}
          <div className="w-[360px] flex flex-col border-l border-gray-200 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A059]">{post.topic}</span>
                {post.title && <p className="text-sm font-medium line-clamp-1">{post.title}</p>}
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* If there's text content + media, show the text here */}
            {(post.image || post.video) && post.content && (
              <div className="px-4 py-3 border-b text-sm text-gray-700 leading-relaxed max-h-32 overflow-y-auto">
                {post.content}
              </div>
            )}

            {/* COMMENTS scroll area */}
            <div ref={commentsRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {post.comments?.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-6">No comments yet. Be first!</p>
              )}
              {post.comments?.map((c) => (
                <div key={c._id} className="text-sm">
                  <div className="flex gap-2 items-start">
                    <div className="w-7 h-7 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(c.user || "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-[#0A0A0A] mr-2">{c.user}</span>
                      <span className="text-gray-700">{c.text}</span>

                      {/* Replies */}
                      {c.replies?.map((r, i) => (
                        <div key={i} className="mt-2 flex gap-2 items-start pl-2 border-l-2 border-[#C5A059]/20">
                          <div className="w-5 h-5 rounded-full bg-[#EAE5D9] flex items-center justify-center text-[#4A4A4A] text-xs font-bold shrink-0">
                            {(r.user || "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-[#0A0A0A] mr-1">{r.user}</span>
                            <span className="text-xs text-gray-600">{r.text}</span>
                          </div>
                        </div>
                      ))}

                      {/* Reply toggle */}
                      {user && (
                        <div className="mt-1">
                          {openReply === c._id ? (
                            <div className="flex gap-2 mt-1">
                              <input
                                value={replyText[c._id] || ""}
                                onChange={(e) => setReplyText({ ...replyText, [c._id]: e.target.value })}
                                placeholder="Reply..."
                                className="flex-1 text-xs border-b border-gray-200 focus:outline-none py-1"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    onReply(post._id, c._id, replyText[c._id] || "");
                                    setReplyText({ ...replyText, [c._id]: "" });
                                    setOpenReply(null);
                                  }
                                }}
                              />
                              <button onClick={() => setOpenReply(null)} className="text-xs text-gray-400">✕</button>
                            </div>
                          ) : (
                            <button onClick={() => setOpenReply(c._id)} className="text-xs text-gray-400 hover:text-[#C5A059] mt-0.5">Reply</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="border-t px-4 py-3">
              <div className="flex items-center gap-4 mb-3">
                <button onClick={() => onLike(post._id)} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition">
                  <Heart size={22} />
                  <span className="text-sm font-medium">{post.likes || 0}</span>
                </button>
                <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <ChatCircle size={20} />
                  {post.comments?.length || 0}
                </span>
              </div>

              {/* COMMENT INPUT */}
              {user ? (
                <form onSubmit={submitComment} className="flex gap-2 items-center">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm border-b border-gray-200 focus:outline-none py-1"
                  />
                  <button type="submit" disabled={!commentText.trim()} className="text-sm text-[#C5A059] font-semibold disabled:opacity-40">
                    Post
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-400">Log in to comment</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Engagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts?category=engagement`);
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API}/posts/like/${postId}`);
      fetchPosts();
      if (selectedPost?._id === postId) {
        const res = await axios.get(`${API}/posts/${postId}`);
        setSelectedPost(res.data);
      }
    } catch (err) { console.error(err); }
  };

  const handleComment = async (postId, text) => {
    try {
      await axios.post(`${API}/posts/comment/${postId}`, { text, user: user?.name || "Anonymous" });
      fetchPosts();
      const res = await axios.get(`${API}/posts/${postId}`);
      setSelectedPost(res.data);
    } catch (err) { console.error(err); }
  };

  const handleReply = async (postId, commentId, text) => {
    if (!text.trim()) return;
    try {
      await axios.post(`${API}/posts/reply/${postId}/${commentId}`, { text, user: user?.name || "Anonymous" });
      fetchPosts();
      const res = await axios.get(`${API}/posts/${postId}`);
      setSelectedPost(res.data);
    } catch (err) { console.error(err); }
  };

  const openPost = (post) => { setSelectedPost(post); document.body.style.overflow = "hidden"; };
  const closePost = () => { setSelectedPost(null); document.body.style.overflow = ""; };

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Engagement" description="Join discussions, vote on polls, like and comment. Community engagement on A Louder Voice South Africa." path="/engagement" />
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl italic" style={{ fontFamily: "Cormorant Garamond, serif" }}>Engagement</h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto my-6" />
          <p className="text-lg text-[#4A4A4A]">Connect, discuss, and be heard.</p>
        </motion.div>

        {loading ? (
          <p className="text-center text-[#4A4A4A]">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-[#4A4A4A]">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post, idx) => {
              const total = post.poll?.options?.reduce((s, o) => s + o.votes, 0) || 0;
              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-white border border-[#E0DBD1] shadow-sm overflow-hidden"
                >
                  {/* POST HEADER */}
                  <div className="px-5 py-3 border-b border-[#E0DBD1] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-xs font-bold">
                        A
                      </div>
                      <div>
                        <p className="text-xs font-semibold">A Louder Voice</p>
                        <p className="text-xs text-[#C5A059] uppercase tracking-widest">{post.topic}</p>
                      </div>
                    </div>
                  </div>

                  {/* IMAGE / VIDEO — clickable to open modal */}
                  {post.image && (
                    <div className="cursor-pointer" onClick={() => openPost(post)}>
                      <img src={post.image} alt={post.title}
                        className="w-full max-h-[500px] object-cover hover:opacity-95 transition" />
                    </div>
                  )}
                  {post.video && (
                    <video controls className="w-full max-h-[500px]">
                      <source src={post.video} />
                    </video>
                  )}

                  {/* CONTENT */}
                  <div className="px-5 py-4">
                    {post.title && <h3 className="font-semibold text-lg mb-1">{post.title}</h3>}
                    <p className="text-sm text-[#4A4A4A] leading-relaxed line-clamp-3">{post.content}</p>

                    {/* POLL */}
                    {post.poll?.question && (
                      <div className="mt-4 bg-[#F4F0E6] p-4">
                        <p className="font-medium text-sm mb-3">{post.poll.question}</p>
                        <div className="space-y-2">
                          {post.poll.options.map((opt, i) => {
                            const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                            return (
                              <button key={i} onClick={() => { axios.post(`${API}/posts/vote/${post._id}/${i}`).then(fetchPosts); }}
                                className="w-full text-left group">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="group-hover:text-[#C5A059] transition">{opt.text}</span>
                                  <span className="text-[#C5A059] font-medium">{pct}%</span>
                                </div>
                                <div className="h-2 bg-[#EAE5D9] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#C5A059] transition-all duration-500" style={{ width: `${pct}%` }} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{total} votes</p>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS BAR */}
                  <div className="px-5 pb-3 flex items-center gap-5 border-t border-[#E0DBD1] pt-3">
                    <button onClick={() => handleLike(post._id)} className="flex items-center gap-1.5 text-[#4A4A4A] hover:text-red-500 transition">
                      <Heart size={20} />
                      <span className="text-sm">{post.likes || 0}</span>
                    </button>
                    <button onClick={() => openPost(post)} className="flex items-center gap-1.5 text-[#4A4A4A] hover:text-[#C5A059] transition">
                      <ChatCircle size={20} />
                      <span className="text-sm">{post.comments?.length || 0} comments</span>
                    </button>
                    <button onClick={() => openPost(post)} className="ml-auto flex items-center gap-1 text-xs text-[#C5A059] uppercase tracking-widest hover:translate-x-1 transition">
                      View all <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* PREVIEW — latest comment */}
                  {post.comments?.length > 0 && (
                    <div className="px-5 pb-4 text-sm">
                      <span className="font-semibold text-[#0A0A0A] mr-2">{post.comments.at(-1).user}</span>
                      <span className="text-[#4A4A4A]">{post.comments.at(-1).text}</span>
                      {post.comments.length > 1 && (
                        <button onClick={() => openPost(post)} className="block text-xs text-gray-400 mt-1 hover:text-[#C5A059] transition">
                          View all {post.comments.length} comments
                        </button>
                      )}
                    </div>
                  )}

                  {/* QUICK COMMENT INPUT */}
                  {user && (
                    <div className="px-5 pb-4 border-t border-[#E0DBD1] pt-3">
                      <QuickComment postId={post._id} userName={user.name} onDone={fetchPosts} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={closePost}
          onLike={handleLike}
          onComment={handleComment}
          onReply={handleReply}
          user={user}
        />
      )}
    </div>
  );
}

function QuickComment({ postId, userName, onDone }) {
  const [text, setText] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post(`${API}/posts/comment/${postId}`, { text, user: userName || "Anonymous" });
    setText("");
    onDone();
  };
  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 text-sm border-b border-[#E0DBD1] bg-transparent py-1 focus:outline-none"
      />
      <button type="submit" disabled={!text.trim()} className="text-sm text-[#C5A059] font-semibold disabled:opacity-40">
        Post
      </button>
    </form>
  );
}
