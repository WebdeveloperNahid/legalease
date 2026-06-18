"use client";

import { useState } from "react";
// Import HeroUI v3 compound form elements
import { Card, Button, Link, TextField, Label, InputGroup, Input, FieldError } from "@heroui/react";
// Import updated Gravity UI icons (using 'At' instead of 'AtSign')
import { Eye, EyeSlash, At, ShieldKeyhole } from "@gravity-ui/icons";
import { signIn } from "@/lib/auth-client";

export default function SigninPage() {
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
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
      } else {
        setSuccess("Signed in successfully! Redirecting...");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "#11100C" }}>
      <Card
        className="w-full max-w-md p-6 shadow-sm"
        style={{ backgroundColor: "#211E0B", border: "1px solid #AF8752" }}
      >

        {/* Header Container */}
        <div
          className="flex flex-col items-center justify-center gap-1 pb-6 mb-6 text-center"
          style={{ borderBottom: "1px solid #AF8752" }}
        >
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#FFD500" }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#AF8752" }}>Sign in to continue to your account</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignin} className="flex flex-col gap-5">

          {/* Email Field */}
          <TextField isRequired name="email" type="email" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium" style={{ color: "#AF8752" }}>Email Address</Label>
            <InputGroup
              className="flex items-center gap-2 rounded-xl px-3 transition-colors"
              style={{ border: "1px solid #AF8752", backgroundColor: "#11100C" }}
            >
              <At style={{ color: "#AF8752" }} className="pointer-events-none" size={16} />
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none border-none"
                style={{ color: "#FFD500" }}
              />
            </InputGroup>
          </TextField>

          {/* Password Field */}
          <TextField isRequired name="password" className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium" style={{ color: "#AF8752" }}>Password</Label>
              <Link href="/forgot-password" className="text-xs font-medium cursor-pointer" style={{ color: "#FFD500" }}>
                Forgot password?
              </Link>
            </div>
            <InputGroup
              className="flex items-center gap-2 rounded-xl px-3 transition-colors"
              style={{ border: "1px solid #AF8752", backgroundColor: "#11100C" }}
            >
              <ShieldKeyhole style={{ color: "#AF8752" }} className="pointer-events-none" size={16} />
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none border-none"
                style={{ color: "#FFD500" }}
              />
              <button
                className="focus:outline-none transition"
                style={{ color: "#AF8752" }}
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </InputGroup>
            <FieldError className="text-xs font-medium mt-0.5" style={{ color: "#FFD500" }} />
          </TextField>

          {/* Dynamic Status Badges */}
          {error && (
            <div
              className="p-3.5 text-xs font-medium rounded-xl"
              style={{ backgroundColor: "#211E0B", color: "#FFD500", border: "1px solid #AF8752" }}
            >
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {success && (
            <div
              className="p-3.5 text-xs font-medium rounded-xl"
              style={{ backgroundColor: "#211E0B", color: "#FFD500", border: "1px solid #AF8752" }}
            >
              <span className="font-semibold">Success:</span> {success}
            </div>
          )}

          {/* Action Button */}
          <Button
            type="submit"
            className="w-full font-semibold rounded-xl text-sm h-12"
            style={{ backgroundColor: "#FFD500", color: "#11100C" }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Sign In
          </Button>

          {/* Navigation Option */}
          <div
            className="text-center pt-4 mt-2 text-sm"
            style={{ borderTop: "1px solid #AF8752", color: "#AF8752" }}
          >
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium cursor-pointer text-sm" style={{ color: "#FFD500" }}>
              Create one
            </Link>
          </div>

        </form>
      </Card>
    </div>
  );
}