import { requireAuth } from "@/lib/auth";
import CreateBlogPage from "./CreateBlogPage";

export default async function Page() {
  await requireAuth(["content_manager"]);

  return <CreateBlogPage />;
}