import { requireAuth } from "@/lib/auth";
import BlogsPage from "./BlogsPage";

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

export default async function Page() {
  const { jwt } = await requireAuth(["admin","content_manager"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog-posts`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blog posts");
  }

  const result = await res.json();

  return <BlogsPage blogs={result.data as BlogPost[]} />;
}