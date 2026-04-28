"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          profession,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16 text-white">
      <h1 className="text-3xl font-semibold">Create account</h1>

      <form onSubmit={handleSignup} className="mt-8 space-y-4">
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          type="text"
          placeholder="Profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full rounded-xl bg-white px-4 py-3 text-black"
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-red-300">{message}</p> : null}

      <p className="mt-6 text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-white underline">
          Log in
        </Link>
      </p>
    </main>
  );
}