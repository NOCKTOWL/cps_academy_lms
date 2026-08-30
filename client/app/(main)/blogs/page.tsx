// client/app/blogs/page.tsx
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

export default async function BlogsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog-posts?populate=author`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch blog posts`);
  }

  const result = await res.json();
  const blogs: Blog[] = result.data;
  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight">Blog</h1>
            <p className="mt-4 text-lg text-slate-400">
              Insights, stories, and updates from the CPS Academy community.
            </p>
          </div>
        </div>
        <div className="mb-4 w-full">
            <input type="text" placeholder="Search blog... (dummy search)"
            className="mx-auto block w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {blogs.length > 0 ? (
          <>
            {featuredBlog && (
              <Link
                href={`/blogs/${featuredBlog.documentId}`}
                className="group block overflow-hidden rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 transition hover:border-sky-500 hover:from-slate-800 hover:to-slate-900"
              >
                <div className="grid gap-0 md:grid-cols-2">
                  {featuredBlog.coverImageUrl && (
                    <div className="relative h-80 md:h-full md:min-h-96">
                      <Image
                        src={featuredBlog.coverImageUrl}
                        alt={featuredBlog.title}
                        fill
                        sizes="30vw"
                        loading="eager"
                        className="object-cover transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-slate-950 to-transparent"></div>
                    </div>
                  )}
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-900/50 bg-sky-950/30 px-4 py-2">
                      <span className="text-xs font-semibold uppercase text-sky-300">
                        Featured
                      </span>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">
                      {featuredBlog.title}
                    </h2>
                    <p className="mt-4 line-clamp-3 text-slate-400">
                      {featuredBlog.body}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-sky-600 to-sky-700"></div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {featuredBlog.author?.username || "Anonymous"}
                        </p>
                        {featuredBlog.createdAt && (
                          <p className="text-xs text-slate-500">
                            {new Date(
                              featuredBlog.createdAt,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sky-300 transition group-hover:gap-3">
                      <span className="font-medium">Read article</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {remainingBlogs.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold">Latest Articles</h3>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {remainingBlogs.map((blog) => (
                    <Link
                      key={blog.documentId}
                      href={`/blogs/${blog.documentId}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition hover:border-sky-500 hover:bg-slate-900"
                    >
                      {blog.coverImageUrl && (
                        <div className="relative h-48 overflow-hidden bg-slate-800">
                          <Image
                            src={blog.coverImageUrl}
                            alt={blog.title}
                            fill
                            sizes="10vw"
                            className="object-cover transition group-hover:scale-110"
                          />
                        </div>
                      )}

                      <div className="flex grow flex-col p-5">
                        <h2 className="text-lg font-bold leading-tight group-hover:text-sky-300">
                          {blog.title}
                        </h2>

                        <p className="mt-3 line-clamp-2 grow text-sm text-slate-400">
                          {blog.body}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
                          <p className="text-xs text-slate-500">
                            {blog.author?.username || "Anonymous"}
                          </p>
                          <span className="text-xs text-sky-300 transition group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg text-slate-400">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}