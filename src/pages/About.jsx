import SEO from "../components/SEO";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="About" description="Learn about A Louder Voice — a South African platform created to amplify real stories, unsent letters, and community voices." path="/about" />
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl mb-8 text-center italic">
            About A Louder Voice
          </h1>

          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-12" />
        </motion.div>

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 text-lg leading-relaxed"
        >

          {/* MISSION */}
          <div className="bg-[#EAE5D9] border p-12">
            <h2 className="text-3xl mb-4">
              Our Mission
            </h2>

            <p>
              A Louder Voice is a digital sanctuary for expression,
              storytelling, and connection. A place to say what cannot
              be said out loud.
            </p>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-[#EAE5D9] border p-8">
              <h3 className="text-2xl mb-4">Safe Space</h3>
              <p className="text-base text-gray-700">
                A space to be heard without judgment. Your voice matters.
              </p>
            </div>

            <div className="bg-[#EAE5D9] border p-8">
              <h3 className="text-2xl mb-4">Community</h3>
              <p className="text-base text-gray-700">
                Built on shared experiences and emotional honesty.
              </p>
            </div>

            <div className="bg-[#EAE5D9] border p-8">
              <h3 className="text-2xl mb-4">Storytelling</h3>
              <p className="text-base text-gray-700">
                Stories that explore what it means to be human.
              </p>
            </div>

            <div className="bg-[#EAE5D9] border p-8">
              <h3 className="text-2xl mb-4">SMME Support</h3>
              <p className="text-base text-gray-700">
                Giving small businesses a voice through story.
              </p>
            </div>

          </div>

          {/* WHY SECTION */}
          <div className="bg-black text-[#F4F0E6] p-12">
            <h2 className="text-3xl mb-4">
              Why We Exist
            </h2>

            <p className="mb-4">
              Not everything is meant to be polished. Some truths are raw,
              unfiltered, and real.
            </p>

            <p>
              This platform exists for the unspoken, the unsent,
              and the unheard.
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}