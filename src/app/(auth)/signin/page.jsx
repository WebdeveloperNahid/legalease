
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
} from "react-icons/fi";
import { FaGoogle } from "react-icons/fa6";
import { signIn, signUp } from "@/lib/auth-client";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1800&auto=format&fit=crop";

const SIDE_IMAGE =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1400&auto=format&fit=crop";

const BRAND_NAME = "LegalEase";

const HIGHLIGHTS = [
  "Verified and experienced lawyers",
  "Private and secure consultations",
  "Clear fees, no hidden charges",
];

const inputWrapperClass =
  "flex items-center gap-3 border border-[#DCE3EE] bg-white px-4 py-3 transition-colors focus-within:border-[#C99A12] focus-within:ring-4 focus-within:ring-[#E2B93B]/15";

const inputClass =
  "w-full min-w-0 bg-transparent text-sm text-[#14213D] outline-none placeholder:text-slate-400";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center bg-[#E2B93B] text-xl font-extrabold text-[#0B1526]">
        {BRAND_NAME.charAt(0)}
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold text-white">
          {BRAND_NAME}
        </span>
        <span className="mt-1 text-[11px] text-white/80">
          Trusted legal help, online
        </span>
      </span>
    </div>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
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
        name: name.trim(),
        email: email.trim(),
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
      setError("Google authentication failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Background */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-[#0B1526]/75" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(226,185,59,0.16), transparent, rgba(0,0,0,0.4))",
        }}
      />

      {/* Main Card - Slight Radius */}
      <div className="relative grid w-full max-w-[1400px] overflow-hidden rounded-lg shadow-2xl shadow-black/40 ring-1 ring-white/15 md:min-h-[80vh] md:w-[80vw] md:grid-cols-[1.15fr_1fr]">
        {/* Left Panel */}
        <aside className="relative min-h-44 md:min-h-0">
          <Image
            src={SIDE_IMAGE}
            alt="Scales of justice and a gavel"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />

          <div className="relative flex h-full flex-col justify-between gap-8 p-6 sm:p-10">
            <Link href="/" className="inline-block w-fit">
              <Brand />
            </Link>

            <div className="hidden md:block">
              <h2 className="max-w-md text-4xl font-extrabold leading-tight text-white drop-shadow-lg lg:text-5xl">
                Your journey to{" "}
                <span className="text-[#F3D98B]">justice</span>{" "}
                starts here.
              </h2>

              <p className="mt-4 max-w-sm text-base leading-relaxed text-white/90">
                Create your account and connect with trusted legal
                professionals. Get the legal support you need,
                all in one place.
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                {HIGHLIGHTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-white"
                  >
                    <FiCheckCircle
                      size={20}
                      className="shrink-0 text-[#E2B93B]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="hidden text-xs text-white/70 md:block">
              © 2026 {BRAND_NAME}. All rights reserved.
            </p>
          </div>
        </aside>

        {/* Right Panel */}
        <main className="flex items-center justify-center bg-white p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <h1 className="font-serif text-3xl font-bold text-[#14213D]">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              Join LegalEase and get started today.
            </p>

            <form onSubmit={handleSignup} className="mt-7 flex flex-col gap-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#14213D]"
                >
                  Full name
                </label>

                <div className={inputWrapperClass}>
                  <FiUser size={18} className="shrink-0 text-[#64748B]" />
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
                  <FiMail size={18} className="shrink-0 text-[#64748B]" />
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

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-[#14213D]"
                >
                  Choose your role
                </label>

                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                    className="w-full appearance-none border border-[#DCE3EE] bg-white px-4 py-3 pr-10 text-sm text-[#14213D] outline-none transition-colors focus:border-[#C99A12] focus:ring-4 focus:ring-[#E2B93B]/15"
                  >
                    <option value="user">Client — Find a lawyer</option>
                    <option value="lawyer">Lawyer — Manage clients</option>
                  </select>

                  <FiBriefcase
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                  />
                </div>
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
                  <FiLock size={18} className="shrink-0 text-[#64748B]" />

                  <input
                    id="password"
                    name="password"
                    type={isVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => setIsVisible((prev) => !prev)}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    className="shrink-0 p-1 text-[#64748B] hover:text-[#14213D] focus-visible:outline-2 focus-visible:outline-[#C99A12]"
                  >
                    {isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>

                <p className="mt-1 text-xs text-[#64748B]">
                  At least 8 characters.
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
                      ? "border-red-400"
                      : ""
                  }`}
                >
                  <FiShield size={18} className="shrink-0 text-[#64748B]" />

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
                    onClick={() => setIsConfirmVisible((prev) => !prev)}
                    aria-label={
                      isConfirmVisible
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="shrink-0 p-1 text-[#64748B] hover:text-[#14213D] focus-visible:outline-2 focus-visible:outline-[#C99A12]"
                  >
                    {isConfirmVisible ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>

                {confirmPassword && confirmPassword !== password && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Success */}
              {success && (
                <p
                  role="status"
                  className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {success}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="mt-1 flex items-center justify-center gap-2 bg-[#14213D] py-3.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#0B1526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99A12] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && <FiLoader size={16} className="animate-spin" />}
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#DCE3EE]" />
              <span className="text-xs text-[#64748B]">OR</span>
              <div className="h-px flex-1 bg-[#DCE3EE]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading || isGoogleLoading}
              className="flex w-full items-center justify-center gap-3 border border-[#DCE3EE] bg-white py-3 text-sm font-semibold text-[#14213D] transition-colors hover:border-[#C99A12] hover:bg-[#FBF6EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99A12] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <FiLoader size={17} className="animate-spin" />
              ) : (
                <FaGoogle className="text-[#B88716]" />
              )}

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Sign In */}
            <p className="mt-7 border-t border-[#DCE3EE] pt-6 text-center text-sm text-[#64748B]">
              Already have an account?{" "}
              <Link
                href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-semibold text-[#8A6A1C] hover:text-[#14213D] hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs leading-5 text-[#94A3B8]">
              © 2026 LegalEase. Trusted legal help, online.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB]">
          <FiLoader size={28} className="animate-spin text-[#C99A12]" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
