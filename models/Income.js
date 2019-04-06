const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const IncomeSchema = new Schema({
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
  date: {
    type: String,
    required: true,
    default: Date.now()
  }
})

module.exports = Income = mongoose.model('incomes', IncomeSchema)
