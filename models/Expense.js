const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ExpenseSchema = new Schema(
  {
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
    }
  },
  {
    timestamps: true
  }
)

module.exports = Expense = mongoose.model('expense', ExpenseSchema)
