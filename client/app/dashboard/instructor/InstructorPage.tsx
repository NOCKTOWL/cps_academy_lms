"use client";

import Link from "next/link";
import type { User } from "@/types/user";

type InstructorPageProps = {
  user: User;

  dashboard: {
    totalCourses: number;
    totalLessons: number;
    totalQuizzes: number;
    totalStudents: number;

    courses: {
      documentId: string;
      title: string;
      totalLessons: number;
      totalQuizzes: number;
      totalStudents: number;
      status: "published" | "draft";
    }[];
  };
};

export default function InstructorPage({
  user,
  dashboard,
}: InstructorPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Instructor dashboard
          </p>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Welcome back, {user.username}
          </h1>

          <p className="mt-2 text-slate-300">
            Here&apos;s an overview of your courses and students.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm font-medium text-slate-400">Total Courses</p>
            <p className="mt-3 text-3xl font-bold text-white">
              {dashboard.totalCourses}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm font-medium text-slate-400">Total Lessons</p>
            <p className="mt-3 text-3xl font-bold text-white">
              {dashboard.totalLessons}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm font-medium text-slate-400">Total Quizzes</p>
            <p className="mt-3 text-3xl font-bold text-white">
              {dashboard.totalQuizzes}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm font-medium text-slate-400">Total Students</p>
            <p className="mt-3 text-3xl font-bold text-white">
              {dashboard.totalStudents}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left">
              <thead>
                <tr className="bg-slate-800/80 text-slate-200">
                  <th className="px-6 py-4 text-sm font-semibold">Course</th>
                  <th className="px-6 py-4 text-sm font-semibold">Students</th>
                  <th className="px-6 py-4 text-sm font-semibold">Lessons</th>
                  <th className="px-6 py-4 text-sm font-semibold">Quizzes</th>
                  <th className="px-6 py-4 text-sm font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.courses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No courses yet.
                    </td>
                  </tr>
                ) : (
                  dashboard.courses.map((course) => {
                    const isPublished = course.status === "published";

                    return (
                      <tr
                        key={course.documentId}
                        className="border-t border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {isPublished ? (
                            <Link
                              href={`/dashboard/instructor/courses/${course.documentId}`}
                              className="text-cyan-400 transition hover:text-cyan-300 hover:underline"
                            >
                              {course.title}
                            </Link>
                          ) : (
                            <span className="text-slate-400">{course.title}</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-300">
                          {course.totalStudents}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-300">
                          {course.totalLessons}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-300">
                          {course.totalQuizzes}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              isPublished
                                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                                : "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                            }`}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}