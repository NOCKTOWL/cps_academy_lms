import { requireAuth } from "@/lib/auth";
import CoursesPage from "./CoursesPage";

export default async function Page() {
  const { user, jwt } = await requireAuth([
      "admin",
      "content_manager",
      "instructor",
  ]);

  const url =
    user.role === "instructor"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-courses`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/courses`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await res.json();

  return (
    <CoursesPage
      courses={result.data}
      role={user.role}
    />
  );
}