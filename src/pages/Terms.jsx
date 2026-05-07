import { motion } from "framer-motion";
import SEO from "../components/SEO";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="Terms of Service" description="A Louder Voice Terms of Service — the rules for using our platform." path="/terms" />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>Terms of Service</h1>
            <div className="w-16 h-[1px] bg-[#C5A059] mx-auto" />
            <p className="text-xs text-[#4A4A4A] mt-4">Last updated: {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>

          <div className="space-y-8 text-[#0A0A0A]/80 leading-relaxed">

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using A Louder Voice ("the Platform") at aloudervoice.co.za, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">2. User Accounts</h2>
              <p>You must provide accurate information when registering. You are responsible for maintaining the security of your account and password. You must be at least 13 years old to use the Platform. One person may only hold one account.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">3. Content Submissions</h2>
              <p>By submitting content, you confirm that:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>The content is your original work or you have the right to share it</li>
                <li>It does not infringe on anyone's copyright, privacy, or legal rights</li>
                <li>It does not contain hate speech, harassment, or content that targets individuals maliciously</li>
                <li>You grant A Louder Voice a non-exclusive licence to publish, display, and promote the content on the Platform</li>
              </ul>
              <p className="mt-3">We reserve the right to reject, edit for formatting, or remove any submission that violates these terms or our editorial standards.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">4. Prohibited Content</h2>
              <p>You may not submit content that:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Is false, misleading, or defamatory</li>
                <li>Promotes violence, discrimination, or illegal activity</li>
                <li>Contains spam, advertising, or unsolicited promotions</li>
                <li>Violates the privacy of others (sharing personal information without consent)</li>
                <li>Is sexually explicit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">5. Anonymous Submissions</h2>
              <p>When you choose to submit anonymously, your name is not displayed publicly. However, your account information is retained internally for moderation and legal compliance purposes as required by POPIA.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">6. Intellectual Property</h2>
              <p>All content on the Platform remains the intellectual property of its respective authors. The A Louder Voice brand, logo, and design are property of A Louder Voice. You may not reproduce or redistribute Platform content without prior written permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">7. Limitation of Liability</h2>
              <p>A Louder Voice is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to loss of data, revenue, or reputation.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">8. Termination</h2>
              <p>We reserve the right to suspend or terminate accounts that violate these terms, without notice. You may delete your account at any time by contacting us at <a href="mailto:TshegoIsithebe@gmail.com" className="text-[#C5A059] hover:underline">TshegoIsithebe@gmail.com</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">9. Governing Law</h2>
              <p>These terms are governed by the laws of the Republic of South Africa. Any disputes shall be subject to the jurisdiction of South African courts.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#0A0A0A] mb-3">10. Contact</h2>
              <p>For questions about these terms: <a href="mailto:TshegoIsithebe@gmail.com" className="text-[#C5A059] hover:underline">TshegoIsithebe@gmail.com</a></p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
