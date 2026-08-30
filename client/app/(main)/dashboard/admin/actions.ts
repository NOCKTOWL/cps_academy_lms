"use server";

import { requireAuth } from "@/lib/auth";

export async function changeUserRole(
  documentId: string,
  role: string,
) {
  try {
    const { jwt } = await requireAuth(["admin"]);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/users/${documentId}/role`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          role,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data?.error?.message ||
          data?.message ||
          "Failed to change role",
      };
    }

    return {
      success: true,
      message: "Role updated successfully",
    };
  } catch (error) {
    console.error("Change role error:", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}