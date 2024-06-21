const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const assert = require('node:assert')
const app = require('../app')
const blogsRouter = require('../controllers/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
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

  const response = await helper.blogsInDb()

  const titles = response.map(r => r.title)

  assert.strictEqual(titles.length, helper.initialBlogs.length + 1)
  response.forEach((blog) => {
    assert('id' in blog)
  })
  assert(titles.includes('Angular skills'))
})

test('blog without title or url is not added', async () => {
  const newBlog = {
    title: "le title",
    author: "Josh Cli",
    likes: 15
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await helper.blogsInDb()

  assert.strictEqual(response.length, helper.initialBlogs.length)
})

test('blog without likes will be 0', async () => {
  const newBlog = {
    title: "Le title",
    author: "Josh Cli",
    url: "https://fakeurl.com/"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const response = await helper.blogsInDb()

  assert.strictEqual(response.length, helper.initialBlogs.length+1)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.title)
  assert(!contents.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})