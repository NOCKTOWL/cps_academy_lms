"use client";

import {
  useActionState,
  useEffect,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  updateBlog,
  deleteBlog,
  type UpdateBlogState,
} from "../actions";

type BlogPost = {
  documentId: string;
  title: string;
  body: string;
  coverImageUrl?: string | null;
};

const initialState: UpdateBlogState = {
  success: false,
  message: "",
};

export default function BlogManagePage({
  blog,
}: {
  blog: BlogPost;
}) {
  const router = useRouter();

  const updateBlogWithId = updateBlog.bind(null, blog.documentId);

  const [state, formAction, isPending] = useActionState(
    updateBlogWithId,
    initialState
  );

  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmed) return;

    startDeleteTransition(async () => {
      const result = await deleteBlog(blog.documentId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.push("/dashboard/blogs");
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-375 p-6 lg:p-8">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Edit post
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Manage blog post
          </h1>
        </header>

        <form
          action={formAction}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Title
                </label>

                <input
                  name="title"
                  defaultValue={blog.title}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Blog content
                </label>

                <textarea
                  name="body"
                  defaultValue={blog.body}
                  rows={18}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/20">
              <p className="text-sm font-medium text-slate-200">Cover image</p>

              {blog.coverImageUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-700">
                  <Image
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    width={800}
                    height={400}
                    className="h-56 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 text-sm text-slate-500">
                  No cover image
                </div>
              )}

              <label className="mt-4 mb-2 block text-sm font-medium text-slate-200">
                Cover image URL
              </label>

              <input
                name="coverImageUrl"
                defaultValue={blog.coverImageUrl ?? ""}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/20">
              {state.message && (
                <p
                  className={
                    state.success
                      ? "mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                      : "mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
                  }
                >
                  {state.message}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isPending || isDeleting}
                  className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending || isDeleting}
                  className="rounded-xl bg-rose-400/20 px-5 py-3 font-semibold text-white transition hover:bg-rose-500/80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete blog"}
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}