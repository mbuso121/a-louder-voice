import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MagnifyingGlass } from "@phosphor-icons/react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/analysis", label: "Analysis" },
  { to: "/engagement", label: "Engagement" },
  { to: "/letters", label: "Letters" },
  { to: "/smme", label: "SMME" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQ)}`);
    setSearchQ("");
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-black text-white relative z-50">
      <div className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">

        {/* LOGO */}
        <Link to="/" className="text-[#C5A059] tracking-widest text-sm font-medium uppercase">
          A Louder Voice
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:text-[#C5A059] transition">{label}</Link>
          ))}
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"
            className="hover:text-[#C5A059] transition">
            <MagnifyingGlass size={16} />
          </button>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search..." className="flex-1 bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none" />
            <button type="submit" className="bg-[#C5A059] text-black px-3 text-xs uppercase">Go</button>
          </form>
          {user ? (
            <>
              <Link to="/submit" className="hover:text-[#C5A059] transition">Submit</Link>
              <Link to="/profile" className="hover:text-[#C5A059] transition">{user.name?.split(" ")[0]}</Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-[#C5A059] hover:text-white transition">Admin</Link>
              )}
              <button onClick={handleLogout} className="border border-white/30 px-4 py-1.5 hover:border-[#C5A059] hover:text-[#C5A059] transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#C5A059] transition">Login</Link>
              <Link to="/register" className="bg-[#C5A059] text-black px-4 py-1.5 hover:bg-white transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* SEARCH BAR DROPDOWN */}
      {searchOpen && (
        <div className="bg-[#111] border-t border-white/10 px-6 py-4">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto">
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search stories, letters..."
              autoFocus
              className="flex-1 bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C5A059]"
            />
            <button type="submit"
              className="bg-[#C5A059] text-black px-4 text-xs uppercase tracking-widest hover:bg-white transition">
              Go
            </button>
          </form>
        </div>
      )}

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden bg-[#111] border-t border-white/10 px-6 py-6 flex flex-col gap-4 text-xs uppercase tracking-widest">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="hover:text-[#C5A059] transition py-1">
              {label}
            </Link>
          ))}
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"
            className="hover:text-[#C5A059] transition">
            <MagnifyingGlass size={16} />
          </button>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search..." className="flex-1 bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none" />
            <button type="submit" className="bg-[#C5A059] text-black px-3 text-xs uppercase">Go</button>
          </form>
          {user ? (
            <>
              <Link to="/submit" onClick={() => setOpen(false)} className="hover:text-[#C5A059] transition py-1">Submit</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="hover:text-[#C5A059] transition py-1">My Profile</Link>
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setOpen(false)} className="text-[#C5A059] py-1">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 transition py-1">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="hover:text-[#C5A059] transition py-1">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-[#C5A059] py-1">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
