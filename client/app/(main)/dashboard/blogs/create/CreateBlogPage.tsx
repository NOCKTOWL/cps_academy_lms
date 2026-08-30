"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlog } from "../actions";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createBlog({
          title,
          body,
          coverImageUrl: coverImageUrl || undefined,
        });

        if (!res.success) {
          setError(res.message);
          return;
        }

        router.push("/dashboard/blogs");
        router.refresh();
      } catch {
        setError("Something went wrong.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1400px] p-6 lg:p-8">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            New post
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Create blog post
          </h1>

          <p className="mt-2 text-slate-300">
            Publish fresh content for your academy audience.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/20 sm:p-6 lg:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Blog title
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Blog content
                </label>

                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={18}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="Write your blog post..."
                />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Cover image URL
                </label>

                <input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />

                {coverImageUrl ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-700">
                    <img
                      src={coverImageUrl}
                      alt="Preview"
                      className="h-52 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex h-52 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 text-sm text-slate-500">
                    Add image preview
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-medium text-slate-200">Publishing</p>

                <p className="mt-2 text-sm text-slate-400">
                  Save when ready. This will post to the public blog list.
                </p>

                {error && (
                  <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Creating..." : "Create blog"}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}