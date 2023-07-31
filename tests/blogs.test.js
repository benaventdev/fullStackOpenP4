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

test('testing the POST', async () => {
  const testNote = new Blog({
    title: 'Un test',
    author: 'Un test',
    url: 'Un test',
    likes: 0
  })
 
  const initialValue = await api.get('/').body.length

  await api.post('/')
  .send(testNote)
  expect(204)

  const finalValue = await api.get('/')
  expect(finalValue.body).toHaveLength(initialValue+1)
})

afterAll(() => {
  mongoose.connection.close()
})