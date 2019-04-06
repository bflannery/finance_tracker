const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Portfolio Schema
const PortfolioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  income: [
    {
      type: Schema.Types.ObjectId,
      ref: 'incomes',
      default: []
    }
  ],
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'expenses',
      default: []
    }
  ],
  bills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'bills',
      default: []
    }
  ],
  date: {
    type: String,
    required: true,
    default: Date.now()
  }
})

module.exports = Portfolio = mongoose.model('portfolios', PortfolioSchema)
