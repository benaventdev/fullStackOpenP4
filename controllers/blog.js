const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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
  
  const user = await User.findById(request.body.userId)

  if(!blog.likes) blog.likes=0
  if(!blog.title || !blog.url){
    response.status(400).end()
  } else {
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.patch('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, {$set: {likes: request.body.likes}}, { new: true})
  response.status(205).end()
})

module.exports = blogsRouter