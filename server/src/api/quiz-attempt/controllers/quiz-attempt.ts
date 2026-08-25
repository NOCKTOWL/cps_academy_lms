/**
 * quiz-attempt controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quiz-attempt.quiz-attempt', ({ strapi }) => ({
  async myResults(ctx) {
    const student = ctx.state.user;

    const attempts = await strapi.documents('api::quiz-attempt.quiz-attempt').findMany({
      filters: {
        student: student.id,
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
  }}))
