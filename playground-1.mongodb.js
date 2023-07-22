/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'Blog-app';
const collection = 'blogs';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection();

// The prototype form to create a collection:
db.createCollection( collection,
  {
    title: String,
    author: String,
    url: String,
    likes: Number
  }
)

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
