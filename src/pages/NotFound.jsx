import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F0E6] flex flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] mb-4">404</p>
        <h1 className="text-6xl sm:text-8xl font-light mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Lost in the Silence
        </h1>
        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-8" />
        <p className="text-[#4A4A4A] mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist — but your voice still matters here.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="bg-[#0A0A0A] text-[#F4F0E6] px-8 py-3 text-sm uppercase tracking-widest hover:bg-[#C5A059] transition">
            Go Home
          </Link>
          <Link to="/letters" className="border border-[#0A0A0A]/30 px-8 py-3 text-sm uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition">
            Read Letters
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
