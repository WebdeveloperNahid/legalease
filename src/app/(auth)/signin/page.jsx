"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Link, TextField, Label, InputGroup, Input, FieldError } from "@heroui/react";
import { Eye, EyeSlash, At, ShieldKeyhole } from "@gravity-ui/icons";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI States
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await signIn.email({
        email,
        password,
        callbackURL:"/"
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
      } else {
        setSuccess("Signed in successfully! Redirecting...");
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
        callbackURL: "/"
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
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-amber-800/70 dark:text-[#AF8752]/80">
            Sign in to your account to continue
          </p>
        </div>
        
        {/* Form Body */}
        <form onSubmit={handleSignin} className="flex flex-col gap-3 sm:gap-4">

          {/* Email Field */}
          <TextField isRequired name="email" type="email" className="flex flex-col gap-1">
            <Label className="text-xs font-semibold text-amber-900 dark:text-[#AF8752]">Email Address</Label>
            <InputGroup className="flex items-center gap-2 rounded-xl px-3 border border-amber-200 bg-amber-50/50 dark:border-[#AF8752]/40 dark:bg-[#11100C] focus-within:border-amber-500 dark:focus-within:border-[#FFD500] transition-colors">
              <At className="text-amber-700/60 dark:text-[#AF8752] pointer-events-none shrink-0" size={16} />
              <Input 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-transparent py-2 text-sm font-semibold outline-none border-none text-[#FFD500] placeholder-amber-600/50 dark:placeholder-[#FFD500]/40" 
              />
            </InputGroup>
          </TextField>

          {/* Password Field */}
          <TextField isRequired name="password" className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-amber-900 dark:text-[#AF8752]">Password</Label>
              <Link href="/forgot-password" className="text-xs font-medium text-amber-600 dark:text-[#FFD500]/80 hover:underline">
                Forgot password?
              </Link>
            </div>
            <InputGroup className="flex items-center gap-2 rounded-xl px-3 border border-amber-200 bg-amber-50/50 dark:border-[#AF8752]/40 dark:bg-[#11100C] focus-within:border-amber-500 dark:focus-within:border-[#FFD500] transition-colors">
              <ShieldKeyhole className="text-amber-700/60 dark:text-[#AF8752] pointer-events-none shrink-0" size={16} />
              <Input 
                type={isVisible ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-transparent py-2 text-sm font-semibold outline-none border-none text-[#FFD500] placeholder-amber-600/50 dark:placeholder-[#FFD500]/40" 
              />
              <button className="focus:outline-none text-amber-700/60 dark:text-[#AF8752] hover:text-amber-900 dark:hover:text-[#FFD500] shrink-0" type="button" onClick={toggleVisibility}>
                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </InputGroup>
          </TextField>

          {/* Error & Success Badges */}
          {error && <div className="p-3 text-xs font-semibold rounded-xl text-center bg-red-50 dark:bg-[#3a1313] text-red-600 dark:text-[#ff8888] border border-red-200 dark:border-[#883a3a]">{error}</div>}
          {success && <div className="p-3 text-xs font-semibold rounded-xl text-center bg-emerald-50 dark:bg-[#133a1d] text-emerald-600 dark:text-[#88ff9c] border border-emerald-200 dark:border-[#3a8846]">{success}</div>}

          {/* Submit Button */}
          <Button type="submit" className="w-full font-bold rounded-xl text-sm h-11 sm:h-12 mt-2 bg-amber-500 text-white shadow-md hover:bg-amber-600 dark:bg-[#FFD500] dark:text-[#11100C] dark:hover:bg-[#e6c000] transition-all" isLoading={isLoading} isDisabled={isLoading}>
            Sign In
          </Button>

          {/* Divider */}
          <div className="flex items-center my-1">
            <div className="flex-1 h-[1px] bg-amber-200 dark:bg-[#AF8752]/30"></div>
            <span className="px-3 text-xs text-amber-800/60 dark:text-[#AF8752]">OR</span>
            <div className="flex-1 h-[1px] bg-amber-200 dark:bg-[#AF8752]/30"></div>
          </div>

          {/* Google OAuth Button */}
          <Button type="button" onClick={handleGoogleLogin} variant="bordered" className="w-full font-medium rounded-xl text-sm h-11 sm:h-12 border-amber-300 dark:border-[#AF8752] text-amber-950 dark:text-[#FFD500] hover:bg-amber-50 dark:hover:bg-white/5 transition-all">
            <FaGoogle className="mr-2 text-amber-600 dark:text-[#FFD500]" /> Continue with Google
          </Button>

          {/* Navigation Link */}
          <div className="text-center pt-4 mt-1 sm:mt-2 text-xs sm:text-sm border-t border-amber-100 dark:border-[#AF8752]/20 text-amber-800/70 dark:text-[#AF8752]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold cursor-pointer text-xs sm:text-sm text-amber-600 hover:text-amber-700 dark:text-[#FFD500] dark:hover:underline">
              Sign up here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}