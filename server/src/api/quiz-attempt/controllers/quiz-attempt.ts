/**
 * quiz-attempt controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quiz-attempt.quiz-attempt', ({ strapi }) => ({
  async myResults(ctx) {
    const student = ctx.state.user;

    if (!student) {
      return ctx.unauthorized("You must be logged in");
    }

    const attempts = await strapi.documents('api::quiz-attempt.quiz-attempt').findMany({
      filters: {
        student: {
          documentId: student.documentId,
        }
      },
      populate: {
        quiz: {
          fields: ['documentId', 'title'],
        },
      },
    });

    ctx.body = {
      data: attempts,
    };
  },

  async instructorResults(ctx) {
    const instructor = ctx.state.user;

    if (!instructor) {
      return ctx.unauthorized("You must be logged in");
    }

    const roleName = instructor.role?.name;

    if (roleName !== "Instructor") {
      return ctx.forbidden("Only instructors can view student results");
    }

    const attempts = await strapi
      .documents("api::quiz-attempt.quiz-attempt")
      .findMany({
        populate: {
          student: {
            fields: ["documentId", "username"],
          },
          quiz: {
            fields: ["documentId", "title"],
            populate: {
              course: {
                populate: {
                  instructor: {
                    fields: ["documentId"],
                  },
                },
              },
              quiz_questions: {
                fields: [
                  "documentId",
                  "question",
                  "options",
                  "correctAnswer",
                ],
              },
            },
          },
        },
        sort: {
          createdAt: "desc",
        },
      });

    const instructorAttempts = attempts.filter(
      (attempt: any) =>
        attempt.quiz?.course?.instructor?.documentId ===
        instructor.documentId,
    );

    const results = instructorAttempts.map((attempt: any) => ({
      documentId: attempt.documentId,

      student: {
        documentId: attempt.student?.documentId,
        username: attempt.student?.username,
      },

      quiz: {
        documentId: attempt.quiz?.documentId,
        title: attempt.quiz?.title,

        questions: attempt.quiz?.quiz_questions?.map(
          (question: any) => ({
            documentId: question.documentId,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,

            studentAnswer:
              attempt.answers?.[question.documentId] ?? null,
          }),
        ),
      },

      score: attempt.score,

      totalQuestions: attempt.totalQuestions,

      answers: attempt.answers,

      createdAt: attempt.createdAt,
    }));

    ctx.body = {
      data: results,
    };
  },

  async submit(ctx) {
    const student = ctx.state.user;

    if (!student) {
      return ctx.unauthorized("You must be logged in");
    }

    const { quizDocumentId, answers } = (ctx.request as any).body;

    if (!quizDocumentId || !answers) {
      return ctx.badRequest(
        "Quiz ID and answers are required",
      );
    }

    const quiz = await strapi
      .documents("api::quiz.quiz")
      .findOne({
        documentId: quizDocumentId,

        populate: {
          quiz_questions: true,

          course: {
            populate: {
              enrollments: {
                populate: {
                  student: {
                    fields: ["documentId"],
                  },
                },
              },
            },
          },
        },
      });

    if (!quiz) {
      return ctx.notFound("Quiz not found");
    }

    // Make sure student belongs to this course
    const isEnrolled = (quiz as any).course?.enrollments?.some(
      (enrollment: any) =>
        enrollment.student?.documentId === student.documentId,
    );

    if (!isEnrolled) {
      return ctx.forbidden(
        "You are not enrolled in this course",
      );
    }

    const questions = (quiz as any).quiz_questions || [];

    if (questions.length === 0) {
      return ctx.badRequest("This quiz has no questions");
    }

    let score = 0;

    for (const question of questions) {
      const studentAnswer =
        answers[question.documentId];

      if (
        studentAnswer &&
        studentAnswer === question.correctAnswer
      ) {
        score++;
      }
    }

    const attempt = await strapi
      .documents("api::quiz-attempt.quiz-attempt")
      .create({
        data: {
          student: student.documentId,
          quiz: quiz.documentId,
          score,
          totalQuestions: questions.length,
          answers,
        },

        status: "published",
      });

    ctx.body = {
      data: {
        score,
        totalQuestions: questions.length,
        percentage: Math.round(
          (score / questions.length) * 100,
        ),
        attemptDocumentId: attempt.documentId,
      },
    };
  },

}))
