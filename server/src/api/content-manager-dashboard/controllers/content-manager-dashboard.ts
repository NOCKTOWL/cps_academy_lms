/**
 * A set of functions called "actions" for `content-manager-dashboard`
 */

export default {
  async dashboard(ctx: any) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const roleName = user.role?.name;

    if (roleName !== "Content Manager") {
      return ctx.forbidden(
        "Only Content Managers can access this dashboard",
      );
    }

    const courses = await strapi
      .documents("api::course.course")
      .findMany({
        populate: {
          lessons: {
            fields: ["documentId"],
          },
          quizzes: {
            fields: ["documentId"],
          },
        },
      });

    const totalCourses = courses.length;

    const totalLessons = courses.reduce(
      (total: number, course: any) =>
        total + (course.lessons?.length ?? 0),
      0,
    );

    const totalQuizzes = courses.reduce(
      (total: number, course: any) =>
        total + (course.quizzes?.length ?? 0),
      0,
    );

    ctx.body = {
      totalCourses,
      totalLessons,
      totalQuizzes,
    };
  },
}
