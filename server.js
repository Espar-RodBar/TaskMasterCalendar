const express = require('express')
const sessions = require('express-session')
const connectDB = require('./config/database')
const logger = require('morgan')
const cors = require('cors')
require('ejs')
const mainRouter = require('./routes/main')
const tasksRouter = require('./routes/tasks')
const datesRouter = require('./routes/dates')

require('dotenv').config()

// Connect to mongo
connectDB()

const app = express()

// config sessions session middleware
const oneDay = 1000 * 60 * 60 * 24
app.use(
  sessions({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
  })
)

// Config logger
app.use(logger('dev'))

// parsing the incoming data
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// adding ejs
app.set('view engine', 'ejs')

//serving public file
app.use(express.static('public'))

// Routes
app.use('/', mainRouter)
app.use('/', tasksRouter)
app.use('/', datesRouter)

const PORT = process.env.PORT || 8000
// Open server port
app.listen(PORT, () => {
  console.log(`server running... port ${PORT}`)
})
