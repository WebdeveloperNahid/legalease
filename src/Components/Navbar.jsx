"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { FaScaleBalanced, FaBars, FaXmark, FaArrowRightFromBracket } from "react-icons/fa6";

/* ---------- Config ---------- */
// Banner.jsx-এর NAVBAR_HEIGHT-এর সাথে একই রাখুন
const NAVBAR_HEIGHT = 72;

const DASHBOARD_LINKS = {
  user: "/dashboard/user",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

/*
  Palette: Navy + Gold
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B | Gold Light #F3D98B
  Cream #FBF6EA     | Beige #E8DCC8
*/

/* ---------- Reusable styles ---------- */
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D98B]";

const btnBase = `inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${focusRing}`;
const btnPrimary = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_6px_20px_rgba(226,185,59,0.3)] hover:shadow-[0_8px_26px_rgba(226,185,59,0.5)]`;
const btnSecondary = `${btnBase} border border-[#FBF6EA]/35 bg-transparent text-[#FBF6EA] hover:border-[#E2B93B] hover:text-[#F3D98B]`;

/* ---------- Small components ---------- */
function Avatar({ user }) {
  const initial = (user.name || user.email || "U").trim().charAt(0).toUpperCase();

  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name ? `${user.name}'s profile photo` : "Profile photo"}
        referrerPolicy="no-referrer"
        className="h-9 w-9 rounded-full border border-[#E2B93B]/70 object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2B93B]/70 bg-[#E2B93B]/15 text-sm font-bold text-[#F3D98B]"
    >
      {initial}
    </span>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      aria-label="LegalEase home"
      className={`group flex items-center gap-3 rounded-lg ${focusRing}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2B93B]/60 bg-[#E2B93B]/10 transition-colors duration-200 group-hover:bg-[#E2B93B]">
        <FaScaleBalanced
          aria-hidden="true"
          className="text-lg text-[#F3D98B] transition-colors duration-200 group-hover:text-[#0B1526]"
        />
      </span>
      <span className="leading-none">
        <span
          className="block text-2xl font-bold tracking-[-0.01em] text-[#FBF6EA]"
          style={{ fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)" }}
        >
          Legal<span className="text-[#E2B93B]">Ease</span>
        </span>
        <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8DCC8]/75 sm:block">
          Online Lawyer Hiring
        </span>
      </span>
    </Link>
  );
}

/* ---------- Navbar ---------- */
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = session?.user;
  const isLoggedIn = Boolean(user?.email);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Lawyers", href: "/lawyers" },
  ];

  if (isLoggedIn) {
    const role = user?.role?.toLowerCase() ?? "";
    navLinks.push({
      label: "Dashboard",
      href: DASHBOARD_LINKS[role] ?? "/dashboard",
    });
  }

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsMenuOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  // scroll করলে shadow ও gold রেখা দেখানো
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // পেজ বদলালে mobile menu বন্ধ
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Escape চাপলে mobile menu বন্ধ
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const firstName = user?.name?.trim().split(" ")[0] || "Account";

  return (
    <header
      className={`sticky top-0 z-50 bg-[#0B1526]/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : ""
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{ height: NAVBAR_HEIGHT }}
      >
        <Logo />

        {/* ---------- Desktop ---------- */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${focusRing} ${
                      active
                        ? "text-[#FBF6EA]"
                        : "text-[#E8DCC8]/85 hover:text-[#F3D98B]"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#E2B93B] transition-opacity duration-200 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="h-6 w-px bg-[#E2B93B]/30" aria-hidden="true" />

          {isPending ? (
            <div
              className="h-10 w-44 animate-pulse rounded-xl bg-[#14213D]"
              aria-hidden="true"
            />
          ) : isLoggedIn && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <Avatar user={user} />
                <span className="max-w-[120px] truncate text-sm font-medium text-[#FBF6EA]">
                  {firstName}
                </span>
              </div>
              <button type="button" onClick={handleSignOut} className={btnSecondary}>
                <FaArrowRightFromBracket aria-hidden="true" className="text-xs" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin" className={btnSecondary}>
                Sign In
              </Link>
              <Link href="/signup" className={btnPrimary}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* ---------- Mobile trigger ---------- */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#FBF6EA]/30 text-[#FBF6EA] transition-colors hover:border-[#E2B93B] hover:text-[#F3D98B] md:hidden ${focusRing}`}
        >
          {isMenuOpen ? (
            <FaXmark aria-hidden="true" className="text-lg" />
          ) : (
            <FaBars aria-hidden="true" className="text-lg" />
          )}
        </button>
      </nav>

      {/* নিচের gold রেখা (উচ্চতা বাড়ায় না) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2B93B] to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-90" : "opacity-40"
        }`}
      />

      {/* ---------- Mobile menu ---------- */}
      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-[#E2B93B]/15 bg-[#0B1526] md:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 rounded-xl border border-[#E2B93B]/25 bg-[#14213D] p-3">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#FBF6EA]">
                    {user.name || "Account"}
                  </p>
                  <p className="truncate text-xs text-[#E8DCC8]/70">{user.email}</p>
                </div>
              </div>
            )}

            <ul className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${focusRing} ${
                        active
                          ? "bg-[#E2B93B]/15 text-[#F3D98B]"
                          : "text-[#E8DCC8] hover:bg-[#14213D] hover:text-[#FBF6EA]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3 border-t border-[#E2B93B]/15 pt-4">
              {isPending ? null : isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={`${btnSecondary} h-12 w-full`}
                >
                  <FaArrowRightFromBracket aria-hidden="true" className="text-xs" />
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/signup" className={`${btnPrimary} h-12 w-full`}>
                    Sign Up
                  </Link>
                  <Link href="/signin" className={`${btnSecondary} h-12 w-full`}>
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;