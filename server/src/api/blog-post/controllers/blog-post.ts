/**
 * blog-post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;

        const blogPost = await strapi.documents('api::blog-post.blog-post').create({
            data: {
                ...(ctx.request as any).body.data,
                author: user.documentId,
            },
        });

        ctx.body = {
            data: blogPost,
        }
    },

    async update(ctx) {
        const documentId = ctx.params.id;
        const user = ctx.state.user;
        
        const blogPost = await strapi.documents('api::blog-post.blog-post').findOne({
            documentId,
            populate: {
                author: true,
            },
        });

        if (!blogPost) {
            return ctx.notFound('Blog post not found');
        }

        if (user.role.type !== 'admin' && (blogPost as any).author?.documentId !== user.documentId) {
            return ctx.forbidden('You are not the author of this blog post');
        }

        const updatedBlogPost = await strapi.documents('api::blog-post.blog-post').update({
            documentId,
            data: (ctx.request as any).body.data,
        });

        ctx.body = {
            data: updatedBlogPost,
        }
    },

    async delete(ctx) {
        const documentId = ctx.params.id;
        const user = ctx.state.user;

        const blogPost = await strapi.documents('api::blog-post.blog-post').findOne({
            documentId,
            populate: {
                author: true,
            },
        });

        if (!blogPost) {
            return ctx.notFound('Blog post not found');
        }

        if (user.role.type !== 'admin' && (blogPost as any).author?.documentId !== user.documentId) {
            return ctx.forbidden('You are not the author of this blog post');
        }

        await strapi.documents('api::blog-post.blog-post').delete({
            documentId,
        });

        ctx.body = {
            message: 'Blog post deleted successfully',
        }
    },
}));
