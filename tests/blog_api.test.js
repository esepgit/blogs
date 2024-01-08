const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

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

const initialUsers = [
    {
        username: "captaineula",
        name: "Eula",
        password: "cryo"
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

    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
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

    test('if likes do not exists, likes = 0', async () => {
        const newBlog = {
            title: "Zero likes",
            author: "Cyro Longa",
            url: "http://cyro.blogs.com",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const response = await api.get('/api/blogs')
        const blog = response.body.find(r => r.title === 'Zero likes')

        expect(blog.likes).toBe(0)
    })

    test('if title and url do not exists, response 400', async () => {
        const newBlog = {
            author: "Kakashi Hatake",
            likes: 500,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
});

describe('users test', () => {
   test('invalid name length return error code 400', async () => {
    const response = await api.get('/api/users')
        
    const newInvalidUser = {
        name: "to",
        password: "aqua"
    }

    await api
        .post('/api/users')
        .send(newInvalidUser)
        .expect(400)

    expect(response.body).toHaveLength(initialUsers.length)
   }); 

   test('username repeat return error 400', async () => {
    const response = await api.get('/api/users')

    const newInvalidUser = {
        username: "captaineula",
        name: "Frijol",
        password: "cryo"
    }

    await api
        .post('/api/users')
        .send(newInvalidUser)
        .expect(400)

    expect(response.body).toHaveLength(initialUsers.length)
   })

});

afterAll(() => {
    mongoose.connection.close();
});