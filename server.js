const express = require('express')
const sessions = require('express-session')
const connectDB = require('./config/database')
const logger = require('morgan')
const cors = require('cors')

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
app.use(logger('tiny'))

// parsing the incoming data
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var auth = function (request, response, next) {
  if (request.session && request.session.user) {
    return next()
  } else response.redirect('/login')
}

//serving public file
app.use(express.static('public'))

// a variable to save a session
let session

// Routes
app.route('/login').get(getLoginHnadler).post(postLoginHandler)
app
  .route('/')
  .get(auth, (req, res) => res.sendFile(__dirname + '/public/calendar.html'))

app.route('/tasks').post((request, response) => {
  console.log('task post')
  console.log(request.body)
  response.status(200).send({ status: 200, message: { data: 'recibido' } })
})
app.route('/signup').get(getSignUpHandler).post(postSignUpHandler)
app.route('/logout').get((request, response) => {
  request.session.destroy()
  response.redirect('/')
})

///////////////
// Task Data
const task = {
  title: '',
  user: 0,
  day: null,
  month: null,
  year: null,
  startHour: null,
  endHour: null,
  deleted: false,
}
const taskAr = []

//////////////////
// login
const User = require('./models/user')

async function postLoginHandler(request, response) {
  const { username, password } = request.body

  const query = User.where({ userName: username, password: password })

  try {
    const userFound = await query.findOne()
    if (userFound) {
      request.session.user = request.body.username
      response.redirect('/')
    } else {
      console.log('Invalid username or password')
      response.redirect('/login')
    }
  } catch (err) {
    console.log('error on post login: ', err)
    response.send('error')
  }
}

function getLoginHnadler(request, response) {
  // console.log('get login', request.session)
  session = request.session
  if (session.userid) {
    response.redirect('/content')
  } else response.sendFile(__dirname + '/views/login.html')
}

///////////////////
// Signup
//const User = require('./models/user')
const validator = require('validator')

function getSignUpHandler(request, response) {
  response.sendFile(__dirname + '/views/signup.html')
}
async function postSignUpHandler(request, response) {
  const { name, username, password } = request.body
  // check if the fields are not empty and the password is correct
  if (username && name && password[0] && password[0] === password[1]) {
    // check if the user exist
    const userFound = await User.findOne({ userName: username }).exec()

    if (userFound) {
      console.log('existing user')
      return response.redirect('/signup')
    }
    const dbUser = new User({
      name: name,
      userName: username,
      password: password[0],
    })
    try {
      await dbUser.save()
      response.redirect('/login')
    } catch (err) {
      console.log('Error saving user')
      response.redirect('/signup')
    }
  } else {
    console.log('bad input values')
    response.redirect('/signup')
  }
}

// Open server port
app.listen(8000, () => {
  console.log('server running... port 8000')
})
