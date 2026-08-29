"use client"

import Link from 'next/link'

type Course = {
    documentId: string;
    title: string;
    description: string;
}

export default function CoursesPage({ courses }: { courses: Course[] }) {
  return (
    <main> 
      <h1>

        Courses
        </h1>

      {courses.map((course) => (
        <Link href={`/courses/${course.documentId}`} key={course.documentId}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </Link>
      ))}
        
    </main>
  )
}
