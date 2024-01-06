const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
   {
    title: "how learning karate",
    author: "Daniel san",
    url: "http://karate.blog.com",
    likes: 200,
   },
   {
    title: "Cheap cars",
    author: "Kuruma Toyota",
    url: "https://cars.blog.com",
    likes: 2000,
   },
   {
    title: "How cook hotcakes",
    author: "Soma Hatsuyo",
    url: "http://cook-elite.blog.com",
    likes: 345,
   }
]
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
})

describe('api test', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('identifier id is defined', async () => {
        const response = await api.get('/api/blogs')

        const ids = response.body.map(r => r.id)

        expect(ids).toBeDefined();
    })

    test('a valid note can be added', async () => {
        const newBlog = {
            title: "Best PC Games",
            author: "Benett Rodriguez",
            url: "http://benett.blogs.com",
            likes: 1,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain('Best PC Games')

    })
});

afterAll(() => {
    mongoose.connection.close();
});