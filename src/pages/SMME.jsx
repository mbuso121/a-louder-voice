import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Storefront, ArrowRight, Heart, ChatCircle } from "@phosphor-icons/react";
import API from "../lib/api";
import SEO from "../components/SEO";
import SkeletonCard from "../components/SkeletonCard";


export default function SMME() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchStories(); }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts?category=smme`);
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F0E6] py-16 px-6">
      <SEO title="SMME Stories" description="Real stories from South African small business owners. Their journeys, struggles and triumphs on A Louder Voice." path="/smme" />
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-light italic" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            SMME Stories
          </h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto my-6" />
          <p className="text-lg text-[#F4F0E6]/70 max-w-2xl mx-auto">
            Meet the people behind small businesses. Their stories, struggles, and triumphs.
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center text-[#F4F0E6]/70">Loading stories...</p>
        ) : stories.length === 0 ? (
          <p className="text-center text-[#F4F0E6]/70">No stories yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, idx) => (
              <motion.div key={story._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div
                  onClick={() => navigate(`/post/${story._id}`)}
                  className="bg-[#1A1A1A] overflow-hidden cursor-pointer hover:ring-1 hover:ring-[#C5A059] transition group"
                >
                  {/* IMAGE */}
                  {story.image ? (
                    <img src={story.image} alt={story.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-64 bg-[#2A2A2A] flex items-center justify-center">
                      <Storefront size={64} className="text-[#C5A059]" />
                    </div>
                  )}

                  {/* VIDEO preview indicator */}
                  {story.video && !story.image && (
                    <div className="w-full h-64 bg-[#2A2A2A] flex flex-col items-center justify-center gap-2">
                      <div className="w-14 h-14 rounded-full border-2 border-[#C5A059] flex items-center justify-center">
                        <span className="text-[#C5A059] text-xl">▶</span>
                      </div>
                      <span className="text-xs text-[#F4F0E6]/50 uppercase tracking-widest">Video Story</span>
                    </div>
                  )}

                  <div className="p-7">
                    <span className="text-xs tracking-[0.2em] uppercase text-[#C5A059] block mb-2">{story.topic}</span>
                    <h2 className="text-2xl font-light mb-3 italic" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      {story.title}
                    </h2>
                    <p className="text-sm text-[#F4F0E6]/60 line-clamp-3 leading-relaxed mb-5">
                      {story.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#F4F0E6]/40">
                        {new Date(story.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                      </span>
                      <span className="flex items-center text-[#C5A059] text-xs uppercase tracking-widest group-hover:translate-x-1 transition">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Heart size={12} /> {story.likes || 0}</span>
                          <span className="flex items-center gap-1"><ChatCircle size={12} /> {story.comments?.length || 0}</span>
                        </div>
                        <span className="flex items-center text-[#C5A059] text-xs uppercase tracking-widest group-hover:translate-x-1 transition">Full Story <ArrowRight size={14} className="ml-1" /></span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
