import { requireAuth } from "@/lib/auth";
import InstructorResultsPage from "./InstructorResultsPage";

export default async function Page() {
  const { jwt } = await requireAuth(["instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-attempts/instructor-results`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch quiz results");
  }

  const result = await res.json();

  return <InstructorResultsPage attempts={result.data} />;
}