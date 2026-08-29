"use client";

import { useState } from "react";

type Course = {
  title: string;
  description: string;
};

type EditCoursePageProps = {
  course: Course;
  documentId: string;
};

export default function EditCoursePage({
  course,
  documentId,
}: EditCoursePageProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Edit Course</h1>

        <form className="mt-8 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium">
              Course Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-32 w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}