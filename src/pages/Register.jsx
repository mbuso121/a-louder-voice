import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register(name, email, password);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error || "Registration failed");
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
          <h1
            className="text-4xl font-light tracking-tighter mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Create Account
          </h1>
          <p className="text-sm text-[#4A4A4A]">Join A Louder Voice community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 focus:outline-none text-[#0A0A0A]"
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 focus:outline-none text-[#0A0A0A]"
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 focus:outline-none text-[#0A0A0A]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#C5A059] transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-[#4A4A4A]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#C5A059] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
