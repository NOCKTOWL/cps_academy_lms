"use client";

import Link from "next/link";
import { useActionState } from "react";

type RegisterState = {
  error: string;
  success: string;
};

const initialState: RegisterState = {
  error: "",
  success: "",
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    async (previousState: RegisterState, formData: FormData) => {
      const username = String(formData.get("username") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "").trim();
      const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

      if (!username || !email || !password || !confirmPassword) {
        return {
          ...previousState,
          error: "All fields are required.",
          success: "",
        };
      }

      if (password !== confirmPassword) {
        return {
          ...previousState,
          error: "Passwords do not match.",
          success: "",
        };
      }

      // hook this to your backend register endpoint when ready
      // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`, {...})
      return {
        ...previousState,
        error: "",
        success: "Account created. You can now sign in.",
      };
    },
    initialState
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)] p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <div className="relative z-10 flex min-h-full flex-col">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950">
                  C
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight">CPS Academy</p>
                </div>
              </div>
            </header>

            <div className="mt-16 flex flex-1 flex-col justify-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Start now
              </p>

              <h1 className="max-w-xl text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-7xl">
                Join the next
                <span className="block text-cyan-300">big skill move.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base text-slate-300 sm:text-lg">
                Build your learning path, track progress, and level up with courses made to move.
              </p>

              <div className="mt-12 grid max-w-2xl gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-black text-white">3x</p>
                  <p className="mt-2 text-sm text-slate-300">faster learning</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-black text-white">24/7</p>
                  <p className="mt-2 text-sm text-slate-300">access</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-black text-white">1</p>
                  <p className="mt-2 text-sm text-slate-300">clear path</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-950 p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Create account
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                Get started today
              </h2>
            </div>

            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-200">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="yourname"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {state.error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {state.error}
                </div>
              )}

              {state.success && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {state.success}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl bg-cyan-400 px-5 py-3.5 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-sm text-slate-400">
              Already got account?{" "}
              <Link href="/auth/login" className="font-medium text-cyan-300 hover:text-cyan-200">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}