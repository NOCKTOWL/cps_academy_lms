"use client";

import Link from "next/link";
import type { User } from "@/types/user";

type ContentManagerDashboard = {
  totalCourses: number;
  totalLessons: number;
  totalQuizzes: number;
};

export default function ContentManagerPage({
  user,
  dashboard,
}: {
  user: User;
  dashboard: ContentManagerDashboard;
}) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.username}
          </h1>

          <p className="mt-2 text-slate-400">
            Manage courses and learning content.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Courses
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.totalCourses}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Lessons
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.totalLessons}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Quizzes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.totalQuizzes}
            </p>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/courses"
            className="rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-500"
          >
            <h2 className="text-xl font-bold">Manage Courses</h2>

            <p className="mt-2 text-sm text-slate-400">
              Create, edit, and manage courses.
            </p>
          </Link>

          <Link
            href="/dashboard/blogs"
            className="rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-500"
          >
            <h2 className="text-xl font-bold">Manage Blogs</h2>

            <p className="mt-2 text-sm text-slate-400">
              Create, edit, and manage blog posts.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}