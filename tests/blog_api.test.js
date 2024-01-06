const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('api test', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000);
    
    test('there are three blogs', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(3)
    })

    test('identifier id is defined', async () => {
        const response = await api.get('/api/blogs')

        const ids = response.body.map(r => r.id)

        expect(ids).toBeDefined();
    }) 
});

afterAll(() => {
    mongoose.connection.close();
});