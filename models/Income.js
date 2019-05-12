const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const IncomeSchema = new Schema(
  {
    portfolio: {
      type: Schema.Types.ObjectId,
      ref: 'Portfolio'
    },
    name: {
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

module.exports = Income = mongoose.model('Income', IncomeSchema)
