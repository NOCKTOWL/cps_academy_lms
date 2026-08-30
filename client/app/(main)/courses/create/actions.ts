"use server";

import { requireAuth } from "@/lib/auth";

export type CreateCourseState = {
  success: boolean;
  message: string;
};

export async function createCourse(
  previousState: CreateCourseState,
  formData: FormData,
): Promise<CreateCourseState> {
  const { jwt } = await requireAuth([
    "admin",
    "content_manager",
    "instructor",
  ]);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? "",
  ).trim();

  if (!title) {
    return {
      success: false,
      message: "Course title is required",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            title,
            description,
          },
        }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          result.error?.message ||
          "Failed to create course",
      };
    }

    return {
      success: true,
      message: "Course created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}