const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const IncomeSchema = new Schema({
  portfolio: {
    type: Schema.Types.ObjectId,
    ref: 'Portfolio'
  },
  source: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
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

module.exports = Income = mongoose.model('Income', IncomeSchema)
