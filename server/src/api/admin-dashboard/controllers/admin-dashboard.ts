/**
 * A set of functions called "actions" for `admin-dashboard`
 */

export default {
  async dashboard(ctx: any) {
    const users = await strapi.documents('plugin::users-permissions.user').findMany({
      populate: {
        role: true,
      },
    });

    const courses = await strapi.documents('api::course.course').findMany();

    const enrollments = await strapi.documents('api::enrollment.enrollment').findMany();

    const totalUsers = users.length;

    const totalStudents = users.filter((user: any) => user.role?.type === 'student').length;

    const totalInstructors = users.filter((user: any) => user.role?.type === 'instructor').length;

    const totalContentManagers = users.filter((user: any) => user.role?.type === 'content-manager').length;

    ctx.body = {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalContentManagers,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
    };
  },

  async users(ctx: any) {
    const users = await strapi.documents('plugin::users-permissions.user').findMany({
      fields: ['username', 'email'],
      populate: {
        role: {
          fields: ['name', 'type'],
        }
      },
    });

    ctx.body = {
      data: users,
    };
  },

  async changeRole(ctx: any) {
    const documentId = ctx.params.id;
    const { role } = (ctx.request as any).body;

    if (!role) {
      return ctx.badRequest('Role is required');
    }

    const targetUser = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId,
    });

    if (!targetUser) {
      return ctx.notFound('User not found');
    }

    const roles = await strapi.documents('plugin::users-permissions.role').findMany({
      filters: {
        type: role,
      },
    });

    const newRole = roles[0];

    if (!newRole) {
      return ctx.badRequest('Invalid role');
    }

    const updatedUser = await strapi.documents('plugin::users-permissions.user').update({
      documentId,
      data: {
        role: newRole.documentId,
      },
    });

    ctx.body = {
      data: {
        id: updatedUser?.id,
        documentId: updatedUser?.documentId,
        username: updatedUser?.username,
        email: updatedUser?.email,
      }
    };
  },
};
