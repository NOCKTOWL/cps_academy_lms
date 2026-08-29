"use server";

import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeLesson(
  lessonDocumentId: string,
  courseDocumentId: string,
) {
  const { jwt } = await requireAuth(["student"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lesson-progresses/${lessonDocumentId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    return {
      success: false,
      message: error?.error?.message || "Failed to complete lesson",
    };
  }

  revalidatePath(
    `/dashboard/student/courses/${courseDocumentId}`,
  );

  return {
    success: true,
    message: "Lesson completed!",
  };
}

export async function submitQuiz(
  quizDocumentId: string,
  answers: Record<string, string>,
) {
  const { jwt } = await requireAuth(["student"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-attempts/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        quizDocumentId,
        answers,
      }),
    },
  );

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      message:
        result?.error?.message || "Failed to submit quiz",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}