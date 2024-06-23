const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('userId', { username: 1, name: 1 })
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

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const blog = new Blog(request.body)
  const user =  request.user

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if(!blog.likes) blog.likes=0
  if(!blog.title || !blog.url){
    response.status(400).json({ error: "missing url or blog" })
  } else if (user) {
    blog.userId = user._id
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor,async (request, response) => {

  const decodedToken =  jwt.verify(request.token, process.env.SECRET)

  const blog = await Blog.findById(request.params.id)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  } else if (decodedToken.id == blog.userId) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(400).send({error: "Inutil que ho has posat mal"}).end()
  }
})

blogsRouter.patch('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, {$set: {likes: request.body.likes}}, { new: true})
  response.status(205).end()
})

module.exports = blogsRouter