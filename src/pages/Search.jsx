import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import API from "../lib/api";
import SEO from "../components/SEO";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
    const q = searchParams.get("q");
    if (q) { setQuery(q); doSearch(q); }
  }, []);

  const doSearch = async (q) => {
    if (!q?.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts/search?q=${encodeURIComponent(q)}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
    doSearch(query);
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Search" description="Search stories, letters and posts on A Louder Voice." path="/search" />
      <div className="max-w-3xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-light mb-8 text-center" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Search
          </h1>

          <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search stories, letters, discussions..."
              className="flex-1 border-b-2 border-[#0A0A0A]/20 bg-transparent py-3 text-lg focus:outline-none focus:border-[#C5A059] transition"
            />
            <button type="submit"
              className="bg-[#0A0A0A] text-[#F4F0E6] px-6 hover:bg-[#C5A059] transition text-sm uppercase tracking-widest">
              Search
            </button>
          </form>

          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-[#EAE5D9] animate-pulse" />)}
            </div>
          )}

          {!loading && searchParams.get("q") && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#4A4A4A]">No results found for "{searchParams.get("q")}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-[#4A4A4A] mb-6">
                {results.length} result{results.length !== 1 ? "s" : ""} for "{searchParams.get("q")}"
              </p>
              <div className="space-y-4">
                {results.map(post => (
                  <motion.div key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div onClick={() => navigate(`/post/${post._id}`)}
                      className="bg-[#EAE5D9] border p-6 cursor-pointer hover:border-[#C5A059] transition group">
                      <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-2">{post.category} · {post.topic}</p>
                      <h3 className="text-xl font-light mb-2 group-hover:text-[#C5A059] transition">
                        {post.title || "(Untitled)"}
                      </h3>
                      <p className="text-sm text-[#4A4A4A] line-clamp-2">{post.content}</p>
                      <span className="flex items-center gap-1 text-xs text-[#C5A059] mt-3 uppercase tracking-widest">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
