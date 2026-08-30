"use client";

import type { Course } from "@/types/course";
import { useActionState, useState, useTransition } from "react";
import {
  addLesson,
  addQuiz,
  deleteLesson,
  deleteQuiz,
  editLesson,
  editQuiz,
  addQuizQuestion,
  editQuizQuestion,
  deleteQuizQuestion,
  deleteCourse
} from "./actions";
import { useRouter } from "next/navigation";

type ActionState = {
  success: boolean;
  message: string;
};

export default function CourseManagePage({ course }: { course: Course }) {
const router = useRouter();

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  const [lessonState, lessonAction, isLessonPending] = useActionState(addLesson, {
    success: false,
    message: "",
  } as ActionState);

  const [quizState, quizAction, isQuizPending] = useActionState(addQuiz, {
    success: false,
    message: "",
  } as ActionState);

  const [lessonEditState, lessonEditAction, isLessonEditPending] =
    useActionState(editLesson, {
      success: false,
      message: "",
    } as ActionState);

  const [lessonDeleteState, lessonDeleteAction, isLessonDeletePending] =
    useActionState(deleteLesson, {
      success: false,
      message: "",
    } as ActionState);

  const [quizEditState, quizEditAction, isQuizEditPending] = useActionState(
    editQuiz,
    {
      success: false,
      message: "",
    } as ActionState
  );

  const [quizDeleteState, quizDeleteAction, isQuizDeletePending] =
    useActionState(deleteQuiz, {
      success: false,
      message: "",
    } as ActionState);

  const [quizQuestionState, quizQuestionAction, isQuizQuestionPending] =
    useActionState(addQuizQuestion, {
      success: false,
      message: "",
    } as ActionState);

  const [
    quizQuestionEditState,
    quizQuestionEditAction,
    isQuizQuestionEditPending,
  ] = useActionState(editQuizQuestion, {
    success: false,
    message: "",
  } as ActionState);

  const [
    quizQuestionDeleteState,
    quizQuestionDeleteAction,
    isQuizQuestionDeletePending,
  ] = useActionState(deleteQuizQuestion, {
    success: false,
    message: "",
  } as ActionState);

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [showQuestionFormFor, setShowQuestionFormFor] =
    useState<string | null>(null);

  const [editingQuestionId, setEditingQuestionId] =
    useState<string | null>(null);

  const [questionDraft, setQuestionDraft] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });


  const [lessonDraft, setLessonDraft] = useState({
    title: "",
    description: "",
  });

  const [quizDraft, setQuizDraft] = useState({
    title: "",
  });

  const [isDeleting, startDeleteTransition] = useTransition();

  const openLessonEdit = (lesson: { documentId: string; title: string; content?: string }) => {
    setEditingLessonId(lesson.documentId);
    setLessonDraft({
      title: lesson.title,
      description: lesson.content ?? "",
    });
  };

  const openQuizEdit = (quiz: { documentId: string; title: string }) => {
    setEditingQuizId(quiz.documentId);
    setQuizDraft({ title: quiz.title });
  };

  const closeLessonEditor = () => {
    setEditingLessonId(null);
    setLessonDraft({ title: "", description: "" });
  };

  const closeQuizEditor = () => {
    setEditingQuizId(null);
    setQuizDraft({ title: "" });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  const openQuestionForm = (quizDocumentId: string) => {
    setShowQuestionFormFor(quizDocumentId);

    setQuestionDraft({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  const closeQuestionForm = () => {
    setShowQuestionFormFor(null);

    setQuestionDraft({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  const openQuestionEdit = (question: {
    documentId: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }) => {
    setEditingQuestionId(question.documentId);

    setQuestionDraft({
      question: question.question,
      options: Array.isArray(question.options)
        ? [...question.options]
        : ["", "", "", ""],
      correctAnswer: question.correctAnswer,
    });
  };

  const closeQuestionEdit = () => {
    setEditingQuestionId(null);

    setQuestionDraft({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  const updateQuestionOption = (
    optionIndex: number,
    value: string
  ) => {
    setQuestionDraft((prev) => {
      const updatedOptions = [...prev.options];
      updatedOptions[optionIndex] = value;

      return {
        ...prev,
        options: updatedOptions,
      };
    });
  };

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmed) return;

    startDeleteTransition(async () => {
      const result = await deleteCourse(course.documentId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.push("/courses");
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Course manager
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 text-slate-300">{course.description}</p>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-bold text-white">Course Details</h2>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-rose-500 px-2 py-1 font-medium text-white disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Title</p>
              <p className="mt-2 font-medium text-white">{course.title}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Description</p>
              <p className="mt-2 font-medium text-white">{course.description}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Lessons</h2>

            <button
              onClick={() => setShowLessonForm((v) => !v)}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
            >
              + Add Lesson
            </button>
          </div>

          {showLessonForm && (
            <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl shadow-slate-950/30">
              <form action={lessonAction} className="space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Lesson title"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                />

                <textarea
                  name="description"
                  placeholder="Lesson description"
                  rows={4}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                />

                <input
                  type="hidden"
                  name="courseDocumentId"
                  value={course.documentId}
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLessonPending}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLessonPending ? "Adding..." : "Add Lesson"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLessonForm(false)}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                {lessonState.message && (
                  <p
                    className={`mt-2 text-sm ${lessonState.success ? "text-emerald-400" : "text-rose-400"
                      }`}
                  >
                    {lessonState.message}
                  </p>
                )}
              </form>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, index) => {
                const isEditing = editingLessonId === lesson.documentId;

                return (
                  <div
                    key={lesson.documentId}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    {isEditing ? (
                      <form action={lessonEditAction} className="space-y-3">
                        <input
                          type="hidden"
                          name="documentId"
                          value={lesson.documentId}
                        />
                        <input
                          type="hidden"
                          name="courseDocumentId"
                          value={course.documentId}
                        />

                        <input
                          value={lessonDraft.title}
                          onChange={(e) =>
                            setLessonDraft((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          name="title"
                          placeholder="Lesson title"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                        />

                        <textarea
                          value={lessonDraft.description}
                          onChange={(e) =>
                            setLessonDraft((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          name="description"
                          rows={4}
                          placeholder="Lesson description"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                        />

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            disabled={isLessonEditPending}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isLessonEditPending ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={closeLessonEditor}
                            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                        </div>

                        {lessonEditState.message && (
                          <p
                            className={`text-sm ${lessonEditState.success
                                ? "text-emerald-400"
                                : "text-rose-400"
                              }`}
                          >
                            {lessonEditState.message}
                          </p>
                        )}
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">
                            {index + 1}. {lesson.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openLessonEdit(lesson)}
                            className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
                          >
                            Edit
                          </button>

                          <form action={lessonDeleteAction}>
                            <input
                              type="hidden"
                              name="documentId"
                              value={lesson.documentId}
                            />
                            <input
                              type="hidden"
                              name="courseDocumentId"
                              value={course.documentId}
                            />
                            <button
                              type="submit"
                              disabled={isLessonDeletePending}
                              className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                No lessons yet.
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Quizzes</h2>

            <button
              onClick={() => setShowQuizForm((v) => !v)}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
            >
              + Add Quiz
            </button>
          </div>

          {showQuizForm && (
            <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl shadow-slate-950/30">
              <form action={quizAction} className="space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Quiz title"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                />

                <input
                  type="hidden"
                  name="courseDocumentId"
                  value={course.documentId}
                />

                <input type="hidden" name="questions" value={JSON.stringify(questions)} />

                {questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="mt-4 rounded-lg border p-4"
                  >
                    <input
                      type="text"
                      placeholder={`Question ${questionIndex + 1}`}
                      value={question.question}
                      onChange={(e) => {
                        const updated = [...questions];

                        updated[questionIndex].question = e.target.value;

                        setQuestions(updated);
                      }}
                      className="w-full rounded-lg border px-3 py-2"
                    />

                    <div className="mt-3 space-y-2">

                      {question.options.map((option, optionIndex) => (
                        <input
                          key={optionIndex}
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => {
                            const updated = [...questions];

                            updated[questionIndex].options[optionIndex] =
                              e.target.value;

                            setQuestions(updated);
                          }}
                          className="w-full rounded-lg border px-3 py-2"
                        />
                      ))}

                    </div>

                    <select
                      value={question.correctAnswer}
                      onChange={(e) => {
                        const updated = [...questions];

                        updated[questionIndex].correctAnswer = e.target.value;

                        setQuestions(updated);
                      }}
                      className="mt-3 w-full rounded-lg border px-3 py-2"
                    >
                      <option value="">Select correct answer</option>

                      {question.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          Option {optionIndex + 1}: {option}
                        </option>
                      ))}
                    </select>

                  </div>
                ))}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isQuizPending}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isQuizPending ? "Adding..." : "Add Quiz"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQuizForm(false)}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                {quizState.message && (
                  <p
                    className={`mt-2 text-sm ${quizState.success ? "text-emerald-400" : "text-rose-400"
                      }`}
                  >
                    {quizState.message}
                  </p>
                )}
              </form>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {course.quizzes && course.quizzes.length > 0 ? (
              course.quizzes.map((quiz, index) => {
                const isEditing = editingQuizId === quiz.documentId;

                return (
                  <div
                    key={quiz.documentId}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    {isEditing ? (
                      <form action={quizEditAction} className="space-y-3">
                        <input
                          type="hidden"
                          name="documentId"
                          value={quiz.documentId}
                        />

                        <input
                          type="hidden"
                          name="courseDocumentId"
                          value={course.documentId}
                        />

                        <input
                          value={quizDraft.title}
                          onChange={(e) =>
                            setQuizDraft((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          name="title"
                          placeholder="Quiz title"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                        />

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            disabled={isQuizEditPending}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isQuizEditPending ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={closeQuizEditor}
                            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                        </div>

                        {quizEditState.message && (
                          <p
                            className={`text-sm ${quizEditState.success
                                ? "text-emerald-400"
                                : "text-rose-400"
                              }`}
                          >
                            {quizEditState.message}
                          </p>
                        )}
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-medium text-white">
                            {index + 1}. {quiz.title}
                          </p>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openQuestionForm(quiz.documentId)}
                              className="rounded-lg border border-cyan-500/60 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/10"
                            >
                              + Add Question
                            </button>
                            <button
                              type="button"
                              onClick={() => openQuizEdit(quiz)}
                              className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
                            >
                              Edit
                            </button>

                            <form action={quizDeleteAction}>
                              <input
                                type="hidden"
                                name="documentId"
                                value={quiz.documentId}
                              />

                              <input
                                type="hidden"
                                name="courseDocumentId"
                                value={course.documentId}
                              />

                              <button
                                type="submit"
                                disabled={isQuizDeletePending}
                                className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </div>

                        {showQuestionFormFor === quiz.documentId && (
                          <form
                            action={quizQuestionAction}
                            className="mt-4 space-y-3 rounded-xl border border-cyan-500/30 bg-slate-900 p-4"
                          >
                            <input
                              type="hidden"
                              name="quizDocumentId"
                              value={quiz.documentId}
                            />

                            <input
                              type="hidden"
                              name="courseDocumentId"
                              value={course.documentId}
                            />

                            <input
                              type="text"
                              name="question"
                              value={questionDraft.question}
                              onChange={(e) =>
                                setQuestionDraft((prev) => ({
                                  ...prev,
                                  question: e.target.value,
                                }))
                              }
                              placeholder="Question"
                              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                            />

                            <div className="space-y-2">
                              {questionDraft.options.map((option, optionIndex) => (
                                <input
                                  key={optionIndex}
                                  type="text"
                                  name="options"
                                  value={option}
                                  onChange={(e) =>
                                    updateQuestionOption(optionIndex, e.target.value)
                                  }
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                                />
                              ))}
                            </div>

                            <select
                              name="correctAnswer"
                              value={questionDraft.correctAnswer}
                              onChange={(e) =>
                                setQuestionDraft((prev) => ({
                                  ...prev,
                                  correctAnswer: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                            >
                              <option value="">Select correct answer</option>

                              {questionDraft.options.map((option, optionIndex) => (
                                <option key={optionIndex} value={option}>
                                  Option {optionIndex + 1}: {option}
                                </option>
                              ))}
                            </select>

                            <div className="flex flex-wrap gap-3">
                              <button
                                type="submit"
                                disabled={isQuizQuestionPending}
                                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isQuizQuestionPending ? "Adding..." : "Add Question"}
                              </button>

                              <button
                                type="button"
                                onClick={closeQuestionForm}
                                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                              >
                                Cancel
                              </button>
                            </div>

                            {quizQuestionState.message && (
                              <p
                                className={`text-sm ${quizQuestionState.success
                                    ? "text-emerald-400"
                                    : "text-rose-400"
                                  }`}
                              >
                                {quizQuestionState.message}
                              </p>
                            )}
                          </form>
                        )}

                        <div className="mt-4 space-y-3">
                          {quiz.quiz_questions &&
                            quiz.quiz_questions.length > 0 ? (
                            quiz.quiz_questions.map((question, questionIndex) => {
                              const isQuestionEditing =
                                editingQuestionId === question.documentId;

                              return (
                                <div
                                  key={question.documentId}
                                  className="rounded-lg border border-slate-700 bg-slate-900/70 p-4"
                                >
                                  {isQuestionEditing ? (
                                    <form
                                      action={quizQuestionEditAction}
                                      className="space-y-3"
                                    >
                                      <input
                                        type="hidden"
                                        name="documentId"
                                        value={question.documentId}
                                      />

                                      <input
                                        type="hidden"
                                        name="courseDocumentId"
                                        value={course.documentId}
                                      />

                                      <input
                                        type="text"
                                        name="question"
                                        value={questionDraft.question}
                                        onChange={(e) =>
                                          setQuestionDraft((prev) => ({
                                            ...prev,
                                            question: e.target.value,
                                          }))
                                        }
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                                      />

                                      <div className="space-y-2">
                                        {questionDraft.options.map((option, optionIndex) => (
                                          <input
                                            key={optionIndex}
                                            type="text"
                                            name="options"
                                            value={option}
                                            onChange={(e) =>
                                              updateQuestionOption(
                                                optionIndex,
                                                e.target.value
                                              )
                                            }
                                            placeholder={`Option ${optionIndex + 1}`}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                                          />
                                        ))}
                                      </div>

                                      <select
                                        name="correctAnswer"
                                        value={questionDraft.correctAnswer}
                                        onChange={(e) =>
                                          setQuestionDraft((prev) => ({
                                            ...prev,
                                            correctAnswer: e.target.value,
                                          }))
                                        }
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                                      >
                                        <option value="">Select correct answer</option>

                                        {questionDraft.options.map(
                                          (option, optionIndex) => (
                                            <option
                                              key={optionIndex}
                                              value={option}
                                            >
                                              Option {optionIndex + 1}: {option}
                                            </option>
                                          )
                                        )}
                                      </select>

                                      <div className="flex gap-3">
                                        <button
                                          type="submit"
                                          disabled={isQuizQuestionEditPending}
                                          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900"
                                        >
                                          {isQuizQuestionEditPending
                                            ? "Saving..."
                                            : "Save"}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={closeQuestionEdit}
                                          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200"
                                        >
                                          Cancel
                                        </button>
                                      </div>

                                      {quizQuestionEditState.message && (
                                        <p
                                          className={`text-sm ${quizQuestionEditState.success
                                              ? "text-emerald-400"
                                              : "text-rose-400"
                                            }`}
                                        >
                                          {quizQuestionEditState.message}
                                        </p>
                                      )}
                                    </form>
                                  ) : (
                                    <>
                                      <div className="flex items-start justify-between gap-4">
                                        <p className="font-medium text-white">
                                          {questionIndex + 1}. {question.question}
                                        </p>

                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => openQuestionEdit(question)}
                                            className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
                                          >
                                            Edit
                                          </button>

                                          <form action={quizQuestionDeleteAction}>
                                            <input
                                              type="hidden"
                                              name="documentId"
                                              value={question.documentId}
                                            />

                                            <input
                                              type="hidden"
                                              name="courseDocumentId"
                                              value={course.documentId}
                                            />

                                            <button
                                              type="submit"
                                              disabled={isQuizQuestionDeletePending}
                                              className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                              Delete
                                            </button>
                                          </form>
                                        </div>
                                      </div>

                                      <div className="mt-3 space-y-2">
                                        {Array.isArray(question.options) &&
                                          question.options.map(
                                            (
                                              option: string,
                                              optionIndex: number
                                            ) => (
                                              <div
                                                key={optionIndex}
                                                className={`rounded-md border px-3 py-2 text-sm ${option === question.correctAnswer
                                                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                                                    : "border-slate-700 bg-slate-950 text-slate-300"
                                                  }`}
                                              >
                                                {String.fromCharCode(
                                                  65 + optionIndex
                                                )}
                                                . {option}

                                                {option === question.correctAnswer && (
                                                  <span className="float-end text-xs font-medium text-emerald-400">
                                                    ✓
                                                  </span>
                                                )}
                                              </div>
                                            )
                                          )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-slate-400">
                              No questions added yet.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                No quizzes yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}