/**
 * quiz-question controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quiz-question.quiz-question', ({ strapi }) => ({
    
    async create(ctx) {
        const user = ctx.state.user;
        const quizDocumentId = (ctx.request as any).body.data?.quiz;

        if (!quizDocumentId) {
            return ctx.badRequest('Quiz is required');
        }

        const quiz = await strapi.documents('api::quiz.quiz').findOne({
            documentId: quizDocumentId,
            populate: {
                course: {
                    populate: {
                        instructor: true,
                    },
                },
            },
        });

        if (!quiz) {
            return ctx.notFound('Quiz not found');
        }

        const course = (quiz as any).course;

        if (course?.instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You can only create quiz questions for your own courses');
        }

        return await super.create(ctx);
    },

    async update(ctx) {
        const {id: documentId} = ctx.params;
        const user = ctx.state.user;

        const quizQuestion = await strapi.documents('api::quiz-question.quiz-question').findOne({
            documentId,
            populate: {
                quiz: {
                    populate: {
                        course: {
                            populate: {
                                instructor: true,
                            },
                        },
                    },
                },
            },
        });

        if (!quizQuestion) {
            return ctx.notFound('Quiz question not found');
        }

        const quiz = (quizQuestion as any).quiz;

        if (quiz?.course?.instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You can only update quiz questions for your own courses');
        }

        const updatedQuizQuestion = await strapi.documents('api::quiz-question.quiz-question').update({
            documentId,
            data: (ctx.request as any).body.data,
            status: "published",
        });

        ctx.body = {
            data: updatedQuizQuestion,
        }
    },

    async delete(ctx) {
        const {id: documentId} = ctx.params;
        const user = ctx.state.user;

        const quizQuestion = await strapi.documents('api::quiz-question.quiz-question').findOne({
            documentId,
            populate: {
                quiz: {
                    populate: {
                        course: {
                            populate: {
                                instructor: true,
                            },
                        },
                    },
                },
            },
        });

        if (!quizQuestion) {
            return ctx.notFound('Quiz question not found');
        }

        const quiz = (quizQuestion as any).quiz;

        if (quiz?.course?.instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You can only delete quiz questions for your own courses');
        }
        
        await strapi.documents('api::quiz-question.quiz-question').delete({
            documentId,
        });

        ctx.body = {
            message: 'Quiz question deleted successfully',
        }
    },
}));
