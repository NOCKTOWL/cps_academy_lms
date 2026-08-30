/**
 * blog-post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::blog-post.blog-post",
  ({ strapi }) => ({
    async find(ctx) {
      const blogs = await strapi
        .documents("api::blog-post.blog-post")
        .findMany({
          populate: {
            author: {
              fields: ["username"],
            },
          },
        });

      ctx.body = {
        data: blogs,
      };
    },

    async findOne(ctx) {
      const { id: documentId } = ctx.params;

      const blog = await strapi
        .documents("api::blog-post.blog-post")
        .findOne({
          documentId,
          populate: {
            author: {
              fields: ["username"],
            },
          },
        });

      if (!blog) {
        return ctx.notFound("Blog post not found");
      }

      ctx.body = {
        data: blog,
      };
    },

    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const roleName = user.role?.name;

      if (
        roleName !== "Content Manager" &&
        roleName !== "Admin"
      ) {
        return ctx.forbidden(
          "You do not have permission to create blog posts",
        );
      }

      const blogPost = await strapi
        .documents("api::blog-post.blog-post")
        .create({
          data: {
            ...(ctx.request as any).body.data,
            author: user.documentId,
          },
          status: "published",
        });

      ctx.body = {
        data: blogPost,
      };
    },

    async update(ctx) {
      const documentId = ctx.params.id;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const roleName = user.role?.name;

      if (
        roleName !== "Content Manager" &&
        roleName !== "Admin"
      ) {
        return ctx.forbidden(
          "You do not have permission to update blog posts",
        );
      }

      const blogPost = await strapi
        .documents("api::blog-post.blog-post")
        .findOne({
          documentId,
        });

      if (!blogPost) {
        return ctx.notFound("Blog post not found");
      }

      const updatedBlogPost = await strapi
        .documents("api::blog-post.blog-post")
        .update({
          documentId,
          data: (ctx.request as any).body.data,
          status: "published",
        });

      ctx.body = {
        data: updatedBlogPost,
      };
    },

    async delete(ctx) {
      const documentId = ctx.params.id;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const roleName = user.role?.name;

      if (
        roleName !== "Content Manager" &&
        roleName !== "Admin"
      ) {
        return ctx.forbidden(
          "You do not have permission to delete blog posts",
        );
      }

      const blogPost = await strapi
        .documents("api::blog-post.blog-post")
        .findOne({
          documentId,
        });

      if (!blogPost) {
        return ctx.notFound("Blog post not found");
      }

      await strapi
        .documents("api::blog-post.blog-post")
        .delete({
          documentId,
        });

      ctx.body = {
        message: "Blog post deleted successfully",
      };
    },
  }),
);