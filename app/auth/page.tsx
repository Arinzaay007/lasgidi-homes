"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import type { Role } from "@/lib/types";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [role, setRole] = useState<Role>("seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError || !data.user) {
        setError(signUpError?.message || "Could not sign up");
        setLoading(false);
        return;
      }
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role,
        full_name: fullName,
        phone,
      });
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-md mx-auto px-4 py-16">
        <h1 className="font-display text-3xl text-ink">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 text-sm font-medium rounded-sm border-2 border-ink ${
              mode === "signup" ? "bg-ink text-white" : "text-ink"
            }`}
          >
            Sign up
          </button>
          <button
            onClick={() => setMode("signin")}
            className={`px-4 py-2 text-sm font-medium rounded-sm border-2 border-ink ${
              mode === "signin" ? "bg-ink text-white" : "text-ink"
            }`}
          >
            Sign in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole("seeker")}
                  className={`flex-1 py-3 rounded-sm border-2 border-ink font-display text-sm ${
                    role === "seeker" ? "bg-vermilion text-white border-vermilion" : "text-ink"
                  }`}
                >
                  I'm looking for a house
                </button>
                <button
                  type="button"
                  onClick={() => setRole("agent")}
                  className={`flex-1 py-3 rounded-sm border-2 border-ink font-display text-sm ${
                    role === "agent" ? "bg-vermilion text-white border-vermilion" : "text-ink"
                  }`}
                >
                  I'm an agent
                </button>
              </div>
              <input
                required
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-2 border-ink rounded-sm px-3 py-2 bg-white"
              />
              <input
                required
                placeholder="Phone number (WhatsApp)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-ink rounded-sm px-3 py-2 bg-white"
              />
            </>
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-ink rounded-sm px-3 py-2 bg-white"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-ink rounded-sm px-3 py-2 bg-white"
          />
          {error && <p className="text-vermilion text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-ink text-white font-display text-lg tracking-wide py-3 rounded-sm hover:bg-vermilion transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
