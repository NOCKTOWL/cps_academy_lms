/**
 * quiz controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quiz.quiz',({ strapi }) => ({
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
            return ctx.forbidden('You can only create quizzes for your own courses');
        }

        return await super.create(ctx);
    },
    
    async update(ctx) {
        const {id: documentId} = ctx.params;
        const user = ctx.state.user;

        const quiz = await strapi.documents('api::quiz.quiz').findOne({
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
            return ctx.notFound('Quiz not found');
        }

        const course = (quiz as any).course;

        if (course?.instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You can only update quizzes for your own courses');
        }

        const updatedQuiz = await strapi.documents('api::quiz.quiz').update({
            documentId,
            data: (ctx.request as any).body.data,
            status: "published",
        });

        ctx.body = {
            data: updatedQuiz,
        }
    },

    async delete(ctx) {
        const {id: documentId} = ctx.params;
        const user = ctx.state.user;
        
        const quiz = await strapi.documents('api::quiz.quiz').findOne({
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
            return ctx.notFound('Quiz not found');
        }

        const course = (quiz as any).course;

        if (course?.instructor?.documentId !== user.documentId) {
            return ctx.forbidden('You can only delete quizzes for your own courses');
        }

        await strapi.documents('api::quiz.quiz').delete({
            documentId,
        });

        ctx.body = {
            message: 'Quiz deleted successfully',
        }
    },

    async submit(ctx) {
        const {documentId} = ctx.params;
        const { answers } = (ctx.request as any).body;

        if (!answers || !Array.isArray(answers)) {
            return ctx.badRequest('Answers are required and should be an array');
        }

        const quiz = await strapi.documents('api::quiz.quiz').findOne({
            documentId,
            populate: {
                quiz_questions: {
                    fields: ['documentId', 'correctAnswer'],
                }
            },
        });

        if (!quiz) {
            return ctx.notFound('Quiz not found');
        }

        const questions = quiz.quiz_questions ?? [];

        let score = 0;

        for (const question of questions) {
            const studentAnswer = answers.find(a => a.questionId === question.documentId);

            if (studentAnswer?.answer === question.correctAnswer) {
                score++;
            }
        }

        const student = ctx.state.user;

        const quizAttempt = await strapi.documents('api::quiz-attempt.quiz-attempt').create({
            data: {
                student: student.documentId,
                quiz: documentId,
                score,
                totalQuestions: questions.length,
            },
        });

        ctx.body = {
            score,
            totalQuestions: questions.length,
            attempt: quizAttempt,
        }
    },
}));
