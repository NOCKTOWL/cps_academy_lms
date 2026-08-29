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
