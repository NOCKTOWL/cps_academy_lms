'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex items-center justify-center px-6 py-32">
        <div className="max-w-md text-center">
          <p className="text-base font-semibold uppercase tracking-widest text-sky-400">
            Error
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Something went wrong
          </h1>

          <p className="mt-6 text-slate-400">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 rounded-lg bg-sky-700/80 px-6 py-2.5 font-semibold text-white transition hover:bg-sky-600/80"
            >
              Try again
            </button>

            <Link
              href="/"
              className="flex-1 rounded-lg border border-slate-700 px-6 py-2.5 font-semibold text-slate-200 transition hover:border-sky-600/50 hover:bg-slate-900"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}