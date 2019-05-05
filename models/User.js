const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString()
  },
  lastUpdated: {
    type: String,
    required: true,
    default: new Date().toISOString()
  }
})

module.exports = User = mongoose.model('User', UserSchema)
