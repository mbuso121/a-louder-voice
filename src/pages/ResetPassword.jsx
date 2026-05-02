import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LockKey, Eye, EyeSlash, CheckCircle } from "@phosphor-icons/react";
import API from "../lib/api";
import SEO from "../components/SEO";

export default function ResetPassword() {
  const { token }     = useParams();
  const navigate      = useNavigate();
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPwd, setShowPwd]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState("");

  const strength = password.length === 0 ? 0
    : password.length < 8  ? 1
    : password.length < 12 ? 2
    : 3;

  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 8)  return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0E6] px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Password Reset!
          </h1>
          <p className="text-[#4A4A4A] mb-2">Your password has been changed successfully.</p>
          <p className="text-sm text-[#4A4A4A]">Redirecting to login...</p>
          <Link to="/login" className="inline-block mt-5 text-[#C5A059] hover:underline text-sm">
            Go to Login now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0E6] px-6 py-12">
      <SEO title="Reset Password" path="/reset-password" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockKey size={28} className="text-[#C5A059]" />
          </div>
          <h1 className="text-4xl font-light mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Set New Password
          </h1>
          <p className="text-sm text-[#4A4A4A]">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{error}</div>
          )}

          {/* NEW PASSWORD */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 pr-10 text-sm focus:outline-none"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4A4A4A] hover:text-[#C5A059]">
                {showPwd ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${strength >= i ? strengthColor[strength] : "bg-[#E0DBD1]"}`} />
                  ))}
                </div>
                <p className={`text-xs mt-1 ${strength === 1 ? "text-red-400" : strength === 2 ? "text-yellow-500" : "text-green-600"}`}>
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
          </div>

          {/* CONFIRM */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Confirm Password</label>
            <input
              type={showPwd ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="Repeat your password"
              className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
            />
            {confirm && password !== confirm && (
              <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || password !== confirm || password.length < 8}
            className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#C5A059] transition disabled:opacity-40"
          >
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>

        <p className="text-center text-xs text-[#4A4A4A] mt-6">
          Remember it now?{" "}
          <Link to="/login" className="text-[#C5A059] hover:underline">Log in</Link>
        </p>

      </motion.div>
    </div>
  );
}
