/**
 * A set of functions called "actions" for `instructor-dashboard`
 */

export default {
  async dashboard(ctx: any) {
    const instructor = ctx.state.user;

    if (!instructor) {
      return ctx.unauthorized('You must be logged in to access the instructor dashboard');
    }

    const courses = await strapi.documents('api::course.course').findMany({
      filters: {
        instructor: {
          documentId: instructor.documentId,
        },
      },
      // populate: {
      //   lessons: true,
      //   quizzes: true,
      // },
    });

    const totalCourses = courses.length;

    const courseIds = courses.map((course: any) => course.documentId);

    const lessons = await strapi.documents('api::lesson.lesson').findMany({
      filters: {
        course: {
          documentId: {
            $in: courseIds,
          },
        },
      },
    });

    const quizzes = await strapi.documents('api::quiz.quiz').findMany({
      filters: {
        course: {
          documentId: {
            $in: courseIds,
          },
        },
      },
    });

    const enrollments = await strapi.documents('api::enrollment.enrollment').findMany({
      filters: {
        course: {
          documentId: {
            $in: courseIds,
          },
        },
      },
      populate: {
        student: {
          fields: ['documentId'],
        },
        course: {
          fields: ['documentId'],
        },
      },
    });

    const uniqueStudentIds = new Set(enrollments.map((enrollment: any) => enrollment.student?.documentId).filter(Boolean));

    const totalStudents = uniqueStudentIds.size;

    ctx.body = {
      totalCourses,
      totalLessons: lessons.length,
      totalQuizzes: quizzes.length,
      totalStudents,
    };
  }
};
