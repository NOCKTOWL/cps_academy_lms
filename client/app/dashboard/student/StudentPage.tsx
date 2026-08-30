"use client";

import Link from "next/link";
import type { User } from "@/types/user";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { logout } from "./actions";

type StudentDashboard = {
  totalCourses?: number;
  completedLessons?: number;
  totalLessons?: number;
  totalQuizzes?: number;
  completedQuizzes?: number;
  enrolledCourseIds: Set<string>;
  courses: {
    documentId: string;
    title: string;
    description: string;
    totalLessons: number;
    completedLessons: number;
    totalQuizzes: number;
    progress: number;
  }[];
};

export default function StudentPage({
  user,
  dashboard,
}: {
  user: User;
  dashboard: StudentDashboard;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
        <header className="mb-8 flex flex-col gap-5 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
              Student dashboard
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Welcome back, {user.username}
            </h1>

            <p className="mt-2 text-slate-300">
              Here&apos;s your learning progress across all your courses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/student/browse-courses"
              className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Browse courses
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">My Courses</p>
            <p className="mt-3 text-3xl font-black text-white">
              {dashboard.totalCourses ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">Completed Lessons</p>
            <p className="mt-3 text-3xl font-black text-white">
              {dashboard.completedLessons ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total Lessons</p>
            <p className="mt-3 text-3xl font-black text-white">
              {dashboard.totalLessons ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">Completed Quizzes</p>
            <p className="mt-3 text-3xl font-black text-white">
              {dashboard.completedQuizzes ?? 0}
              <span className="ml-2 text-base font-medium text-slate-500">
                / {dashboard.totalQuizzes ?? 0}
              </span>
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">Enrolled courses</h2>

            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {dashboard.courses.length > 0 ? (
            <div className="grid gap-4 p-5 xl:grid-cols-2">
              {dashboard.courses.map((course) => (
                <Link
                  key={course.documentId}
                  href={`/dashboard/student/courses/${course.documentId}`}
                  className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-cyan-500 hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Course
                      </p>

                      <h3 className="text-xl font-bold text-white">
                        {course.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                        {course.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <div className="h-14 w-14">
                        <CircularProgressbar
                          value={course.progress}
                          text={`${course.progress}%`}
                          background
                          backgroundPadding={6}
                          styles={buildStyles({
                            backgroundColor: "#0f172a",
                            pathColor: "#22d3ee",
                            trailColor: "#1e293b",
                            textColor: "#e2e8f0",
                            textSize: "28px",
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-sm text-slate-400">
                    <span>{course.totalLessons} lessons</span>
                    <span>{course.totalQuizzes} quizzes</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-slate-400">
              You are not enrolled in any courses yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}