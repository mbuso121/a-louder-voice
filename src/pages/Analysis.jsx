import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import API from "../lib/api";
import SEO from "../components/SEO";
import SkeletonCard from "../components/SkeletonCard";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function Analysis() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const topics = ["all", "relationships", "self-growth", "society"];

  useEffect(() => { setPage(1); fetchArticles(); }, [selectedTopic]);
  useEffect(() => { fetchArticles(); }, [page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const url = selectedTopic === "all"
        ? `${API}/posts?category=analysis&page=${page}&limit=${PAGE_SIZE}`
        : `${API}/posts?category=analysis&topic=${selectedTopic}&page=${page}&limit=${PAGE_SIZE}`;
      const res = await axios.get(url);
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Analysis" description="Deep emotional and social analysis articles on relationships, self-growth and society. A Louder Voice South Africa." path="/analysis" />
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>Analysis</h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Deep emotional and social insights.</p>
        </motion.div>

        {/* FILTER */}
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {topics.map((t) => (
            <button key={t} onClick={() => setSelectedTopic(t)}
              className={`px-5 py-2 text-xs uppercase tracking-widest transition ${
                selectedTopic === t ? "bg-black text-white" : "bg-[#EAE5D9] hover:bg-black hover:text-white"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No articles yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.div key={article._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div
                  onClick={() => navigate(`/post/${article._id}`)}
                  className="bg-[#EAE5D9] border h-full flex flex-col cursor-pointer hover:border-[#C5A059] transition group overflow-hidden"
                >
                  {/* IMAGE */}
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-48 bg-[#D4CFC3] flex items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-[#4A4A4A]">Analysis</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs uppercase text-[#C5A059] mb-2">{article.topic}</span>
                    <h2 className="text-xl mb-3 flex-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>{article.title}</h2>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{article.author || "Admin"}</span>
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

        {/* PAGINATION */}
        {!loading && articles.length > 0 && (
          <div className="flex justify-center gap-3 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EAE5D9] hover:bg-black hover:text-white disabled:opacity-30 transition">
              Prev
            </button>
            <span className="px-4 py-2 text-xs text-[#4A4A4A]">Page {page}</span>
            <button onClick={() => setPage(p => p+1)} disabled={articles.length < PAGE_SIZE}
              className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EAE5D9] hover:bg-black hover:text-white disabled:opacity-30 transition">
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
