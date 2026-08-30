"use server";

import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
};

export async function addLesson(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const courseDocumentId = String(formData.get("courseDocumentId") ?? "").trim();

  if (!title || !description || !courseDocumentId) {
    return {
      success: false,
      message: "Title, description, and course are required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        title,
        content: description,
        course: courseDocumentId,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return {
      success: false,
      message: error?.error?.message || "Failed to create lesson",
    };
  }

  revalidatePath(`/dashboard/courses/${courseDocumentId}`);

  return {
    success: true,
    message: "Lesson added successfully.",
  };
}

export async function editLesson(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const courseDocumentId = String(formData.get("courseDocumentId") ?? "").trim();

  if (!documentId || !title || !description || !courseDocumentId) {
    return {
      success: false,
      message: "Title, description, and course are required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          title,
          content: description,
        },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return {
      success: false,
      message: error?.error?.message || "Failed to update lesson",
    };
  }

  revalidatePath(`/dashboard/courses/${courseDocumentId}`);

  return {
    success: true,
    message: "Lesson updated successfully.",
  };
}

export async function deleteLesson(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const courseDocumentId = String(formData.get("courseDocumentId") ?? "").trim();

  if (!documentId || !courseDocumentId) {
    return {
      success: false,
      message: "Lesson id and course id are required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return {
      success: false,
      message: error?.error?.message || "Failed to delete lesson",
    };
  }

  revalidatePath(`/dashboard/courses/${courseDocumentId}`);

  return {
    success: true,
    message: "Lesson deleted successfully.",
  };
}

export async function addQuiz(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();

  const courseDocumentId = String(
    formData.get("courseDocumentId") ?? ""
  ).trim();

  const questionsString = String(
    formData.get("questions") ?? ""
  );

  if (!title || !courseDocumentId || !questionsString) {
    return {
      success: false,
      message: "Quiz title, course, and questions are required.",
    };
  }

  let questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];

  try {
    questions = JSON.parse(questionsString);
  } catch {
    return {
      success: false,
      message: "Invalid questions data.",
    };
  }

  if (!questions.length) {
    return {
      success: false,
      message: "At least one question is required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  // CREATE QUIZ
  const quizRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          title,
          course: courseDocumentId,
        },
      }),
    }
  );

  if (!quizRes.ok) {
    const error = await quizRes.json().catch(() => ({}));

    return {
      success: false,
      message: error?.error?.message || "Failed to create quiz.",
    };
  }

  const quizResult = await quizRes.json();
  const quizDocumentId = quizResult.data.documentId;

  // CREATE QUESTIONS
  const questionResults = await Promise.all(
    questions.map(async (questionData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              question: questionData.question,
              options: questionData.options,
              correctAnswer: questionData.correctAnswer,
              quiz: quizDocumentId,
            },
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(
          error?.error?.message || "Failed to create quiz question."
        );
      }

      return res.json();
    })
  );

  revalidatePath(
    `/dashboard/courses/${courseDocumentId}`
  );

  return {
    success: true,
    message: `Quiz created with ${questionResults.length} question(s).`,
  };
}

export async function editQuiz(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const courseDocumentId = String(formData.get("courseDocumentId") ?? "").trim();

  if (!documentId || !title || !courseDocumentId) {
    return {
      success: false,
      message: "Quiz title and course are required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          title,
        },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return {
      success: false,
      message: error?.error?.message || "Failed to update quiz",
    };
  }

  revalidatePath(`/dashboard/courses/${courseDocumentId}`);

  return {
    success: true,
    message: "Quiz updated successfully.",
  };
}

export async function addQuizQuestion(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const question = String(formData.get("question") ?? "").trim();

  const correctAnswer = String(
    formData.get("correctAnswer") ?? "",
  ).trim();

  const quizDocumentId = String(
    formData.get("quizDocumentId") ?? "",
  ).trim();

  const courseDocumentId = String(
    formData.get("courseDocumentId") ?? "",
  ).trim();

  const options = formData
  .getAll("options")
  .map((option) => String(option).trim())
  .filter(Boolean);

  if (
    !question ||
    !correctAnswer ||
    !quizDocumentId ||
    !courseDocumentId
  ) {
    return {
      success: false,
      message: "Question, options, correct answer, and quiz are required.",
    };
  }

  if (options.length < 2) {
    return {
      success: false,
      message: "At least 2 options are required.",
    };
  }

  if (!options.includes(correctAnswer)) {
    return {
      success: false,
      message: "Correct answer must match one of the options.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          question,
          options,
          correctAnswer,
          quiz: quizDocumentId,
        },
      }),
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    return {
      success: false,
      message:
        error?.error?.message || "Failed to create quiz question",
    };
  }

  revalidatePath(
    `/dashboard/courses/${courseDocumentId}`,
  );

  return {
    success: true,
    message: "Question added successfully.",
  };
}

export async function editQuizQuestion(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const documentId = String(formData.get("documentId") ?? "").trim();

  const question = String(formData.get("question") ?? "").trim();

  const correctAnswer = String(
    formData.get("correctAnswer") ?? ""
  ).trim();

  const courseDocumentId = String(
    formData.get("courseDocumentId") ?? ""
  ).trim();

  const options = formData
    .getAll("options")
    .map((option) => String(option).trim())
    .filter(Boolean);

  if (
    !documentId ||
    !question ||
    !correctAnswer ||
    !courseDocumentId ||
    options.length < 2
  ) {
    return {
      success: false,
      message: "Question, options, and correct answer are required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-questions/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          question,
          options,
          correctAnswer,
        },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    return {
      success: false,
      message: error?.error?.message || "Failed to update question",
    };
  }

  revalidatePath(
    `/dashboard/courses/${courseDocumentId}`
  );

  return {
    success: true,
    message: "Question updated successfully.",
  };
}

export async function deleteQuizQuestion(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const documentId = String(formData.get("documentId") ?? "").trim();

  const courseDocumentId = String(
    formData.get("courseDocumentId") ?? ""
  ).trim();

  if (!documentId || !courseDocumentId) {
    return {
      success: false,
      message: "Question id and course id are required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-questions/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    return {
      success: false,
      message: error?.error?.message || "Failed to delete question",
    };
  }

  revalidatePath(
    `/dashboard/courses/${courseDocumentId}`
  );

  return {
    success: true,
    message: "Question deleted successfully.",
  };
}

export async function deleteQuiz(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const courseDocumentId = String(formData.get("courseDocumentId") ?? "").trim();

  if (!documentId || !courseDocumentId) {
    return {
      success: false,
      message: "Quiz id and course id are required.",
    };
  }

  const { jwt } = await requireAuth(["admin", "content_manager", "instructor"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return {
      success: false,
      message: error?.error?.message || "Failed to delete quiz",
    };
  }

  revalidatePath(`/dashboard/courses/${courseDocumentId}`);

  return {
    success: true,
    message: "Quiz deleted successfully.",
  };
}