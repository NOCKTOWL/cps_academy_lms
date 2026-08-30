import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => ({
  async find(ctx) {
    const { documentId } = ctx.params;

    const quiz = await strapi.documents('api::quiz.quiz').findOne({
      documentId,
      populate: {
        quiz_questions: {
          fields: ['question', 'options'],
        }
      },
    });

    if (!quiz) {
      return ctx.notFound('Quiz not found');
    }

    ctx.body = {
      data: quiz,
    }
  },

  async findOne(ctx) {
    const { id: documentId } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const quiz = await strapi.documents("api::quiz.quiz").findOne({
      documentId,

      populate: {
        course: {
          fields: ["documentId"],
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
    });

    if (!quiz) {
      return ctx.notFound("Quiz not found");
    }

    const roleType = user.role?.type;

    if (roleType === "student") {
      const enrollments = await strapi
        .documents("api::enrollment.enrollment")
        .findMany({
          filters: {
            student: {
              documentId: user.documentId,
            },

            course: {
              documentId: quiz.course?.documentId,
            },
          },
        });

      if (enrollments.length === 0) {
        return ctx.forbidden(
          "You are not enrolled in the course for this quiz",
        );
      }

      const safeQuestions = (quiz.quiz_questions ?? []).map(
        (question) => ({
          documentId: question.documentId,
          question: question.question,
          options: question.options,
        }),
      );

      ctx.body = {
        data: {
          documentId: quiz.documentId,
          title: quiz.title,
          quiz_questions: safeQuestions,
        },
      };

      return;
    }

    const courseDocumentId = quiz.course?.documentId;

    if (!courseDocumentId) {
      return ctx.badRequest("Quiz does not belong to a course");
    }

    if (
      roleType === "admin" ||
      roleType === "content_manager"
    ) {
      ctx.body = {
        data: quiz,
      };

      return;
    }

    if (roleType === "instructor") {
      const course = await strapi.documents("api::course.course").findOne({
        documentId: courseDocumentId,
        populate: {
          instructor: {
            fields: ["documentId"],
          },
        },
      });

      if (
        !course ||
        course.instructor?.documentId !== user.documentId
      ) {
        return ctx.forbidden(
          "You do not own the course for this quiz",
        );
      }

      ctx.body = {
        data: quiz,
      };

      return;
    }

    return ctx.forbidden("You do not have access to this quiz");
  },

  async create(ctx) {
    const user = ctx.state.user;
    const courseDocumentId = (ctx.request as any).body.data?.course;

    if (!courseDocumentId) {
      return ctx.badRequest('Course is required');
    }

    const course = await strapi.documents('api::course.course').findOne({
      documentId: courseDocumentId,
      populate: {
        instructor: true,
      },
    });

    if (!course) {
      return ctx.notFound('Course not found');
    }

    const roleType = user.role?.type;

    if (
      roleType === "admin" ||
      roleType === "content_manager"
    ) {
      return await super.create(ctx);
    }

    if (roleType === "instructor") {
      if ((course as any).instructor?.documentId !== user.documentId) {
        return ctx.forbidden(
          "You can only create quizzes for your own courses",
        );
      }

      return await super.create(ctx);
    }

    return ctx.forbidden(
      "You do not have permission to create quizzes",
    );
  },

  async update(ctx) {
    const { id: documentId } = ctx.params;
    const user = ctx.state.user;

    const roleType = user.role?.type;

    const quiz = await strapi
      .documents("api::quiz.quiz")
      .findOne({
        documentId,
        populate: {
          course: {
            populate: {
              instructor: true,
            },
          },
        },
      });

    if (!quiz) {
      return ctx.notFound("Quiz not found");
    }

    const course = (quiz as any).course;

    if (
      roleType !== "admin" &&
      roleType !== "content_manager" &&
      roleType !== "instructor"
    ) {
      return ctx.forbidden(
        "You do not have permission to update quizzes",
      );
    }

    if (
      roleType === "instructor" &&
      course?.instructor?.documentId !== user.documentId
    ) {
      return ctx.forbidden(
        "You can only update quizzes for your own courses",
      );
    }

    const updatedQuiz = await strapi
      .documents("api::quiz.quiz")
      .update({
        documentId,
        data: (ctx.request as any).body.data,
        status: "published",
      });

    ctx.body = {
      data: updatedQuiz,
    };
  },

  async delete(ctx) {
    const { id: documentId } = ctx.params;
    const user = ctx.state.user;

    const roleType = user.role?.type;

    const quiz = await strapi
      .documents("api::quiz.quiz")
      .findOne({
        documentId,
        populate: {
          course: {
            populate: {
              instructor: true,
            },
          },
        },
      });

    if (!quiz) {
      return ctx.notFound("Quiz not found");
    }

    const course = (quiz as any).course;

    if (
      roleType !== "admin" &&
      roleType !== "content_manager" &&
      roleType !== "instructor"
    ) {
      return ctx.forbidden(
        "You do not have permission to delete quizzes",
      );
    }

    if (
      roleType === "instructor" &&
      course?.instructor?.documentId !== user.documentId
    ) {
      return ctx.forbidden(
        "You can only delete quizzes for your own courses",
      );
    }

    await strapi
      .documents("api::quiz.quiz")
      .delete({
        documentId,
      });

    ctx.body = {
      message: "Quiz deleted successfully",
    };
  },
}));
