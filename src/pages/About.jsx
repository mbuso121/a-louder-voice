import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const VALUES = [
  {
    title: "Authenticity",
    text: "We believe real stories — messy, vulnerable, and unfiltered — are the ones that change people. No polishing required.",
  },
  {
    title: "Anonymity",
    text: "Not every story needs a name attached. Our anonymous submission option exists so your truth can breathe freely.",
  },
  {
    title: "Community",
    text: "A Louder Voice is built by and for South Africans. Every story you read was written by someone in your world.",
  },
  {
    title: "Dignity",
    text: "Every submission is reviewed with care. We amplify voices — we don't exploit them.",
  },
];

const SECTIONS = [
  { title: "Analysis", link: "/analysis", text: "Deep dives into love, relationships, self-growth and society." },
  { title: "Unsent Letters", link: "/letters", text: "Words meant for someone who may never read them — finally released." },
  { title: "Engagement", link: "/engagement", text: "Polls, discussions, and conversations that bring the community together." },
  { title: "SMME Stories", link: "/smme", text: "The human side of building a business in South Africa." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#F4F0E6]">
      <SEO
        title="About"
        description="A Louder Voice is a South African digital platform created to amplify real stories, unsent letters, and community voices."
        path="/about"
      />

      {/* HERO */}
      <section className="py-24 px-6 text-center bg-[#0A0A0A] text-[#F4F0E6]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] mb-6">Our Story</p>
          <h1 className="text-5xl sm:text-7xl font-light mb-8 max-w-3xl mx-auto leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Every voice deserves to be heard
          </h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-8" />
          <p className="text-[#F4F0E6]/70 max-w-xl mx-auto text-lg leading-relaxed">
            A Louder Voice was born from a simple belief — that the stories we keep to ourselves
            are often the ones that need to be told the most.
          </p>
        </motion.div>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059] mb-6">How It Started</p>
            <div className="space-y-5 text-[#0A0A0A]/80 leading-relaxed text-lg">
              <p>
                South Africa is full of voices that go unheard. People carrying stories of love, loss, ambition,
                heartbreak, resilience — and nowhere safe to put them. A Louder Voice was created to change that.
              </p>
              <p>
                We built a space where you can submit anonymously, read honestly, and engage without judgment.
                Whether it's an unsent letter to someone who hurt you, a piece of analysis about something you've
                observed in society, or the behind-the-scenes story of building your small business —
                this platform exists for you.
              </p>
              <p>
                We moderate everything with care and publish with intention. Your words are treated with the
                dignity they deserve.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-6 bg-[#EAE5D9]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059] mb-3">What We Stand For</p>
            <h2 className="text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Our Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {VALUES.map(({ title, text }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#F4F0E6] p-8 border-l-2 border-[#C5A059]"
              >
                <h3 className="text-xl mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>{title}</h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059] mb-3">Explore</p>
            <h2 className="text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              What's on the Platform
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECTIONS.map(({ title, link, text }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={link} className="block group bg-[#EAE5D9] p-6 h-full hover:border-[#C5A059] border border-transparent transition">
                  <h3 className="text-lg mb-3 group-hover:text-[#C5A059] transition"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{text}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0A0A0A] text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-light text-[#F4F0E6] mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Your voice matters here
          </h2>
          <p className="text-[#F4F0E6]/60 mb-8 max-w-md mx-auto">
            Join thousands of South Africans who have shared their stories on A Louder Voice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/submit"
              className="bg-[#C5A059] text-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-white transition">
              Share Your Story
            </Link>
            <Link to="/letters"
              className="border border-white/30 text-white px-8 py-3 text-sm uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition">
              Read Letters
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
