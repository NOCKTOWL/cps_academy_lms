import { requireAuth } from "@/lib/auth";
import QuizPage from "./QuizPage";

export default async function Page({
  params,
}: {
  params: Promise<{
    documentId: string;
    quizDocumentId: string;
  }>;
}) {

  const { documentId, quizDocumentId } = await params;

  const { jwt } = await requireAuth(["student"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizDocumentId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch quiz");
  }

  const result = await res.json();
  console.log("Quiz result:", result); // Log the result to see its structure

  return (
    <QuizPage
      quiz={result.data}
      courseDocumentId={documentId}
    />
  );
}