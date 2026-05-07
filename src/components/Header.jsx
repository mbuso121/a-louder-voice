import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, List, MagnifyingGlass } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; // ✅ FIXED

export default function Header() {
  const { user, logout } = useAuth(); // ✅ REAL AUTH
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const close = () => setOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQ)}`);
    setSearchQ('');
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // ✅ better UX
    close();
  };

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/engagement', label: 'Engagement' },
    { to: '/letters', label: 'Unsent Letters' },
    { to: '/smme', label: 'SMME Stories' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#F4F0E6]/90 backdrop-blur-xl border-b border-black/5 relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/">
            <h1
              className="text-2xl font-light tracking-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              A Louder Voice
            </h1>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-xs tracking-[0.2em] uppercase transition ${
                  location.pathname === item.to || location.pathname.startsWith(item.to + '/')
                    ? 'text-[#C5A059]'
                    : 'text-black hover:text-[#C5A059]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center space-x-4">

            {user ? (
              <>
                {/* ✅ ADMIN LINK */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm text-[#C5A059] hover:underline"
                  >
                    Admin
                  </Link>
                )}

                <Link to="/profile"
                  className="text-xs tracking-[0.2em] uppercase transition text-black hover:text-[#C5A059]">
                  Profile
                </Link>

                <Link
                  to="/submit"
                  className="px-4 py-2 bg-black text-[#F4F0E6] text-sm"
                >
                  Submit
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm hover:text-[#C5A059]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm hover:text-[#C5A059]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-[#F4F0E6] text-sm"
                >
                  Register
                </Link>
              </>
            )}

          </div>

          {/* SEARCH ICON — desktop */}
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="hidden md:block text-black hover:text-[#C5A059] transition ml-2"
            aria-label="Search">
            <MagnifyingGlass size={18} />
          </button>

          {/* MOBILE BUTTON */}
          <button onClick={() => setOpen(true)} className="md:hidden">
            <List size={26} />
          </button>
        </div>
      </header>

      {/* SEARCH DROPDOWN */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 bg-[#F4F0E6] border-b border-black/10 px-6 py-4 z-40">
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search stories, letters, discussions..." autoFocus
                className="flex-1 border-b-2 border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none focus:border-[#C5A059] transition" />
              <button type="submit"
                className="bg-[#0A0A0A] text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#C5A059] transition">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-full bg-[#F4F0E6] p-8 flex flex-col"
            >

              {/* TOP */}
              <div className="flex justify-between mb-10">
                <h2 className="text-xl font-light">Menu</h2>
                <button onClick={close}>
                  <X size={26} />
                </button>
              </div>

              {/* NAV LINKS */}
              <div className="flex flex-col space-y-6">
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={`text-2xl font-light transition ${
                      location.pathname === item.to || location.pathname.startsWith(item.to + "/")
                        ? "text-[#C5A059]" : "text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* AUTH SECTION */}
              <div className="mt-10 border-t pt-6">

                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={close}
                        className="block mb-4 text-lg text-[#C5A059]"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Link to="/profile" onClick={close} className="block mb-4 text-lg">
                      My Profile
                    </Link>

                    <Link
                      to="/submit"
                      onClick={close}
                      className="block mb-4 text-lg"
                    >
                      Submit
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="text-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={close}
                      className="block mb-4 text-lg"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={close}
                      className="text-lg"
                    >
                      Register
                    </Link>
                  </>
                )}

              </div>

              {/* FOOTER */}
              <div className="mt-auto text-xs text-black/40">
                A Louder Voice • Premium Platform
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}