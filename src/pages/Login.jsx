import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const role = result.user?.role || "user";
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0E6] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tighter mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Welcome Back
          </h1>
          <p className="text-sm text-[#4A4A4A]">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm mb-2">{successMsg}</div>
        )}

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 focus:outline-none text-[#0A0A0A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 focus:outline-none text-[#0A0A0A] pr-16"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-2 text-xs text-[#4A4A4A] hover:text-[#C5A059] uppercase tracking-widest transition">
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#C5A059] transition disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-right mt-1 mb-4">
            <Link to="/forgot-password" className="text-xs text-[#4A4A4A] hover:text-[#C5A059] transition">
              Forgot your password?
            </Link>
          </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-[#4A4A4A]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#C5A059] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
