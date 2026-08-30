"use client";

import Link from "next/link";
import Image from "next/image";

type BlogPost = {
  documentId: string;
  title: string;
  body: string;
  createdAt: string;
  author?: {
    username: string;
  };
  coverImageUrl?: string | null;
};

export default function BlogsPage({
  blogs,
}: {
  blogs: BlogPost[];
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
              Content manager
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Manage blogs
            </h1>

            <p className="mt-2 text-slate-300">
              Create, review, and publish posts from one place.
            </p>
          </div>

          <Link
            href="/dashboard/blogs/create"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            + Create blog
          </Link>
        </header>

        {blogs.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {blogs.map((blog) => (
              <article
                key={blog.documentId}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20 transition hover:border-cyan-500/40 hover:bg-slate-900"
              >
                {blog.coverImageUrl ? (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={blog.coverImageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-linear-to-br from-slate-800 to-slate-950 text-sm text-slate-500">
                    No cover image
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span>{blog.author?.username ?? "Unknown author"}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-white">{blog.title}</h2>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {blog.body.length > 220
                      ? `${blog.body.slice(0, 220)}...`
                      : blog.body}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                      Blog post
                    </span>

                    <Link
                      href={`/dashboard/blogs/${blog.documentId}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Manage
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-10 text-center text-slate-400">
            No blog posts yet. Create one to get started.
          </div>
        )}
      </div>
    </main>
  );
}