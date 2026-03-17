"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { signupWithEmail } from "./actions";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signupWithEmail(name, email, password);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        // Sign in the user after successful signup
        console.log("User created, attempting client-side signin...");
        try {
          const signInResult = await signIn("credentials", {
            email: result.email,
            password: result.password,
            redirect: false,
          });

          console.log("Sign in result:", signInResult);

          if (signInResult?.error) {
            setError("Account created! Please sign in with your credentials.");
            setLoading(false);
          } else if (signInResult?.ok) {
            // Successful login, redirect to home
            router.push("/");
          } else {
            setError(
              "Signup successful but login failed. Please try signing in.",
            );
            setLoading(false);
          }
        } catch (signInErr: unknown) {
          console.error("Sign in error:", signInErr);
          setError("Account created! Please sign in with your credentials.");
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        redirectTo: "/",
      });
    } catch (err) {
      console.error("Google signup error:", err);
      setError("Google signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Create Account
        </h2>
        <p className="text-muted-foreground">Join us to get started</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground"
            placeholder="John Doe"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground"
            placeholder="••••••••"
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 6 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 border border-border hover:border-border/80 disabled:opacity-50 text-foreground font-medium py-2 px-4 rounded-lg transition-colors bg-card"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC04"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>

      <p className="text-center text-muted-foreground text-sm mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary/90 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
