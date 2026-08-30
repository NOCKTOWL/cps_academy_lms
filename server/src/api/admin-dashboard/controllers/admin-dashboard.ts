/**
 * A set of functions called "actions" for `admin-dashboard`
 */

const requireAdmin = (ctx: any) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.unauthorized("You must be logged in");
    return false;
  }

  if (user.role?.type !== "admin") {
    ctx.forbidden("Only admins can access this");
    return false;
  }

  return true;
};

export default {
  async dashboard(ctx: any) {
    if (!requireAdmin(ctx)) return;

    const users = await strapi
      .documents("plugin::users-permissions.user")
      .findMany({
        populate: {
          role: true,
        },
      });

    const courses = await strapi
      .documents("api::course.course")
      .findMany();

    const enrollments = await strapi
      .documents("api::enrollment.enrollment")
      .findMany();

    ctx.body = {
      totalUsers: users.length,
      totalStudents: users.filter(
        (user: any) => user.role?.type === "student",
      ).length,
      totalInstructors: users.filter(
        (user: any) => user.role?.type === "instructor",
      ).length,
      totalContentManagers: users.filter(
        (user: any) =>
          user.role?.type === "content_manager"
      ).length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
    };
  },

  async users(ctx: any) {
    if (!requireAdmin(ctx)) return;

    const users = await strapi
      .documents("plugin::users-permissions.user")
      .findMany({
        fields: ["username", "email"],
        populate: {
          role: {
            fields: ["name", "type"],
          },
        },
      });

    ctx.body = {
      data: users,
    };
  },

  async changeRole(ctx: any) {
    if (!requireAdmin(ctx)) return;

    const documentId = ctx.params.id;
    const { role } = (ctx.request as any).body;

    if (!role) {
      return ctx.badRequest("Role is required");
    }

    const allowedRoles = [
      "student",
      "instructor",
      "content_manager",
      "admin",
    ];

    if (!allowedRoles.includes(role)) {
      return ctx.badRequest("Invalid role");
    }

    const targetUser = await strapi
      .documents("plugin::users-permissions.user")
      .findOne({
        documentId,
      });

    if (!targetUser) {
      return ctx.notFound("User not found");
    }

    const roles = await strapi
      .documents("plugin::users-permissions.role")
      .findMany({
        filters: {
          type: role,
        },
      });

    const newRole = roles[0];

    if (!newRole) {
      return ctx.badRequest("Role does not exist");
    }

    const updatedUser = await strapi
      .documents("plugin::users-permissions.user")
      .update({
        documentId,
        data: {
          role: newRole.documentId,
        },
      });

    ctx.body = {
      data: updatedUser,
    };
  },
};
