import { motion } from "framer-motion";
import SEO from "../components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Privacy Policy" description="A Louder Voice Privacy Policy — POPIA compliant. How we collect, use and protect your personal information." path="/privacy" />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>Privacy Policy</h1>
            <div className="w-16 h-[1px] bg-[#C5A059] mx-auto" />
            <p className="text-xs text-[#4A4A4A] mt-4">Last updated: {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>

          <div className="prose max-w-none space-y-8 text-[#0A0A0A]/80 leading-relaxed">

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">1. Who We Are</h2>
              <p>A Louder Voice ("we", "our", "us") is a South African digital storytelling platform accessible at aloudervoice.co.za. We are committed to protecting your personal information in line with the Protection of Personal Information Act 4 of 2013 (POPIA).</p>
              <p className="mt-2">Contact: <a href="mailto:TshegoIsithebe@gmail.com" className="text-[#C5A059] hover:underline">TshegoIsithebe@gmail.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">2. Information We Collect</h2>
              <p>We collect the following personal information:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Name and email address when you register</li>
                <li>Content you submit (stories, letters, comments)</li>
                <li>Your IP address and browser type for security purposes</li>
                <li>Anonymous usage data to improve the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>To create and manage your account</li>
                <li>To publish content you submit (after moderation)</li>
                <li>To send password reset emails when requested</li>
                <li>To respond to contact form enquiries</li>
                <li>To improve our platform and prevent abuse</li>
              </ul>
              <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">4. Anonymous Submissions</h2>
              <p>When you submit content anonymously, your name is not published. However, we retain your account details internally for moderation and safety purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">5. Data Storage & Security</h2>
              <p>Your data is stored securely on MongoDB Atlas (cloud database). Passwords are encrypted using bcrypt. We use HTTPS encryption for all data transmission.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">6. Your Rights Under POPIA</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Object to the processing of your information</li>
                <li>Lodge a complaint with the Information Regulator (South Africa)</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:TshegoIsithebe@gmail.com" className="text-[#C5A059] hover:underline">TshegoIsithebe@gmail.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">7. Cookies</h2>
              <p>We use a single authentication cookie to keep you logged in. This cookie is strictly necessary for the website to function and does not track you across other websites.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">8. Changes to This Policy</h2>
              <p>We may update this policy from time to time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes acceptance.</p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
