import { requireAuth } from "@/lib/auth";
import BlogManagePage from "./BlogManagePage";

type BlogPost = {
  documentId: string;
  title: string;
  body: string;
  coverImageUrl?: string | null;
  createdAt: string;
  author?: {
    username: string;
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  if (!documentId) {
    throw new Error("Document ID is required");
  }

  const { jwt } = await requireAuth(["content_manager"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog-posts/${documentId}?populate=author`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blog post");
  }

  const result = await res.json();

  return (
    <BlogManagePage
      blog={result.data as BlogPost}
    />
  );
}