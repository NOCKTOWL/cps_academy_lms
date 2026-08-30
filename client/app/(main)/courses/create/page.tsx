import { requireAuth } from "@/lib/auth";
import CreateCoursePage from "./CreateCoursePage";

export default async function Page() {
  await requireAuth([
    "admin",
    "content_manager",
    "instructor",
  ]);

  return <CreateCoursePage />;
}