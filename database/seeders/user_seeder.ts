import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Post from '#models/post'

export default class extends BaseSeeder {
  async run() {
    // Create sample users
    const users = await User.createMany([
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
      }
    ])

    // Create sample posts
    await Post.createMany([
      {
        title: 'Getting Started with AdonisJS',
        content: 'AdonisJS is a powerful Node.js framework that provides everything you need to build modern web applications.',
        slug: 'getting-started-with-adonisjs',
        isPublished: true,
        userId: users[0].id
      },
      {
        title: 'Building REST APIs',
        content: 'Learn how to build RESTful APIs with AdonisJS using controllers, models, and validation.',
        slug: 'building-rest-apis',
        isPublished: true,
        userId: users[0].id
      },
      {
        title: 'Database Migrations and Models',
        content: 'Understanding how to work with databases in AdonisJS using Lucid ORM.',
        slug: 'database-migrations-and-models',
        isPublished: false,
        userId: users[1].id
      }
    ])
  }
}