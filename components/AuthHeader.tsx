"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserProfile = {
  first_name?: string;
  last_name?: string;
  profession?: string;
};

export function AuthHeader() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(Boolean(session));
      setProfile((session?.user?.user_metadata as UserProfile) ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setProfile((session?.user?.user_metadata as UserProfile) ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  const firstName = profile?.first_name?.trim();
  const profession = profile?.profession?.trim();

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Link
        href="/dashboard"
        className="rounded-2xl bg-blue-500 px-6 py-4 text-lg font-medium text-white transition hover:bg-blue-400"
      >
        Open dashboard
      </Link>

      <Link
        href="/analysis"
        className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-white transition hover:bg-white/10"
      >
        Read analysis
      </Link>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-slate-300">
          Checking session...
        </div>
      ) : isAuthenticated ? (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-slate-200">
            {firstName
              ? `Welcome, ${firstName}${profession ? ` • ${profession}` : ""}`
              : "Signed in"}
          </div>

          <Link
            href="/comparison"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-white transition hover:bg-white/10"
          >
            Comparison
          </Link>

          <button
            onClick={handleSignOut}
            className="rounded-2xl border border-red-400/20 bg-red-400/10 px-6 py-4 text-lg font-medium text-red-100 transition hover:bg-red-400/20"
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-white transition hover:bg-white/10"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-4 text-lg font-medium text-emerald-100 transition hover:bg-emerald-400/20"
          >
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}