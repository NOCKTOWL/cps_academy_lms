"use client";

import type { Course } from "@/types/course";

export default function StudentCoursePage({
  course,
}: {
  course: Course;
}) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          {course.title}
        </h1>

        <p className="mt-2 text-slate-400">
          {course.description}
        </p>

        <h2 className="mt-8 text-xl font-bold">
          Lessons
        </h2>

        <div className="mt-4 space-y-3">
          {course.lessons?.map((lesson) => (
            <div
              key={lesson.documentId}
              className="rounded-lg border border-slate-700 p-4"
            >
              {lesson.title}
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-xl font-bold">
          Quizzes
        </h2>

        <div className="mt-4 space-y-3">
          {course.quizzes?.map((quiz) => (
            <div
              key={quiz.documentId}
              className="rounded-lg border border-slate-700 p-4"
            >
              <p className="font-medium">{quiz.title}</p>

              <p className="mt-1 text-sm text-slate-400">
                {quiz.quiz_questions?.length || 0} questions
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}