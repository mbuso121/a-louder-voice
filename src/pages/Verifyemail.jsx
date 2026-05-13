import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import API from "../lib/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${API}/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(res.data.message);
        setTimeout(() => navigate("/login", { state: { message: "Email verified! You can now log in." } }), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed. The link may have expired.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md">

        {status === "verifying" && (
          <>
            <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[#4A4A4A] uppercase tracking-widest text-sm">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Email Verified!
            </h1>
            <p className="text-[#4A4A4A] mb-6">{message}</p>
            <p className="text-sm text-[#4A4A4A]">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-3xl">✗</span>
            </div>
            <h1 className="text-3xl font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Verification Failed
            </h1>
            <p className="text-[#4A4A4A] mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/login"
                className="bg-[#0A0A0A] text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-[#C5A059] transition">
                Go to Login
              </Link>
              <button onClick={async () => {
                const email = prompt("Enter your email to resend verification:");
                if (!email) return;
                try {
                  await axios.post(`${API}/auth/resend-verification`, { email });
                  alert("Verification email resent! Check your inbox.");
                } catch { alert("Failed to resend. Please try again."); }
              }}
                className="border border-[#0A0A0A]/20 px-8 py-3 text-sm uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition">
                Resend Verification Email
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}