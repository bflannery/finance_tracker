const path = require('path')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')

const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// DB Config
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

// Passport middleware
// app.use(passport.initialize())

// Passport config
// require('./config/passport')(passport)

// Landing Route
app.get('/', (req, res) => res.send('Hello'))

// User Routes
app.use('/api/users', users)

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'))

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//   })
// }

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
