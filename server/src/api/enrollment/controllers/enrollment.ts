/**
 * enrollment controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::enrollment.enrollment",
    ({ strapi }) => ({
        async create(ctx) {
            const student = ctx.state.user;

            if (!student) {
                return ctx.unauthorized("You must be logged in");
            }

            const roleName = student.role?.name;

            if (roleName !== "Student") {
                return ctx.forbidden("Only students can enroll in courses");
            }

            const { courseDocumentId } = (ctx.request as any).body;

            if (!courseDocumentId) {
                return ctx.badRequest("Course ID is required");
            }

            const course = await strapi
                .documents("api::course.course")
                .findOne({
                    documentId: courseDocumentId,
                });

            if (!course) {
                return ctx.notFound("Course not found");
            }

            const existingEnrollment = await strapi
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
                });

            if (existingEnrollment.length > 0) {
                return ctx.badRequest("You are already enrolled in this course");
            }

            const enrollment = await strapi
                .documents("api::enrollment.enrollment")
                .create({
                    data: {
                        student: student.documentId,
                        course: courseDocumentId,
                        enrolledAt: new Date(),
                    },
                    status: "published",
                });

            ctx.body = {
                data: enrollment,
            };
        },
    }),
);