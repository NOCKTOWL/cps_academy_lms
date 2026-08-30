import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex items-center justify-center px-6 py-32 sm:py-40 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold uppercase tracking-widest text-sky-400">
            404 Error
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight sm:text-7xl">
            Page not found
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            It looks like you&apos;ve taken a wrong turn. <br/> Don&apos;t worry, it happens to the best of us.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="rounded-lg bg-sky-700/80 px-6 py-3 font-semibold text-white transition hover:bg-sky-600/80"
            >
              Go home
            </Link>

            <Link
              href="/courses"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-sky-600/50 hover:bg-slate-900"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}