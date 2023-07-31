const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

test.skip('receiving notes', async () => {
    await api
    .get ('/')
    .expect(200)
})

test.skip('there are six blogs', async () => {
  const response = await api.get('/')
  expect(response.body).toHaveLength(6)

})

test.skip('verify the id', async () => {
  const response = await api.get('/')
  expect(response.body[0].id).toBeDefined()
})

test.skip('testing the POST', async () => {
  const testNote = new Blog({
    title: "Un test",
    author: "Un test",
    url: "Un test",
    likes: 0
  })
 
  const initialValue = (await api.get('/')).body.length

  await api.post('/')
  .send(testNote)
  .expect(204)

  const finalValue = await api.get('/')
  expect(finalValue.body).toHaveLength(initialValue+1)
})

test.skip('if no likes, then 0', async () => {
  const newBlog = {
    title: "Un test",
    author: "Un test",
    url: "Un test"
  }

  const response = await api
  .post("/")
  .send(newBlog)
  expect(response.body.likes).toBe(0)
})

test.skip('if no TITLE or no URL error', async () => {
  const newBlog = new Blog({
    author: "antonio"
  })

  await api.post("/")
  .send(newBlog)
  .expect(400)
})

test('delete one resource ', async () => {
  await api.delete("/64c81b4c927278a3c900b298")
  .send()
  .expect(204)
})

afterAll(() => {
  mongoose.connection.close()
})