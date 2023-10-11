const express = require('express')
const sessions = require('express-session')
const connectDB = require('./config/database')
require('dotenv').config()

// Connect to mongo
// connectDB()

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

var auth = function (request, response, next) {
  if (request.session && request.session.user === myusername) {
    console.log('middleware', request.session)
    return next()
  } else response.redirect('/login')
}

//serving public file
app.use(express.static('public'))

//username and password
const myusername = 'espar'
const mypassword = '88888888'

// a variable to save a session
let session

app.get('/login', (request, response) => {
  console.log('index', request.session)
  session = request.session
  if (session.userid) {
    response.redirect('/content')
  } else response.sendFile(__dirname + '/views/index.html')
})

app.post('/user', (request, response) => {
  console.log('on /user:', request.body)
  if (
    request.body.username == myusername &&
    request.body.password == mypassword
  ) {
    request.session.user = request.body.username
    console.log(request.session)
    response.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`)
  } else {
    response.send('Invalid username or password')
  }
})

// Get content endpoint
app.get('/', auth, function (req, res) {
  res.send("You can only see this after you've logged in.")
})

app.get('/logout', (request, response) => {
  request.session.destroy()
  response.redirect('/')
})

app.listen(8000, () => {
  console.log('server running...')
})
