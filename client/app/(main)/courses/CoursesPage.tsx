"use client";

import Link from "next/link";

type Course = {
  documentId: string;
  title: string;
  description?: string;
};

export default function CoursesPage({
  courses,
  role,
  isLoggedIn,
}: {
  courses: Course[];
  role: string;
  isLoggedIn: boolean;
}) {

  const canManage = role === "admin" || role === "content_manager" || role === "instructor";
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="flex items-end justify-between mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {isLoggedIn
                ? role === "instructor"
                  ? "My Courses"
                  : "All Courses"
                : "Courses"}
            </h1>

            <p className="mt-2 text-slate-400">
              {isLoggedIn
                ? role === "instructor"
                  ? "Manage your courses and track student progress."
                  : "Browse all available courses."
                : "Browse all available courses and start learning."}
            </p>
          </div>

          {canManage && (
            <div className="mt-4">
              <Link
                href="/courses/create"
                className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950"
              >
                Create New Course
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          {courses.map((course) => (
            <div
              key={course.documentId}
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-5"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {course.title}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {course.description}
                </p>
              </div>

              {canManage ? (
                <Link
                  href={`/courses/${course.documentId}`}
                  className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950"
                >
                  Manage
                </Link>
              ) : !isLoggedIn ? (
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950"
                >
                  Enroll Now
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.documentId}`}
                  className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950"
                >
                  View Course
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}