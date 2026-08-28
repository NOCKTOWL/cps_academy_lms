/**
 * lesson controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lesson.lesson', ({ strapi }) => ({
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

        if ((course as any).instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You are not the instructor of this course');
        }

        return await super.create(ctx);
    },

    async update(ctx) {
        const {id: documentId} = ctx.params;
        const user = ctx.state.user;

        const lesson = await strapi.documents('api::lesson.lesson').findOne({
            documentId,
            populate: {
                course: {
                    populate: {
                        instructor: true,
                    },
                },
            },
        });

        if (!lesson) {
            return ctx.notFound('Lesson not found');
        }

        const course = (lesson as any).course;

        if (course?.instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You are not the instructor of this course');
        }

        const updatedLesson = await strapi.documents('api::lesson.lesson').update({
            documentId,
            data: (ctx.request as any).body.data,
            status: "published",
        });

        ctx.body = {
            data: updatedLesson,
        }
    },

    async delete(ctx) {
        const {id: documentId} = ctx.params;
        const user = ctx.state.user;

        const lesson = await strapi.documents('api::lesson.lesson').findOne({
            documentId,
            populate: {
                course: {
                    populate: {
                        instructor: true,
                    },
                },
            },
        });

        if (!lesson) {
            return ctx.notFound('Lesson not found');
        }

        const course = (lesson as any).course;

        if (course?.instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You are not the instructor of this course');
        }

        await strapi.documents('api::lesson.lesson').delete({
            documentId,
        });

        ctx.body = {
            message: 'Lesson deleted successfully',
        }
    }
}));