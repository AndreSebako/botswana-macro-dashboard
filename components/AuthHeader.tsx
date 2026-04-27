"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserProfile = {
  first_name?: string;
  last_name?: string;
  profession?: string;
};

type AuthState = {
  loading: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
};

export function AuthHeader() {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    isAuthenticated: false,
    profile: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const profile = session?.user?.user_metadata as UserProfile | undefined;

      setAuthState({
        loading: false,
        isAuthenticated: Boolean(session),
        profile: profile ?? null,
      });
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const profile = session?.user?.user_metadata as UserProfile | undefined;

      setAuthState({
        loading: false,
        isAuthenticated: Boolean(session),
        profile: profile ?? null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const firstName = authState.profile?.first_name?.trim();

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

      {authState.loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-slate-300">
          Checking session...
        </div>
      ) : authState.isAuthenticated ? (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-slate-200">
            {firstName ? `Welcome, ${firstName}` : "Signed in"}
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