import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";

export default function Login() {
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [showPw,     setShowPw]     = useState(false);
  const [unverified, setUnverified] = useState(false);

  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const successMsg = location.state?.message || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUnverified(false);

    const result = await login(email, password);

    if (result.unverified) {
      setUnverified(true);
      setLoading(false);
      return;
    }

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  const resendVerification = async () => {
    try {
      await axios.post(`${API}/auth/resend-verification`, { email });
      alert("Verification email sent! Check your inbox.");
    } catch {
      alert("Failed to resend. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* LOGO */}
        <div className="text-center mb-10">
          <Link to="/">
            <h1 className="text-3xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              A <span className="text-[#C5A059]">Louder</span> Voice
            </h1>
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-[#4A4A4A] mt-2">Sign In</p>
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm mb-4">
            {successMsg}
          </div>
        )}

        {unverified && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 text-sm mb-4">
            Please verify your email before logging in.{" "}
            <button onClick={resendVerification} className="underline font-medium hover:text-yellow-900">
              Resend verification email
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 focus:outline-none text-[#0A0A0A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 pr-10 focus:outline-none text-[#0A0A0A]"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-2 text-[#4A4A4A] hover:text-[#C5A059] transition">
                {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#C5A059] transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-right mt-4">
          <Link to="/forgot-password" className="text-xs text-[#4A4A4A] hover:text-[#C5A059] transition">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-[#4A4A4A]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#C5A059] hover:underline">Register</Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}