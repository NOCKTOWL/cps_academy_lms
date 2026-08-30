"use server";

import { requireAuth } from "@/lib/auth";

type BlogData = {
  title: string;
  body: string;
  coverImageUrl?: string;
};

export type UpdateBlogState = {
  success: boolean;
  message: string;
};

export async function createBlog(data: BlogData) {
  const { jwt } = await requireAuth(["admin","content_manager"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog-posts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data,
      }),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message:
        result.error?.message ||
        "Failed to create blog post",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export async function updateBlog(
  documentId: string,
  previousState: UpdateBlogState,
  formData: FormData,
): Promise<UpdateBlogState> {
  const { jwt } = await requireAuth(["admin","content_manager"]);

  const title = formData.get("title")?.toString().trim();
  const body = formData.get("body")?.toString().trim();
  const coverImageUrl = formData
    .get("coverImageUrl")
    ?.toString()
    .trim();

  if (!title || !body) {
    return {
      success: false,
      message: "Title and blog content are required",
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog-posts/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          title,
          body,
          coverImageUrl: coverImageUrl || null,
        },
      }),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message:
        result.error?.message || "Failed to update blog post",
    };
  }

  return {
    success: true,
    message: "Blog post updated successfully",
  };
}

export async function deleteBlog(documentId: string) {
  const { jwt } = await requireAuth(["admin","content_manager"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog-posts/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );

  if (!res.ok) {
    const result = await res.json();

    return {
      success: false,
      message:
        result.error?.message ||
        "Failed to delete blog post",
    };
  }

  return {
    success: true,
    message: "Blog post deleted successfully",
  };
}