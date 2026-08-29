/**
 * A set of functions called "actions" for `instructor-dashboard`
 */

export default {
  async dashboard(ctx: any) {
    const instructor = ctx.state.user;

    if (!instructor) {
      return ctx.unauthorized(
        "You must be logged in to access the instructor dashboard",
      );
    }

    const [publishedCourses, draftCourses] = await Promise.all([
      strapi.documents("api::course.course").findMany({
        filters: {
          instructor: {
            documentId: instructor.documentId,
          },
        },
        status: "published",
        populate: {
          enrollments: {
            populate: {
              student: {
                fields: ["documentId"],
              },
            },
          },
          lessons: true,
          quizzes: true,
        },
      }),

      strapi.documents("api::course.course").findMany({
        filters: {
          instructor: {
            documentId: instructor.documentId,
          },
        },
        status: "draft",
        populate: {
          enrollments: {
            populate: {
              student: {
                fields: ["documentId"],
              },
            },
          },
          lessons: true,
          quizzes: true,
        },
      }),
    ]);

    const publishedIds = new Set(
      publishedCourses.map((course: any) => course.documentId),
    );

    const allCourses = [
      ...publishedCourses.map((course: any) => ({
        ...course,
        status: "published",
      })),
      ...draftCourses
        .filter((course: any) => !publishedIds.has(course.documentId))
        .map((course: any) => ({
          ...course,
          status: "draft",
        })),
    ];

    const courseData = allCourses.map((course: any) => ({
      documentId: course.documentId,
      title: course.title,
      totalStudents: course.enrollments?.length || 0,
      totalLessons: course.lessons?.length || 0,
      totalQuizzes: course.quizzes?.length || 0,
      status: course.status,
    }));

    const uniqueStudentIds = new Set(
      allCourses
        .flatMap((course: any) => course.enrollments || [])
        .map((enrollment: any) => enrollment.student?.documentId)
        .filter(Boolean),
    );

    const totalCourses = courseData.length;

    const totalLessons = courseData.reduce(
      (total: number, course: any) => total + course.totalLessons,
      0,
    );

    const totalQuizzes = courseData.reduce(
      (total: number, course: any) => total + course.totalQuizzes,
      0,
    );

    const totalStudents = uniqueStudentIds.size;

    ctx.body = {
      totalCourses,
      totalLessons,
      totalQuizzes,
      totalStudents,
      courses: courseData,
    };
  },
};
