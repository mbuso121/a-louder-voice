import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ChatCircle, ShareNetwork, WhatsappLogo, TwitterLogo, FacebookLogo, LinkedinLogo, TelegramLogo, RedditLogo, EnvelopeSimple, Link as LinkIcon, X as XIcon } from "@phosphor-icons/react";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";
import SEO, { ArticleSchema } from "../components/SEO";
 
const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
 
export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [openReply, setOpenReply] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);
 
  useEffect(() => {
    fetchPost();
  }, [id]);
 
  const fetchRelated = async (category) => {
    try {
      const res = await axios.get(`${API}/posts?category=${category}&limit=3`);
      setRelated((Array.isArray(res.data) ? res.data : []).filter(p => p._id !== id).slice(0, 3));
    } catch {}
  };
 
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${API}/posts/${id}`);
      setPost(res.data);
      setUserLiked(res.data.userLiked || false);
      fetchRelated(res.data.category);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleLike = async () => {
    try {
      await axios.post(`${API}/posts/like/${id}`);
      fetchPost();
    } catch (err) { console.error(err); }
  };
 
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API}/posts/comment/${id}`, {
        text: commentText,
        user: user?.name || "Anonymous"
      });
      setCommentText("");
      fetchPost();
    } catch (err) { console.error(err); }
  };
 
  const handleReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    try {
      await axios.post(`${API}/posts/reply/${id}/${commentId}`, {
        text: replyText[commentId],
        user: user?.name || "Anonymous"
      });
      setReplyText({ ...replyText, [commentId]: "" });
      setOpenReply(null);
      fetchPost();
    } catch (err) { console.error(err); }
  };
 
  const handleVote = async (optionIndex) => {
    try {
      await axios.post(`${API}/posts/vote/${id}/${optionIndex}`);
      fetchPost();
    } catch (err) { console.error(err); }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center">
        <p className="text-[#4A4A4A]">Loading...</p>
      </div>
    );
  }
 
  if (!post) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] flex flex-col items-center justify-center gap-4">
        <p className="text-[#4A4A4A]">Post not found.</p>
        <button onClick={() => navigate(-1)} className="text-[#C5A059] flex items-center gap-2">
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );
  }
 
  const postUrl = typeof window !== "undefined" ? window.location.href : "";
 
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;
 
  const nativeShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.content?.slice(0, 100) + "...",
        url: postUrl,
      });
    } catch {}
  };
 
  const copyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
 
  const readTime = post.content
    ? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))
    : 1;
 
  const bgColor = post.category === "smme" ? "bg-[#0A0A0A] text-[#F4F0E6]" : "bg-[#F4F0E6] text-[#0A0A0A]";
  const seoImage = post.image || undefined;
 
  return (
    <div className={`min-h-screen ${bgColor}`}>
      <SEO
        title={post.title || "Post"}
        description={post.content ? post.content.slice(0, 155) + "..." : ""}
        path={`/post/${post._id}`}
        image={seoImage}
      />
      <ArticleSchema post={post} url={`/post/${post._id}`} />
      <div className="max-w-3xl mx-auto px-6 py-16">
 
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#C5A059] mb-10 hover:gap-3 transition-all text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>
 
        {/* CATEGORY + TOPIC */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">
            {post.category} {post.topic ? `· ${post.topic}` : ""}
          </span>
 
          {/* TITLE */}
          <h1
            className="text-4xl sm:text-5xl font-light mt-3 mb-6 leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {post.title || "(Untitled)"}
          </h1>
 
          {/* META */}
          <div className="flex items-center gap-4 text-xs text-[#4A4A4A] mb-8 pb-6 border-b border-[#0A0A0A]/10">
            <span>{post.is_anonymous ? "Anonymous" : (post.author_name || post.author || "Admin")}</span>
            <span>·</span>
<span>{new Date(post.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="text-[#0A0A0A]/30">·</span>
            <span>{readTime} min read</span>
          </div>
 
          {/* HERO IMAGE */}
          {post.image && (
            <div className="mb-8 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}
 
          {/* VIDEO */}
          {post.video && (
            <div className="mb-8">
              <video controls className="w-full max-h-[500px]">
                <source src={post.video} />
              </video>
            </div>
          )}
 
          {/* CONTENT */}
          <div className="prose max-w-none">
            <p className="text-[17px] leading-[2] whitespace-pre-wrap">{post.content}</p>
          </div>
 
          {/* POLL */}
          {post.poll?.question && (
            <div className="mt-10 bg-[#EAE5D9] p-6">
              <p className="font-medium text-lg mb-4">{post.poll.question}</p>
              <div className="space-y-3">
                {post.poll.options.map((opt, i) => {
                  const total = post.poll.options.reduce((s, o) => s + o.votes, 0);
                  const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                  return (
                    <button key={i} onClick={() => handleVote(i)} className="w-full text-left group">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="group-hover:text-[#C5A059] transition">{opt.text}</span>
                        <span className="text-[#C5A059] font-medium">{pct}%</span>
                      </div>
                      <div className="h-2 bg-[#D4CFC3] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C5A059] transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#4A4A4A] mt-3">
                {post.poll.options.reduce((s, o) => s + o.votes, 0)} votes · click to vote
              </p>
            </div>
          )}
 
          {/* LIKE + COMMENT COUNT */}
          <div className="flex items-center gap-8 mt-10 pt-8 border-t border-[#0A0A0A]/10">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition group ${
                userLiked ? "text-red-500" : "text-[#4A4A4A] hover:text-red-500"
              }`}
              title={userLiked ? "Unlike" : "Like"}
            >
              <Heart size={22} weight={userLiked ? "fill" : "regular"} className="group-hover:scale-110 transition" />
              <span className="text-sm">{post.likes || 0} {post.likes === 1 ? "like" : "likes"}</span>
            </button>
            <span className="flex items-center gap-2 text-[#4A4A4A] text-sm">
              <ChatCircle size={22} />
              {post.comments?.length || 0} comments
            </span>
            <div className="relative ml-auto">
              <button onClick={() => setShowShare(!showShare)}
                className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#C5A059] transition text-sm">
                <ShareNetwork size={22} /> Share
              </button>
              {showShare && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                  onClick={() => setShowShare(false)}>
                  <div className="bg-white w-full max-w-sm shadow-2xl"
                    onClick={e => e.stopPropagation()}>
 
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#0A0A0A]/10">
                      <span className="text-sm font-medium uppercase tracking-widest">Share this post</span>
                      <button onClick={() => setShowShare(false)} className="text-[#4A4A4A] hover:text-black transition">
                        <XIcon size={18} />
                      </button>
                    </div>
 
                    {/* Post title preview */}
                    <div className="px-5 py-3 bg-[#F4F0E6] border-b border-[#0A0A0A]/10">
                      <p className="text-xs text-[#4A4A4A] line-clamp-2 italic">"{post.title}"</p>
                    </div>
 
                    {/* Share options */}
                    <div className="grid grid-cols-4 gap-1 p-4">
                      {[
                        {
                          label: "WhatsApp",
                          icon: <WhatsappLogo size={24} weight="fill" />,
                          color: "text-[#25D366]",
                          bg: "hover:bg-[#25D366]/10",
                          href: `https://wa.me/?text=${encodeURIComponent(post.title + "\n\n" + postUrl)}`
                        },
                        {
                          label: "Facebook",
                          icon: <FacebookLogo size={24} weight="fill" />,
                          color: "text-[#1877F2]",
                          bg: "hover:bg-[#1877F2]/10",
                          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
                        },
                        {
                          label: "Twitter / X",
                          icon: <TwitterLogo size={24} weight="fill" />,
                          color: "text-[#1DA1F2]",
                          bg: "hover:bg-[#1DA1F2]/10",
                          href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`
                        },
                        {
                          label: "LinkedIn",
                          icon: <LinkedinLogo size={24} weight="fill" />,
                          color: "text-[#0A66C2]",
                          bg: "hover:bg-[#0A66C2]/10",
                          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
                        },
                        {
                          label: "Telegram",
                          icon: <TelegramLogo size={24} weight="fill" />,
                          color: "text-[#26A5E4]",
                          bg: "hover:bg-[#26A5E4]/10",
                          href: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`
                        },
                        {
                          label: "Reddit",
                          icon: <RedditLogo size={24} weight="fill" />,
                          color: "text-[#FF4500]",
                          bg: "hover:bg-[#FF4500]/10",
                          href: `https://reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`
                        },
                        {
                          label: "Email",
                          icon: <EnvelopeSimple size={24} weight="fill" />,
                          color: "text-[#C5A059]",
                          bg: "hover:bg-[#C5A059]/10",
                          href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent("I thought you'd enjoy this:\n\n" + post.title + "\n\n" + postUrl)}`
                        },
                        canNativeShare ? {
                          label: "More",
                          icon: <ShareNetwork size={24} />,
                          color: "text-[#4A4A4A]",
                          bg: "hover:bg-[#F4F0E6]",
                          onClick: nativeShare
                        } : null
                      ].filter(Boolean).map((opt) => (
                        opt.onClick ? (
                          <button key={opt.label} onClick={opt.onClick}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded transition ${opt.color} ${opt.bg}`}>
                            {opt.icon}
                            <span className="text-[10px] text-[#4A4A4A] text-center leading-tight">{opt.label}</span>
                          </button>
                        ) : (
                          <a key={opt.label} href={opt.href} target="_blank" rel="noreferrer"
                            className={`flex flex-col items-center gap-1.5 p-3 rounded transition ${opt.color} ${opt.bg}`}>
                            {opt.icon}
                            <span className="text-[10px] text-[#4A4A4A] text-center leading-tight">{opt.label}</span>
                          </a>
                        )
                      ))}
                    </div>
 
                    {/* Copy link */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2 bg-[#F4F0E6] border border-[#0A0A0A]/10 px-3 py-2">
                        <span className="text-xs text-[#4A4A4A] flex-1 truncate">{postUrl}</span>
                        <button onClick={copyLink}
                          className={`text-xs uppercase tracking-widest flex-shrink-0 transition font-medium ${copied ? "text-green-600" : "text-[#C5A059] hover:text-black"}`}>
                          {copied ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
 
                  </div>
                </div>
              )}
            </div>
          </div>
 
          {/* COMMENT INPUT */}
          <div className="mt-8">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[#C5A059] mb-4">
              Leave a Comment
            </h3>
            <form onSubmit={handleComment} className="flex gap-3">
              <div className="flex-1">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value.slice(0, 1000))}
                  placeholder={user ? "Write something..." : "Login to comment"}
                  disabled={!user}
                  className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none disabled:opacity-40"
                  maxLength={1000}
                />
                {commentText.length > 800 && (
                  <span className={`text-xs ${commentText.length >= 1000 ? "text-red-500" : "text-[#4A4A4A]"}`}>
                    {1000 - commentText.length} chars remaining
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={!user || !commentText.trim()}
                className="bg-[#0A0A0A] text-[#F4F0E6] px-5 py-2 text-sm hover:bg-[#C5A059] transition disabled:opacity-40"
              >
                Post
              </button>
            </form>
          </div>
 
          {/* COMMENTS LIST */}
          {post.comments?.length > 0 && (
            <div className="mt-8 space-y-6">
              {post.comments.map((c) => (
                <div key={c._id} className="border-b border-[#0A0A0A]/10 pb-5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-[#C5A059]">{c.user}</span>
                    <span className="text-xs text-[#4A4A4A]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{c.text}</p>
 
                  {/* REPLIES */}
                  {c.replies?.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-[#C5A059]/30 space-y-2">
                      {c.replies.map((r, i) => (
                        <div key={i}>
                          <span className="text-xs font-medium text-[#C5A059]">{r.user}</span>
                          <p className="text-xs text-[#4A4A4A]">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
 
                  {/* REPLY BUTTON */}
                  {user && (
                    <div className="mt-2">
                      {openReply === c._id ? (
                        <div className="flex gap-2 mt-2">
                          <input
                            value={replyText[c._id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [c._id]: e.target.value })}
                            placeholder="Write a reply..."
                            className="flex-1 border-b border-[#0A0A0A]/20 bg-transparent py-1 text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleReply(c._id)}
                            className="text-xs bg-[#4A4A4A] text-white px-3 py-1 hover:bg-[#C5A059] transition"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => setOpenReply(null)}
                            className="text-xs text-[#4A4A4A]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setOpenReply(c._id)}
                          className="text-xs text-[#4A4A4A] hover:text-[#C5A059] transition mt-1"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
 
        {/* RELATED POSTS */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#0A0A0A]/10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-6">More from {post.category}</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map(r => (
                <div key={r._id} onClick={() => { navigate(`/post/${r._id}`); window.scrollTo(0,0); }}
                  className="cursor-pointer group">
                  {r.image ? (
                    <img src={r.image} alt={r.title} className="w-full h-32 object-cover mb-3 group-hover:opacity-80 transition" />
                  ) : (
                    <div className="w-full h-32 bg-[#EAE5D9] mb-3 flex items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-[#4A4A4A]">{r.category}</span>
                    </div>
                  )}
                  <p className="text-sm font-medium group-hover:text-[#C5A059] transition line-clamp-2">{r.title || "(Untitled)"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
 
        </motion.div>
      </div>
    </div>
  );
}