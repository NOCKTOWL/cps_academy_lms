/**
 * lesson-progress controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::lesson-progress.lesson-progress",
  ({ strapi }) => ({
    async complete(ctx) {
      const student = ctx.state.user;
      const { lessonDocumentId } = ctx.params;

      if (!student) {
        return ctx.unauthorized("You must be logged in");
      }

      // Get lesson and its course
      const lesson = await strapi
        .documents("api::lesson.lesson")
        .findOne({
          documentId: lessonDocumentId,
          populate: {
            course: {
              fields: ["documentId"],
            },
          },
        });

      if (!lesson) {
        return ctx.notFound("Lesson not found");
      }

      const courseDocumentId = (lesson as any).course?.documentId;

      if (!courseDocumentId) {
        return ctx.badRequest("Lesson does not belong to a course");
      }

      // Verify student is enrolled
      const enrollment = await strapi
        .documents("api::enrollment.enrollment")
        .findMany({
          filters: {
            student: {
              documentId: student.documentId,
            },
            course: {
              documentId: courseDocumentId,
            },
          },
          limit: 1,
        });

      if (enrollment.length === 0) {
        return ctx.forbidden("You are not enrolled in this course");
      }

      // Check existing progress
      const existingProgress = await strapi
        .documents("api::lesson-progress.lesson-progress")
        .findMany({
          filters: {
            student: {
              documentId: student.documentId,
            },
            lesson: {
              documentId: lessonDocumentId,
            },
          },
          limit: 1,
        });

      let progress;

      if (existingProgress.length > 0) {
        progress = await strapi
          .documents("api::lesson-progress.lesson-progress")
          .update({
            documentId: existingProgress[0].documentId,
            data: {
              completed: true,
            },
            status: "published",
          });
      } else {
        progress = await strapi
          .documents("api::lesson-progress.lesson-progress")
          .create({
            data: {
              student: student.documentId,
              lesson: lessonDocumentId,
              completed: true,
            },
            status: "published",
          });
      }

      ctx.body = {
        success: true,
        data: progress,
      };
    },
  }),
);
