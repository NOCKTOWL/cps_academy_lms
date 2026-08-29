"use client"

import type { Course } from '@/types/course'

export default function CoursePage({ course }: { course: Course }) {
  return (
    <main>
      <h1>{course.title}</h1>

      <p>{course.description}</p>

      <h2>Lessons</h2>

      {course.lessons?.length ? (
        course.lessons.map((lesson) => (
          <div key={lesson.documentId}>
            <h3>{lesson.title}</h3>
          </div>
        ))
      ) : (
        <p>No lessons yet.</p>
      )}
    </main>
  )
}
