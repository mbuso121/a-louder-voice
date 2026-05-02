import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, EnvelopeSimple } from "@phosphor-icons/react";
import API from "../lib/api";
import SEO from "../components/SEO";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0E6] px-6 py-12">
      <SEO title="Forgot Password" path="/forgot-password" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        <Link to="/login" className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] mb-8 hover:gap-3 transition-all">
          <ArrowLeft size={14} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeSimple size={28} className="text-[#C5A059]" />
          </div>
          <h1 className="text-4xl font-light mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Forgot Password?
          </h1>
          <p className="text-sm text-[#4A4A4A]">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-green-50 border border-green-200 p-8">
            <div className="text-4xl mb-3">📬</div>
            <h2 className="text-xl font-light mb-2">Check your inbox</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <p className="text-xs text-[#4A4A4A] mt-3">Don't see it? Check your spam folder.</p>
            <Link to="/login" className="block mt-6 text-sm text-[#C5A059] hover:underline">
              Back to Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{error}</div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#C5A059] transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}
