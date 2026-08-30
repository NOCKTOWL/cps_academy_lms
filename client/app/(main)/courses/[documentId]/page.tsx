import { requireAuth } from "@/lib/auth";
import CourseManagePage from "./CourseManagePage";

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return new Response("Failed to fetch course data", { status: res.status });
  }

  const result = await res.json();

  return <CourseManagePage course={result.data} />;
}