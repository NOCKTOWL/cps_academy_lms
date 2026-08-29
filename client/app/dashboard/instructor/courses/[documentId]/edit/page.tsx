import { requireAuth } from "@/lib/auth";
import EditCoursePage from "./EditCoursePage";

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  const { jwt } = await requireAuth(["instructor"]);

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
    throw new Error("Failed to fetch course");
  }

  const result = await res.json();

  return (
    <EditCoursePage
      course={result.data}
      documentId={documentId}
    />
  );
}