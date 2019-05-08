const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

// Create Portfolio Schema
const PortfolioSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  incomes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Income',
      default: []
    }
  ],
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Expense',
      default: []
    }
  ],
  // bills: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Bill',
  //     default: []
  //   }
  // ],
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

module.exports = Portfolio = mongoose.model('Portfolio', PortfolioSchema)
