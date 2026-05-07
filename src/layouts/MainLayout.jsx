import React from "react";
import Header from "../components/Header"; // ✅ THIS IS REQUIRED
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import BackToTop from "../components/BackToTop";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F0E6]">

      {/* Header */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cookie Consent */}
      <CookieBanner />

      {/* Back to Top */}
      <BackToTop />

    </div>
  );
}