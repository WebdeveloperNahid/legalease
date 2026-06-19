"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaScaleBalanced } from "react-icons/fa6";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  console.log(session);
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
        },
      },
    });
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Lawyers", href: "/browse-lawyers" },
  ];

  return (
    // নেভবার ব্যাকগ্রাউন্ডে গভীর ডার্ক-জলপাই টোন এবং বর্ডারে #88865A এর সূক্ষ্ম টাচ
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#171610]/90 to-[#0E0E0A]/95 backdrop-blur-md border-b border-[#88865A]/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* 🏛️ LOGO SECTION */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD500] via-[#88865A] to-[#2A291A] p-[1px] shadow-[0_0_15px_rgba(136,134,90,0.2)] transition-all duration-300 group-hover:scale-105">
              {/* জলপাই ব্যাকগ্রাউন্ডের সাথে ম্যাচিং ডার্ক ইনার বক্স */}
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#11100C] transition-colors group-hover:bg-transparent">
                <FaScaleBalanced className="text-xl text-[#FFD500] transition-colors group-hover:text-black" />
              </div>
            </div>

            <div className="leading-none">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD500]/80">
                Premium Law
              </span>
              <h1 className="text-xl font-black text-white tracking-wide mt-0.5">
                Legal<span className="text-[#FFD500]">Ease</span>
              </h1>
            </div>
          </Link>

          {/* 🌐 DESKTOP NAVIGATION (Floating Olive Pill) */}
          <div className="hidden items-center gap-8 md:flex">
            {/* ক্যাপসুল ব্যাকগ্রাউন্ডে জলপাই কালারের সফট অপাসিটি */}
            <ul className="flex items-center gap-1.5 rounded-full border border-[#88865A]/20 bg-[#88865A]/5 p-1.5 backdrop-blur-lg">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative rounded-full px-5 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-[#FFD500] hover:bg-[#88865A]/15"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Elegant Metallic Divider */}
            <div className="h-5 w-[1px] bg-gradient-to-b from-transparent via-[#88865A]/40 to-transparent" />

            {/* 🔐 AUTH BUTTONS */}
            <div className="flex items-center gap-5">
              {user ? (
                <>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="bg-[#FFD500] font-bold text-gray-600"
                  >
                    Logout
                  </Button>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Link
                    href="/signin"
                    className="text-sm font-semibold text-gray-200 transition-colors duration-300 hover:text-[#FFD500]"
                  >
                    Signin
                  </Link>
                  <Link
                    href="/signup"
                    className="h-11 bg-gradient-to-r from-[#FFD500] to-[#171817] px-6 text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,213,0,0.2)]  transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[1px] rounded-full flex justify-center items-center "
                  >
                    SignUp
                  </Link>{" "}
                </>
              )}
            </div>
          </div>

          {/* 📱 MOBILE MENU TRIGGER */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-gray-300 transition-all hover:bg-[#88865A]/10 hover:text-[#FFD500]"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6 text-[#FFD500]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE DROPDOWN MENU */}
      {isMenuOpen && (
        <div className="border-t border-[#88865A]/20 bg-[#0E0E0A]/98 backdrop-blur-xl md:hidden">
          <div className="space-y-2 px-4 py-6">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-gray-300 transition-all hover:bg-[#88865A]/15 hover:text-[#FFD500]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-[#88865A]/10 pt-4">
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      className="bg-[#FFD500] font-bold text-gray-600"
                    >
                      Logout
                    </Button>{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Link
                      href="/signin"
                      className="text-sm font-semibold text-gray-200 transition-colors duration-300 hover:text-[#FFD500]"
                    >
                      Signin
                    </Link>
                    <Link
                      href="/signup"
                      className="h-11 w-19 bg-gradient-to-r from-[#FFD500] to-[#171817] px-6 text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,213,0,0.2)]  transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[1px] rounded-full flex justify-center items-center "
                    >
                      SignUp
                    </Link>{" "}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
