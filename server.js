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

///////////////
// Task Data
function Task() {
  return {
    title: '',
    user: 0,
    day: null,
    month: null,
    year: null,
    startHour: null,
    startMinutes: null,
    endMinutes: null,
    endHour: null,
    deleted: false,
  }
}
const taskAr = []

// Routes
app.route('/login').get(getLoginHandler).post(postLoginHandler)
app
  .route('/')
  .get(auth, (req, res) => res.sendFile(__dirname + '/public/calendar.html'))

app.route('/tasks').post(auth, (request, response) => {
  const { task, timeStart, duration, taskDate } = request.body
  if (taskDate && task && timeStart && duration > 0) {
    const newTask = Task()
    const [year, month, day] = taskDate.split('-')
    const [hour, minutes] = timeStart.split(':')
    newTask.day = day
    newTask.month = month
    newTask.year = year
    newTask.startHour = hour
    newTask.startMinutes = minutes
    newTask.endHour = hour + duration
    newTask.endMinutes = minutes
    newTask.title = task
    newTask.user = request.session.userid

    taskAr.push(newTask)
    console.log(taskAr)
    response.status(200).redirect('/')
  } else {
    response.status(400).redirect('/')
  }
})
app.route('/signup').get(getSignUpHandler).post(postSignUpHandler)
app.route('/logout').get((request, response) => {
  request.session.destroy()
  response.redirect('/')
})

//////////////////
// login
const User = require('./models/user')

async function postLoginHandler(request, response) {
  const { username, password } = request.body

  const query = User.where({ userName: username, password: password })

  try {
    const userFound = await query.findOne()

    if (userFound) {
      request.session.user = userFound.userName
      request.session.userid = userFound.id
      console.log(request.session)
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

function getLoginHandler(request, response) {
  console.log('get login', request.session)
  // session = request.session
  if (request.session.userid) {
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
