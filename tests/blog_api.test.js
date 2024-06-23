const { describe, test, after, beforeEach } = require('node:test')
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

describe('checking with existing data', () => {
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

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(resultBlog.body.title, blogToView.title)
  })
})

describe('adding new blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "Angular skills",
      author: "Michael Juan",
      url: "https://fakeurl.com/",
      likes: 7
    }

    const resp = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY2NzgzM2FjODg0Y2VmNjk0ZDdhZmJhZCIsImlhdCI6MTcxOTE1MzYzNywiZXhwIjoxNzE5MTU3MjM3fQ.Scilp80iJJwkAk4UsN7oridMWKRUekFwlCfZTQ6PjW4')
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
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY2NzgzM2FjODg0Y2VmNjk0ZDdhZmJhZCIsImlhdCI6MTcxOTE1MzYzNywiZXhwIjoxNzE5MTU3MjM3fQ.Scilp80iJJwkAk4UsN7oridMWKRUekFwlCfZTQ6PjW4')
      .send(newBlog)
      .expect(400)

    const response = await helper.blogsInDb()

    assert.strictEqual(response.length, helper.initialBlogs.length)
  })

  test('adding a blog without likes will be 0', async () => {
    const newBlog = {
      title: "Le title",
      author: "Josh Cli",
      url: "https://fakeurl.com/"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY2NzgzM2FjODg0Y2VmNjk0ZDdhZmJhZCIsImlhdCI6MTcxOTE1MzYzNywiZXhwIjoxNzE5MTU3MjM3fQ.Scilp80iJJwkAk4UsN7oridMWKRUekFwlCfZTQ6PjW4')
      .send(newBlog)
      .expect(201)

    const response = await helper.blogsInDb()

    assert.strictEqual(response.length, helper.initialBlogs.length+1)
  })
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY2NzgzM2FjODg0Y2VmNjk0ZDdhZmJhZCIsImlhdCI6MTcxOTE1MzYzNywiZXhwIjoxNzE5MTU3MjM3fQ.Scilp80iJJwkAk4UsN7oridMWKRUekFwlCfZTQ6PjW4')
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.title)
  assert(!contents.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('a blog likes can be updated', async () => {
  const blogs = await helper.blogsInDb()
  const oldBlog = blogs.find(blog => blog.id === "5a422a851b54a676234d17f7")
  const newBlog = {likes: 55553252}
  
  await api
    .patch(`/api/blogs/${oldBlog.id}`)
    .send(newBlog)
    .expect(205)

  const response = (await helper.blogsInDb()).find(blog => blog.id = "5a422a851b54a676234d17f7")
  assert.notStrictEqual(oldBlog.likes, response.likes)
})

after(async () => {
  await mongoose.connection.close()
})