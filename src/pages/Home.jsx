import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowRight,
  Article,
  ChatCircle,
  EnvelopeSimple,
  Storefront,
} from "@phosphor-icons/react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-[#F4F0E6]">

      {/* HERO */}
      <section
        className="min-h-screen flex items-center justify-center text-center relative"
        style={{
          backgroundImage:
            "url(/hero.jpg), linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6 max-w-4xl"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6 italic">
            Your Unspoken Journey
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-8">
            A Place to Say What You Cannot Say Out Loud
          </p>

          {user ? (
            <Link to="/submit" className="btn-gold">
              Share Your Voice
            </Link>
          ) : (
            <Link to="/register" className="btn-gold">
              Get Started
            </Link>
          )}
        </motion.div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4">
              Explore Our Spaces
            </h2>
            <div className="w-16 h-[1px] bg-[#C5A059] mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                title: "Analysis",
                icon: <Article size={40} className="text-[#C5A059]" />,
                link: "/analysis",
                text: "Deep emotional and social insights.",
              },
              {
                title: "Engagement",
                icon: <ChatCircle size={40} className="text-[#C5A059]" />,
                link: "/engagement",
                text: "Join conversations and connect.",
              },
              {
                title: "Unsent Letters",
                icon: <EnvelopeSimple size={40} className="text-[#C5A059]" />,
                link: "/letters",
                text: "Say what was never said.",
              },
              {
                title: "SMME Stories",
                icon: <Storefront size={40} className="text-[#C5A059]" />,
                link: "/smme",
                text: "Stories behind small businesses.",
              },
              {
                title: "Contact",
                icon: <EnvelopeSimple size={40} className="text-[#C5A059]" />,
                link: "/contact",
                text: "Get in touch with us.",
              },
              {
                title: "Submit",
                icon: <ArrowRight size={40} className="text-[#C5A059]" />,
                link: "/submit",
                text: "Share your story with the world.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.link} className="block group">
                  <div className="bg-[#EAE5D9] border p-8 h-full hover:border-[#C5A059] transition">

                    {item.icon}

                    <h3 className="text-2xl mt-4 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      {item.text}
                    </p>

                    <span className="flex items-center text-[#C5A059] text-sm uppercase tracking-widest group-hover:translate-x-2 transition">
                      Explore <ArrowRight size={16} className="ml-2" />
                    </span>

                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGIN / REGISTER CTA */}
      <section className="py-20 px-6 bg-[#EAE5D9]">
        <div className="max-w-4xl mx-auto text-center">

          {!user ? (
            <>
              <h2 className="text-3xl mb-6 font-light">
                Join the Conversation
              </h2>

              <p className="mb-8 text-[#0A0A0A]/80">
                Create an account to share your voice and connect with others.
              </p>

              <div className="flex justify-center gap-4">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl mb-6 font-light">
                Welcome Back 👋
              </h2>

              <p className="mb-8 text-[#0A0A0A]/80">
                Continue your journey and share your voice.
              </p>

              <Link to="/engagement" className="btn-primary">
                Go to Engagement
              </Link>
            </>
          )}

        </div>
      </section>

    </div>
  );
}