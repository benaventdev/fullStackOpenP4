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
    console.log(blog)
    if(!blog.title){
      response.status(400).end()
    } else {
      await blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => next(error))
    }
    
  })

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = blogsRouter