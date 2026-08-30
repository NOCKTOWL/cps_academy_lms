"use server";

import { requireAuth } from "@/lib/auth";

export async function enrollCourse(courseDocumentId: string) {
  const { jwt } = await requireAuth(["student"]);

  console.log("Enrolling in course:", courseDocumentId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseDocumentId,
      }),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: result?.error?.message || "Failed to enroll",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}