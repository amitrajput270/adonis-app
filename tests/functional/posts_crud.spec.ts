import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Post from '#models/post'
import User from '#models/user'

test.group('Posts CRUD', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    group.each.setup(() => testUtils.db().truncate())

    test('should create a post', async ({ client, assert }) => {
        // Create a user first
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        })

        const postData = {
            title: 'Test Post',
            content: 'This is a test post content',
            isPublished: true,
            userId: user.id
        }

        const response = await client.post('/api/posts').json(postData)

        response.assertStatus(201)
        response.assertBodyContains({
            message: 'Post created successfully'
        })

        const post = response.body().data
        assert.equal(post.title, postData.title)
        assert.equal(post.content, postData.content)
        assert.equal(post.slug, 'test-post')
        assert.equal(post.userId, user.id)
    })

    test('should list all posts', async ({ client, assert }) => {
        // Create a user and posts
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        })

        await Post.createMany([
            {
                title: 'Post 1',
                content: 'Content 1',
                slug: 'post-1',
                isPublished: true,
                userId: user.id
            },
            {
                title: 'Post 2',
                content: 'Content 2',
                slug: 'post-2',
                isPublished: false,
                userId: user.id
            }
        ])

        const response = await client.get('/api/posts')

        response.assertStatus(200)
        response.assertBodyContains({
            message: 'Posts retrieved successfully'
        })

        const posts = response.body().data.data
        assert.lengthOf(posts, 2)
    })

    test('should get a specific post', async ({ client, assert }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        })

        const post = await Post.create({
            title: 'Specific Post',
            content: 'Specific content',
            slug: 'specific-post',
            isPublished: true,
            userId: user.id
        })

        const response = await client.get(`/api/posts/${post.id}`)

        response.assertStatus(200)
        response.assertBodyContains({
            message: 'Post retrieved successfully'
        })

        const responsePost = response.body().data
        assert.equal(responsePost.id, post.id)
        assert.equal(responsePost.title, post.title)
        assert.isObject(responsePost.user)
        assert.equal(responsePost.user.id, user.id)
    })

    test('should update a post', async ({ client, assert }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        })

        const post = await Post.create({
            title: 'Original Title',
            content: 'Original content',
            slug: 'original-title',
            isPublished: false,
            userId: user.id
        })

        const updateData = {
            title: 'Updated Title',
            content: 'Updated content',
            isPublished: true
        }

        const response = await client.put(`/api/posts/${post.id}`).json(updateData)

        response.assertStatus(200)
        response.assertBodyContains({
            message: 'Post updated successfully'
        })

        const updatedPost = response.body().data
        assert.equal(updatedPost.title, updateData.title)
        assert.equal(updatedPost.content, updateData.content)
        assert.equal(updatedPost.slug, 'updated-title')
        assert.isTrue(updatedPost.isPublished)
    })

    test('should delete a post', async ({ client }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        })

        const post = await Post.create({
            title: 'Post to Delete',
            content: 'Content to delete',
            slug: 'post-to-delete',
            isPublished: true,
            userId: user.id
        })

        const response = await client.delete(`/api/posts/${post.id}`)

        response.assertStatus(200)
        response.assertBodyContains({
            message: 'Post deleted successfully'
        })

        // Verify post is deleted
        const deletedPost = await Post.find(post.id)
        assert.isNull(deletedPost)
    })

    test('should return 404 for non-existent post', async ({ client }) => {
        const response = await client.get('/api/posts/999')

        response.assertStatus(404)
        response.assertBodyContains({
            message: 'Post not found'
        })
    })

    test('should validate required fields when creating post', async ({ client }) => {
        const response = await client.post('/api/posts').json({
            title: 'a', // Too short
            content: 'short', // Too short
            userId: 'invalid' // Not a number
        })

        response.assertStatus(400)
        response.assertBodyContains({
            message: 'Validation failed'
        })
    })
})