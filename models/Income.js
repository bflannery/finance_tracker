const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const IncomeSchema = new Schema({
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
