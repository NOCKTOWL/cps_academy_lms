import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      
      <section className="relative overflow-hidden border-b border-slate-800 px-6 py-20 lg:px-8 lg:py-32">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">
                Learning platform
              </p>

              <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                Learn. Teach.
                <span className="block text-sky-400">Level up.</span>
              </h1>

              <p className="mt-6 max-w-md text-lg text-slate-300 sm:text-xl">
                CPS Academy LMS brings courses, lessons, and quizzes together. Built for students who want to learn fast and instructors who want to teach better.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/register"
                  className="rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-sky-500"
                >
                  Start learning
                </Link>

                <Link
                  href="/auth/login"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-base font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-3xl font-black text-white">12k+</p>
                  <p className="mt-2 text-sm text-slate-400">Active learners</p>
                </div>

                <div>
                  <p className="text-3xl font-black text-white">140+</p>
                  <p className="mt-2 text-sm text-slate-400">Courses available</p>
                </div>

                <div>
                  <p className="text-3xl font-black text-white">98%</p>
                  <p className="mt-2 text-sm text-slate-400">Completion joy</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex">
              <div className="relative w-full">
                <div className="absolute inset-0 rounded-2xl border border-slate-800 bg-linear-to-br from-slate-800 to-slate-950" />

                <div className="relative rounded-2xl border border-slate-700 bg-slate-900 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-sky-600/20 border border-sky-600/30" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Interactive courses
                        </p>
                        <p className="text-xs text-slate-500">Learn at your pace</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-sky-600/20 border border-sky-600/30" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Track progress
                        </p>
                        <p className="text-xs text-slate-500">See your journey</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-sky-600/20 border border-sky-600/30" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Real quizzes
                        </p>
                        <p className="text-xs text-slate-500">Test your knowledge</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-sky-600/20 border border-sky-600/30" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Instant feedback
                        </p>
                        <p className="text-xs text-slate-500">Learn and improve</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
              Platform features
            </p>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Everything you need to learn and teach
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Courses",
                description: "Structured learning paths designed for your goals",
              },
              {
                title: "Lessons",
                description: "Deep-dive content broken down into digestible chunks",
              },
              {
                title: "Quizzes",
                description: "Test your knowledge and track your progress",
              },
              {
                title: "Dashboard",
                description: "See your learning stats at a glance",
              },
              {
                title: "Progress tracking",
                description: "Know exactly how far you've come",
              },
              {
                title: "Community",
                description: "Learn alongside thousands of motivated people",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700 hover:bg-slate-900/80"
              >
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-8 text-center sm:p-12 lg:p-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
              Ready to start?
            </p>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Join thousands learning today
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Sign up now and get instant access to hundreds of courses. No credit card required.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="rounded-xl bg-sky-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-sky-500"
              >
                Create account
              </Link>

              <Link
                href="/auth/login"
                className="rounded-xl border border-slate-700 bg-slate-900 px-8 py-4 text-base font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950/50 px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-400 sm:flex-row sm:text-left">
            <p>&copy; 2026 CPS Academy. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="transition hover:text-slate-200">
                Privacy
              </Link>
              <Link href="#" className="transition hover:text-slate-200">
                Terms
              </Link>
              <Link href="#" className="transition hover:text-slate-200">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}