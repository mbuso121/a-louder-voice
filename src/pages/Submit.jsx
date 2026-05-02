import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import API from "../lib/api";
import SEO from "../components/SEO";

const CATEGORIES = [
  { value: "engagement", label: "Engagement / Discussion", topics: ["discussion"] },
  { value: "letters",    label: "Unsent Letter",           topics: ["love", "heartbreak", "family", "friendship", "general"] },
  { value: "smme",       label: "SMME Story",              topics: ["business", "startup"] },
];

export default function Submit() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    category: "letters",
    topic: "love",
    title: "",
    content: "",
    is_anonymous: true,
    author_name: ""
  });

  const currentCategory = CATEGORIES.find(c => c.value === formData.category);

  const handleCategoryChange = (cat) => {
    const found = CATEGORIES.find(c => c.value === cat);
    setFormData(prev => ({ ...prev, category: cat, topic: found?.topics[0] || "general" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API}/posts/submit`, formData);
      setSuccess(true);
      setFormData({ category: "letters", topic: "love", title: "", content: "", is_anonymous: true, author_name: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Submit Your Story" description="Share your unsent letter, business story or discussion topic with the A Louder Voice community. Anonymous submissions welcome." path="/submit" />
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <div className="text-center mb-10">
            <h1 className="text-5xl font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Share Your Voice
            </h1>
            <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-4" />
            <p className="text-sm text-[#4A4A4A]">Your words will be reviewed before publishing.</p>
          </div>

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-6 text-green-700 bg-green-50 border border-green-200 p-4 text-sm">
              ✅ Submitted! Our team will review it shortly.
            </motion.div>
          )}

          {error && (
            <div className="mb-6 text-red-700 bg-red-50 border border-red-200 p-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* CATEGORY */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                What are you submitting?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat.value}
                    className={`flex items-center gap-3 p-4 border cursor-pointer transition ${
                      formData.category === cat.value
                        ? "border-[#C5A059] bg-[#C5A059]/5"
                        : "border-[#0A0A0A]/10 hover:border-[#C5A059]/40"
                    }`}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={() => handleCategoryChange(cat.value)}
                      className="accent-[#C5A059]"
                    />
                    <span className="text-sm">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TOPIC */}
            {currentCategory?.topics.length > 1 && (
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
                >
                  {currentCategory.topics.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
            )}

            {/* TITLE */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Title</label>
              <input
                type="text"
                placeholder={
                  formData.category === "letters" ? "Dear..." :
                  formData.category === "smme" ? "Your business name or story title" :
                  "Topic or question"
                }
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                {formData.category === "letters" ? "Your Letter" :
                 formData.category === "smme" ? "Your Story" :
                 "Your Message"}
              </label>
              <textarea
                required
                rows={9}
                placeholder={
                  formData.category === "letters" ? "Write the words you never sent..." :
                  formData.category === "smme" ? "Tell us about your business journey..." :
                  "Share your thoughts, start a discussion..."
                }
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full border border-[#0A0A0A]/10 bg-transparent p-4 text-sm focus:outline-none resize-none"
              />
            </div>

            {/* ANONYMOUS */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_anonymous}
                  onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                  className="accent-[#C5A059] w-4 h-4"
                />
                <span className="text-sm text-[#4A4A4A]">Post anonymously</span>
              </label>
            </div>

            {/* NAME (if not anonymous) */}
            {!formData.is_anonymous && (
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="How you'd like to be credited"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#C5A059] transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
