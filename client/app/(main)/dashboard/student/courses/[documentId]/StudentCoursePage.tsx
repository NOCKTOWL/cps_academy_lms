"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FaYoutube } from "react-icons/fa6";

import { completeLesson } from "./actions";
import type { Course, QuizAttempt } from "@/types/course";
import { Quiz } from '../../../../../../types/course';
import QuizAttemp from '@/types/course';

export default function StudentCoursePage({
  course,
  completedLessonIds,
  quizAttempts,
}: {
  course: Course;
  completedLessonIds: string[];
  quizAttempts: QuizAttempt[];
}) {
  const [completedLessons, setCompletedLessons] = useState<string[]>(completedLessonIds);

  const [pendingLessonId, setPendingLessonId] = useState<string | null>(
    null,
  );

  const [isPending, startTransition] = useTransition();

  function handleComplete(lessonDocumentId: string) {
    if (completedLessons.includes(lessonDocumentId)) {
      return;
    }

    setPendingLessonId(lessonDocumentId);

    startTransition(async () => {
      const result = await completeLesson(
        lessonDocumentId,
        course.documentId,
      );

      if (result.success) {
        setCompletedLessons((prev) => [
          ...prev,
          lessonDocumentId,
        ]);
      } else {
        console.error(result.message);
      }

      setPendingLessonId(null);
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">

        <section>
          <h1 className="text-3xl font-bold">
            {course.title}
          </h1>

          <p className="mt-3 text-slate-400">
            {course.description}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Lessons
          </h2>

          <div className="mt-4 space-y-3">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(
                  lesson.documentId,
                );

                const isThisLessonPending = pendingLessonId === lesson.documentId;

                return (
                  <div
                    key={lesson.documentId}
                    className="flex items-center justify-start gap-8 rounded-xl border border-slate-700 bg-slate-900 p-5"
                  >
                    
                    <button
                      type="button"
                      onClick={() =>
                        handleComplete(lesson.documentId)
                      }
                      disabled={isPending}
                      className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition whitespace-pre-wrap ${isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {isCompleted
                        ? "Completed     ✓"
                        : isThisLessonPending
                          ? "Completing..."
                          : "Mark Complete"}
                    </button>


                    <div className="flex w-full items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {index + 1}. {lesson.title}
                        </p>

                        {lesson.content && (
                          <p className="mt-2 text-sm text-slate-400">
                            {lesson.content}
                          </p>
                        )}
                      </div>

                      {lesson.videoURL && (
                        <Link
                          href={lesson.videoURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-blue-400 hover:text-blue-300"
                        >
                          <FaYoutube className="text-4xl" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400">
                No lessons available yet.
              </p>
            )}
          </div>
        </section>


        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Quizzes
          </h2>

          <div className="mt-4 space-y-4">

            {course.quizzes && course.quizzes.length > 0 ? (
  course.quizzes.map((quiz, index) => {

    const quizAttempt = quizAttempts.find(
      (attempt) =>
        attempt.quiz?.documentId === quiz.documentId,
    );

    const percentage = quizAttempt
      ? Math.round(
          (quizAttempt.score / quizAttempt.totalQuestions) * 100,
        )
      : null;

    return (
      <div
        key={quiz.documentId}
        className="rounded-xl border border-slate-700 bg-slate-900 p-5"
      >
        <div className="flex items-center justify-between gap-4">

          <div>
            <h3 className="font-semibold">
              {index + 1}. {quiz.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Questions: {quiz.quiz_questions?.length ?? 0}
            </p>

            {quizAttempt && (
              <div className="mt-3">
                <p className="text-sm font-medium text-emerald-400">
                  Latest score: {quizAttempt.score} /{" "}
                  {quizAttempt.totalQuestions}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Score: {percentage}%
                </p>
              </div>
            )}

            {!quizAttempt && (
              <p className="mt-3 text-sm text-slate-400">
                Not attempted yet.
              </p>
            )}
          </div>


          <Link
            href={`/dashboard/student/courses/${course.documentId}/quiz/${quiz.documentId}`}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            {quizAttempt ? "Attempt Again" : "Start Quiz"}
          </Link>

        </div>
      </div>
    );
  })
) : (
  <p className="text-slate-400">
    No quizzes available yet.
  </p>
)}

          </div>
        </section>

      </div>
    </main>
  );
}