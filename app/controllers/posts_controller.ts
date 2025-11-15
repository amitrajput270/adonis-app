import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post_validator'
import { prettyPrintError } from '@adonisjs/core';

export default class PostsController {
    /**
     * Display a list of posts
     */
    async index({ request, response }: HttpContext) {
        try {
            const page = request.input('page', 1)
            const limit = request.input('limit', 10)

            const posts = await Post.query()
                .preload('user')
                .orderBy('created_at', 'desc')
                .paginate(page, limit)

            return response.ok({
                message: 'Posts retrieved successfully',
                data: posts
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Failed to retrieve posts',
                error: error.message
            })
        }
    }

    /**
     * Handle form to create a new post
     */
    async store(ctx: HttpContext) {
        const { response } = ctx
        try {
            const payload = await ctx.request.validateUsing(createPostValidator)
            // Generate slug from title
            const slug = payload.title.toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')

            const post = await Post.create({
                ...payload,
                slug
            })

            await post.load('user')

            return response.created({
                message: 'Post created successfully',
                data: post
            })
        } catch (error) {
            if (error.messages) {
                return response.badRequest({
                    message: 'Validation failed',
                    errors: error.messages
                })
            }

            return response.internalServerError({
                message: 'Failed to create post',
                error: error.message
            })
        }
    }

    /**
     * Show individual post
     */
    async show({ params, response }: HttpContext) {
        try {
            const post = await Post.query()
                .where('id', params.id)
                .preload('user')
                .firstOrFail()

            // check if post exists
            return response.ok({
                message: 'Post retrieved successfully',
                data: post
            })
        } catch (error) {
            console.log('Post found:', error)

            // return response.notFound({ error: error })

            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'Post not found'
                })
            }

            return response.internalServerError({
                message: 'Failed to retrieve post',
                error: error.message
            })
        }
    }
    /**
     * Handle form to update an existing post
     */
    async update(ctx: HttpContext) {
        const { params, response } = ctx
        try {
            const post = await Post.findOrFail(params.id)
            const payload = await ctx.request.validateUsing(updatePostValidator)

            // Generate new slug if title changed
            let updateData: any = { ...payload }
            if (payload.title && payload.title !== post.title) {
                updateData.slug = payload.title.toLowerCase()
                    .replace(/[^a-z0-9 -]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
            }

            post.merge(updateData)
            await post.save()
            await post.load('user')

            return response.ok({
                message: 'Post updated successfully',
                data: post
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'Post not found'
                })
            }

            if (error.messages) {
                return response.badRequest({
                    message: 'Validation failed',
                    errors: error.messages
                })
            }

            return response.internalServerError({
                message: 'Failed to update post',
                error: error.message
            })
        }
    }

    /**
     * Delete an existing post
     */
    async destroy({ params, response }: HttpContext) {
        try {
            const post = await Post.findOrFail(params.id)
            await post.delete()

            return response.ok({
                message: 'Post deleted successfully'
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'Post not found'
                })
            }

            return response.internalServerError({
                message: 'Failed to delete post',
                error: error.message
            })
        }
    }
}