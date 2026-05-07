import { useState, useEffect } from "react";
import { ArrowUp } from "@phosphor-icons/react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-6 z-40 bg-[#0A0A0A] text-[#F4F0E6] w-10 h-10 flex items-center justify-center hover:bg-[#C5A059] transition shadow-lg"
      aria-label="Back to top"
    >
      <ArrowUp size={16} />
    </button>
  );
}
