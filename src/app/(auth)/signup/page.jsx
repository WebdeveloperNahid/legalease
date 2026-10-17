
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiBriefcase,
  FiShield,
  FiCheckCircle,
  FiLoader,
  FiUserPlus,
} from "react-icons/fi";
import { FaGoogle } from "react-icons/fa6";
import { signIn, signUp } from "@/lib/auth-client";

// Background Images
const BG_IMAGE =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1800&auto=format&fit=crop";

const SIDE_IMAGE =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1400&auto=format&fit=crop";

// Brand
const BRAND_NAME = "LegalEase";

// Highlights
const HIGHLIGHTS = [
  "Verified and experienced lawyers",
  "Private and secure consultations",
  "Clear fees, no hidden charges",
];

// Input Styles
const inputWrapperClass =
  "flex items-center gap-3 border border-[#DCE3EE] bg-white px-4 py-3 transition-all focus-within:border-[#C99A12] focus-within:ring-4 focus-within:ring-[#E2B93B]/15";

const inputClass =
  "w-full min-w-0 bg-transparent text-sm text-[#14213D] outline-none placeholder:text-slate-400";

// Brand Component
function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E2B93B] text-xl font-extrabold text-[#0B1526]">
        {BRAND_NAME.charAt(0)}
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold text-white">
          {BRAND_NAME}
        </span>

        <span className="mt-1 text-[11px] text-white/75">
          Trusted legal help, online
        </span>
      </span>
    </div>
  );
}

// Signup Form
function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        requestedRole: role,
      });

      if (authError) {
        setError(
          authError.message || "Something went wrong during signup."
        );
        return;
      }

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    setError("");
    setSuccess("");
    setIsGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch {
      setError("Google authentication failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:py-10">
      {/* Background Image */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#0B1526]/75" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(226,185,59,0.16), transparent 45%, rgba(11,21,38,0.65))",
        }}
      />

      {/* Main Card - Rounded Corners */}
      <div className="relative grid w-full max-w-[1400px] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/15 md:min-h-[80vh] md:w-[90vw] md:grid-cols-[1fr_1.05fr] lg:w-[85vw]">
        {/* Left Panel */}
        <aside className="relative min-h-[190px] md:min-h-0">
          <Image
            src={SIDE_IMAGE}
            alt="Scales of justice representing legal services"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover object-center"
          />

          {/* Left Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1526]/85 via-[#0B1526]/45 to-[#0B1526]/95" />

          <div className="relative flex h-full flex-col justify-between gap-8 p-6 sm:p-10 lg:p-12">
            {/* Brand */}
            <Link href="/" className="inline-block w-fit">
              <Brand />
            </Link>

            {/* Introduction */}
            <div className="hidden md:block">
              <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[#E2B93B]/40 bg-[#E2B93B]/10 text-[#F3D98B]">
                <FiUserPlus size={27} />
              </div>

              <h2 className="max-w-md font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
                Your journey to
                <span className="text-[#F3D98B]"> justice </span>
                starts here.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/80 lg:text-base">
                Create your account and connect with trusted legal
                professionals. Get started with a simpler, safer,
                and more accessible legal experience.
              </p>

              {/* Highlights */}
              <ul className="mt-8 flex flex-col gap-4">
                {HIGHLIGHTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/90"
                  >
                    <FiCheckCircle
                      size={19}
                      className="shrink-0 text-[#E2B93B]"
                    />

                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 h-px w-20 bg-[#E2B93B]/70" />
            </div>

            {/* Copyright */}
            <p className="hidden text-xs text-white/60 md:block">
              © 2026 {BRAND_NAME}. All rights reserved.
            </p>
          </div>
        </aside>

        {/* Right Panel - Signup Form */}
        <main className="flex items-center justify-center bg-white px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-7">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-[#E2B93B]/50 bg-[#FBF6EA] text-[#8A6A1C]">
                <FiUserPlus size={22} />
              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#475569]">
                Join LegalEase and get the legal support you need.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#14213D]"
                >
                  Full name
                </label>

                <div className={inputWrapperClass}>
                  <FiUser
                    size={18}
                    className="shrink-0 text-[#64748B]"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#14213D]"
                >
                  Email address
                </label>

                <div className={inputWrapperClass}>
                  <FiMail
                    size={18}
                    className="shrink-0 text-[#64748B]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-[#14213D]"
                >
                  I want to join as
                </label>

                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                    className="w-full appearance-none border border-[#DCE3EE] bg-white px-4 py-3 pr-10 text-sm font-medium text-[#14213D] outline-none transition-all focus:border-[#C99A12] focus:ring-4 focus:ring-[#E2B93B]/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="user">
                      Client — Find and hire lawyers
                    </option>

                    <option value="lawyer">
                      Lawyer — Manage cases and clients
                    </option>
                  </select>

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#64748B]">
                    <FiBriefcase size={17} />
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-[#64748B]">
                  Choose the role that best describes how you will
                  use LegalEase.
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#14213D]"
                >
                  Password
                </label>

                <div className={inputWrapperClass}>
                  <FiLock
                    size={18}
                    className="shrink-0 text-[#64748B]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setIsPasswordVisible((prev) => !prev)
                    }
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                    className="shrink-0 p-1 text-[#64748B] transition-colors hover:text-[#14213D] focus-visible:outline-2 focus-visible:outline-[#C99A12]"
                  >
                    {isPasswordVisible ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-[#64748B]">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#14213D]"
                >
                  Confirm password
                </label>

                <div
                  className={`${inputWrapperClass} ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-400 focus-within:border-red-500"
                      : ""
                  }`}
                >
                  <FiShield
                    size={18}
                    className="shrink-0 text-[#64748B]"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={isConfirmVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setIsConfirmVisible((prev) => !prev)
                    }
                    aria-label={
                      isConfirmVisible
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="shrink-0 p-1 text-[#64748B] transition-colors hover:text-[#14213D] focus-visible:outline-2 focus-visible:outline-[#C99A12]"
                  >
                    {isConfirmVisible ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>

                {confirmPassword && confirmPassword !== password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <p
                  role="alert"
                  className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Success Message */}
              {success && (
                <p
                  role="status"
                  className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700"
                >
                  {success}
                </p>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="mt-1 flex items-center justify-center gap-2 bg-[#14213D] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#14213D]/15 transition-all hover:bg-[#0B1526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99A12] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <FiLoader size={17} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <FiUserPlus size={17} />
                    Create account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#DCE3EE]" />

              <span className="text-xs text-[#64748B]">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-[#DCE3EE]" />
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading || isGoogleLoading}
              className="flex w-full items-center justify-center gap-3 border border-[#DCE3EE] bg-white px-4 py-3 text-sm font-semibold text-[#14213D] transition-all hover:border-[#C99A12] hover:bg-[#FBF6EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99A12] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <FiLoader size={17} className="animate-spin" />
              ) : (
                <FaGoogle size={17} className="text-[#B88716]" />
              )}

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Sign In Link */}
            <p className="mt-7 border-t border-[#DCE3EE] pt-6 text-center text-sm text-[#64748B]">
              Already have an account?{" "}
              <Link
                href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-bold text-[#8A6A1C] underline-offset-4 transition-colors hover:text-[#14213D] hover:underline"
              >
                Sign in
              </Link>
            </p>

            {/* Footer Note */}
            <p className="mt-4 text-center text-xs leading-5 text-[#94A3B8]">
              By creating an account, you agree to use LegalEase
              responsibly and protect your account credentials.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

// Signup Page
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB]">
          <FiLoader
            size={28}
            className="animate-spin text-[#C99A12]"
          />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
