const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema(
  {
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
    portfolios: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio',
        default: []
      }
    ]
  },
  {
    timestamps: true
  }
)

// UserSchema.pre('save', async function() {
//   console.log({ this: this })
// })

module.exports = User = mongoose.model('User', UserSchema)
