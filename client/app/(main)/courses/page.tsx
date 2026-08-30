import { requireAuth } from "@/lib/auth";
import CoursesPage from "./CoursesPage";
import { cookies } from "next/headers";

export default async function Page() {
  // const { user, jwt } = await requireAuth([
  //     "admin",
  //     "content_manager",
  //     "instructor",
  // ]);
  
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  let user = null;
  if (jwt) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth-user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (res.ok) {
      user = await res.json();
    }
  }

  const url =
    user?.role === "instructor"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-courses`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/courses`;

      const headers: HeadersInit = {};

      if (jwt) {
        headers.Authorization = `Bearer ${jwt}`;
      }

  const res = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await res.json();

  return (
    <CoursesPage
      courses={result.data}
      role={user?.role ?? null}
      isLoggedIn={!!user}
    />
  );
}