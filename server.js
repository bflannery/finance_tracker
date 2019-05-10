const path = require('path')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const portfolios = require('./routes/api/portfolios')
const incomes = require('./routes/api/incomes')
const expenses = require('./routes/api/expenses')

// Initiaite express app
const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// DB Config
const db = require('./config/keys').mongoURI

// MongoDB options
const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useFindAndModify: false
}

// MongoDB connection with retry on err
const mongoConnectWithRetry = () => {
  console.log('Connecting to Mongo...')
  mongoose
    .connect(db, options)
    .then(() => {
      console.log('MongoDB is connected')
    })
    .catch(err => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
      console.log(err)
      setTimeout(mongoConnectWithRetry, 5000)
    })
}

// Connect to MongoDb with retry
mongoConnectWithRetry()

// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)

// Landing Route
app.get('/', (req, res) => res.send('Hello'))

// User Routes
app.use('/api/users', users)
app.use('/api/portfolios', portfolios)
app.use('/api/incomes', incomes)
app.use('/api/expenses', expenses)

// Env Build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// App Port
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
