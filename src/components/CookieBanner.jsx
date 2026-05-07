import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't consented yet
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] text-[#F4F0E6] border-t border-[#C5A059]/30 px-6 py-5 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* TEXT */}
        <div className="flex-1 text-sm leading-relaxed text-[#F4F0E6]/80">
          <span className="text-[#C5A059] font-medium">🍪 We use cookies</span>
          {" "}to keep you logged in and improve your experience. We do not track you across other sites or sell your data.{" "}
          <Link to="/privacy" className="text-[#C5A059] underline hover:no-underline">
            Privacy Policy
          </Link>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2 text-xs uppercase tracking-widest border border-white/20 hover:border-white/50 transition text-[#F4F0E6]/60 hover:text-[#F4F0E6]"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-xs uppercase tracking-widest bg-[#C5A059] text-black hover:bg-white transition font-medium"
          >
            Accept
          </button>
        </div>

      </div>
    </div>
  );
}
