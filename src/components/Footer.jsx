import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, TiktokLogo } from '@phosphor-icons/react';

const TIKTOK_URL   = "https://www.tiktok.com/@a_louder_voice?_r=1&_t=ZS-95yDz1INbpI";
const INSTAGRAM_URL = "https://www.instagram.com/a_louder_voice?igsh=MTlnaGdsNDY4Z2Z3NA==";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-[#F4F0E6] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              A Louder Voice
            </h3>
            <p className="text-sm text-[#F4F0E6]/70 leading-relaxed">
              A digital space for expression, storytelling, and connection.
            </p>
            <a href="https://www.balanceitafrica.co.za" target="_blank" rel="noreferrer"
              className="inline-block mt-6 text-sm text-[#C5A059] hover:text-[#F4F0E6] transition">
              Built by Balance IT Africa
            </a>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-4">Explore</h4>
            <div className="space-y-2">
              {[
                ["/analysis",   "Analysis"],
                ["/engagement", "Engagement"],
                ["/letters",    "Unsent Letters"],
                ["/smme",       "SMME Stories"],
              ].map(([to, label]) => (
                <Link key={to} to={to} className="block text-sm hover:text-[#C5A059] transition">{label}</Link>
              ))}
            </div>
          </div>

          {/* CONNECT */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-4">Connect</h4>
            <div className="space-y-2">
              {[
                ["/about",   "About"],
                ["/contact", "Contact"],
                ["/submit",  "Submit Content"],
              ].map(([to, label]) => (
                <Link key={to} to={to} className="block text-sm hover:text-[#C5A059] transition">{label}</Link>
              ))}
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-4">Follow Us</h4>
            <div className="flex gap-5">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
                className="group flex flex-col items-center gap-1.5 hover:text-[#C5A059] transition"
                aria-label="Follow on Instagram">
                <InstagramLogo size={28} className="group-hover:scale-110 transition" />
                <span className="text-[10px] tracking-widest uppercase text-[#F4F0E6]/40">Instagram</span>
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noreferrer"
                className="group flex flex-col items-center gap-1.5 hover:text-[#C5A059] transition"
                aria-label="Follow on TikTok">
                <TiktokLogo size={28} className="group-hover:scale-110 transition" />
                <span className="text-[10px] tracking-widest uppercase text-[#F4F0E6]/40">TikTok</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-[#F4F0E6]/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-[#F4F0E6]/50">
          <p>© {new Date().getFullYear()} A Louder Voice. All rights reserved.</p>
          <p>
            Designed & Developed by{" "}
            <a href="https://www.balanceitafrica.co.za" target="_blank" rel="noreferrer"
              className="text-[#C5A059] hover:text-[#F4F0E6] transition">
              Balance IT Africa
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
