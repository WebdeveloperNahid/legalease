"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Link,
  TextField,
  Label,
  InputGroup,
  Input,
  FieldError,
} from "@heroui/react";
import { Eye, EyeSlash, Person, At, ShieldKeyhole } from "@gravity-ui/icons";
import { FaGoogle } from "react-icons/fa6";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  // UI States
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      const { data, error: authError } = await signUp.email({
        email,
        password,
        name,
        role,
      });

      if (authError) {
        setError(authError.message || "Something went wrong during signup.");
      } else {
        setSuccess("Account created successfully! Redirecting to Home...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError("Google authentication failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-6 px-4 sm:py-10 bg-amber-50/40 dark:bg-[#11100C] transition-colors duration-300">
      <Card className="w-full max-w-md p-5 sm:p-6 shadow-xl border bg-white border-amber-200/60 dark:bg-[#1C1A0E] dark:border-[#AF8752]/40 rounded-2xl sm:rounded-3xl transition-colors duration-300">
        {/* Header Container */}
        <div className="flex flex-col items-center justify-center gap-1 pb-5 mb-5 sm:pb-6 sm:mb-6 text-center border-b border-amber-100 dark:border-[#AF8752]/20">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-950 dark:text-[#FFD500]">
            Create an account
          </h1>
          <p className="text-xs sm:text-sm text-amber-800/70 dark:text-[#AF8752]/80">
            Fill in the fields below to get started
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignup} className="flex flex-col gap-3 sm:gap-4">
          {/* Name Field */}
          <TextField isRequired name="name" className="flex flex-col gap-1">
            <Label className="text-xs font-semibold text-amber-900 dark:text-[#AF8752]">
              Name
            </Label>
            <InputGroup className="flex items-center gap-2 rounded-xl px-3 border border-amber-200 bg-amber-50/50 dark:border-[#AF8752]/40 dark:bg-[#11100C] focus-within:border-amber-500 dark:focus-within:border-[#FFD500] transition-colors">
              <Person
                className="text-amber-700/60 dark:text-[#AF8752] pointer-events-none shrink-0"
                size={16}
              />
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent py-2 text-sm font-semibold outline-none border-none text-[#FFD500] placeholder-amber-600/50 dark:placeholder-[#FFD500]/40"
              />
            </InputGroup>
          </TextField>

          {/* Email Field */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="flex flex-col gap-1"
          >
            <Label className="text-xs font-semibold text-amber-900 dark:text-[#AF8752]">
              Email Address
            </Label>
            <InputGroup className="flex items-center gap-2 rounded-xl px-3 border border-amber-200 bg-amber-50/50 dark:border-[#AF8752]/40 dark:bg-[#11100C] focus-within:border-amber-500 dark:focus-within:border-[#FFD500] transition-colors">
              <At
                className="text-amber-700/60 dark:text-[#AF8752] pointer-events-none shrink-0"
                size={16}
              />
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-sm font-semibold outline-none border-none text-[#FFD500] placeholder-amber-600/50 dark:placeholder-[#FFD500]/40"
              />
            </InputGroup>
          </TextField>

          {/* Role Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-amber-900 dark:text-[#AF8752]">
              Choose Your Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 rounded-xl px-3 text-sm font-semibold outline-none cursor-pointer border border-amber-200 bg-amber-50/50 dark:border-[#AF8752]/40 dark:bg-[#11100C] text-[#FFD500] focus:border-amber-500 dark:focus:border-[#FFD500] transition-colors"
            >
              <option
                value="user"
                className="bg-white text-amber-700 dark:bg-[#1C1A0E] dark:text-[#FFD500] font-semibold"
              >
                Client
              </option>
              <option
                value="lawyer"
                className="bg-white text-amber-700 dark:bg-[#1C1A0E] dark:text-[#FFD500] font-semibold"
              >
                Lawyer
              </option>
            </select>
          </div>

          {/* Password Field */}
          <TextField
            isRequired
            name="password"
            className="flex flex-col gap-1"
            validate={(value) =>
              value.length < 8
                ? "Password must be at least 8 characters long."
                : null
            }
          >
            <Label className="text-xs font-semibold text-amber-900 dark:text-[#AF8752]">
              Password
            </Label>
            <InputGroup className="flex items-center gap-2 rounded-xl px-3 border border-amber-200 bg-amber-50/50 dark:border-[#AF8752]/40 dark:bg-[#11100C] focus-within:border-amber-500 dark:focus-within:border-[#FFD500] transition-colors">
              <ShieldKeyhole
                className="text-amber-700/60 dark:text-[#AF8752] pointer-events-none shrink-0"
                size={16}
              />
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2 text-sm font-semibold outline-none border-none text-[#FFD500] placeholder-amber-600/50 dark:placeholder-[#FFD500]/40"
              />
              <button
                className="focus:outline-none text-amber-700/60 dark:text-[#AF8752] hover:text-amber-900 dark:hover:text-[#FFD500] shrink-0"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </InputGroup>
            <FieldError className="text-xs font-medium mt-0.5 text-red-500 dark:text-amber-500" />
          </TextField>

          {/* Confirm Password Field */}
          <TextField
            isRequired
            name="confirmPassword"
            className="flex flex-col gap-1"
          >
            <Label className="text-xs font-semibold text-amber-900 dark:text-[#AF8752]">
              Confirm Password
            </Label>
            <InputGroup className="flex items-center gap-2 rounded-xl px-3 border border-amber-200 bg-amber-50/50 dark:border-[#AF8752]/40 dark:bg-[#11100C] focus-within:border-amber-500 dark:focus-within:border-[#FFD500] transition-colors">
              <ShieldKeyhole
                className="text-amber-700/60 dark:text-[#AF8752] pointer-events-none shrink-0"
                size={16}
              />
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent py-2 text-sm font-semibold outline-none border-none text-[#FFD500] placeholder-amber-600/50 dark:placeholder-[#FFD500]/40"
              />
            </InputGroup>
          </TextField>

          {/* Error & Success Badges */}
          {error && (
            <div className="p-3 text-xs font-semibold rounded-xl text-center bg-red-50 dark:bg-[#3a1313] text-red-600 dark:text-[#ff8888] border border-red-200 dark:border-[#883a3a]">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-xs font-semibold rounded-xl text-center bg-emerald-50 dark:bg-[#133a1d] text-emerald-600 dark:text-[#88ff9c] border border-emerald-200 dark:border-[#3a8846]">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-bold rounded-xl text-sm h-11 sm:h-12 mt-2 bg-amber-500 text-white shadow-md hover:bg-amber-600 dark:bg-[#FFD500] dark:text-[#11100C] dark:hover:bg-[#e6c000] transition-all"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Sign Up
          </Button>

          {/* Divider */}
          <div className="flex items-center my-1">
            <div className="flex-1 h-[1px] bg-amber-200 dark:bg-[#AF8752]/30"></div>
            <span className="px-3 text-xs text-amber-800/60 dark:text-[#AF8752]">
              OR
            </span>
            <div className="flex-1 h-[1px] bg-amber-200 dark:bg-[#AF8752]/30"></div>
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="bordered"
            className="w-full font-medium rounded-xl text-sm h-11 sm:h-12 border-amber-300 dark:border-[#AF8752] text-amber-950 dark:text-[#FFD500] bg-amber-100 hover:bg-amber-200 font-semibold dark:hover:bg-white/5 transition-all"
          >
            <FaGoogle className="mr-2 text-amber-600 dark:text-[#FFD500]" />{" "}
            Continue with Google
          </Button>

          {/* Navigation Link */}
          <div className="text-center pt-4 mt-1 sm:mt-2 text-xs sm:text-sm border-t border-amber-100 dark:border-[#AF8752]/20 text-amber-800/70 dark:text-[#AF8752]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold cursor-pointer text-xs sm:text-sm text-amber-600 hover:text-amber-700 dark:text-[#FFD500] dark:hover:underline"
            >
              Sign in instead
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
