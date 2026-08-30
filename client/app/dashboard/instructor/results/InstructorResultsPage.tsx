"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/course";

type Attempt = {
  documentId: string;
  score: number;
  totalQuestions: number;

  student?: {
    documentId: string;
    username: string;
  };

  quiz?: {
    documentId: string;
    title: string;
    questions?: QuizQuestion[];
  };

  answers?: Record<string, string>;

  createdAt: string;
};

export default function InstructorResultsPage({
  attempts,
}: {
  attempts: Attempt[];
}) {
  const [openAttemptId, setOpenAttemptId] = useState<string | null>(null);

  const toggleAttempt = (attemptId: string) => {
    setOpenAttemptId((current) => (current === attemptId ? null : attemptId));
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Instructor results
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Quiz results
          </h1>
          <p className="mt-2 text-slate-400">
            View student attempts. Keep it clean. Open only what matter.
          </p>
        </header>

        {attempts.length > 0 ? (
          <div className="space-y-5">
            {attempts.map((attempt) => {
              const percentage =
                attempt.totalQuestions > 0
                  ? Math.round((attempt.score / attempt.totalQuestions) * 100)
                  : 0;

              const isOpen = openAttemptId === attempt.documentId;

              return (
                <section
                  key={attempt.documentId}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                        {attempt.quiz?.title ?? "Untitled Quiz"}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                        <span>Student: {attempt.student?.username ?? "Unknown"}</span>
                        <span>•</span>
                        <span>
                          Date: {new Date(attempt.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center">
                        <p className="text-lg font-black text-cyan-300">
                          {attempt.score} / {attempt.totalQuestions}
                        </p>
                        <p className="text-xs text-slate-400">{percentage}%</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleAttempt(attempt.documentId)}
                        className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        {isOpen ? "Hide answers" : "Open answers"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-slate-800 bg-slate-950/50 p-5">
                      {attempt.quiz?.questions && attempt.quiz.questions.length > 0 ? (
                        <div className="space-y-4">
                          {attempt.quiz.questions.map((question, index) => {
                            const studentAnswer = attempt.answers?.[question.documentId];
                            const isCorrect = studentAnswer === question.correctAnswer;

                            return (
                              <div
                                key={question.documentId}
                                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                              >
                                <p className="text-base font-semibold text-white">
                                  {index + 1}. {question.question}
                                </p>

                                <div className="mt-4 space-y-2 text-sm">
                                  <p className="text-slate-300">
                                    Student answer:{" "}
                                    <span
                                      className={
                                        isCorrect
                                          ? "font-semibold text-emerald-400"
                                          : "font-semibold text-rose-400"
                                      }
                                    >
                                      {studentAnswer ?? "No answer"}
                                    </span>
                                  </p>

                                  <p className="text-slate-300">
                                    Correct answer:{" "}
                                    <span className="font-semibold text-emerald-400">
                                      {question.correctAnswer}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-700 p-5 text-slate-400">
                          No question data for this quiz.
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
            No student quiz attempts yet.
          </div>
        )}
      </div>
    </main>
  );
}