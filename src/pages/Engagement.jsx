import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChatCircle, X, ArrowRight, ShareNetwork } from "@phosphor-icons/react";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";
import SEO from "../components/SEO";
import SkeletonCard from "../components/SkeletonCard";

export default function Engagement() {
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [topic,      setTopic]      = useState("all");
  const [selected,   setSelected]   = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [voteMap,    setVoteMap]    = useState({});
  const { user } = useAuth();
  const navigate  = useNavigate();

  const topics = ["all", "discussion", "poll"];

  useEffect(() => { fetchPosts(); }, [topic]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = topic === "all"
        ? `${API}/posts?category=engagement`
        : `${API}/posts?category=engagement&topic=${topic}`;
      const res = await axios.get(url);
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  };

  const handleLike = async (postId) => {
    if (!user) { navigate("/login"); return; }
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API}/posts/like/${postId}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikedPosts(prev => {
        const next = new Set(prev);
        res.data.userLiked ? next.add(postId) : next.delete(postId);
        return next;
      });
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
      if (selected?._id === postId) setSelected(s => ({ ...s, likes: res.data.likes, userLiked: res.data.userLiked }));
    } catch {}
  };

  const handleVote = async (postId, optionIndex) => {
    if (!user) { navigate("/login"); return; }
    if (voteMap[postId] !== undefined) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API}/posts/vote/${postId}/${optionIndex}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVoteMap(prev => ({ ...prev, [postId]: optionIndex }));
      setPosts(prev => prev.map(p => p._id === postId ? res.data : p));
      if (selected?._id === postId) setSelected(res.data);
    } catch {}
  };

  const openPost = (post) => {
    setSelected(post);
    document.body.style.overflow = "hidden";
  };

  const closePost = () => {
    setSelected(null);
    document.body.style.overflow = "";
  };

  const totalVotes = (poll) => poll?.options?.reduce((s, o) => s + (o.votes || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Engagement" description="Join polls, discussions and conversations on A Louder Voice." path="/engagement" />

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] mb-3">Community</p>
          <h1 className="text-5xl sm:text-6xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Engagement
          </h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mt-6" />
        </div>

        {/* TOPIC FILTER */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {topics.map(t => (
            <button key={t} onClick={() => setTopic(t)}
              className={`px-5 py-2 text-xs uppercase tracking-widest border transition ${
                topic === t
                  ? "bg-[#0A0A0A] text-[#F4F0E6] border-[#0A0A0A]"
                  : "border-[#0A0A0A]/20 hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* POSTS GRID */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-[#4A4A4A] py-16">No posts yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <motion.div key={post._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border hover:border-[#C5A059] transition cursor-pointer group flex flex-col"
                onClick={() => openPost(post)}>

                {post.image && (
                  <img src={post.image} alt={post.title}
                    className="w-full h-44 object-cover group-hover:opacity-90 transition" />
                )}

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-2">{post.topic}</p>
                  <h3 className="text-lg font-light mb-3 group-hover:text-[#C5A059] transition line-clamp-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] line-clamp-3 leading-relaxed flex-1">{post.content}</p>

                  {/* POLL PREVIEW */}
                  {post.poll && (
                    <div className="mt-3 space-y-1">
                      {post.poll.options?.slice(0, 2).map((opt, i) => (
                        <div key={i} className="text-xs bg-[#F4F0E6] px-3 py-1.5 truncate">
                          {opt.text}
                        </div>
                      ))}
                      {post.poll.options?.length > 2 && (
                        <p className="text-xs text-[#4A4A4A]">+{post.poll.options.length - 2} more options</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F4F0E6]">
                    <div className="flex items-center gap-3">
                      <button onClick={e => { e.stopPropagation(); handleLike(post._id); }}
                        className={`flex items-center gap-1 text-xs transition ${
                          likedPosts.has(post._id) ? "text-red-500" : "text-[#4A4A4A] hover:text-red-500"
                        }`}>
                        <Heart size={14} weight={likedPosts.has(post._id) ? "fill" : "regular"} />
                        {post.likes || 0}
                      </button>
                      <span className="flex items-center gap-1 text-xs text-[#4A4A4A]">
                        <ChatCircle size={14} /> {post.comments?.length || 0}
                      </span>
                    </div>
                    <span className="flex items-center text-[#C5A059] text-xs uppercase tracking-widest">
                      Open <ArrowRight size={12} className="ml-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── FULL POST MODAL ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={closePost}>

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-[#F4F0E6] w-full sm:max-w-2xl sm:rounded-lg overflow-hidden flex flex-col"
              style={{ maxHeight: "92vh" }}
              onClick={e => e.stopPropagation()}>

              {/* MODAL HEADER */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-[#0A0A0A]/10 flex-shrink-0">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1">{selected.topic}</p>
                  <h2 className="text-xl font-light leading-snug" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {selected.title}
                  </h2>
                </div>
                <button onClick={closePost} className="text-[#4A4A4A] hover:text-black transition flex-shrink-0 mt-1">
                  <X size={22} />
                </button>
              </div>

              {/* MODAL BODY — scrollable */}
              <div className="flex-1 overflow-y-auto px-5 py-4">

                {selected.image && (
                  <img src={selected.image} alt={selected.title}
                    className="w-full max-h-56 object-cover mb-4" />
                )}

                <p className="text-sm text-[#0A0A0A]/80 leading-relaxed whitespace-pre-line mb-4">
                  {selected.content}
                </p>

                {/* POLL */}
                {selected.poll && (
                  <div className="bg-white border p-4 mb-4">
                    <p className="font-medium text-sm mb-3">{selected.poll.question}</p>
                    <div className="space-y-2">
                      {selected.poll.options?.map((opt, i) => {
                        const total   = totalVotes(selected.poll);
                        const pct     = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                        const voted   = voteMap[selected._id] !== undefined;
                        const isVoted = voteMap[selected._id] === i;
                        return (
                          <button key={i} disabled={voted}
                            onClick={() => handleVote(selected._id, i)}
                            className={`w-full text-left transition ${voted ? "cursor-default" : "hover:opacity-80"}`}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className={isVoted ? "text-[#C5A059] font-medium" : ""}>{opt.text}</span>
                              {voted && <span className="text-xs text-[#4A4A4A]">{pct}%</span>}
                            </div>
                            <div className="h-2 bg-[#F4F0E6] rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-500 ${isVoted ? "bg-[#C5A059]" : "bg-[#0A0A0A]/20"}`}
                                style={{ width: voted ? `${pct}%` : "0%" }} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-[#4A4A4A] mt-3">{totalVotes(selected.poll)} vote{totalVotes(selected.poll) !== 1 ? "s" : ""}</p>
                    {!user && <p className="text-xs text-[#C5A059] mt-1">Log in to vote</p>}
                  </div>
                )}

                {/* READ FULL */}
                <button onClick={() => { closePost(); navigate(`/post/${selected._id}`); }}
                  className="text-xs uppercase tracking-widest text-[#C5A059] hover:underline flex items-center gap-1 mb-4">
                  Read full post <ArrowRight size={12} />
                </button>
              </div>

              {/* MODAL FOOTER — fixed */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#0A0A0A]/10 bg-[#F4F0E6] flex-shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleLike(selected._id)}
                    className={`flex items-center gap-1.5 text-sm transition ${
                      likedPosts.has(selected._id) ? "text-red-500" : "text-[#4A4A4A] hover:text-red-500"
                    }`}>
                    <Heart size={18} weight={likedPosts.has(selected._id) ? "fill" : "regular"} />
                    {selected.likes || 0} {selected.likes === 1 ? "like" : "likes"}
                  </button>
                  <span className="flex items-center gap-1.5 text-sm text-[#4A4A4A]">
                    <ChatCircle size={18} /> {selected.comments?.length || 0}
                  </span>
                </div>
                {!user && (
                  <button onClick={() => { closePost(); navigate("/login"); }}
                    className="text-xs uppercase tracking-widest text-[#C5A059] hover:underline">
                    Login to like & vote
                  </button>
                )}
                <a href={`https://wa.me/?text=${encodeURIComponent(selected.title + " " + window.location.origin + "/post/" + selected._id)}`}
                  target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-[#4A4A4A] hover:text-[#25D366] transition">
                  <ShareNetwork size={16} /> Share
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}