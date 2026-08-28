/**
 * enrollment controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::enrollment.enrollment', ({ strapi }) => ({
   async create(ctx) {
        const student = ctx.state.user;
        
        const enrollment = await strapi.documents('api::enrollment.enrollment').create({
            data: {
                ...(ctx.request as any).body.data,
                student: student.documentId,
            },
            status: "published",
        });

        ctx.body = {
            data: enrollment,
        }
    },
}));
