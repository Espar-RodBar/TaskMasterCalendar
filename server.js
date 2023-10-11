const express = require('express')
const sessions = require('express-session')
const connectDB = require('./config/database')
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

// parsing the incoming data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var auth = function (req, res, next) {
  if (req.session && req.session.user === myusername && req.session.admin)
    return next()
  else return res.sendStatus(401)
}

//serving public file
app.use(express.static('public'))

//username and password
const myusername = 'espar'
const mypassword = '88888888'

// a variable to save a session
let session

app.get('/', (request, response) => {
  console.log('/', request.session)
  session = request.session
  if (session.userid) {
    response.send("Welcome User <a href='/logout'>click to logout</a>")
  } else response.sendFile('views/index.html', {})
})

app.post('/user', (request, response) => {
  if (
    request.query.username == myusername &&
    request.query.password == mypassword
  ) {
    request.session.user = request.query.username
    console.log(request.session)
    response.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`)
  } else {
    response.send('Invalid username or password')
  }
})

// Get content endpoint
app.get('/content', auth, function (req, res) {
  res.send("You can only see this after you've logged in.")
})

app.get('/logout', (request, response) => {
  request.session.destroy()
  response.redirect('/')
})

app.listen(8000, () => {
  console.log('server running')
})
