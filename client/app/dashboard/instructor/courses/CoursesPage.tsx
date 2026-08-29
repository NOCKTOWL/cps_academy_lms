"use client"
import { Course } from '@/types/course';
import type {User} from '@/types/user'
import Link from 'next/link';

type CoursesPageProps = {
  user: User;
  courses: Course[];
}

export default function CoursesPage({ user, courses }: CoursesPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Courses
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your courses, lessons and quizzes.
          </p>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-600">
            You have not created any courses yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.documentId}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-zinc-900">
                  {course.title}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {course.description}
                </p>

                <Link href={`/dashboard/instructor/courses/${course.documentId}`} className="mt-5 rounded-lg bg-black px-4 py-2 text-sm text-white">
                  Manage Course
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
