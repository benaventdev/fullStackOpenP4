const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const user = await User.find({})
  response.json(user)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)

  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const user = new User({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  if(user.likes != Number) user.likes = 0
  if(!user.title || !user.url) return response.status(400).end()

  const saveduser = await User.save()
  response.json(saveduser)
})

usersRouter.delete('/:id', async (request, response) => {
  await user.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

usersRouter.put('/:id', async (request, response) => {
  const body = request.body

  const user = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updateduser = await User.findByIdAndUpdate(request.params.id, user, {new: true})
  response.json(updateduser)
})

module.exports = usersRouter