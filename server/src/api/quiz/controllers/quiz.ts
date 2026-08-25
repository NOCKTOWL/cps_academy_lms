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
    async submit(ctx) {
        const {documentId} = ctx.params;
        const { answers } = ctx.request.body;

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
                student: student.id,
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
