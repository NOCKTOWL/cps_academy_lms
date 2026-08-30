import Image from "next/image";
import Link from "next/link";

type Blog = {
  documentId: string;
  title: string;
  body: string;
  coverImageUrl?: string | null;
  author?: {
    username: string;
  } | null;
  createdAt?: string;
};

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog-posts/${documentId}?populate=author`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return new Response("Failed to fetch blog post", { status: res.status });
  }

  const result = await res.json();
  const blog: Blog = result.data;

  const readingTime = Math.ceil((blog.body?.split(" ").length || 0) / 200);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <article>
        {blog.coverImageUrl && (
          <div className="relative h-96 w-full overflow-hidden bg-slate-900 md:h-125">
            <Image
              src={blog.coverImageUrl}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-sky-300 transition hover:text-sky-200"
          >
            <span>←</span>
            <span>Back to blogs</span>
          </Link>

          <header className="mt-10">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              {blog.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-b border-slate-800 pb-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-sky-600 to-sky-700"></div>
                <div>
                  <p className="font-medium text-white">
                    {blog.author?.username || "Anonymous"}
                  </p>
                  {blog.createdAt && (
                    <p className="text-sm text-slate-400">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex sm:items-center sm:gap-4">
                <div className="h-8 w-px bg-slate-800"></div>
                <span className="text-sm text-slate-400">
                  {readingTime} min read
                </span>
              </div>
            </div>
          </header>

          <div className="prose prose-invert mt-12 max-w-none">
            <div className="whitespace-pre-wrap leading-8 text-slate-300">
              {blog.body}
            </div>
          </div>

          <div className="mt-16 border-t border-slate-800 pt-8">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-600 to-sky-700"></div>
                <div>
                  <p className="font-semibold text-white">
                    {blog.author?.username || "Anonymous"}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Content creator at CPS Academy
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-3 rounded-lg border border-sky-600/30 bg-sky-700/20 px-6 py-3 font-medium text-sky-300 transition hover:border-sky-600/50 hover:bg-sky-700/30"
            >
              <span>Explore more articles</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}