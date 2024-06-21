const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)



beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

   assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 2)
  })
  
test('the first blogs is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert.strictEqual(contents.includes('React patterns'), true)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Angular skills",
    author: "Michael Juan",
    url: "https://fakeurl.com/",
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await helper.notesInDb()

  const titles = response.map(r => r.title)

  assert.strictEqual(titles.length, helper.initialBlogs.length + 1)

  assert(titles.includes('Angular skills'))
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: "Josh Cli",
    url: "https://fakeurl.com/",
    likes: 15
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await helper.notesInDb()

  assert.strictEqual(response.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})