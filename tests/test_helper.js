const Blog = require('../models/blog')
const User = require('../models/user')

const initialNotes = [
    {
      content: 'HTML is easy',
      important: false,
      _id: 221212,
      user: 123456,
    },
    {
      content: 'The most important operations of HTTP protocol are GET and POST',
      important: true,
      _id: 221255,
      user: 123456,
    },
    {
      content: 'A proper dinosaur codes with Java',
      important: false,
      _id: 221244,
      user: 141414,
    },
  ]

const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const notesInDb = async () => {
    const blog = await Blog.find({})
    return blog.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}