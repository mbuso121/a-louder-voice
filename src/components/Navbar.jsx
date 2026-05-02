import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-black text-white">

      <h1 className="text-[#C5A059] tracking-widest">
        A LOUDER VOICE
      </h1>

      <div className="flex gap-6 text-sm uppercase">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/analysis">Analysis</Link>
        <Link to="/engagement">Engagement</Link>
        <Link to="/letters">Letters</Link>
        <Link to="/smme">SMME</Link>
        <Link to="/contact">Contact</Link>
        
      </div>

    </nav>
  );
}