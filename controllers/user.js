const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
  const user = await User.findById(request.params.id)
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  }
)

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
})
  

usersRouter.delete('/:id', async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

usersRouter.patch('/:id', async (request, response) => {
  const user = await User.findByIdAndUpdate(request.params.id, {$set: {likes: request.body.likes}}, { new: true})
  response.status(205).end()
})

module.exports = usersRouter