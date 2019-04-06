const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ExpenseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  recurring: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    required: true,
    default: Date.now()
  }
})

module.exports = Expense = mongoose.model('expenses', ExpenseSchema)
