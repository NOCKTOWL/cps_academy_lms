"use client";

import { useState, useTransition } from "react";
import { enrollCourse } from "./actions";

type Course = {
    documentId: string;
    title: string;
    description: string;
};

export default function BrowseCoursesPage({
    courses,
    enrolledCourseIds: initialEnrolledCourseIds,
}: {
    courses: Course[];
    enrolledCourseIds: string[];
}) {
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(
        initialEnrolledCourseIds,
    );
    //   const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    function handleEnroll(courseDocumentId: string) {
        startTransition(async () => {
            console.log("Trying to enroll:", courseDocumentId);

            const result = await enrollCourse(courseDocumentId);

            console.log("Enroll result:", result);

            if (result.success) {
                setEnrolledCourseIds((prev) => [
                    ...prev,
                    courseDocumentId,
                ]);
            }
        });
    }

    return (
        <main className="min-h-screen bg-slate-950 p-6 text-white">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold">Browse Courses</h1>

                <p className="mt-2 text-slate-400">
                    Discover courses and start learning.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourseIds.includes(course.documentId);

                        return (
                            <div
                                key={course.documentId}
                                className="rounded-xl border border-slate-700 bg-slate-900 p-5"
                            >
                                <h2 className="text-xl font-semibold">
                                    {course.title}
                                </h2>

                                <p className="mt-3 text-sm text-slate-400">
                                    {course.description}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEnroll(course.documentId)
                                    }
                                    disabled={isPending || isEnrolled}
                                    className={`mt-5 rounded-lg px-4 py-2 text-sm font-semibold transition
                    ${isEnrolled
                                            ? "bg-emerald-500 text-white"
                                            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                                        }
                    disabled:opacity-60`}
                                >
                                    {isEnrolled
                                        ? "Enrolled ✓"
                                        : isPending
                                            ? "Enrolling..."
                                            : "Enroll"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}