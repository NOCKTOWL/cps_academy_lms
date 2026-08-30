"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitQuiz } from "../actions";

import type { Quiz, QuizQuestion } from "@/types/course";



export default function QuizPage({
  quiz,
  courseDocumentId,
}: {
  quiz: Quiz;
  courseDocumentId: string;
}) {

  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  const [result, setResult] = useState<{
    score: number;
    totalQuestions: number;
    percentage: number;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const questions = quiz.quiz_questions || [];

  function handleAnswerChange(
    questionDocumentId: string,
    answer: string,
  ) {

    setAnswers((prev) => ({
      ...prev,
      [questionDocumentId]: answer,
    }));

  }

  function handleSubmit() {

    if (Object.keys(answers).length !== questions.length) {

      alert("Please answer all questions before submitting.");

      return;

    }

    startTransition(async () => {

      const response = await submitQuiz(
        quiz.documentId,
        answers,
      );

      if (response.success && response.data) {

        setResult(response.data);

      } else {

        alert(
          response.message || "Failed to submit quiz",
        );

      }

    });

  }

  return (

    <main className="min-h-screen bg-slate-950 p-6 text-white">

      <div className="mx-auto max-w-3xl">

        <Link
          href={`/dashboard/student/courses/${courseDocumentId}`}
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Course
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          {quiz.title}
        </h1>

        <p className="mt-2 text-slate-400">
          Answer all questions before submitting.
        </p>

        {result ? (

          <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">

            <h2 className="text-xl font-bold text-emerald-400">
              Quiz Completed ✓
            </h2>

            <p className="mt-4 text-lg">
              Score: {result.score} / {result.totalQuestions}
            </p>

            <p className="mt-2 text-slate-300">
              Percentage: {result.percentage}%
            </p>

            <Link
              href={`/dashboard/student/courses/${courseDocumentId}`}
              className="mt-6 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950"
            >
              Back to Course
            </Link>

          </div>

        ) : (

          <div className="mt-8 space-y-6">

            {questions.map(
              (question: QuizQuestion, questionIndex: number) => (

                <div
                  key={question.documentId}
                  className="rounded-xl border border-slate-700 bg-slate-900 p-5"
                >

                  <p className="font-semibold">

                    {questionIndex + 1}. {question.question}

                  </p>

                  <div className="mt-5 space-y-3">

                    {Array.isArray(question.options) &&
                      question.options.map(
                        (
                          option: string,
                          optionIndex: number,
                        ) => (

                          <label
                            key={optionIndex}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 px-4 py-3 text-slate-300 transition hover:border-cyan-500"
                          >

                            <input
                              type="radio"
                              name={question.documentId}
                              value={option}
                              checked={
                                answers[
                                  question.documentId
                                ] === option
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  question.documentId,
                                  option,
                                )
                              }
                            />

                            {option}

                          </label>

                        ),
                      )}

                  </div>

                </div>

              ),
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isPending
                ? "Submitting..."
                : "Submit Quiz"}

            </button>

          </div>

        )}

      </div>

    </main>

  );

}