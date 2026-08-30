"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { login } from "@/app/auth/actions";

import { BiSolidShow, BiSolidHide } from "react-icons/bi";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <div className="relative z-10 flex min-h-full flex-col">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 font-black text-white">
                  C
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight">CPS Academy</p>
                </div>
              </div>
            </header>

            <div className="mt-16 flex flex-1 flex-col justify-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">
                Learn fast
              </p>

              <h1 className="max-w-xl text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-7xl">
                Build real skill.
                <span className="block text-sky-300">Not just noise.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base text-slate-300 sm:text-lg">
                Turn lessons, quizzes, and progress into momentum. Teach better. Learn smarter.
              </p>

              <div className="mt-12 grid max-w-2xl gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-3xl font-black text-white">12k+</p>
                  <p className="mt-2 text-sm text-slate-300">active learners</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-3xl font-black text-white">140+</p>
                  <p className="mt-2 text-sm text-slate-300">courses</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-3xl font-black text-white">98%</p>
                  <p className="mt-2 text-sm text-slate-300">completion joy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-950 p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                Sign in to your account
              </h2>
            </div>

            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 pr-12 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <BiSolidHide className="size-8" />
                    ) : (
                      <BiSolidShow className="size-8" />
                    )}
                  </button>
                </div>
              </div>

              {state.error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl bg-sky-700/80 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-sky-600/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Logging in..." : "Login to dashboard"}
              </button>
            </form>

            <p className="mt-8 text-sm text-slate-400">
              No account yet?{" "}
              <Link href="/auth/register" className="font-medium text-sky-300 hover:text-sky-200">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}