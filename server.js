// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// require route files
const userProfileRoutes = require('./app/routes/userProfile_routes')
const userRoutes = require('./app/routes/user_routes')

// require middleware
const errorHandler = require('./lib/error_handler')
const requestLogger = require('./lib/request_logger')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// instantiate express application object
const app = express()

// socket
const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer(app)

// set io determined upon whether in development or production
const io = db.slice(38) === 'development' ? new Server(httpServer, {
  cors: {
    origin: 'http://localhost:7165',
    credentials: true
  }
}) : new Server(httpServer, {
  cors: {
    origin: 'https://the-re-actors.github.io',
    credentials: true
  }
})

// define server and client ports
// used for cors and local port declaration
const serverDevPort = 4741
const clientDevPort = 7165

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}`, credentials: true }))

// define port for API to run on
const port = process.env.PORT || serverDevPort

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// register route files
app.use(userProfileRoutes)
app.use(userRoutes)

// register error handling middleware
// note that this comes after the route middle wares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// socket
io.on('connection', socket => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message })
  })
})

httpServer.listen(port, () => {
  console.log('listening on port ', port)
})

// needed for testing
module.exports = app
