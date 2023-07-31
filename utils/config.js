require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST
const NODE_ENV = process.env.NODE_ENV

module.exports = {
  MONGODB_URI,
  PORT,
  MONGODB_URI_TEST,
  NODE_ENV
}