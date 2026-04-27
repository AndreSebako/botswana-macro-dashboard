"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.assign(next);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16 text-white">
      <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
        Account
      </div>

      <h1 className="mt-3 text-3xl font-semibold">Log in</h1>

      <p className="mt-3 text-slate-300">
        Sign in to access the protected dashboard and data sections.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}

      <p className="mt-6 text-sm text-slate-400">
        Need an account?{" "}
        <Link href="/signup" className="text-white underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-6 py-16 text-white">
          Loading login...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}