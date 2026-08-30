"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  createCourse,
  type CreateCourseState,
} from "./actions";

const initialState: CreateCourseState = {
  success: false,
  message: "",
};

export default function CreateCoursePage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    createCourse,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.push("/courses");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">
          Create Course
        </h1>

        <form
          action={formAction}
          className="mt-8 space-y-5 rounded-xl border border-slate-700 bg-slate-900 p-6"
        >
          <div>
            <label className="text-sm font-medium">
              Course Title
            </label>

            <input
              name="title"
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              rows={6}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              placeholder="Enter course description"
            />
          </div>

          {state.message && (
            <p
              className={
                state.success
                  ? "text-emerald-400"
                  : "text-rose-400"
              }
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-slate-950 disabled:opacity-60"
          >
            {isPending
              ? "Creating..."
              : "Create Course"}
          </button>
        </form>
      </div>
    </main>
  );
}