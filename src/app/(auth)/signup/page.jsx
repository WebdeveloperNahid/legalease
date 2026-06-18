"use client";

import { useState } from "react";
// Import HeroUI v3 compound form elements
import { Card, Button, Link, TextField, Label, InputGroup, Input, FieldError } from "@heroui/react";
// Import updated Gravity UI icons (using 'At' instead of 'AtSign')
import { Eye, EyeSlash, Person, At, ShieldKeyhole } from "@gravity-ui/icons";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    // সাবমিট করার সময়ও ৮ ক্যারেক্টার চেক (নিরাপত্তার জন্য)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await signUp.email({
        email,
        password,
        name,
      });

      if (authError) {
        setError(authError.message || "Something went wrong during signup.");
      } else {
        setSuccess("Account created successfully! Welcome.");
        setName("");
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
            Create an account
          </h1>
          <p className="text-sm" style={{ color: "#AF8752" }}>Fill in the fields below to get started</p>
        </div>
        
        {/* Form Body */}
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          
          {/* Name Field */}
          <TextField isRequired name="name" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium" style={{ color: "#AF8752" }}>Name</Label>
            <InputGroup
              className="flex items-center gap-2 rounded-xl px-3 transition-colors"
              style={{ border: "1px solid #AF8752", backgroundColor: "#11100C" }}
            >
              <Person style={{ color: "#AF8752" }} className="pointer-events-none" size={16} />
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none border-none"
                style={{ color: "#FFD500" }}
              />
            </InputGroup>
          </TextField>

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

          {/* Password Field সাথে কাস্টম ৮ ক্যারেক্টার ভ্যালিডেশন */}
          <TextField 
            isRequired 
            name="password" 
            className="flex flex-col gap-1.5"
            validate={(value) => value.length < 8 ? "Password must be at least 8 characters long." : null}
          >
            <Label className="text-sm font-medium" style={{ color: "#AF8752" }}>Password</Label>
            <InputGroup
              className="flex items-center gap-2 rounded-xl px-3 transition-colors"
              style={{ border: "1px solid #AF8752", backgroundColor: "#11100C" }}
            >
              <ShieldKeyhole style={{ color: "#AF8752" }} className="pointer-events-none" size={16} />
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Choose a password"
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
            {/* ভ্যালিডেশন এরর মেসেজটি সুন্দরভাবে দেখানোর জন্য */}
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
            Sign Up
          </Button>

          {/* Navigation Option */}
          <div
            className="text-center pt-4 mt-2 text-sm"
            style={{ borderTop: "1px solid #AF8752", color: "#AF8752" }}
          >
            Already have an account?{" "}
            <Link href="/signin" className="font-medium cursor-pointer text-sm" style={{ color: "#FFD500" }}>
              Sign in instead
            </Link>
          </div>

        </form>
      </Card>
    </div>
  );
}