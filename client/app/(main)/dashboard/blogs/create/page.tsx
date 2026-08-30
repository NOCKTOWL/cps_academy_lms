import { requireAuth } from "@/lib/auth";
import CreateBlogPage from "./CreateBlogPage";

export default async function Page() {
  const res = await requireAuth(["admin", "content_manager"]);

  if (!res) {
    throw new Error("Unauthorized");
  }

  return <CreateBlogPage />;
}