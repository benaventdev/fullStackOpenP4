const { describe, test, after, beforeEach } = require('node:test')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const assert = require('node:assert')
const app = require('../app')
const usersRouter = require('../controllers/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ 
        username: 'root',
        name: 'root',
        passwordHash
    })
    await user.save()
})

describe('when there is initially one user in DB', () => {
    test('creation succeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
        
        const user = {
            username: 'benaventdev',
            name: 'vicent',
            password: 'unaContrasenya'
        }

        await api
            .post('/api/users')
            .send(user)
            .expect(201)
            .expect('Content-type', /application\/json/)

        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length,usersAtStart.length+1)

        const usernames = await usersAtEnd.map( user => user.username)
        assert(usernames.includes(user.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'benaventdev',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
})

after(async () => {
    await mongoose.connection.close()
})