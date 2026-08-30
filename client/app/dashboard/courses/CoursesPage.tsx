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
}: {
  courses: Course[];
  role: string;
}) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Manage Courses
        </h1>

        <p className="mt-2 text-slate-400">
          {role === "instructor"
            ? "Manage your courses."
            : "Manage all courses."}
        </p>

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

              <Link
                href={`/dashboard/courses/${course.documentId}`}
                className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}