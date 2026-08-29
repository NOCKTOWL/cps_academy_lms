/**
 * A set of functions called "actions" for `auth-user`
 */

export default {
  async me(ctx: any) {
    const currentUser = ctx.state.user;

    if (!currentUser) {
      return ctx.unauthorized("You must be logged in");
    }

    const user = await strapi.documents("plugin::users-permissions.user").findOne({
      documentId: currentUser.documentId,
      populate: {
        role: true,
      }
    });

    if (!user) {
      return ctx.notFound("User not found");
    }

    ctx.body = {
      id: user.id,
      documentId: user.documentId,
      username: user.username,
      email: user.email,
      role: (user as any).role?.type,
    };
  },
};
