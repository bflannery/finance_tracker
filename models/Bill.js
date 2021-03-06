const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const BillSchema = new Schema(
  {
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
    dueDate: {
      type: String,
      required: true,
      default: Date.now()
    },
    frequency: {
      type: String,
      required: true,
      enum: [
        'once',
        'weekly',
        'bi-weekly',
        'monthly',
        'quarterly',
        'bi-yearly',
        'yearly'
      ]
    }
  },
  {
    timestamps: true
  }
)

module.exports = Bill = mongoose.model('bills', BillSchema)
