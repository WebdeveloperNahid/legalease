"use client"
import Link from "next/link";
import {
  LogoFacebook,
  LogoLinkedin,
  LogoGithub,
} from "@gravity-ui/icons";
import { FaScaleBalanced, FaPaperPlane } from "react-icons/fa6";

export default function Footer() {
  return (
    // ব্যাকগ্রাউন্ডে গভীর Navy টোন এবং টপ বর্ডারে Gold-এর সূক্ষ্ম টাচ
    <footer className="border-t border-[#E2B93B]/20 bg-gradient-to-b from-[#14213D] to-[#0B1526] text-[#FBF6EA]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        
        {/* TOP SECTION */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. LEFT: LOGO, BRAND DESCRIPTION & SOCIALS */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 group w-fit">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[1px] shadow-[0_0_15px_rgba(226,185,59,0.15)] transition-all duration-300 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0B1526] transition-colors group-hover:bg-transparent">
                  <FaScaleBalanced className="text-xl text-[#E2B93B] transition-colors group-hover:text-[#0B1526]" />
                </div>
              </div>

              <div className="leading-none">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F3D98B]/90">
                  Premium Law
                </span>
                <h1 className="text-xl font-black text-[#FBF6EA] tracking-wide mt-0.5">
                  Legal<span className="text-[#E2B93B]">Ease</span>
                </h1>
              </div>
            </Link>

            {/* Description */}
            <p className="max-w-xs text-sm leading-7 text-[#E8DCC8]/80">
              The AI-native legal companion. Empowering individuals and businesses with absolute legal clarity, built for those who value precision.
            </p>

            {/* Social Icons (Gold হোভার ইফেক্ট) */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2B93B]/20 bg-white/[0.02] text-[#E8DCC8]/80 backdrop-blur-md transition-all duration-300 hover:border-[#E2B93B]/50 hover:bg-[#E2B93B]/15 hover:text-[#E2B93B]"
              >
                <LogoFacebook className="h-5 w-5" />
              </Link>

              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2B93B]/40 bg-[#E2B93B]/15 text-[#E2B93B] backdrop-blur-md transition-all duration-300 hover:bg-[#E2B93B] hover:text-[#0B1526] hover:shadow-[0_0_15px_rgba(226,185,59,0.25)]"
              >
                <LogoGithub className="h-5 w-5" />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2B93B]/20 bg-white/[0.02] text-[#E8DCC8]/80 backdrop-blur-md transition-all duration-300 hover:border-[#E2B93B]/50 hover:bg-[#E2B93B]/15 hover:text-[#E2B93B]"
              >
                <LogoLinkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* 2. SERVICES LINKS */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#F3D98B]">
              Services
            </h3>
            <ul className="space-y-4 text-sm text-[#E8DCC8]/80">
              <li>
                <Link href="/browse-lawyers" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  Browse Lawyers
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  Online Consultation
                </Link>
              </li>
              <li>
                <Link href="/case-study" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  Affordable Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. QUICK EXPLORE LINKS */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#F3D98B]">
              Explore
            </h3>
            <ul className="space-y-4 text-sm text-[#E8DCC8]/80">
              <li>
                <Link href="/" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors duration-300 hover:text-[#E2B93B]">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. NEWSLETTER SIGNUP PLACEHOLDER (FRONTEND ONLY) */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#F3D98B]">
              Newsletter
            </h3>
            <p className="text-sm text-[#E8DCC8]/80 mb-4 leading-6">
              Subscribe to get the latest legal insights, templates, and updates straight to your inbox.
            </p>
            
            {/* Frontend Form Form Placeholder */}
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center mt-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full h-11 px-4 pr-12 rounded-xl border border-[#E2B93B]/30 bg-[#0B1526]/60 text-sm text-[#FBF6EA] placeholder-[#E8DCC8]/60 backdrop-blur-md outline-none transition-all duration-300 focus:border-[#E2B93B]/60 focus:ring-1 focus:ring-[#E2B93B]/30"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#E2B93B] to-[#C99A12] text-[#0B1526] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#E2B93B]/10 pt-8 text-xs text-[#E8DCC8]/60 md:flex-row">
          <p>Copyright {new Date().getFullYear()} — LegalEase. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="transition-colors duration-300 hover:text-[#F3D98B]">
              Terms of Service
            </Link>

            <Link href="/privacy" className="transition-colors duration-300 hover:text-[#F3D98B]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}