import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import API from "../lib/api";
import SEO from "../components/SEO";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function Letters() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const navigate = useNavigate();

  const topics = ["all", "love", "heartbreak", "family", "friendship"];

  useEffect(() => { fetchLetters(); }, [selectedTopic]);

  const fetchLetters = async () => {
    setLoading(true);
    try {
      const url = selectedTopic === "all"
        ? `${API}/posts?category=letters`
        : `${API}/posts?category=letters&topic=${selectedTopic}`;
      const { data } = await axios.get(url);
      setLetters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE5D9] py-16 px-6">
      <SEO title="Unsent Letters" description="Anonymous and named letters never sent. Words left unspoken, shared on A Louder Voice South Africa." path="/letters" />
      <div className="max-w-5xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>
            Unsent Letters
          </h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-6" />
          <p className="text-lg text-[#0A0A0A]/80 max-w-2xl mx-auto">
            Words you never sent. Feelings left unspoken.
          </p>
        </motion.div>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {topics.map((t) => (
            <button key={t} onClick={() => setSelectedTopic(t)}
              className={`px-5 py-2 text-xs tracking-[0.2em] uppercase border transition-all ${
                selectedTopic === t
                  ? "bg-[#0A0A0A] text-[#F4F0E6] border-[#0A0A0A]"
                  : "bg-transparent text-[#0A0A0A] border-[#0A0A0A]/20 hover:bg-[#0A0A0A] hover:text-[#F4F0E6]"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-12 text-[#0A0A0A]/60">Loading letters...</p>
        ) : letters.length === 0 ? (
          <p className="text-center py-12 text-[#0A0A0A]/60">No letters in this category yet.</p>
        ) : (
          <div className="space-y-8">
            {letters.map((letter, idx) => (
              <motion.div key={letter._id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div
                  onClick={() => navigate(`/post/${letter._id}`)}
                  className="bg-[#F4F0E6] border border-[#0A0A0A]/10 overflow-hidden cursor-pointer hover:border-[#C5A059] transition group shadow-sm"
                >
                  {/* IMAGE if present */}
                  {letter.image && (
                    <img src={letter.image} alt={letter.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
                  )}

                  <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs tracking-[0.2em] uppercase text-[#C5A059]">{letter.topic}</span>
                      <span className="text-xs text-[#4A4A4A]">
                        {letter.is_anonymous ? "Anonymous" : (letter.author_name || letter.author || "Anonymous")}
                      </span>
                    </div>

                    <h2 className="text-2xl mb-3 font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      {letter.title}
                    </h2>

                    <p className="text-[14px] leading-relaxed text-[#0A0A0A]/70 line-clamp-3">
                      {letter.content}
                    </p>

                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#0A0A0A]/10">
                      <span className="text-xs text-[#4A4A4A]">
                        {new Date(letter.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      <span className="flex items-center text-[#C5A059] text-xs uppercase tracking-widest group-hover:translate-x-1 transition">
                        Read <ArrowRight size={14} className="ml-1" />
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
