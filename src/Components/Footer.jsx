"use client"
import Link from "next/link";
import {
  LogoFacebook,
  LogoLinkedin,
  LogoGithub,
} from "@gravity-ui/icons";
import { FaScaleBalanced, FaPaperPlane } from "react-icons/fa6";

/*
  Palette
  Navy #14213D | Deep Navy #0B1526 | Gold #E2B93B | Gold Light #F3D98B
  Gold Dark #C99A12 | Cream #FBF6EA | Beige #E8DCC8
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1526]";

const serviceLinks = [
  { href: "/browse-lawyers", label: "Browse Lawyers" },
  { href: "/consultation", label: "Online Consultation" },
  { href: "/case-study", label: "Case Studies" },
  { href: "/pricing", label: "Affordable Plans" },
];

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/help-center", label: "Help Center" },
  { href: "/contact", label: "Contact Support" },
];

const socials = [
  { label: "Facebook", href: "#", Icon: LogoFacebook },
  { label: "GitHub", href: "#", Icon: LogoGithub },
  { label: "LinkedIn", href: "#", Icon: LogoLinkedin },
];

/* কলামের heading: Playfair + ছোট gold দাগ */
function ColumnHeading({ children }) {
  return (
    <div className="mb-6">
      <h3
        className="text-lg font-bold tracking-[-0.01em] text-[#FBF6EA]"
        style={headingFont}
      >
        {children}
      </h3>
      <span
        aria-hidden="true"
        className="mt-2 block h-[2px] w-8 rounded-full bg-[#E2B93B]"
      />
    </div>
  );
}

/* Link: hover-এ gold দাগ আঁকা হয়, লেখা gold হয় */
function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className={`group/link inline-flex items-center rounded-sm py-1 text-sm text-[#E8DCC8]/80 transition-colors duration-300 hover:text-[#E2B93B] focus-visible:text-[#E2B93B] ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className="mr-0 h-px w-0 bg-[#E2B93B] transition-all duration-300 group-hover/link:mr-2 group-hover/link:w-3 group-focus-visible/link:mr-2 group-focus-visible/link:w-3 motion-reduce:transition-none"
      />
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#14213D] to-[#0B1526] text-[#FBF6EA]">
      {/* উপরের gold রেখা */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2B93B] to-transparent"
      />
      {/* উপরে হালকা gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-[#E2B93B]/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 lg:px-8 lg:pt-20">
        {/* TOP SECTION */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* 1. LEFT: LOGO, BRAND DESCRIPTION & SOCIALS */}
          <div className="space-y-6 lg:col-span-4">
            {/* Logo */}
            <Link
              href="/"
              className={`group flex w-fit items-center gap-3.5 rounded-xl ${focusRing}`}
            >
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[1px] shadow-[0_0_15px_rgba(226,185,59,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(226,185,59,0.35)]">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0B1526] transition-colors group-hover:bg-transparent">
                  <FaScaleBalanced className="text-xl text-[#E2B93B] transition-colors group-hover:text-[#0B1526]" />
                </div>
              </div>

              <div className="leading-none">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F3D98B]/90">
                  Premium Law
                </span>
                <h1 className="mt-0.5 text-xl font-black tracking-wide text-[#FBF6EA]">
                  Legal<span className="text-[#E2B93B]">Ease</span>
                </h1>
              </div>
            </Link>

            {/* Description */}
            <p className="max-w-xs text-sm leading-7 text-[#E8DCC8]/80">
              The AI-native legal companion. Empowering individuals and businesses with absolute legal clarity, built for those who value precision.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socials.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2B93B]/25 bg-white/[0.03] text-[#E8DCC8]/80 transition-all duration-300 hover:-translate-y-1 hover:border-[#E2B93B] hover:bg-[#E2B93B] hover:text-[#0B1526] hover:shadow-[0_8px_22px_rgba(226,185,59,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* 2 & 3. SERVICES + EXPLORE (পাশাপাশি) */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:pl-6">
            <div>
              <ColumnHeading>Services</ColumnHeading>
              <ul className="space-y-1.5">
                {serviceLinks.map((l) => (
                  <li key={l.href}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ColumnHeading>Explore</ColumnHeading>
              <ul className="space-y-1.5">
                {exploreLinks.map((l) => (
                  <li key={l.href}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. NEWSLETTER SIGNUP PLACEHOLDER (FRONTEND ONLY) */}
          <div className="md:col-span-2 lg:col-span-4">
            <div className="rounded-2xl border border-[#E2B93B]/20 bg-white/[0.03] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <ColumnHeading>Newsletter</ColumnHeading>
              <p className="mb-5 text-sm leading-6 text-[#E8DCC8]/80">
                Subscribe to get the latest legal insights, templates, and updates straight to your inbox.
              </p>

              {/* Frontend Form Placeholder */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex max-w-md items-center"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  required
                  className="h-12 w-full rounded-xl border border-[#E2B93B]/30 bg-[#0B1526]/70 px-4 pr-14 text-sm text-[#FBF6EA] placeholder-[#E8DCC8]/60 outline-none transition-all duration-300 focus:border-[#E2B93B]/70 focus:ring-2 focus:ring-[#E2B93B]/30"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className={`absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#E2B93B] to-[#C99A12] text-[#0B1526] transition-all duration-300 hover:scale-105 active:scale-95 motion-reduce:transition-none ${focusRing}`}
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div
          aria-hidden="true"
          className="mt-16 h-px bg-gradient-to-r from-transparent via-[#E2B93B]/30 to-transparent"
        />
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-[#E8DCC8]/60 md:flex-row">
          <p>Copyright {new Date().getFullYear()} — LegalEase. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className={`rounded-sm py-1 transition-colors duration-300 hover:text-[#F3D98B] ${focusRing}`}
            >
              Terms of Service
            </Link>

            <Link
              href="/privacy"
              className={`rounded-sm py-1 transition-colors duration-300 hover:text-[#F3D98B] ${focusRing}`}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* নিচের বড় হালকা brand watermark (শুধু সাজসজ্জা) */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative select-none overflow-hidden text-center"
      >
        <p
          className="translate-y-[14%] whitespace-nowrap bg-gradient-to-b from-[#E2B93B]/30 via-[#E2B93B]/10 to-transparent bg-clip-text text-[15vw] font-bold leading-[0.85] tracking-[-0.02em] text-transparent sm:text-[12vw] lg:text-[10rem]"
          style={headingFont}
        >
          LegalEase
        </p>
      </div>
    </footer>
  );
}