/**
 * course controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
    async progress(ctx) {
        const { documentId } = ctx.params;
        const student = ctx.state.user;

        const course = await strapi.documents('api::course.course').findOne({
            documentId,
            populate: {
                lessons: {
                    fields: ['documentId'],
                },
            },
        });

        if (!course) {
            return ctx.notFound('Course not found');
        }

        const lessons = (course as any).lessons ?? [];
        const totalLessons = lessons.length;

        const completedProgress = await strapi.documents('api::lesson-progress.lesson-progress').findMany({
            filters: {
                student: {
                    id: student.id,
                },
                completed: true,
            },
            populate: {
                lesson: {
                    fields: ['documentId'],
                },
            },
        });

        const courseLessonIds = lessons.map((lesson: any) => lesson.documentId);

        const completedLessons = completedProgress.filter((progress: any) =>
            progress.lesson && courseLessonIds.includes(progress.lesson.documentId)).length
        

        const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        ctx.body = {
            totalLessons,
            completedLessons,
            progress,
        }
    },
}));
