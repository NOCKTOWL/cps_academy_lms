import { requireAuth } from "@/lib/auth";
import BrowseCoursesPage from "./BrowseCoursesPage";

export default async function Page() {
  const { jwt } = await requireAuth(["student"]);

  const [res, enrolledCourses] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/student-courses`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    }),
  ]);

  if (!res.ok || !enrolledCourses.ok) {
    throw new Error("Failed to fetch courses");
  }

  const enrolledCoursesData = await enrolledCourses.json();

  const enrolledCourseIds = enrolledCoursesData.data.map(
  (course: { documentId: string }) => course.documentId,
);

  const result = await res.json();

  return <BrowseCoursesPage courses={result.data} enrolledCourseIds={enrolledCourseIds} />;
}