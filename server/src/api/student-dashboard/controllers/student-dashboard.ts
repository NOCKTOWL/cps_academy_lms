/**
 * A set of functions called "actions" for `student-dashboard`
 */

export default {
  async dashboard(ctx: any) {
    const student = ctx.state.user;

    if (!student) {
      return ctx.unauthorized(
        "You must be logged in to access the student dashboard",
      );
    }

    const enrollments = await strapi
      .documents("api::enrollment.enrollment")
      .findMany({
        filters: {
          student: {
            documentId: student.documentId,
          },
        },
        populate: {
          course: {
            populate: {
              instructor: true,

              lessons: {
                fields: ["documentId"],
              },

              quizzes: {
                fields: ["documentId"],
              },
            },
          },
        },
      });

    const courses = enrollments
      .map((enrollment: any) => enrollment.course)
      .filter(Boolean);

    const completedProgress = await strapi
      .documents("api::lesson-progress.lesson-progress")
      .findMany({
        filters: {
          student: {
            documentId: student.documentId,
          },
          completed: true,
        },

        populate: {
          lesson: {
            fields: ["documentId"],
          },
        },
      });

    const completedLessonIds = new Set(
      completedProgress
        .map((progress: any) => progress.lesson?.documentId)
        .filter(Boolean),
    );

    const totalCourses = courses.length;

    const totalLessons = courses.reduce(
      (total: number, course: any) =>
        total + (course.lessons?.length || 0),
      0,
    );

    const completedLessons = courses.reduce(
      (total: number, course: any) =>
        total +
        (course.lessons || []).filter((lesson: any) =>
          completedLessonIds.has(lesson.documentId),
        ).length,
      0,
    );

    const totalQuizzes = courses.reduce(
      (total: number, course: any) =>
        total + (course.quizzes?.length || 0),
      0,
    );

    const courseData = courses.map((course: any) => {
      const lessons = course.lessons || [];

      const courseCompletedLessons = lessons.filter((lesson: any) =>
        completedLessonIds.has(lesson.documentId),
      ).length;

      const progress =
        lessons.length === 0
          ? 0
          : Math.round(
            (courseCompletedLessons / lessons.length) * 100,
          );

      return {
        documentId: course.documentId,
        title: course.title,
        description: course.description,

        totalLessons: lessons.length,
        completedLessons: courseCompletedLessons,

        totalQuizzes: course.quizzes?.length || 0,

        progress,
      };
    });

    ctx.body = {
      totalCourses,
      totalLessons,
      completedLessons,
      totalQuizzes,

      courses: courseData,
    };
  },
};
