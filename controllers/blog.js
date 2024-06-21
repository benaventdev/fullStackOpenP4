const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }
)

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  if(!blog.likes) blog.likes=0
  if(!blog.title || !blog.url){
    response.status(400).end()
  } else {
    const savedNote = await blog.save()
    response.status(201).json(savedNote)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter