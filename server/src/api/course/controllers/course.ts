/**
 * course controller
 */

import { factories } from "@strapi/strapi";
import quiz from "../../quiz/controllers/quiz";
import { populate } from "dotenv";

export default factories.createCoreController(
    "api::course.course",
    ({ strapi }) => ({
        async findOne(ctx) {
            const { id: documentId } = ctx.params;
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You must be logged in");
            }

            const course = await strapi.documents("api::course.course").findOne({
                documentId,

                populate: {
                    instructor: {
                        fields: ["documentId"],
                    },

                    lessons: true,

                    quizzes: {
                        populate: {
                            quiz_questions: true,
                        },
                    },

                    enrollments: {
                        populate: {
                            student: {
                                fields: ["documentId", "username"],
                            },
                        },
                    },
                },
            });

            if (!course) {
                return ctx.notFound("Course not found");
            }

            if ((course as any).instructor?.documentId !== user.documentId) {
                return ctx.forbidden("You do not own this course");
            }

            ctx.body = {
                data: course,
            };
        },

        async myCourses(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You must be logged in to view your courses");
            }

            const courses = await strapi.documents("api::course.course").findMany({
                filters: {
                    instructor: {
                        documentId: user.documentId,
                    },
                },
                status: "published",
            });

            ctx.body = {
                data: courses,
            };
        },

        async progress(ctx) {
            const { documentId } = ctx.params;
            const student = ctx.state.user;

            const course = await strapi.documents("api::course.course").findOne({
                documentId,
                populate: {
                    lessons: {
                        fields: ["documentId"],
                    },
                },
            });

            if (!course) {
                return ctx.notFound("Course not found");
            }

            const lessons = (course as any).lessons ?? [];
            const totalLessons = lessons.length;

            const completedProgress = await strapi
                .documents("api::lesson-progress.lesson-progress")
                .findMany({
                    filters: {
                        student: {
                            id: student.id,
                        },
                        completed: true,
                    },
                    populate: {
                        lesson: {
                            fields: ["documentId"],
                        },
                    },
                });

            const courseLessonIds = lessons.map((lesson: any) => lesson.documentId);

            const completedLessons = completedProgress.filter(
                (progress: any) =>
                    progress.lesson &&
                    courseLessonIds.includes(progress.lesson.documentId),
            ).length;

            const progress =
                totalLessons === 0
                    ? 0
                    : Math.round((completedLessons / totalLessons) * 100);

            ctx.body = {
                totalLessons,
                completedLessons,
                progress,
            };
        },

        async create(ctx) {
            const user = ctx.state.user;

            const course = await strapi.documents("api::course.course").create({
                data: {
                    ...(ctx.request as any).body.data,
                    instructor: user.documentId,
                },
                status: "published",
            });

            ctx.body = {
                data: course,
            };
        },

        async update(ctx) {
            const { id: documentId } = ctx.params;
            const user = ctx.state.user;

            const course = await strapi.documents("api::course.course").findOne({
                documentId,
                populate: {
                    instructor: true,
                },
            });

            if (!course) {
                return ctx.notFound("Course not found");
            }

            if ((course as any).instructor?.documentId !== user.documentId) {
                return ctx.forbidden("You are not the instructor of this course");
            }

            const updatedCourse = await strapi
                .documents("api::course.course")
                .update({
                    documentId,
                    data: (ctx.request as any).body.data,
                    status: "published",
                });

            ctx.body = {
                data: updatedCourse,
            };
        },

        async delete(ctx) {
            const { id: documentId } = ctx.params;
            const user = ctx.state.user;

            const course = await strapi.documents("api::course.course").findOne({
                documentId,
                populate: {
                    instructor: true,
                },
            });

            if (!course) {
                return ctx.notFound("Course not found");
            }

            if ((course as any).instructor?.documentId !== user.documentId) {
                return ctx.forbidden("You are not the instructor of this course");
            }

            await strapi.documents("api::course.course").delete({
                documentId,
            });

            ctx.body = {
                message: "Course deleted successfully",
            };
        },
    }),
);
