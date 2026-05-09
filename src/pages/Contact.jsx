import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { EnvelopeSimple, InstagramLogo, TiktokLogo, FacebookLogo, TwitterLogo, YoutubeLogo, LinkedinLogo, CheckCircle } from "@phosphor-icons/react";
import API from "../lib/api";
import SEO from "../components/SEO";
 
const TIKTOK_URL    = "https://www.tiktok.com/@a_louder_voice?_r=1&_t=ZS-95yDz1INbpI";
const INSTAGRAM_URL = "https://www.instagram.com/a_louder_voice?igsh=MTlnaGdsNDY4Z2Z3NA==";
 
export default function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
 
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/contact`, form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Contact Us" description="Get in touch with A Louder Voice. We'd love to hear from you." path="/contact" />
 
      <div className="max-w-5xl mx-auto">
 
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-5xl sm:text-6xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Get In Touch
          </h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-6" />
          <p className="text-lg text-[#4A4A4A] max-w-xl mx-auto">
            We'd love to hear from you — whether it's a question, collaboration, or just to say hello.
          </p>
        </motion.div>
 
        <div className="grid md:grid-cols-5 gap-12">
 
          {/* LEFT — info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-8">
 
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">Email</h3>
              <a href="mailto:tshegolsithebe@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-[#C5A059] transition">
                <EnvelopeSimple size={18} className="text-[#C5A059]" />
                tshegolsithebe@gmail.com
              </a>
            </div>
 
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">Follow Us</h3>
              <div className="flex flex-col gap-3">
                {[
                  { href: INSTAGRAM_URL, icon: <InstagramLogo size={18} />, handle: "@a_louder_voice", label: "Instagram" },
                  { href: TIKTOK_URL,    icon: <TiktokLogo size={18} />,    handle: "@a_louder_voice", label: "TikTok" },
                  { href: "https://www.facebook.com/aloudervoice",           icon: <FacebookLogo size={18} />,  handle: "A Louder Voice",   label: "Facebook" },
                  { href: "https://twitter.com/aloudervoice",                icon: <TwitterLogo size={18} />,   handle: "@aloudervoice",    label: "X / Twitter" },
                  { href: "https://www.youtube.com/@aloudervoice",           icon: <YoutubeLogo size={18} />,   handle: "A Louder Voice",   label: "YouTube" },
                  { href: "https://www.linkedin.com/company/aloudervoice",   icon: <LinkedinLogo size={18} />,  handle: "A Louder Voice",   label: "LinkedIn" },
                ].map(({ href, icon, handle, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 text-sm hover:text-[#C5A059] transition group">
                    <span className="text-[#C5A059] group-hover:scale-110 transition">{icon}</span>
                    <span>
                      <span className="block text-xs uppercase tracking-widest text-[#4A4A4A]">{label}</span>
                      <span className="text-sm">{handle}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
 
            <div className="bg-[#EAE5D9] p-6">
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                For content submissions, use the{" "}
                <a href="/submit" className="text-[#C5A059] hover:underline">Submit page</a>.
                The contact form is for general enquiries and collaborations.
              </p>
            </div>
          </motion.div>
 
          {/* RIGHT — form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="md:col-span-3">
 
            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={56} className="text-green-500 mb-4" />
                <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Message Sent!
                </h2>
                <p className="text-[#4A4A4A] text-sm max-w-sm">
                  We've received your message and sent a confirmation to your email. We'll be in touch soon.
                </p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-xs text-[#C5A059] uppercase tracking-widest hover:underline">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
 
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{error}</div>
                )}
 
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Name *</label>
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="Your name"
                      className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Email *</label>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange} required
                      placeholder="your@email.com"
                      className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
 
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Subject</label>
                  <input
                    name="subject" value={form.subject} onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
                  />
                </div>
 
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} required
                    placeholder="Tell us what's on your mind..."
                    rows={7}
                    className="w-full border border-[#0A0A0A]/10 bg-transparent p-4 text-sm focus:outline-none resize-none"
                  />
                </div>
 
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#C5A059] transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
 
                <p className="text-xs text-[#4A4A4A] text-center">
                  You'll receive a confirmation email after sending.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}