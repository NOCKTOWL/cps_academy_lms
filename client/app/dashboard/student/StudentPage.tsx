"use client";

import Link from "next/link";
import type { User } from "@/types/user";
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type StudentDashboard = {
  totalCourses?: number;
  completedLessons?: number;
  totalLessons?: number;
  totalQuizzes?: number;
  completedQuizzes?: number;
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
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.username}
          </h1>

          <p className="mt-2 text-slate-400">
            Here&apos;s an overview of your learning progress.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              My Courses
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.totalCourses ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Completed Lessons
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.completedLessons ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Lessons
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.totalLessons ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Completed Quizzes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.completedQuizzes ?? 0}
              <span className="text-base text-slate-500">
                {" "}
                / {dashboard.totalQuizzes ?? 0}
              </span>
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Enrolled Courses</h2>

            {/* dummy searchbar */}
            <div className="mt-4 w-1/3">
              <input
                type="text"
                placeholder="Search courses... (dummy searchbar)"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          

          {dashboard.courses.length > 0 ? (
            <div className="mt-4 flex flex-col gap-4">
              {dashboard.courses.map((course) => (
                <Link
                  key={course.documentId}
                  href={`/dashboard/student/courses/${course.documentId}`}
                  className="grid grid-cols-6 items-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 transition hover:border-cyan-500"
                >
                  <h3 className="text-lg font-semibold col-span-3">
                    {course.title}
                  </h3>

                  <div className="ml-auto col-span-1">
                    <CircularProgressbar
                      value={course.progress}
                      text={`${course.progress}%`}
                      background
                      backgroundPadding={6}
                      styles={buildStyles({
                        backgroundColor: "#1e293b",
                        pathColor: "#06b6d4",
                        textColor: "#94a3b8",
                        trailColor: "transparent"
                      })}
                      className="size-12"
                    />
                  </div>

                  <div className="col-span-2 text-right text-sm text-slate-400">
                    {course.totalQuizzes} Quizzes
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-slate-400">
              You are not enrolled in any courses yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}